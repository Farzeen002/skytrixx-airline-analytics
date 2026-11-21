import data from './data/prototype.json'
import type { FlightRow, PrototypeData } from './types'
import { compactNumber, money, number, pct, yieldPerPax } from './format'
import { donut, horizontalBars, loadMeter } from './charts'

const d = data as unknown as PrototypeData
const { kpis } = d

type TabId = 'overview' | 'network' | 'capacity' | 'revenue' | 'forecast'
type PeriodGrain = 'daily' | 'weekly' | 'monthly' | null

const TABS: { id: TabId; label: string }[] = [
  { id: 'overview', label: 'Commercial Overview' },
  { id: 'network', label: 'Network Performance' },
  { id: 'capacity', label: 'Capacity & Load' },
  { id: 'revenue', label: 'Revenue & Distribution' },
  { id: 'forecast', label: 'Forecasting' },
]

const WEEKS = [
  { id: 'wk1', label: 'WK-1', start: 1, end: 7 },
  { id: 'wk2', label: 'WK-2', start: 8, end: 14 },
  { id: 'wk3', label: 'WK-3', start: 15, end: 21 },
  { id: 'wk4', label: 'WK-4', start: 22, end: 31 },
] as const

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const

const state: {
  tab: TabId
  grain: PeriodGrain
  week: string | null
  month: string | null
} = {
  tab: 'overview',
  grain: null,
  week: null,
  month: null,
}

const yieldPerRpk = kpis.totalRpk ? (kpis.passengerRevenueExTax / kpis.totalRpk) * 100 : 0
const rask = kpis.totalAsk ? (kpis.passengerRevenueExTax / kpis.totalAsk) * 100 : 0
const ancillaryShare = kpis.passengerRevenueExTax
  ? kpis.ancillaryRevenue / kpis.passengerRevenueExTax
  : 0
const ticketShare = kpis.passengerRevenueExTax
  ? kpis.flownTicketRevenue / kpis.passengerRevenueExTax
  : 0
const emptySeats = kpis.operatedSeats - kpis.flownPax

const countryNames: Record<string, string> = {
  IN: 'India',
  GB: 'United Kingdom',
  AE: 'UAE',
  US: 'United States',
  CA: 'Canada',
}

const stackMax = kpis.totalCollectedInclTax || 1

/** Illustrative monthly LF index — Nov uses real network LF; others pending data. */
const ILLUSTRATIVE_MONTHLY_LF = [0.81, 0.83, 0.84, 0.82, 0.85, 0.86, 0.87, 0.86, 0.85, 0.84, kpis.avgLoadFactor, 0.83]

function lfTone(lf: number): string {
  const p = Math.round(lf * 100)
  return p >= 88 ? 'high' : p >= 82 ? 'mid' : 'low'
}

function dayOf(f: FlightRow): number {
  if (!f.date) return 0
  return Number(f.date.slice(8, 10))
}

function filteredFlights(): FlightRow[] {
  let rows = [...d.flights]
  if (state.grain === 'weekly' && state.week) {
    const wk = WEEKS.find((w) => w.id === state.week)
    if (wk) rows = rows.filter((f) => {
      const day = dayOf(f)
      return day >= wk.start && day <= wk.end
    })
  }
  if (state.grain === 'monthly' && state.month) {
    if (state.month !== 'Nov') return []
  }
  return rows
}

function aggregateFlights(flights: FlightRow[]) {
  const operated = flights.reduce((s, f) => s + f.operatedSeats, 0)
  const flown = flights.reduce((s, f) => s + f.flownPax, 0)
  const ask = flights.reduce((s, f) => s + f.ask, 0)
  const rpk = flights.reduce((s, f) => s + f.rpk, 0)
  const scheduled = flights.reduce((s, f) => s + f.scheduledSeats, 0)
  const blocked = flights.reduce((s, f) => s + f.blockedSeats, 0)
  const sellable = flights.reduce((s, f) => s + f.sellableSeats, 0)
  const booked = flights.reduce((s, f) => s + f.bookedSeats, 0)
  const sampleRev = flights.reduce((s, f) => s + (f.sampleRevenue ?? 0), 0)
  const sampleAnc = flights.reduce((s, f) => s + (f.sampleAncillary ?? 0), 0)
  return {
    operated,
    flown,
    ask,
    rpk,
    scheduled,
    blocked,
    sellable,
    booked,
    sampleRev,
    sampleAnc,
    lf: operated ? flown / operated : 0,
  }
}

