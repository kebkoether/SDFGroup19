import { unstable_cache } from "next/cache";
import { CONTRACT_ADDRESSES, SYMBOL_CURRENCY } from "./addresses";

// Public RPC endpoints for EVM-compatible chains (no API key required)
const EVM_RPCS: Record<string, string> = {
  Ethereum:    "https://eth.llamarpc.com",
  Polygon:     "https://polygon-rpc.com",
  Base:        "https://mainnet.base.org",
  "BNB Chain": "https://bsc-dataseed.binance.org",
  Avalanche:   "https://api.avax.network/ext/bc/C/rpc",
  Arbitrum:    "https://arb1.arbitrum.io/rpc",
  Celo:        "https://forno.celo.org",
  Moonbeam:    "https://rpc.api.moonbeam.network",
  Gnosis:      "https://rpc.gnosischain.com",
  Hedera:      "https://mainnet.hashio.io/api", // Hedera EVM relay (for 0x addresses)
  Ronin:       "https://api.roninchain.com/rpc",
};

// — Fetch helpers —

async function withTimeout<T>(
  promise: Promise<T>,
  ms = 8000,
  fallback: T,
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

async function ethCall(rpcUrl: string, to: string, data: string): Promise<string | null> {
  try {
    const res = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_call",
        params: [{ to, data }, "latest"],
      }),
    });
    const json = await res.json();
    return typeof json.result === "string" && json.result !== "0x"
      ? json.result
      : null;
  } catch {
    return null;
  }
}

// Converts a BigInt raw supply + decimals to a plain number without losing
// precision on large values (avoids Number(BigInt) overflow for 18-decimal tokens).
function toFloat(raw: bigint, decimals: number): number {
  if (decimals === 0) return Number(raw);
  const d = BigInt(decimals);
  const pow = BigInt(10) ** d;
  const whole = raw / pow;
  const frac = raw % pow;
  return Number(whole) + Number(frac) / Math.pow(10, decimals);
}

// — Per-chain supply fetchers —

async function getErc20Supply(rpcUrl: string, address: string): Promise<number> {
  const [supplyHex, decimalsHex] = await Promise.all([
    ethCall(rpcUrl, address, "0x18160ddd"), // totalSupply()
    ethCall(rpcUrl, address, "0x313ce567"), // decimals()
  ]);
  if (!supplyHex || !decimalsHex) return 0;
  const raw = BigInt(supplyHex);
  const decimals = Number(BigInt(decimalsHex));
  if (decimals > 30) return 0; // sanity guard
  return toFloat(raw, decimals);
}

async function getSolanaSupply(mintAddress: string): Promise<number> {
  const res = await fetch("https://api.mainnet-beta.solana.com", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getTokenSupply",
      params: [mintAddress],
    }),
  });
  const json = await res.json();
  return parseFloat(json.result?.value?.uiAmountString ?? "0") || 0;
}

async function getStellarSupply(assetStr: string): Promise<number> {
  // assetStr format: "CODE:GISSUERADDRESS"
  const [code, issuer] = assetStr.split(":");
  if (!code || !issuer) return 0;
  const res = await fetch(
    `https://horizon.stellar.org/assets?asset_code=${code}&asset_issuer=${issuer}&limit=1`,
  );
  const json = await res.json();
  return parseFloat(json._embedded?.records?.[0]?.amount ?? "0") || 0;
}

// Hedera HTS token (token ID format "0.0.NNNN")
async function getHederaTokenSupply(tokenId: string): Promise<number> {
  const res = await fetch(
    `https://mainnet.mirrornode.hedera.com/api/v1/tokens/${tokenId}`,
  );
  const json = await res.json();
  const decimals = parseInt(json.decimals ?? "0", 10);
  const totalSupply = parseInt(json.total_supply ?? "0", 10);
  return totalSupply / Math.pow(10, decimals);
}

async function getChainSupply(chain: string, address: string): Promise<number> {
  if (chain === "Solana") return getSolanaSupply(address);
  if (address.includes(":")) return getStellarSupply(address);
  if (chain === "Hedera" && /^\d+\.\d+\.\d+$/.test(address))
    return getHederaTokenSupply(address);
  if (EVM_RPCS[chain]) return getErc20Supply(EVM_RPCS[chain], address);
  return 0; // chain not yet supported (Monad, Sui, XDC, etc.)
}

// — FX rates —

async function fetchUsdRates(): Promise<Record<string, number>> {
  const res = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
  const json = await res.json();
  return (json.rates as Record<string, number>) ?? {};
}

// — Main computation (cached 4 h) —

async function computeAllMarketCaps(): Promise<Record<string, number>> {
  const rates = await withTimeout(fetchUsdRates(), 8000, {});

  const entries = await Promise.allSettled(
    Object.entries(CONTRACT_ADDRESSES).map(async ([symbol, chains]) => {
      const currency = SYMBOL_CURRENCY[symbol] ?? "USD";
      const fxRate = (rates as Record<string, number>)[currency] ?? 1;

      const chainSupplies = await Promise.allSettled(
        Object.entries(chains).map(([chain, address]) =>
          withTimeout(getChainSupply(chain, address), 8000, 0),
        ),
      );

      const totalLocal = chainSupplies.reduce<number>(
        (sum, r) => sum + (r.status === "fulfilled" ? r.value : 0),
        0,
      );

      return [symbol, fxRate > 0 ? totalLocal / fxRate : 0] as const;
    }),
  );

  return Object.fromEntries(
    entries
      .filter((r): r is PromiseFulfilledResult<readonly [string, number]> => r.status === "fulfilled")
      .map((r) => r.value),
  );
}

export const fetchAllMarketCaps = unstable_cache(
  computeAllMarketCaps,
  ["market-caps"],
  { revalidate: 4 * 60 * 60 },
);

// Per-chain USD breakdown for a single coin — used by the detail page.
async function computeCoinChainBreakdown(
  symbol: string,
): Promise<Record<string, number>> {
  const chains = CONTRACT_ADDRESSES[symbol];
  if (!chains) return {};

  const rates = await withTimeout(fetchUsdRates(), 8000, {});
  const currency = SYMBOL_CURRENCY[symbol] ?? "USD";
  const fxRate = (rates as Record<string, number>)[currency] ?? 1;

  const entries = await Promise.allSettled(
    Object.entries(chains).map(async ([chain, address]) => {
      const supply = await withTimeout(getChainSupply(chain, address), 8000, 0);
      const usd = fxRate > 0 ? supply / fxRate : 0;
      return [chain, usd] as const;
    }),
  );

  return Object.fromEntries(
    entries
      .filter((r): r is PromiseFulfilledResult<readonly [string, number]> =>
        r.status === "fulfilled",
      )
      .map((r) => r.value),
  );
}

export function fetchCoinChainBreakdown(symbol: string) {
  return unstable_cache(
    () => computeCoinChainBreakdown(symbol),
    [`chain-breakdown-${symbol}`],
    { revalidate: 4 * 60 * 60 },
  )();
}
