/**
 * Inline brand-mark SVGs for blockchain networks.
 *
 * Each icon renders in a 24×24 box with a circular brand-color background and
 * a simplified glyph in white. The shapes approximate the canonical chain
 * brand marks well enough to be recognizable in a dense table view.
 *
 * To add a new chain:
 *   1. Add an entry to CHAIN_ICONS keyed by a lowercase canonical name.
 *   2. If the sheet writes the chain in a non-obvious way (e.g. "Avalanche
 *      C-Chain" vs "Avalanche"), add an alias to NAME_ALIASES.
 */

type IconProps = { size?: number };

function Wrap({
  bg,
  children,
  size = 24,
  title,
}: {
  bg: string;
  children: React.ReactNode;
  size?: number;
  title: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <circle cx="16" cy="16" r="16" fill={bg} />
      {children}
    </svg>
  );
}

// — Individual chain marks —

const Ethereum = ({ size }: IconProps) => (
  <Wrap bg="#627EEA" size={size} title="Ethereum">
    <g fill="#FFF" fillRule="nonzero">
      <path fillOpacity="0.6" d="M16.5 4v8.87l7.5 3.35z" />
      <path d="M16.5 4L9 16.22l7.5-3.35z" />
      <path fillOpacity="0.6" d="M16.5 21.97v6.03L24 17.62z" />
      <path d="M16.5 28v-6.03L9 17.62z" />
      <path fillOpacity="0.2" d="M16.5 20.57L24 16.22l-7.5-3.35z" />
      <path fillOpacity="0.6" d="M9 16.22l7.5 4.35v-7.7z" />
    </g>
  </Wrap>
);

const Solana = ({ size }: IconProps) => (
  <Wrap bg="#000" size={size} title="Solana">
    <defs>
      <linearGradient id="sol-g" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#9945FF" />
        <stop offset="100%" stopColor="#14F195" />
      </linearGradient>
    </defs>
    <path
      d="M9 21.2l2-2.2h13.5l-2 2.2H9zm0-5l2-2.2h13.5l-2 2.2H9zm15.5-7.2l-2 2.2H9l2-2.2h13.5z"
      fill="url(#sol-g)"
    />
  </Wrap>
);

const Polygon = ({ size }: IconProps) => (
  <Wrap bg="#8247E5" size={size} title="Polygon">
    <path
      fill="#FFF"
      d="M21.16 12.37l-2.59-1.5a.52.52 0 00-.52 0l-2.59 1.5-2.59 1.49a.52.52 0 00-.26.45v2.99l-2.08 1.2V15.3l4.67-2.7 4.67 2.7v2.99l-2.08-1.2v-2.99a.52.52 0 00-.26-.45zM16 11.12l2.08 1.2v2.99L16 14.1l-2.08 1.2v-2.99L16 11.12zm-4.67 8.78V17.1l2.08 1.2v2.81l-2.08-1.2zm4.67.98l-2.08-1.2v-2.99l2.08 1.2 2.08-1.2v2.99L16 20.88zm4.67-.98l-2.08 1.2v-2.81l2.08-1.2v2.81z"
    />
  </Wrap>
);

const Base = ({ size }: IconProps) => (
  <Wrap bg="#0052FF" size={size} title="Base">
    <path
      fill="#FFF"
      d="M16 26c5.52 0 10-4.48 10-10S21.52 6 16 6 6 10.48 6 16h13.7c.16 0 .3.13.3.3v0c0 .16-.14.3-.3.3H6c0 5.52 4.48 10 10 10z"
    />
  </Wrap>
);

const BNBChain = ({ size }: IconProps) => (
  <Wrap bg="#F0B90B" size={size} title="BNB Chain">
    <g fill="#FFF">
      {/* top */}
      <path d="M13.5 9L16 6.5l2.5 2.5L16 11.5z" />
      {/* left */}
      <path d="M6.5 16L9 13.5l2.5 2.5L9 18.5z" />
      {/* center */}
      <path d="M13.5 16L16 13.5l2.5 2.5L16 18.5z" />
      {/* right */}
      <path d="M20.5 16L23 13.5l2.5 2.5L23 18.5z" />
      {/* bottom */}
      <path d="M13.5 23L16 20.5l2.5 2.5L16 25.5z" />
    </g>
  </Wrap>
);