/** Group IB/OB by unordered city pair; rank by combined sample revenue. */
function topIbOb(flights: FlightRow[], limit = 10) {
  type Pair = {
    key: string
    ib?: FlightRow
    ob?: FlightRow
    revenue: number
    lf: number
    flown: number
    operated: number
  }
  const map = new Map<string, Pair>()
  for (const f of flights) {
    const cities = [f.origin, f.destination].sort()
    const key = `${cities[0]}-${cities[1]}`
    let pair = map.get(key)
    if (!pair) {
      pair = { key, revenue: 0, lf: 0, flown: 0, operated: 0 }
      map.set(key, pair)
    }
    // First-seen direction as OB (origin→dest as listed), reverse as IB — prefer lower alphabet origin as OB for stability
    if (f.origin === cities[0]) pair.ob = f
    else pair.ib = f
    pair.revenue += f.sampleRevenue ?? 0
    pair.flown += f.flownPax
    pair.operated += f.operatedSeats
  }
  return [...map.values()]
    .map((p) => ({
      ...p,
      lf: p.operated ? p.flown / p.operated : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit)
}

function verticalBars(
  items: { label: string; value: number; highlight?: boolean; muted?: boolean }[],
  opts?: { format?: (n: number) => string; unit?: string },
): string {
  const max = Math.max(...items.map((i) => i.value), 0.01)
  const fmt = opts?.format ?? ((n: number) => `${Math.round(n * 100)}%`)
  return `
    <div class="vbar-chart" role="img" aria-label="Column chart">
      ${items
        .map((item) => {
          const h = Math.max(4, (item.value / max) * 100)
          const cls = [
            'vbar-col',
            item.highlight ? 'is-highlight' : '',
            item.muted ? 'is-muted' : '',
          ]
            .filter(Boolean)
            .join(' ')
          return `
            <div class="${cls}">
              <span class="vbar-val">${fmt(item.value)}${opts?.unit ?? ''}</span>
              <div class="vbar-track"><div class="vbar-fill" style="--h:${h}%"></div></div>
              <span class="vbar-label">${item.label}</span>
            </div>`
        })
        .join('')}
    </div>
  `
}

function carrierName(code: string, name?: string): string {
  const raw = name ?? d.meta.airlineNames?.[code] ?? code
  return raw.replace(/\s*\(sample\)\s*/gi, '').trim()
}

function weekDateLabel(start: number, end: number): string {
  const last = Math.min(end, 10)
  if (start > 10) return 'No flights'
  return `${start}–${last} Nov`
}

function flightsInWeek(weekId: string): FlightRow[] {
  const wk = WEEKS.find((w) => w.id === weekId)
  if (!wk) return []
  return d.flights.filter((f) => {
    const day = dayOf(f)
    return day >= wk.start && day <= wk.end
  })
}

function weekSummaries() {
  return WEEKS.map((w) => {
    const rows = flightsInWeek(w.id)
    const agg = aggregateFlights(rows)
    return {
      ...w,
      dates: weekDateLabel(w.start, w.end),
      flights: rows,
      count: rows.length,
      ...agg,
    }
  })
}

/** Human-readable active filter for airline users. */
function viewingContext(_flights?: FlightRow[]): { title: string; range: string } {
  if (!state.grain) {
    return { title: 'All flights', range: '1–10 Nov 2026' }
  }
  if (state.grain === 'daily') {
    return { title: 'Daily view', range: 'Each row is one flight date' }
  }
  if (state.grain === 'weekly') {
    const wk = WEEKS.find((w) => w.id === state.week)
    if (!wk) return { title: 'Weekly view', range: 'Select a week below' }
    return {
      title: wk.label,
      range: weekDateLabel(wk.start, wk.end) + ' 2026',
    }
  }
  return {
    title: state.month ?? 'Monthly',
    range: state.month === 'Nov' ? 'November 2026' : `${state.month} 2026`,
  }
}

function viewingBanner(flights: FlightRow[]): string {
  const ctx = viewingContext(flights)
  const n = flights.length
  return `
    <div class="viewing-banner">
      <div class="viewing-main">
        <span class="viewing-label">Showing</span>
        <strong>${ctx.title}</strong>
        <span class="viewing-range">${ctx.range}</span>
      </div>
      <div class="viewing-meta">
        <span>${n} flight${n === 1 ? '' : 's'}</span>
        ${
          state.grain
            ? `<button type="button" class="link-clear" data-clear="1">Clear filter</button>`
            : ''
        }
      </div>
    </div>
  `
}

function renderShell() {
  const app = document.querySelector<HTMLDivElement>('#app')
  if (!app) throw new Error('#app missing')

  app.innerHTML = `
    <header class="topbar">
      <div class="brand">
        <div class="brand-mark" aria-hidden="true">S</div>
        <div class="brand-text">
          <strong>SkyTrixx</strong>
          <span>Commercial analytics</span>
        </div>
      </div>
      <div class="top-filters">
        <span class="filter-pill">Airline: All</span>
        <span class="filter-pill">Currency: ${d.meta.currency}</span>
        <span class="filter-pill">Nov 2026</span>
      </div>
    </header>

    <nav class="floating-tabs" aria-label="Primary views" role="tablist">
      ${TABS.map(
        (t) => `
        <button type="button" role="tab" class="ftab${state.tab === t.id ? ' is-active' : ''}"
          data-tab="${t.id}" aria-selected="${state.tab === t.id}">
          ${t.label}
        </button>`,
      ).join('')}
    </nav>

    <div class="period-bar" id="period-bar"></div>
    <main id="view" class="view"></main>
  `

  app.querySelectorAll<HTMLButtonElement>('[data-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.tab = btn.dataset.tab as TabId
      syncPeriodToTab()
      render()
    })
  })
}

