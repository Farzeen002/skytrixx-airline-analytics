const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const usdExact = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})

const compact = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

const int = new Intl.NumberFormat('en-US')

export function money(n: number, exact = false): string {
  return exact ? usdExact.format(n) : usd.format(n)
}

export function number(n: number): string {
  return int.format(n)
}

export function compactNumber(n: number): string {
  return compact.format(n)
}

export function pct(n: number, digits = 1): string {
  return `${(n * 100).toFixed(digits)}%`
}

export function yieldPerPax(revenue: number, pax: number): string {
  if (!pax) return '—'
  return money(revenue / pax, true)
}