const Avalanche = ({ size }: IconProps) => (
  <Wrap bg="#E84142" size={size} title="Avalanche">
    <path
      fill="#FFF"
      d="M20.36 21H23a.5.5 0 00.43-.75l-2.65-4.55a.5.5 0 00-.86 0L18.5 18.4a1 1 0 000 1l1 1.72a1 1 0 00.86.48zM12.6 11.27a.5.5 0 00-.86 0L7.07 19.5a1 1 0 00.86 1.5h4.84a1 1 0 00.86-.5l3.7-6.42a1 1 0 000-1l-2.4-4.15a.5.5 0 00-.86 0L12.6 11.27z"
    />
  </Wrap>
);

const Tron = ({ size }: IconProps) => (
  <Wrap bg="#FF060A" size={size} title="Tron">
    <path
      fill="#FFF"
      d="M22 11l-12-3 6 16 8-13zm-3.5 1.5l-7-1.5 5.5 9 1.5-7.5zm-3 9.5l-3-9 5 .8L15.5 22z"
    />
  </Wrap>
);

const Sui = ({ size }: IconProps) => (
  <Wrap bg="#4DA2FF" size={size} title="Sui">
    <path
      fill="#FFF"
      d="M16 6c-3.5 4.5-6 7.5-6 11a6 6 0 0012 0c0-3.5-2.5-6.5-6-11zm0 14.5a3.5 3.5 0 01-3.5-3.5c0-1.7 1-3.4 2.5-5.5 0 2.5 3 3.5 3 6.5a2 2 0 01-2 2.5z"
    />
  </Wrap>
);

const Stellar = ({ size }: IconProps) => (
  <Wrap bg="#000" size={size} title="Stellar">
    <path
      fill="#FFF"
      d="M22 11l-12 6.2v-2L20 10v-1.4l-12 6.2v6L20 14.6v1.4l-10 5.2V23l12-6.2v-6L10 17v-1.4l12-6.2V11z"
    />
  </Wrap>
);

const Arbitrum = ({ size }: IconProps) => (
  <Wrap bg="#28A0F0" size={size} title="Arbitrum">
    <path
      fill="#FFF"
      d="M16 6L8 22h3l1.4-3h7.2l1.4 3h3L16 6zm-2.6 11l2.6-5.4 2.6 5.4h-5.2z"
    />
  </Wrap>
);

const Etherlink = ({ size }: IconProps) => (
  <Wrap bg="#38FF9C" size={size} title="Etherlink">
    <path
      fill="#000"
      d="M16 6l8 4.6v9.2L16 24l-8-4.6v-9.2L16 6zm0 2.3L10 11.7v6.6l6 3.4 6-3.4v-6.6l-6-3.4zM12 13h8v2h-8v-2zm0 4h6v2h-6v-2z"
    />
  </Wrap>
);

const Hedera = ({ size }: IconProps) => (
  <Wrap bg="#000" size={size} title="Hedera">
    <path
      fill="#FFF"
      d="M11 8h2v4h6V8h2v16h-2v-4h-6v4h-2V8zm2 6v4h6v-4h-6z"
    />
  </Wrap>
);

const Zilliqa = ({ size }: IconProps) => (
  <Wrap bg="#49C1BF" size={size} title="Zilliqa">
    <path
      fill="#FFF"
      d="M9 11h14l-9 6h9l-14-2 9-6H9v2zm0 8h14v2H9v-2z"
    />
  </Wrap>
);

const LayerZero = ({ size }: IconProps) => (
  <Wrap bg="#000" size={size} title="LayerZero">
    <g fill="#FFF">
      <rect x="9" y="9" width="14" height="2" />
      <path d="M9 13h14l-12 6h12v2H9l12-6H9v-2z" />
      <rect x="9" y="21" width="14" height="2" />
    </g>
  </Wrap>
);

