"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChainIcon } from "@/components/ChainIcon";
import type { Stablecoin } from "@/lib/stablecoins";
import { getMetrics } from "@/lib/tokenMetrics";

type RankedCoin = Stablecoin & { rank: number };

function formatUsd(usd: number): string {
  if (usd >= 1_000_000_000) return `$${(usd / 1_000_000_000).toFixed(2)}B`;
  if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(1)}M`;
  if (usd >= 1_000) return `$${(usd / 1_000).toFixed(0)}K`;
  if (usd === 0) return "-";
  return `$${usd.toLocaleString()}`;
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--card)] px-2.5 py-0.5 text-xs text-[var(--foreground)]">
      {children}
    </span>
  );
}

const currencyToCountry: Record<string, string> = {
  MXN: "mx", BRL: "br", SGD: "sg", IDR: "id", TRY: "tr", CAD: "ca",
  JPY: "jp", NZD: "nz", ZAR: "za", HKD: "hk", GBP: "gb", AUD: "au",
  CHF: "ch", CNY: "cn", INR: "in", KRW: "kr", THB: "th", PHP: "ph",
  MYR: "my", VND: "vn", AED: "ae", SAR: "sa", ILS: "il", NGN: "ng",
  KES: "ke", GHS: "gh", EGP: "eg", ARS: "ar", COP: "co", CLP: "cl",
  PEN: "pe", UYU: "uy", PLN: "pl", SEK: "se", NOK: "no", DKK: "dk",
  CZK: "cz", HUF: "hu", RUB: "ru", UAH: "ua", RON: "ro", TWD: "tw",
  BGN: "bg", ISK: "is", PKR: "pk", BDT: "bd", LKR: "lk", VES: "ve",
  MAD: "ma", DZD: "dz", TND: "tn", ETB: "et", QAR: "qa", KWD: "kw",
  BHD: "bh", OMR: "om", JOD: "jo", LBP: "lb",
};

function resolveCountry(currency: string, symbol: string): string | null {
  const direct = currencyToCountry[currency?.toUpperCase()];
  if (direct) return direct;
  const s = symbol.toUpperCase();
  for (const [code, cc] of Object.entries(currencyToCountry)) {
    if (s.includes(code)) return cc;
  }
  return null;
}

function CurrencyPill({ currency, symbol }: { currency: string; symbol: string }) {
  const cc = resolveCountry(currency, symbol);
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-2.5 py-0.5 text-xs text-[var(--foreground)]">
      {cc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`https://flagcdn.com/w40/${cc}.png`}
          srcSet={`https://flagcdn.com/w80/${cc}.png 2x`}
          width={20}
          height={15}
          alt={`${currency} flag`}
          className="h-[15px] w-[20px] rounded-[2px] object-cover"
        />
      )}
      {currency}
    </span>
  );
}

function ChainBadge({ name }: { name: string }) {
  const icon = ChainIcon({ name, size: 22 });
  if (icon) {
    return (
      <span
        className="inline-flex h-[22px] items-center"
        title={name}
        aria-label={name}
      >
        {icon}
      </span>
    );
  }
  return <Pill>{name}</Pill>;
}

function matches(coin: Stablecoin, q: string): boolean {
  if (!q) return true;
  const needle = q.toLowerCase();
  const haystack = [
    coin.symbol,
    coin.name,
    coin.currency,
    coin.category,
    coin.yieldSource,
    ...coin.chains,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(needle);
}

export default function StablecoinTable({ rows }: { rows: Stablecoin[] }) {
  const [query, setQuery] = useState("");

  // Assign each coin its original market-cap rank before filtering, so the
  // number stays meaningful when the user searches.
  const ranked = useMemo<RankedCoin[]>(
    () => rows.map((coin, i) => ({ ...coin, rank: i + 1 })),
    [rows],
  );

  const filtered = useMemo(
    () => ranked.filter((coin) => matches(coin, query.trim())),
    [ranked, query],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by symbol, currency, issuer, or chain..."
            className="w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
            aria-label="Search stablecoins"
          />
        </div>
        <span className="text-xs text-[var(--muted)]">
          Showing {filtered.length} of {rows.length}
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--card)]">
        <table className="min-w-full divide-y divide-[var(--border)] text-sm">
          <thead className="bg-black/20">
            <tr className="text-left text-xs uppercase tracking-wider text-[var(--muted)]">
              <th className="w-12 px-3 py-3 text-right font-medium">#</th>
              <th className="px-4 py-3 font-medium">Token</th>
              <th className="px-4 py-3 font-medium">Name / Issuer</th>
              <th className="px-4 py-3 font-medium">Currency</th>
              <th className="px-4 py-3 font-medium">Chains</th>
              <th className="px-4 py-3 text-right font-medium">Market Cap</th>
              <th className="px-4 py-3 text-right font-medium">30 Day Payment Volume</th>
              <th className="px-2 py-3 font-medium sr-only">Detail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-[var(--muted)]"
                >
                  No stablecoins match &quot;{query}&quot;.
                </td>
              </tr>
            ) : (
              filtered.map((coin) => {
                const m = getMetrics(coin.symbol);
                const href = `/coin/${encodeURIComponent(coin.symbol)}`;
                return (
                  <tr key={coin.symbol} className="group hover:bg-white/[0.02]">
                    <td className="w-12 px-3 py-4 text-right align-top font-mono text-xs text-[var(--muted)]">
                      {coin.rank}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <Link
                        href={href}
                        className="font-semibold hover:text-[var(--accent)] transition-colors"
                      >
                        {coin.symbol}
                      </Link>
                    </td>
                    <td className="px-4 py-4 align-top text-[var(--muted)]">
                      {coin.name}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <CurrencyPill currency={coin.currency} symbol={coin.symbol} />
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex flex-wrap items-center gap-2">
                        {coin.chains.map((chain) => (
                          <ChainBadge key={chain} name={chain} />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right align-top font-mono">
                      {formatUsd(coin.marketCapUsd)}
                    </td>
                    <td
                      className={`px-4 py-4 text-right align-top font-mono ${
                        m.volume30dUsd ? "" : "text-[var(--muted)]"
                      }`}
                    >
                      {m.volume30dUsd ? formatUsd(m.volume30dUsd) : "-"}
                    </td>
                    <td className="px-2 py-4 align-top">
                      <Link
                        href={href}
                        className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--muted)] opacity-0 transition-all group-hover:opacity-100 hover:border-[var(--accent)] hover:text-[var(--accent)]"
                      >
                        Details
                        <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                          <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
