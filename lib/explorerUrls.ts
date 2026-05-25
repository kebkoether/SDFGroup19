export function explorerUrl(chain: string, address: string): string | null {
  const a = address;
  switch (chain) {
    case "Ethereum":    return `https://etherscan.io/token/${a}`;
    case "Polygon":     return `https://polygonscan.com/token/${a}`;
    case "Base":        return `https://basescan.org/token/${a}`;
    case "BNB Chain":   return `https://bscscan.com/token/${a}`;
    case "Avalanche":   return `https://snowtrace.io/token/${a}`;
    case "Arbitrum":    return `https://arbiscan.io/token/${a}`;
    case "Celo":        return `https://celoscan.io/token/${a}`;
    case "Moonbeam":    return `https://moonscan.io/token/${a}`;
    case "Gnosis":      return `https://gnosisscan.io/token/${a}`;
    case "Ronin":       return `https://app.roninchain.com/token/${a}`;
    case "Solana":      return `https://solscan.io/token/${a}`;
    case "Hedera":      return /^\d+\.\d+\.\d+$/.test(a)
                          ? `https://hashscan.io/mainnet/token/${a}`
                          : `https://hashscan.io/mainnet/account/${a}`;
    case "Stellar": {
      const parts = a.split(":");
      return parts.length === 2
        ? `https://stellar.expert/explorer/public/asset/${parts[0]}-${parts[1]}`
        : `https://stellar.expert/explorer/public/account/${a}`;
    }
    case "XRP Ledger":  return `https://livenet.xrpl.org/accounts/${a}`;
    case "XDC":         return `https://xdcscan.com/token/${a}`;
    case "Sui":         return `https://suiscan.xyz/mainnet/coin/${a}`;
    default:            return null;
  }
}
