export type BarItem = {
  label: string
  value: number
  secondary?: string
}

const PALETTE = ['#0E7C7B', '#1A4F6B', '#B85C38', '#3D6B4F', '#5C6B7A', '#0A1B2E']

export function horizontalBars(items: BarItem[], opts?: { max?: number; unit?: string }): string {
  const max = opts?.max ?? Math.max(...items.map((i) => i.value), 1)
  return `
    <div class="hbar-list" role="img" aria-label="Bar chart">
      ${items
        .map((item, idx) => {
          const width = Math.max(4, (item.value / max) * 100)
          const color = PALETTE[idx % PALETTE.length]
          return `
            <div class="hbar-row">
              <div class="hbar-label">
                <span>${escapeHtml(item.label)}</span>
                ${item.secondary ? `<small>${escapeHtml(item.secondary)}</small>` : ''}
              </div>
              <div class="hbar-track">
                <div class="hbar-fill" style="--w:${width}%; --c:${color}"></div>
              </div>
              <div class="hbar-value">${escapeHtml(opts?.unit ? `${formatShort(item.value)}${opts.unit}` : formatShort(item.value))}</div>
            </div>
          `
        })
        .join('')}
    </div>
  `
}

export function donut(items: BarItem[], centerLabel: string, centerValue: string): string {
  const total = items.reduce((s, i) => s + i.value, 0) || 1
  const r = 42
  const c = 2 * Math.PI * r
  let offset = 0
  const slices = items
    .map((item, idx) => {
      const frac = item.value / total
      const len = frac * c
      const dash = `${len} ${c - len}`
      const el = `<circle class="donut-slice" cx="50" cy="50" r="${r}" fill="none" stroke="${PALETTE[idx % PALETTE.length]}" stroke-width="12" stroke-dasharray="${dash}" stroke-dashoffset="${-offset}" transform="rotate(-90 50 50)"></circle>`
      offset += len
      return el
    })
    .join('')

  const legend = items
    .map(
      (item, idx) => `
      <li>
        <span class="swatch" style="background:${PALETTE[idx % PALETTE.length]}"></span>
        <span class="leg-label">${escapeHtml(item.label)}</span>
        <span class="leg-value">${escapeHtml(formatShort(item.value))}</span>
      </li>`,
    )
    .join('')

  return `
    <div class="donut-wrap">
      <svg viewBox="0 0 100 100" class="donut-svg" aria-hidden="true">
        <circle cx="50" cy="50" r="${r}" fill="none" stroke="#D7E3EA" stroke-width="12"></circle>
        ${slices}
      </svg>
      <div class="donut-center">
        <strong>${escapeHtml(centerValue)}</strong>
        <span>${escapeHtml(centerLabel)}</span>
      </div>
      <ul class="donut-legend">${legend}</ul>
    </div>
  `
}

export function loadMeter(flights: { flightNumber: string; loadFactor: number; route: string }[]): string {
  return `
    <div class="load-grid">
      ${flights
        .map((f) => {
          const pct = Math.round(f.loadFactor * 100)
          const tone = pct >= 88 ? 'high' : pct >= 82 ? 'mid' : 'low'
          return `
            <div class="load-cell tone-${tone}">
              <div class="load-top">
                <strong>${escapeHtml(f.flightNumber)}</strong>
                <span>${pct}%</span>
              </div>
              <div class="load-route">${escapeHtml(f.route)}</div>
              <div class="load-track"><div class="load-fill" style="--w:${pct}%"></div></div>
            </div>
          `
        })
        .join('')}
    </div>
  `
}

function formatShort(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}k`
  return n % 1 === 0 ? String(n) : n.toFixed(0)
}

function escapeHtml(s: string): string {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}