function periodOptionsForTab(tab: TabId): Array<'daily' | 'weekly' | 'monthly'> {
  if (tab === 'network' || tab === 'capacity') return ['daily', 'weekly', 'monthly']
  if (tab === 'forecast') return ['monthly']
  return []
}

function syncPeriodToTab() {
  const allowed = periodOptionsForTab(state.tab)
  if (!allowed.length) {
    state.grain = null
    state.week = null
    state.month = null
    return
  }
  if (state.grain && !allowed.includes(state.grain)) {
    state.grain = null
    state.week = null
    state.month = null
  }
}

function bindClearButtons(root: ParentNode = document) {
  root.querySelectorAll<HTMLButtonElement>('[data-clear]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.grain = null
      state.week = null
      state.month = null
      render()
    })
  })
}

function renderPeriodBar() {
  const bar = document.querySelector('#period-bar')
  if (!bar) return

  const options = periodOptionsForTab(state.tab)
  if (!options.length) {
    bar.innerHTML = ''
    return
  }

  const helpVerb =
    state.tab === 'network' ? 'sectors and markets' : state.tab === 'forecast' ? 'outlook tables' : 'KPIs and flight table'

  bar.innerHTML = `
    <div class="period-row">
      <div class="period-group" role="group" aria-label="Period">
        <span class="period-label">View by</span>
        ${options
          .map(
            (g) => `
          <button type="button" class="chip${state.grain === g ? ' is-active' : ''}" data-grain="${g}">
            ${g[0].toUpperCase()}${g.slice(1)}
          </button>`,
          )
          .join('')}
        <button type="button" class="chip chip-clear" data-clear="1">Clear Filter</button>
      </div>
    </div>
    ${
      state.grain === 'weekly' && options.includes('weekly')
        ? `<div class="week-picker" role="group" aria-label="Select week">
            <p class="picker-help">Select a week — ${helpVerb} update below</p>
            <div class="week-cards">
              ${weekSummaries()
                .map((w) => {
                  const active = state.week === w.id
                  const disabled = w.count === 0
                  return `
                  <button type="button" class="week-card${active ? ' is-active' : ''}${disabled ? ' is-empty' : ''}"
                    data-week="${w.id}" ${disabled ? 'disabled' : ''}>
                    <span class="week-card-id">${w.label}</span>
                    <span class="week-card-dates">${w.dates}</span>
                    <span class="week-card-stat">${w.count ? `${w.count} flights · LF ${pct(w.lf)}` : 'No flights'}</span>
                  </button>`
                })
                .join('')}
            </div>
          </div>`
        : ''
    }
    ${
      state.grain === 'monthly' && options.includes('monthly')
        ? `<div class="week-picker">
            <p class="picker-help">Select a month — ${helpVerb} update below</p>
            <div class="period-sub month-strip" role="group" aria-label="Month">
              ${MONTHS.map((m) => {
                const has = m === 'Nov'
                return `<button type="button" class="chip sub${state.month === m ? ' is-active' : ''}${has ? '' : ' is-empty'}"
                  data-month="${m}" ${has ? '' : 'disabled'}>${m}</button>`
              }).join('')}
            </div>
          </div>`
        : ''
    }
    ${
      state.grain === 'daily' && options.includes('daily')
        ? `<p class="picker-help">Daily view — each flight date is listed in the detail below.</p>`
        : ''
    }
  `

  bar.querySelectorAll<HTMLButtonElement>('[data-grain]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.grain = btn.dataset.grain as PeriodGrain
      state.week = state.grain === 'weekly' ? 'wk1' : null
      state.month = state.grain === 'monthly' ? 'Nov' : null
      render()
    })
  })
  bindClearButtons(bar)
  bar.querySelectorAll<HTMLButtonElement>('[data-week]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.week = btn.dataset.week ?? null
      render()
    })
  })
  bar.querySelectorAll<HTMLButtonElement>('[data-month]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.month = btn.dataset.month ?? null
      render()
    })
  })
}

