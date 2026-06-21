export function formatNumber(value: number | null | undefined, maxDecimals = 4): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "—";
  }

  const abs = Math.abs(value);
  const decimals = abs >= 1000 ? 2 : maxDecimals;

  return new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: decimals,
  }).format(value);
}
