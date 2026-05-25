import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchStablecoins } from "@/lib/stablecoins";
import { fetchCoinChainBreakdown } from "@/lib/marketcap";
import { CONTRACT_ADDRESSES } from "@/lib/addresses";
import { explorerUrl } from "@/lib/explorerUrls";
import { ChainIcon } from "@/components/ChainIcon";
import { LogoMark } from "@/components/Logo";
import CopyButton from "@/components/CopyButton";

export const dynamic = "force-dynamic";

function formatUsd(usd: number): string {
  if (usd >= 1_000_000_000) return `$${(usd / 1_000_000_000).toFixed(2)}B`;
  if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(1)}M`;
  if (usd >= 1_000) return `$${(usd / 1_000).toFixed(0)}K`;
  if (usd === 0) return "—";
  return `$${usd.toLocaleString()}`;
}

function ChainLogoFallback({ name }: { name: string }) {
  const icon = ChainIcon({ name, size: 28 });
  if (icon) return icon;
  const initials = name
    .split(/[\s-]/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[9px] font-bold">
      {initials}
    </span>
  );
}

export default async function CoinPage({
  params,
}: {
  params: { symbol: string };
}) {
  const symbol = decodeURIComponent(params.symbol).toUpperCase();
  const [stablecoins, chainBreakdown] = await Promise.all([
    fetchStablecoins(),
    fetchCoinChainBreakdown(symbol),
  ]);

  const coin = stablecoins.find((c) => c.symbol.toUpperCase() === symbol);
  if (!coin) notFound();

  // Merge addresses from the lib registry (more complete) with sheet data
  const registryAddresses = CONTRACT_ADDRESSES[symbol] ?? {};
  const sheetAddresses = coin.contractAddresses ?? {};
  const allAddresses: Record<string, string> = { ...sheetAddresses, ...registryAddresses };

  // Build sorted chain rows: chains with live USD data first, then address-only
  type ChainRow = {
    chain: string;
    address: string | null;
    usd: number | null;
  };

  const allChains = Array.from(
    new Set([...Object.keys(allAddresses), ...Object.keys(chainBreakdown)]),
  );

  const rows: ChainRow[] = allChains.map((chain) => ({
    chain,
    address: allAddresses[chain] ?? null,
    usd: chainBreakdown[chain] ?? null,
  }));

  rows.sort((a, b) => {
    if (a.usd !== null && b.usd !== null) return b.usd - a.usd;
    if (a.usd !== null) return -1;
    if (b.usd !== null) return 1;
    if (a.address && !b.address) return -1;
    if (!a.address && b.address) return 1;
    return a.chain.localeCompare(b.chain);
  });

  const totalLiveUsd = Object.values(chainBreakdown).reduce((s, v) => s + v, 0);
  const displayCap = totalLiveUsd > 0 ? totalLiveUsd : coin.marketCapUsd;
  const hasLiveData = totalLiveUsd > 0;

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      {/* Nav */}
      <nav className="mb-10 flex items-center justify-between border-b border-[var(--border)] pb-6">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <LogoMark className="text-[var(--accent)]" size={36} />
          <span className="text-lg font-semibold">
            Stable<span className="text-[var(--accent)]">Reef</span>
          </span>
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          All stablecoins
        </Link>
      </nav>

      {/* Hero */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-4xl font-bold tracking-tight">{coin.symbol}</h1>
              <span className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-sm font-medium text-[var(--accent)]">
                {coin.currency}
              </span>
              {coin.category && (
                <span className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-xs text-[var(--muted)]">
                  {coin.category}
                </span>
              )}
              {coin.yieldBearing && (
                <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                  Yield · {coin.yieldSource}
                </span>
              )}
            </div>
            <p className="mt-2 text-xl text-[var(--muted)]">{coin.name}</p>
            {coin.source && (() => {
              try {
                const host = new URL(coin.source).hostname.replace("www.", "");
                return (
                  <a
                    href={coin.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs text-[var(--muted)] underline underline-offset-2 hover:text-[var(--accent)]"
                  >
                    {host}
                    <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                      <path d="M7 3H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M10 2h4v4M14 2L8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                );
              } catch { return null; }
            })()}
          </div>

          <div className="text-right">
            <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
              {hasLiveData ? "Live Market Cap" : "Market Cap"}
            </p>
            <p className="mt-1 text-4xl font-semibold tabular-nums">
              {formatUsd(displayCap)}
            </p>
            {hasLiveData && (
              <p className="mt-1 flex items-center justify-end gap-1 text-xs text-emerald-400">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Live · refreshes every 4h
              </p>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-[var(--border)] pt-6 sm:grid-cols-4">
          <Stat label="Chains" value={String(rows.filter((r) => r.address).length)} />
          <Stat label="Yield" value={coin.yieldBearing ? coin.yieldSource || "Yes" : "No"} />
          <Stat label="Currency" value={coin.currency || "—"} />
          <Stat label="On-chain data" value={hasLiveData ? "Live" : "Sheet only"} accent={hasLiveData} />
        </div>
      </div>

      {/* Chain breakdown */}
      <div className="mt-8">
        <h2 className="text-base font-semibold uppercase tracking-wider text-[var(--muted)]">
          By Chain
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          {hasLiveData
            ? "Market cap computed from live on-chain supply × live FX rate."
            : "Contract addresses by chain. On-chain supply data unavailable for this asset."}
        </p>

        <div className="mt-4 space-y-2">
          {rows.map((row) => {
            const href = row.address ? explorerUrl(row.chain, row.address) : null;
            const pct =
              hasLiveData && row.usd !== null && totalLiveUsd > 0
                ? (row.usd / totalLiveUsd) * 100
                : null;

            return (
              <div
                key={row.chain}
                className="relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 transition-colors hover:border-white/10 hover:bg-white/[0.03]"
              >
                {/* Progress bar background */}
                {pct !== null && (
                  <div
                    className="pointer-events-none absolute inset-y-0 left-0 rounded-xl bg-[var(--accent)] opacity-[0.06]"
                    style={{ width: `${pct}%` }}
                  />
                )}

                <div className="relative flex items-center gap-3">
                  {/* Chain logo */}
                  <div className="shrink-0">
                    <ChainLogoFallback name={row.chain} />
                  </div>

                  {/* Chain name */}
                  <div className="w-28 shrink-0">
                    <p className="font-medium leading-tight">{row.chain}</p>
                    {pct !== null && (
                      <p className="text-xs text-[var(--muted)]">{pct.toFixed(1)}%</p>
                    )}
                  </div>

                  {/* Address */}
                  <div className="flex min-w-0 flex-1 items-center">
                    {row.address ? (
                      <>
                        <code
                          className="min-w-0 truncate rounded bg-black/30 px-2 py-1 font-mono text-xs"
                          title={row.address}
                        >
                          {row.address}
                        </code>
                        <CopyButton text={row.address} />
                        {href && (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="View on explorer"
                            className="ml-1 shrink-0 rounded p-1 text-[var(--muted)] transition-colors hover:bg-white/10 hover:text-[var(--foreground)]"
                          >
                            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                              <path d="M7 3H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                              <path d="M10 2h4v4M14 2L8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </a>
                        )}
                      </>
                    ) : (
                      <span className="text-xs text-[var(--muted)]">No address on record</span>
                    )}
                  </div>

                  {/* Market cap */}
                  <div className="ml-4 shrink-0 text-right">
                    {row.usd !== null && row.usd > 0 ? (
                      <p className="font-mono text-sm font-semibold">{formatUsd(row.usd)}</p>
                    ) : (
                      <p className="font-mono text-sm text-[var(--muted)]">—</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {rows.length === 0 && (
        <p className="mt-6 text-[var(--muted)]">No chain data available for this asset.</p>
      )}
    </main>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-[var(--muted)]">{label}</p>
      <p className={`mt-1 font-medium ${accent ? "text-emerald-400" : ""}`}>{value}</p>
    </div>
  );
}