const XRPLedger = ({ size }: IconProps) => (
  <Wrap bg="#00AAE4" size={size} title="XRP Ledger">
    <path
      fill="#FFF"
      d="M22.5 9h-3.2l-3.3 4.2L12.7 9H9.5l4.9 6.2-4.9 7.8h3.2l3.3-4.4 3.3 4.4h3.2l-4.9-7.8L22.5 9z"
    />
  </Wrap>
);

const XDC = ({ size }: IconProps) => (
  <Wrap bg="#2157D3" size={size} title="XDC">
    {/* Hexagon outline */}
    <path
      fill="none"
      stroke="#FFF"
      strokeWidth="2"
      d="M16 8l6.93 4v8L16 24l-6.93-4v-8z"
    />
    {/* Inner chevrons suggesting the X */}
    <path fill="#FFF" d="M12 13.5l4 2.5-4 2.5v-5zm8 0v5l-4-2.5 4-2.5z" />
  </Wrap>
);

const Moonbeam = ({ size }: IconProps) => (
  <Wrap bg="#E1147B" size={size} title="Moonbeam">
    {/* Crescent moon */}
    <path
      fill="#FFF"
      d="M21 12a8 8 0 01-10.39 7.59A9 9 0 1021 12z"
    />
  </Wrap>
);

const Gnosis = ({ size }: IconProps) => (
  <Wrap bg="#04795B" size={size} title="Gnosis">
    {/* Owl eyes */}
    <circle cx="12.5" cy="15" r="3.2" fill="none" stroke="#FFF" strokeWidth="1.8" />
    <circle cx="19.5" cy="15" r="3.2" fill="none" stroke="#FFF" strokeWidth="1.8" />
    <circle cx="12.5" cy="15" r="1.4" fill="#FFF" />
    <circle cx="19.5" cy="15" r="1.4" fill="#FFF" />
    {/* Beak */}
    <path fill="#FFF" d="M14.5 19.2h3l-1.5 2.3z" />
  </Wrap>
);

// — Registry —

const CHAIN_ICONS: Record<string, (p: IconProps) => React.ReactElement> = {
  ethereum: Ethereum,
  solana: Solana,
  polygon: Polygon,
  base: Base,
  "bnb chain": BNBChain,
  bnb: BNBChain,
  bsc: BNBChain,
  avalanche: Avalanche,
  tron: Tron,
  sui: Sui,
  stellar: Stellar,
  arbitrum: Arbitrum,
  etherlink: Etherlink,
  hedera: Hedera,
  zilliqa: Zilliqa,
  layerzero: LayerZero,
  "xrp ledger": XRPLedger,
  xrpl: XRPLedger,
  xdc: XDC,
  moonbeam: Moonbeam,
  gnosis: Gnosis,
};

// Common aliases — map sheet-side variants to canonical keys.
const NAME_ALIASES: Record<string, string> = {
  "avalanche c-chain": "avalanche",
  "avax": "avalanche",
  "binance smart chain": "bnb chain",
  "binance": "bnb chain",
  "matic": "polygon",
  "polygon pos": "polygon",
  "eth": "ethereum",
  "arbitrum one": "arbitrum",
  "trx": "tron",
  "ripple": "xrp ledger",
  "xrp": "xrp ledger",
  "xdc network": "xdc",
  "gnosis chain": "gnosis",
  "xdai": "gnosis",
  "moonbeam network": "moonbeam",
};

function normalize(name: string): string {
  return name.trim().toLowerCase();
}

/**
 * Looks up the icon for a chain name (case-insensitive, alias-aware).
 * Returns null if no icon is registered for this chain — the caller should
 * render a text pill as fallback.
 */
export function ChainIcon({
  name,
  size = 24,
}: {
  name: string;
  size?: number;
}): React.ReactElement | null {
  const key = normalize(name);
  const resolved = NAME_ALIASES[key] ?? key;
  const Icon = CHAIN_ICONS[resolved];
  if (!Icon) return null;
  return <Icon size={size} />;
}