/** Sector roll-up from filtered flight rows (capacity + coupon revenue on that flight). */
function sectorsFromFlights(flights: FlightRow[]) {
  type Sector = {
    route: string
    flown: number
    operated: number
    revenue: number
    coupons: number
    ask: number
    rpk: number
    count: number
  }
  const map = new Map<string, Sector>()
  for (const f of flights) {
    const route = `${f.origin}-${f.destination}`
    const row = map.get(route) ?? {
      route,
      flown: 0,
      operated: 0,
      revenue: 0,
      coupons: 0,
      ask: 0,
      rpk: 0,
      count: 0,
    }
    row.flown += f.flownPax
    row.operated += f.operatedSeats
    row.revenue += f.sampleRevenue ?? 0
    row.coupons += f.sampleCoupons ?? 0
    row.ask += f.ask
    row.rpk += f.rpk
    row.count += 1
    map.set(route, row)
  }
  return [...map.values()]
    .map((s) => ({
      ...s,
      lf: s.operated ? s.flown / s.operated : 0,
      avgFare: s.coupons ? s.revenue / s.coupons : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue)
}

function viewOverview(): string {
  const weak = [...d.flights].sort((a, b) => a.loadFactor - b.loadFactor)[0]
  const strongRev = [...d.routes].sort((a, b) => b.revenue - a.revenue)[0]

  return `
    <section class="page-head">
      <div>
        <h1>Commercial overview</h1>
        <p>Network revenue, traffic and load performance · 1–10 Nov 2026</p>
      </div>
    </section>

    <section class="kpi-strip light">
      <div class="kpi">
        <span class="label">Pax revenue (ex tax)</span>
        <span class="value">${money(kpis.passengerRevenueExTax)}</span>
        <span class="hint">Base + surcharge</span>
      </div>
      <div class="kpi">
        <span class="label">Ancillary revenue</span>
        <span class="value">${money(kpis.ancillaryRevenue)}</span>
        <span class="hint">${pct(ancillaryShare)} of pax revenue</span>
      </div>
      <div class="kpi">
        <span class="label">ASK</span>
        <span class="value">${compactNumber(kpis.totalAsk)}</span>
        <span class="hint">Operated seats × distance</span>
      </div>
      <div class="kpi">
        <span class="label">RPK</span>
        <span class="value">${compactNumber(kpis.totalRpk)}</span>
        <span class="hint">Flown PAX × distance</span>
      </div>
      <div class="kpi accent">
        <span class="label">Load factor (LF)</span>
        <span class="value">${pct(kpis.avgLoadFactor)}</span>
        <span class="hint">${number(kpis.flownPax)} flown of ${number(kpis.operatedSeats)} operated seats</span>
      </div>
    </section>

    <section class="metric-row defs">
      <div class="metric">
        <span>Yield / RPK</span>
        <strong>${yieldPerRpk.toFixed(2)}¢</strong>
        <em>Passenger revenue ÷ RPK</em>
      </div>
      <div class="metric">
        <span>RASK</span>
        <strong>${rask.toFixed(2)}¢</strong>
        <em>Passenger revenue ÷ ASK</em>
      </div>
      <div class="metric">
        <span>Avg coupon value</span>
        <strong>${yieldPerPax(kpis.passengerRevenueExTax, kpis.couponRecords)}</strong>
        <em>Passenger revenue ex tax</em>
      </div>
      <div class="metric">
        <span>Empty seats</span>
        <strong>${number(emptySeats)}</strong>
        <em>${number(kpis.operatedSeats)} operated − ${number(kpis.flownPax)} flown</em>
      </div>
    </section>

    <section class="grid">
      <article class="panel">
        <h2>Items to review</h2>
        <p class="sub">Operational signals</p>
        <div class="signal-list">
          <div class="signal warn">
            <strong>${weak.flightNumber} · ${weak.origin}–${weak.destination}</strong>
            <p>LF ${pct(weak.loadFactor)} vs network ${pct(kpis.avgLoadFactor)}.</p>
          </div>
          <div class="signal info">
            <strong>Top route: ${strongRev.route}</strong>
            <p>${money(strongRev.revenue)} · avg ${money(strongRev.avgFare ?? 0, true)}</p>
          </div>
        </div>
      </article>
      <article class="panel">
        <h2>Top routes</h2>
        <p class="sub">Snapshot · full detail on Network</p>
        <div class="table-wrap tight">
          <table>
            <thead>
              <tr><th>Route</th><th>Revenue</th><th>PAX</th><th>Avg</th></tr>
            </thead>
            <tbody>
              ${[...d.routes]
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 5)
                .map(
                  (r) => `
                <tr>
                  <td><strong>${r.route}</strong></td>
                  <td class="num">${money(r.revenue)}</td>
                  <td class="num">${number(r.pax)}</td>
                  <td class="num">${money(r.avgFare ?? 0, true)}</td>
                </tr>`,
                )
                .join('')}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  `
}

function viewNetwork(): string {
  const flights = filteredFlights()
  const empty = flights.length === 0
  const agg = aggregateFlights(flights)
  const sectors = sectorsFromFlights(flights)
  const topSector = sectors[0]
  const yieldPeriod = agg.rpk ? (agg.sampleRev / agg.rpk) * 100 : 0

  return `
    <section class="page-head">
      <div>
        <h1>Network performance</h1>
        <p>Sectors and markets for the selected period.</p>
      </div>
    </section>

    ${viewingBanner(flights)}

    ${
      empty
        ? `<div class="empty-state">No flights in this period. Choose another week/month or clear the filter.</div>`
        : ''
    }

    <section class="kpi-strip light four">
      <div class="kpi">
        <span class="label">Pax revenue</span>
        <span class="value">${empty ? '—' : money(agg.sampleRev)}</span>
        <span class="hint">Ex tax · selected period</span>
      </div>
      <div class="kpi">
        <span class="label">Top sector</span>
        <span class="value">${empty || !topSector ? '—' : topSector.route}</span>
        <span class="hint">${empty || !topSector ? '—' : money(topSector.revenue)}</span>
      </div>
      <div class="kpi">
        <span class="label">Sectors</span>
        <span class="value">${empty ? '—' : number(sectors.length)}</span>
        <span class="hint">${empty ? '—' : `${number(flights.length)} flights`}</span>
      </div>
      <div class="kpi">
        <span class="label">Yield</span>
        <span class="value">${empty ? '—' : `${yieldPeriod.toFixed(2)}¢`}</span>
        <span class="hint">Per RPK · selected period</span>
      </div>
    </section>

    <section class="panel">
      <h2>Sector revenue</h2>
      <p class="sub">By flight sector · selected period</p>
      ${
        empty
          ? '<p class="note-inline">No sectors in range.</p>'
          : horizontalBars(
              sectors.map((r) => ({
                label: r.route,
                value: r.revenue,
                secondary: `LF ${pct(r.lf)} · avg ${money(r.avgFare, true)}`,
              })),
            )
      }
    </section>

    <section class="panel">
      <h2>Sector scorecard</h2>
      <p class="sub">${viewingContext().title} · ${viewingContext().range}</p>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Sector</th>
              <th>Flights</th>
              <th>Revenue</th>
              <th>Flown</th>
              <th>LF</th>
              <th>ASK</th>
              <th>RPK</th>
            </tr>
          </thead>
          <tbody>
            ${
              empty
                ? `<tr><td colspan="7">No sectors in range.</td></tr>`
                : sectors
                    .map((s) => {
                      const tone = lfTone(s.lf)
                      return `
                <tr>
                  <td><strong>${s.route}</strong></td>
                  <td class="num">${number(s.count)}</td>
                  <td class="num">${money(s.revenue)}</td>
                  <td class="num">${number(s.flown)}</td>
                  <td><span class="lf-pill ${tone}">${Math.round(s.lf * 100)}%</span></td>
                  <td class="num">${compactNumber(s.ask)}</td>
                  <td class="num">${compactNumber(s.rpk)}</td>
                </tr>`
                    })
                    .join('')
            }
          </tbody>
        </table>
      </div>
    </section>

    ${
      !state.grain
        ? `<section class="panel" style="margin-top:1rem">
      <h2>O&amp;D markets</h2>
      <p class="sub">Full network itinerary view</p>
      ${horizontalBars(
        [...d.odMarkets]
          .sort((a, b) => b.revenue - a.revenue)
          .map((o) => ({
            label: o.market,
            value: o.revenue,
            secondary: `${o.pax} pax · avg ${money(o.avgFare ?? 0)}`,
          })),
      )}
    </section>`
        : ''
    }
  `
}

function weekCompareTable(): string {
  const rows = weekSummaries()
  return `
    <section class="panel">
      <h2>Performance by week</h2>
      <p class="sub">Compare weeks, then select one to update the view below</p>
      <div class="table-wrap">
        <table class="week-table">
          <thead>
            <tr>
              <th>Week</th>
              <th>Dates</th>
              <th>Flights</th>
              <th>Flown</th>
              <th>Operated</th>
              <th>LF</th>
              <th>ASK</th>
              <th>RPK</th>
            </tr>
          </thead>
          <tbody>
            ${rows
              .map((w) => {
                const active = state.week === w.id
                const tone = w.count ? lfTone(w.lf) : ''
                return `
                <tr class="${active ? 'is-active-row' : ''}${w.count ? '' : ' is-empty-row'}" data-week-row="${w.id}">
                  <td><strong>${w.label}</strong></td>
                  <td>${w.dates}</td>
                  <td class="num">${w.count || '—'}</td>
                  <td class="num">${w.count ? number(w.flown) : '—'}</td>
                  <td class="num">${w.count ? number(w.operated) : '—'}</td>
                  <td>${w.count ? `<span class="lf-pill ${tone}">${Math.round(w.lf * 100)}%</span>` : '—'}</td>
                  <td class="num">${w.count ? compactNumber(w.ask) : '—'}</td>
                  <td class="num">${w.count ? compactNumber(w.rpk) : '—'}</td>
                </tr>`
              })
              .join('')}
          </tbody>
        </table>
      </div>
    </section>
  `
}

function viewCapacity(): string {
  const flights = filteredFlights()
  const source = flights
  const agg = aggregateFlights(source)
  const empty = source.length === 0
  const pairs = topIbOb(empty ? d.flights : source, 10)

  return `
    <section class="page-head">
      <div>
        <h1>Capacity &amp; load</h1>
        <p>Seat supply, traffic and load factor.</p>
      </div>
    </section>

    ${viewingBanner(source)}

    ${state.grain === 'weekly' ? weekCompareTable() : ''}

    ${
      empty
        ? `<div class="empty-state">No flights in this period. Choose another week/month or clear the filter.</div>`
        : ''
    }

    <section class="kpi-strip light four">
      <div class="kpi">
        <span class="label">ASK</span>
        <span class="value">${empty ? '—' : compactNumber(agg.ask)}</span>
        <span class="hint">For selected period</span>
      </div>
      <div class="kpi">
        <span class="label">RPK</span>
        <span class="value">${empty ? '—' : compactNumber(agg.rpk)}</span>
        <span class="hint">For selected period</span>
      </div>
      <div class="kpi accent">
        <span class="label">Load factor (LF)</span>
        <span class="value">${empty ? '—' : pct(agg.lf)}</span>
        <span class="hint">${empty ? '—' : `${number(agg.flown)} flown / ${number(agg.operated)} seats`}</span>
      </div>
      <div class="kpi">
        <span class="label">Operated seats</span>
        <span class="value">${empty ? '—' : number(agg.operated)}</span>
        <span class="hint">For selected period</span>
      </div>
    </section>

    <section class="grid">
      <article class="panel">
        <h2>Load factor by flight</h2>
        <p class="sub">Flights in selected period</p>
        ${
          empty
            ? '<p class="note-inline">No flights in range.</p>'
            : loadMeter(
                source.map((f) => ({
                  flightNumber: f.flightNumber,
                  loadFactor: f.loadFactor,
                  route: `${f.origin} → ${f.destination} · ${f.date ?? ''} · ${number(f.flownPax)}/${number(f.operatedSeats)}`,
                })),
              )
        }
      </article>
      <article class="panel">
        <h2>Capacity reconciliation</h2>
        <p class="sub">For selected period</p>
        <div class="pipeline vertical">
          <div class="pipe-step"><span>Scheduled</span><strong>${empty ? '—' : number(agg.scheduled)}</strong></div>
          <div class="pipe-step"><span>Operated</span><strong>${empty ? '—' : number(agg.operated)}</strong></div>
          <div class="pipe-step"><span>Sellable</span><strong>${empty ? '—' : number(agg.sellable)}</strong></div>
          <div class="pipe-step accent"><span>Flown</span><strong>${empty ? '—' : number(agg.flown)}</strong></div>
        </div>
        <ul class="fact-list">
          <li><b>Blocked:</b> ${empty ? '—' : number(agg.blocked)}</li>
          <li><b>Booked:</b> ${empty ? '—' : number(agg.booked)}</li>
        </ul>
      </article>
    </section>

    <section class="panel">
      <h2>Top flights (IB &amp; OB)</h2>
      <p class="sub">City pairs · selected period</p>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>City pair</th>
              <th>OB</th>
              <th>IB</th>
              <th>Flown PAX</th>
              <th>LF</th>
            </tr>
          </thead>
          <tbody>
            ${pairs
              .map((p, i) => {
                const tone = lfTone(p.lf)
                return `
                <tr>
                  <td class="num">${i + 1}</td>
                  <td><strong>${p.key}</strong></td>
                  <td>${p.ob ? `${p.ob.flightNumber} · ${p.ob.origin}→${p.ob.destination}` : '—'}</td>
                  <td>${p.ib ? `${p.ib.flightNumber} · ${p.ib.origin}→${p.ib.destination}` : '—'}</td>
                  <td class="num">${number(p.flown)}</td>
                  <td><span class="lf-pill ${tone}">${Math.round(p.lf * 100)}%</span></td>
                </tr>`
              })
              .join('')}
          </tbody>
        </table>
      </div>
    </section>

    ${
      state.grain === 'monthly'
        ? `<section class="panel">
      <h2>Load factor by month</h2>
      <p class="sub">Jan–Dec</p>
      ${verticalBars(
        MONTHS.map((m, i) => ({
          label: m,
          value: ILLUSTRATIVE_MONTHLY_LF[i],
          highlight: m === state.month,
          muted: m !== 'Nov',
        })),
      )}
    </section>`
        : ''
    }

    <section class="panel">
      <h2>Performance by flight no / route</h2>
      <p class="sub">${viewingContext(source).title} · ${viewingContext(source).range}</p>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Flight</th>
              <th>Route</th>
              <th>Date</th>
              <th>Aircraft</th>
              <th>Operated</th>
              <th>Booked</th>
              <th>Flown</th>
              <th>LF</th>
              <th>ASK</th>
              <th>RPK</th>
            </tr>
          </thead>
          <tbody>
            ${(empty ? [] : flights)
              .map((f) => {
                const tone = lfTone(f.loadFactor)
                return `
                <tr>
                  <td><strong>${f.flightNumber}</strong><div class="cell-sub">${carrierName(f.airline, f.airlineName)}</div></td>
                  <td>${f.origin}—${f.destination}</td>
                  <td>${f.date ?? '—'}</td>
                  <td>${f.aircraft}</td>
                  <td class="num">${number(f.operatedSeats)}</td>
                  <td class="num">${number(f.bookedSeats)}</td>
                  <td class="num">${number(f.flownPax)}</td>
                  <td><span class="lf-pill ${tone}">${Math.round(f.loadFactor * 100)}%</span></td>
                  <td class="num">${compactNumber(f.ask)}</td>
                  <td class="num">${compactNumber(f.rpk)}</td>
                </tr>`
              })
              .join('') || `<tr><td colspan="10">No flights in range.</td></tr>`}
          </tbody>
        </table>
      </div>
    </section>
  `
}

function viewRevenue(): string {
  return `
    <section class="page-head">
      <div>
        <h1>Revenue &amp; distribution</h1>
        <p>Revenue mix, channels and point of sale.</p>
      </div>
    </section>

    <section class="kpi-strip light four">
      <div class="kpi">
        <span class="label">Pax revenue (ex tax)</span>
        <span class="value">${money(kpis.passengerRevenueExTax)}</span>
        <span class="hint">${pct(ticketShare)} ticket · ${pct(ancillaryShare)} ancillary</span>
      </div>
      <div class="kpi">
        <span class="label">Passenger yield</span>
        <span class="value">${yieldPerRpk.toFixed(2)}¢</span>
        <span class="hint">Per RPK</span>
      </div>
      <div class="kpi">
        <span class="label">Ancillary</span>
        <span class="value">${money(kpis.ancillaryRevenue)}</span>
        <span class="hint">Bags, seats, meals</span>
      </div>
      <div class="kpi">
        <span class="label">Avg coupon value</span>
        <span class="value">${yieldPerPax(kpis.passengerRevenueExTax, kpis.couponRecords)}</span>
        <span class="hint">Ex tax</span>
      </div>
    </section>

    <section class="grid">
      <article class="panel">
        <h2>Revenue composition</h2>
        <p class="sub">Ticket, ancillary and tax</p>
        <div class="stack">
          <div class="stack-row">
            <span>Flown ticket</span>
            <div class="stack-track"><div class="stack-fill c-ticket" style="--w:${(kpis.flownTicketRevenue / stackMax) * 100}%"></div></div>
            <strong>${money(kpis.flownTicketRevenue)}</strong>
          </div>
          <div class="stack-row">
            <span>Ancillary</span>
            <div class="stack-track"><div class="stack-fill c-anc" style="--w:${(kpis.ancillaryRevenue / stackMax) * 100}%"></div></div>
            <strong>${money(kpis.ancillaryRevenue)}</strong>
          </div>
          <div class="stack-row">
            <span>Taxes</span>
            <div class="stack-track"><div class="stack-fill c-tax" style="--w:${(kpis.taxAmount / stackMax) * 100}%"></div></div>
            <strong>${money(kpis.taxAmount)}</strong>
          </div>
        </div>
        <ul class="fact-list">
          <li><b>Total collected incl. tax:</b> ${money(kpis.totalCollectedInclTax)}</li>
        </ul>
      </article>
      <article class="panel">
        <h2>Ancillary revenue</h2>
        <p class="sub">By product</p>
        ${horizontalBars(
          d.ancillaries
            .filter((a) => a.type !== 'None')
            .map((a) => ({
              label: a.type,
              value: a.revenue,
              secondary: `${a.count} · avg ${money(a.avg ?? 0, true)}`,
            })),
        )}
      </article>
    </section>

    <section class="grid">
      <article class="panel">
        <h2>Cabin &amp; RBD</h2>
        <p class="sub">Fare class mix</p>
        ${donut(
          d.cabins.map((c) => ({ label: c.cabin, value: c.revenue })),
          'pax rev',
          money(kpis.passengerRevenueExTax),
        )}
        <div class="table-wrap tight" style="margin-top:1rem">
          <table>
            <thead><tr><th>RBD</th><th>PAX</th><th>Revenue</th><th>Avg</th></tr></thead>
            <tbody>
              ${d.rbds
                .map(
                  (r) => `
                <tr>
                  <td><strong>${r.rbd}</strong></td>
                  <td class="num">${number(r.pax)}</td>
                  <td class="num">${money(r.revenue)}</td>
                  <td class="num">${money(r.avgFare ?? 0, true)}</td>
                </tr>`,
                )
                .join('')}
            </tbody>
          </table>
        </div>
      </article>
      <article class="panel">
        <h2>Channel &amp; POS</h2>
        <p class="sub">Distribution and booking country</p>
        ${horizontalBars(
          d.channels.map((c) => ({
            label: c.channel,
            value: c.revenue,
            secondary: pct(c.share ?? 0),
          })),
        )}
        <div style="margin-top:1.25rem">
          ${horizontalBars(
            d.pointOfSale.map((p) => ({
              label: countryNames[p.country] ?? p.country,
              value: p.revenue,
              secondary: p.country,
            })),
          )}
        </div>
      </article>
    </section>
  `
}

function viewForecast(): string {
  const flights = filteredFlights()
  const empty = flights.length === 0
  const agg = aggregateFlights(flights)
  const markets = sectorsFromFlights(flights)
  const watch = [...markets].sort((a, b) => a.lf - b.lf).slice(0, 3)

  return `
    <section class="page-head">
      <div>
        <h1>Forecasting</h1>
        <p>Forward demand, bookings and capacity outlook.</p>
      </div>
    </section>

    ${viewingBanner(flights)}

    ${
      empty
        ? `<div class="empty-state">No flights in this period. Choose another month or clear the filter.</div>`
        : ''
    }

    <section class="kpi-strip light four">
      <div class="kpi">
        <span class="label">Next 6-month revenue</span>
        <span class="value">—</span>
        <span class="hint">Outlook</span>
      </div>
      <div class="kpi">
        <span class="label">Forward bookings</span>
        <span class="value">—</span>
        <span class="hint">Scheduled flights</span>
      </div>
      <div class="kpi">
        <span class="label">Planned ASK</span>
        <span class="value">${empty ? '—' : compactNumber(agg.ask)}</span>
        <span class="hint">Selected period</span>
      </div>
      <div class="kpi accent">
        <span class="label">Expected LF</span>
        <span class="value">${empty ? '—' : pct(agg.lf)}</span>
        <span class="hint">Based on current flown / operated</span>
      </div>
    </section>

    <section class="grid">
      <article class="panel">
        <h2>Revenue outlook</h2>
        <p class="sub">${state.grain === 'monthly' ? 'Monthly horizon' : 'Forward months'}</p>
        ${verticalBars(
          [
            { label: 'Sep', value: 0.72, muted: true },
            { label: 'Oct', value: 0.78, muted: true },
            { label: 'Nov', value: 1, highlight: state.month === 'Nov' || !state.grain },
            { label: 'Dec', value: 0.85, muted: true },
            { label: 'Jan', value: 0.88, muted: true },
            { label: 'Feb', value: 0.8, muted: true },
          ],
          { format: () => '—' },
        )}
      </article>
      <article class="panel">
        <h2>Watchlist</h2>
        <p class="sub">Markets to review · selected period</p>
        <div class="signal-list">
          ${
            empty
              ? '<p class="note-inline">No markets in range.</p>'
              : watch
                  .map((m) => {
                    const tone = m.lf < 0.82 ? 'warn' : 'info'
                    return `
              <div class="signal ${tone}">
                <strong>${m.route}</strong>
                <p>LF ${pct(m.lf)} · ${number(m.flown)}/${number(m.operated)} seats</p>
              </div>`
                  })
                  .join('')
          }
        </div>
      </article>
    </section>

    <section class="panel">
      <h2>Demand and capacity</h2>
      <p class="sub">Market roll-up · ${viewingContext().title} · ${viewingContext().range}</p>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Market</th>
              <th>Flights</th>
              <th>Operated seats</th>
              <th>Flown PAX</th>
              <th>LF</th>
              <th>Signal</th>
            </tr>
          </thead>
          <tbody>
            ${
              empty
                ? `<tr><td colspan="6">No markets in range.</td></tr>`
                : markets
                    .map((m) => {
                      const signal = m.lf >= 0.88 ? 'On plan' : m.lf >= 0.82 ? 'Monitor' : 'Review'
                      const cls =
                        signal === 'On plan' ? 'sig-ok' : signal === 'Monitor' ? 'sig-mid' : 'sig-bad'
                      return `
                <tr>
                  <td><strong>${m.route}</strong></td>
                  <td class="num">${number(m.count)}</td>
                  <td class="num">${number(m.operated)}</td>
                  <td class="num">${number(m.flown)}</td>
                  <td><span class="lf-pill ${lfTone(m.lf)}">${Math.round(m.lf * 100)}%</span></td>
                  <td class="${cls}">${signal}</td>
                </tr>`
                    })
                    .join('')
            }
          </tbody>
        </table>
      </div>
    </section>
  `
}

function renderView() {
  const view = document.querySelector('#view')
  if (!view) return
  const map: Record<TabId, () => string> = {
    overview: viewOverview,
    network: viewNetwork,
    capacity: viewCapacity,
    revenue: viewRevenue,
    forecast: viewForecast,
  }
  view.innerHTML = map[state.tab]()
  bindClearButtons(view)
  view.querySelectorAll<HTMLTableRowElement>('[data-week-row]').forEach((row) => {
    const id = row.dataset.weekRow
    if (!id || row.classList.contains('is-empty-row')) return
    row.style.cursor = 'pointer'
    row.addEventListener('click', () => {
      state.grain = 'weekly'
      state.week = id
      state.month = null
      render()
    })
  })
}

function render() {
  syncPeriodToTab()
  const app = document.querySelector('#app')
  if (!app?.querySelector('.floating-tabs')) {
    renderShell()
  } else {
    app.querySelectorAll<HTMLButtonElement>('[data-tab]').forEach((btn) => {
      const active = btn.dataset.tab === state.tab
      btn.classList.toggle('is-active', active)
      btn.setAttribute('aria-selected', String(active))
    })
  }
  renderPeriodBar()
  renderView()
}

render()
