import type { Stablecoin } from "@/lib/stablecoins";

function formatUsd(usd: number): string {
  if (usd >= 1_000_000_000) return `$${(usd / 1_000_000_000).toFixed(2)}B`;
  if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(1)}M`;
  if (usd >= 1_000) return `$${(usd / 1_000).toFixed(0)}K`;
  if (usd === 0) return "—";
  return `$${usd.toLocaleString()}`;
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--card)] px-2.5 py-0.5 text-xs text-[var(--foreground)]">
      {children}
    </span>
  );
}

const CHAIN_LOGOS: Record<string, string> = {
  "Arbitrum":   "https://icons.llamao.fi/icons/chains/rsz_arbitrum.jpg",
  "Avalanche":  "https://icons.llamao.fi/icons/chains/rsz_avax.jpg",
  "Base":       "https://icons.llamao.fi/icons/chains/rsz_base.jpg",
  "BNB Chain":  "https://icons.llamao.fi/icons/chains/rsz_bsc.jpg",
  "Celo":       "https://icons.llamao.fi/icons/chains/rsz_celo.jpg",
  "Ethereum":   "https://icons.llamao.fi/icons/chains/rsz_ethereum.jpg",
  "Gnosis":     "https://icons.llamao.fi/icons/chains/rsz_gnosis.jpg",
  "Hedera":     "https://icons.llamao.fi/icons/chains/rsz_hedera.jpg",
  "Injective":  "https://icons.llamao.fi/icons/chains/rsz_injective.jpg",
  "Kaia":       "https://icons.llamao.fi/icons/chains/rsz_klaytn.jpg",
  "Monad":      "https://icons.llamao.fi/icons/chains/rsz_monad.jpg",
  "Moonbeam":   "https://icons.llamao.fi/icons/chains/rsz_moonbeam.jpg",
  "Polygon":    "https://icons.llamao.fi/icons/chains/rsz_polygon.jpg",
  "Ronin":      "https://icons.llamao.fi/icons/chains/rsz_ronin.jpg",
  "Solana":     "https://icons.llamao.fi/icons/chains/rsz_solana.jpg",
  "Stellar":    "https://icons.llamao.fi/icons/chains/rsz_stellar.jpg",
  "Sui":        "https://icons.llamao.fi/icons/chains/rsz_sui.jpg",
  "Tron":       "https://icons.llamao.fi/icons/chains/rsz_tron.jpg",
  "XDC":        "https://icons.llamao.fi/icons/chains/rsz_xdc.jpg",
  "XRP Ledger": "https://icons.llamao.fi/icons/chains/rsz_xrpl.jpg",
};

function ChainLogo({ chain }: { chain: string }) {
  const src = CHAIN_LOGOS[chain];
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={chain}
        title={chain}
        width={24}
        height={24}
        className="rounded-full"
      />
    );
  }
  return <Pill>{chain}</Pill>;
}

export default function StablecoinTable({ rows }: { rows: Stablecoin[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--card)]">
      <table className="min-w-full divide-y divide-[var(--border)] text-sm">
        <thead className="bg-black/20">
          <tr className="text-left text-xs uppercase tracking-wider text-[var(--muted)]">
            <th className="px-4 py-3 font-medium">Token</th>
            <th className="px-4 py-3 font-medium">Issuer</th>
            <th className="px-4 py-3 font-medium">Currency</th>
            <th className="px-4 py-3 font-medium">Chains</th>
            <th className="px-4 py-3 text-right font-medium">TVL</th>
            <th className="px-4 py-3 text-right font-medium">Payments</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {rows.map((coin) => (
            <tr key={coin.symbol} className="hover:bg-white/[0.02]">
              <td className="px-4 py-4 align-top">
                <div className="font-semibold">{coin.symbol}</div>
              </td>
              <td className="px-4 py-4 align-top text-[var(--muted)]">{coin.name}</td>
              <td className="px-4 py-4 align-top">
                <Pill>{coin.currency}</Pill>
              </td>
              <td className="px-4 py-4 align-top">
                <div className="flex flex-wrap gap-1.5">
                  {coin.chains.map((chain) => (
                    <ChainLogo key={chain} chain={chain} />
                  ))}
                </div>
              </td>
              <td className="px-4 py-4 text-right align-top font-mono">
                {formatUsd(coin.marketCapUsd)}
              </td>
              <td className="px-4 py-4 text-right align-top font-mono text-[var(--muted)]">
                —
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
