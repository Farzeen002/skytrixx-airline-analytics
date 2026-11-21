"use strict";
(() => {
  // src/data/prototype.json
  var prototype_default = {
    meta: {
      title: "SkyTrixx Airline Commercial Analytics",
      note: "Synthetic prototype data \u2014 100 coupon records across 10 flight sectors (USD).",
      currency: "USD",
      source: "SkyTrixx_Airline_Commercial_Analytics_Prototype.xlsx",
      grain: {
        coupon: "One row = one flown passenger coupon on one flight leg.",
        capacity: "One row = one operated flight sector/date (full plane totals).",
        warning: "Coupon sheet is a 10-row sample per flight. Capacity Flown_PAX is the full flight total \u2014 do not treat sample coupon count as total passengers."
      },
      airlineNames: {
        AI: "Air India (sample)",
        "6E": "IndiGo (sample)",
        SG: "SpiceJet (sample)",
        UK: "Vistara (sample)"
      }
    },
    kpis: {
      couponRecords: 100,
      flightSectors: 10,
      passengerRevenueExTax: 28603,
      flownTicketRevenue: 26231,
      ancillaryRevenue: 2372,
      taxAmount: 3014,
      totalCollectedInclTax: 31617,
      operatedSeats: 1951,
      flownPax: 1645,
      totalAsk: 6107530,
      totalRpk: 5076890,
      avgLoadFactor: 0.8454
    },
    airlines: [
      {
        code: "6E",
        pax: 30,
        revenue: 5790,
        ancillary: 647,
        flownTicket: 5143,
        name: "IndiGo (sample)",
        avgFare: 193,
        ancillaryShare: 0.1117
      },
      {
        code: "AI",
        pax: 30,
        revenue: 15634,
        ancillary: 804,
        flownTicket: 14830,
        name: "Air India (sample)",
        avgFare: 521.13,
        ancillaryShare: 0.0514
      },
      {
        code: "SG",
        pax: 20,
        revenue: 4564,
        ancillary: 536,
        flownTicket: 4028,
        name: "SpiceJet (sample)",
        avgFare: 228.2,
        ancillaryShare: 0.1174
      },
      {
        code: "UK",
        pax: 20,
        revenue: 2615,
        ancillary: 385,
        flownTicket: 2230,
        name: "Vistara (sample)",
        avgFare: 130.75,
        ancillaryShare: 0.1472
      }
    ],
    routes: [
      {
        route: "BOM-LHR",
        pax: 10,
        revenue: 5790,
        avgFare: 579
      },
      {
        route: "LHR-BOM",
        pax: 10,
        revenue: 5787,
        avgFare: 578.7
      },
      {
        route: "BOM-DEL",
        pax: 20,
        revenue: 5366,
        avgFare: 268.3
      },
      {
        route: "BOM-DXB",
        pax: 10,
        revenue: 2282,
        avgFare: 228.2
      },
      {
        route: "DXB-BOM",
        pax: 10,
        revenue: 2282,
        avgFare: 228.2
      },
      {
        route: "DXB-DEL",
        pax: 10,
        revenue: 2205,
        avgFare: 220.5
      },
      {
        route: "DEL-DXB",
        pax: 10,
        revenue: 2202,
        avgFare: 220.2
      },
      {
        route: "BLR-BOM",
        pax: 10,
        revenue: 1383,
        avgFare: 138.3
      },
      {
        route: "DEL-BOM",
        pax: 10,
        revenue: 1306,
        avgFare: 130.6
      }
    ],
    channels: [
      {
        channel: "GDS",
        pax: 20,
        revenue: 6075,
        avgFare: 303.75,
        share: 0.2124
      },
      {
        channel: "NDC",
        pax: 20,
        revenue: 6014,
        avgFare: 300.7,
        share: 0.2103
      },
      {
        channel: "OTA",
        pax: 20,
        revenue: 5618,
        avgFare: 280.9,
        share: 0.1964
      },
      {
        channel: "Travel Agent",
        pax: 20,
        revenue: 5612,
        avgFare: 280.6,
        share: 0.1962
      },
      {
        channel: "Direct",
        pax: 20,
        revenue: 5284,
        avgFare: 264.2,
        share: 0.1847
      }
    ],
    ancillaries: [
      {
        type: "Meal",
        count: 20,
        revenue: 759,
        avg: 37.95
      },
      {
        type: "Baggage",
        count: 20,
        revenue: 735,
        avg: 36.75
      },
      {
        type: "Upgrade",
        count: 20,
        revenue: 445,
        avg: 22.25
      },
      {
        type: "Seat Selection",
        count: 20,
        revenue: 433,
        avg: 21.65
      },
      {
        type: "None",
        count: 20,
        revenue: 0,
        avg: 0
      }
    ],
    cabins: [
      {
        cabin: "Business",
        pax: 10,
        revenue: 4057,
        avgFare: 405.7,
        share: 0.1418
      },
      {
        cabin: "Economy",
        pax: 90,
        revenue: 24546,
        avgFare: 272.73,
        share: 0.8582
      }
    ],
    rbds: [
      {
        rbd: "B",
        pax: 10,
        revenue: 3415,
        avgFare: 341.5
      },
      {
        rbd: "V",
        pax: 10,
        revenue: 3361,
        avgFare: 336.1
      },
      {
        rbd: "Q",
        pax: 10,
        revenue: 2875,
        avgFare: 287.5
      },
      {
        rbd: "J",
        pax: 10,
        revenue: 2868,
        avgFare: 286.8
      },
      {
        rbd: "K",
        pax: 10,
        revenue: 2744,
        avgFare: 274.4
      },
      {
        rbd: "H",
        pax: 10,
        revenue: 2743,
        avgFare: 274.3
      },
      {
        rbd: "L",
        pax: 10,
        revenue: 2681,
        avgFare: 268.1
      },
      {
        rbd: "M",
        pax: 10,
        revenue: 2660,
        avgFare: 266
      },
      {
        rbd: "S",
        pax: 10,
        revenue: 2653,
        avgFare: 265.3
      },
      {
        rbd: "Y",
        pax: 10,
        revenue: 2603,
        avgFare: 260.3
      }
    ],
    pointOfSale: [
      {
        country: "GB",
        pax: 20,
        revenue: 6075,
        avgFare: 303.75,
        share: 0.2124
      },
      {
        country: "CA",
        pax: 20,
        revenue: 6014,
        avgFare: 300.7,
        share: 0.2103
      },
      {
        country: "AE",
        pax: 20,
        revenue: 5618,
        avgFare: 280.9,
        share: 0.1964
      },
      {
        country: "US",
        pax: 20,
        revenue: 5612,
        avgFare: 280.6,
        share: 0.1962
      },
      {
        country: "IN",
        pax: 20,
        revenue: 5284,
        avgFare: 264.2,
        share: 0.1847
      }
    ],
    odMarkets: [
      {
        market: "BOM-DOH-LHR",
        pax: 10,
        revenue: 5790,
        avgFare: 579
      },
      {
        market: "LHR-DOH-BOM",
        pax: 10,
        revenue: 5787,
        avgFare: 578.7
      },
      {
        market: "BOM-DEL",
        pax: 20,
        revenue: 5366,
        avgFare: 268.3
      },
      {
        market: "BOM-DXB",
        pax: 10,
        revenue: 2282,
        avgFare: 228.2
      },
      {
        market: "DXB-BOM",
        pax: 10,
        revenue: 2282,
        avgFare: 228.2
      },
      {
        market: "DXB-DEL",
        pax: 10,
        revenue: 2205,
        avgFare: 220.5
      },
      {
        market: "DEL-DXB",
        pax: 10,
        revenue: 2202,
        avgFare: 220.2
      },
      {
        market: "BLR-BOM",
        pax: 10,
        revenue: 1383,
        avgFare: 138.3
      },
      {
        market: "DEL-BOM",
        pax: 10,
        revenue: 1306,
        avgFare: 130.6
      }
    ],
    flights: [
      {
        flightId: "F001",
        airline: "AI",
        airlineName: "Air India (sample)",
        date: "2026-11-01",
        flightNumber: "AI127",
        origin: "BOM",
        destination: "LHR",
        sector: "BOM-LHR",
        aircraft: "B787-8",
        distanceKm: 7600,
        scheduledSeats: 256,
        operatedSeats: 250,
        blockedSeats: 12,
        sellableSeats: 238,
        bookedSeats: 225,
        flownPax: 200,
        loadFactor: 0.8,
        ask: 19e5,
        rpk: 152e4,
        sampleCoupons: 10,
        sampleRevenue: 5790,
        sampleAncillary: 268,
        sampleFlownTicket: 5522,
        sampleTax: 563,
        sampleAvgFare: 579,
        cabinMix: {
          Economy: 10
        },
        channelMix: {
          GDS: 2,
          OTA: 2,
          "Travel Agent": 2,
          NDC: 2,
          Direct: 2
        }
      },
      {
        flightId: "F002",
        airline: "AI",
        airlineName: "Air India (sample)",
        date: "2026-11-02",
        flightNumber: "AI128",
        origin: "LHR",
        destination: "BOM",
        sector: "LHR-BOM",
        aircraft: "B787-8",
        distanceKm: 7600,
        scheduledSeats: 256,
        operatedSeats: 256,
        blockedSeats: 8,
        sellableSeats: 248,
        bookedSeats: 237,
        flownPax: 214,
        loadFactor: 0.8359,
        ask: 1945600,
        rpk: 1626400,
        sampleCoupons: 10,
        sampleRevenue: 5787,
        sampleAncillary: 265,
        sampleFlownTicket: 5522,
        sampleTax: 640,
        sampleAvgFare: 578.7,
        cabinMix: {
          Economy: 10
        },
        channelMix: {
          OTA: 2,
          "Travel Agent": 2,
          NDC: 2,
          Direct: 2,
          GDS: 2
        }
      },
      {
        flightId: "F003",
        airline: "6E",
        airlineName: "IndiGo (sample)",
        date: "2026-11-03",
        flightNumber: "6E145",
        origin: "DEL",
        destination: "DXB",
        sector: "DEL-DXB",
        aircraft: "A321neo",
        distanceKm: 2190,
        scheduledSeats: 180,
        operatedSeats: 180,
        blockedSeats: 6,
        sellableSeats: 174,
        bookedSeats: 171,
        flownPax: 157,
        loadFactor: 0.8722,
        ask: 394200,
        rpk: 343830,
        sampleCoupons: 10,
        sampleRevenue: 2202,
        sampleAncillary: 188,
        sampleFlownTicket: 2014,
        sampleTax: 264,
        sampleAvgFare: 220.2,
        cabinMix: {
          Economy: 10
        },
        channelMix: {
          "Travel Agent": 2,
          NDC: 2,
          Direct: 2,
          GDS: 2,
          OTA: 2
        }
      },
      {
        flightId: "F004",
        airline: "6E",
        airlineName: "IndiGo (sample)",
        date: "2026-11-04",
        flightNumber: "6E146",
        origin: "DXB",
        destination: "DEL",
        sector: "DXB-DEL",
        aircraft: "A321neo",
        distanceKm: 2190,
        scheduledSeats: 180,
        operatedSeats: 174,
        blockedSeats: 10,
        sellableSeats: 164,
        bookedSeats: 157,
        flownPax: 157,
        loadFactor: 0.9023,
        ask: 381060,
        rpk: 343830,
        sampleCoupons: 10,
        sampleRevenue: 2205,
        sampleAncillary: 191,
        sampleFlownTicket: 2014,
        sampleTax: 205,
        sampleAvgFare: 220.5,
        cabinMix: {
          Economy: 10
        },
        channelMix: {
          NDC: 2,
          Direct: 2,
          GDS: 2,
          OTA: 2,
          "Travel Agent": 2
        }
      },
      {
        flightId: "F005",
        airline: "SG",
        airlineName: "SpiceJet (sample)",
        date: "2026-11-05",
        flightNumber: "SG051",
        origin: "BOM",
        destination: "DXB",
        sector: "BOM-DXB",
        aircraft: "B737-800",
        distanceKm: 1930,
        scheduledSeats: 189,
        operatedSeats: 189,
        blockedSeats: 9,
        sellableSeats: 180,
        bookedSeats: 175,
        flownPax: 151,
        loadFactor: 0.7989,
        ask: 364770,
        rpk: 291430,
        sampleCoupons: 10,
        sampleRevenue: 2282,
        sampleAncillary: 268,
        sampleFlownTicket: 2014,
        sampleTax: 233,
        sampleAvgFare: 228.2,
        cabinMix: {
          Economy: 10
        },
        channelMix: {
          Direct: 2,
          GDS: 2,
          OTA: 2,
          "Travel Agent": 2,
          NDC: 2
        }
      },
      {
        flightId: "F006",
        airline: "SG",
        airlineName: "SpiceJet (sample)",
        date: "2026-11-06",
        flightNumber: "SG052",
        origin: "DXB",
        destination: "BOM",
        sector: "DXB-BOM",
        aircraft: "B737-800",
        distanceKm: 1930,
        scheduledSeats: 189,
        operatedSeats: 180,
        blockedSeats: 14,
        sellableSeats: 166,
        bookedSeats: 171,
        flownPax: 150,
        loadFactor: 0.8333,
        ask: 347400,
        rpk: 289500,
        sampleCoupons: 10,
        sampleRevenue: 2282,
        sampleAncillary: 268,
        sampleFlownTicket: 2014,
        sampleTax: 264,
        sampleAvgFare: 228.2,
        cabinMix: {
          Economy: 10
        },
        channelMix: {
          GDS: 2,
          OTA: 2,
          "Travel Agent": 2,
          NDC: 2,
          Direct: 2
        }
      },
      {
        flightId: "F007",
        airline: "UK",
        airlineName: "Vistara (sample)",
        date: "2026-11-07",
        flightNumber: "UK955",
        origin: "DEL",
        destination: "BOM",
        sector: "DEL-BOM",
        aircraft: "A320neo",
        distanceKm: 1150,
        scheduledSeats: 186,
        operatedSeats: 186,
        blockedSeats: 5,
        sellableSeats: 181,
        bookedSeats: 167,
        flownPax: 162,
        loadFactor: 0.871,
        ask: 213900,
        rpk: 186300,
        sampleCoupons: 10,
        sampleRevenue: 1306,
        sampleAncillary: 191,
        sampleFlownTicket: 1115,
        sampleTax: 114,
        sampleAvgFare: 130.6,
        cabinMix: {
          Economy: 10
        },
        channelMix: {
          OTA: 2,
          "Travel Agent": 2,
          NDC: 2,
          Direct: 2,
          GDS: 2
        }
      },
      {
        flightId: "F008",
        airline: "UK",
        airlineName: "Vistara (sample)",
        date: "2026-11-08",
        flightNumber: "UK956",
        origin: "BOM",
        destination: "DEL",
        sector: "BOM-DEL",
        aircraft: "A320neo",
        distanceKm: 1150,
        scheduledSeats: 186,
        operatedSeats: 180,
        blockedSeats: 7,
        sellableSeats: 173,
        bookedSeats: 167,
        flownPax: 163,
        loadFactor: 0.9056,
        ask: 207e3,
        rpk: 187450,
        sampleCoupons: 10,
        sampleRevenue: 1309,
        sampleAncillary: 194,
        sampleFlownTicket: 1115,
        sampleTax: 127,
        sampleAvgFare: 130.9,
        cabinMix: {
          Economy: 10
        },
        channelMix: {
          "Travel Agent": 2,
          NDC: 2,
          Direct: 2,
          GDS: 2,
          OTA: 2
        }
      },
      {
        flightId: "F009",
        airline: "AI",
        airlineName: "Air India (sample)",
        date: "2026-11-09",
        flightNumber: "AI865",
        origin: "BOM",
        destination: "DEL",
        sector: "BOM-DEL",
        aircraft: "A321",
        distanceKm: 1150,
        scheduledSeats: 182,
        operatedSeats: 176,
        blockedSeats: 11,
        sellableSeats: 165,
        bookedSeats: 167,
        flownPax: 141,
        loadFactor: 0.8011,
        ask: 202400,
        rpk: 162150,
        sampleCoupons: 10,
        sampleRevenue: 4057,
        sampleAncillary: 271,
        sampleFlownTicket: 3786,
        sampleTax: 490,
        sampleAvgFare: 405.7,
        cabinMix: {
          Business: 10
        },
        channelMix: {
          NDC: 2,
          Direct: 2,
          GDS: 2,
          OTA: 2,
          "Travel Agent": 2
        }
      },
      {
        flightId: "F010",
        airline: "6E",
        airlineName: "IndiGo (sample)",
        date: "2026-11-10",
        flightNumber: "6E210",
        origin: "BLR",
        destination: "BOM",
        sector: "BLR-BOM",
        aircraft: "A320neo",
        distanceKm: 840,
        scheduledSeats: 180,
        operatedSeats: 180,
        blockedSeats: 4,
        sellableSeats: 176,
        bookedSeats: 162,
        flownPax: 150,
        loadFactor: 0.8333,
        ask: 151200,
        rpk: 126e3,
        sampleCoupons: 10,
        sampleRevenue: 1383,
        sampleAncillary: 268,
        sampleFlownTicket: 1115,
        sampleTax: 114,
        sampleAvgFare: 138.3,
        cabinMix: {
          Economy: 10
        },
        channelMix: {
          Direct: 2,
          GDS: 2,
          OTA: 2,
          "Travel Agent": 2,
          NDC: 2
        }
      }
    ]
  };

  // src/format.ts
  var usd = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  });
  var usdExact = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
  });
  var compact = new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1
  });
  var int = new Intl.NumberFormat("en-US");
  function money(n, exact = false) {
    return exact ? usdExact.format(n) : usd.format(n);
  }
  function number(n) {
    return int.format(n);
  }
  function compactNumber(n) {
    return compact.format(n);
  }
  function pct(n, digits = 1) {
    return `${(n * 100).toFixed(digits)}%`;
  }
  function yieldPerPax(revenue, pax) {
    if (!pax) return "\u2014";
    return money(revenue / pax, true);
  }

  // src/charts.ts
  var PALETTE = ["#0E7C7B", "#1A4F6B", "#B85C38", "#3D6B4F", "#5C6B7A", "#0A1B2E"];
  function horizontalBars(items, opts) {
    const max = opts?.max ?? Math.max(...items.map((i) => i.value), 1);
    return `
    <div class="hbar-list" role="img" aria-label="Bar chart">
      ${items.map((item, idx) => {
      const width = Math.max(4, item.value / max * 100);
      const color = PALETTE[idx % PALETTE.length];
      return `
            <div class="hbar-row">
              <div class="hbar-label">
                <span>${escapeHtml(item.label)}</span>
                ${item.secondary ? `<small>${escapeHtml(item.secondary)}</small>` : ""}
              </div>
              <div class="hbar-track">
                <div class="hbar-fill" style="--w:${width}%; --c:${color}"></div>
              </div>
              <div class="hbar-value">${escapeHtml(opts?.unit ? `${formatShort(item.value)}${opts.unit}` : formatShort(item.value))}</div>
            </div>
          `;
    }).join("")}
    </div>
  `;
  }
  function donut(items, centerLabel, centerValue) {
    const total = items.reduce((s, i) => s + i.value, 0) || 1;
    const r = 42;
    const c = 2 * Math.PI * r;
    let offset = 0;
    const slices = items.map((item, idx) => {
      const frac = item.value / total;
      const len = frac * c;
      const dash = `${len} ${c - len}`;
      const el = `<circle class="donut-slice" cx="50" cy="50" r="${r}" fill="none" stroke="${PALETTE[idx % PALETTE.length]}" stroke-width="12" stroke-dasharray="${dash}" stroke-dashoffset="${-offset}" transform="rotate(-90 50 50)"></circle>`;
      offset += len;
      return el;
    }).join("");
    const legend = items.map(
      (item, idx) => `
      <li>
        <span class="swatch" style="background:${PALETTE[idx % PALETTE.length]}"></span>
        <span class="leg-label">${escapeHtml(item.label)}</span>
        <span class="leg-value">${escapeHtml(formatShort(item.value))}</span>
      </li>`
    ).join("");
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
  `;
  }
  function loadMeter(flights) {
    return `
    <div class="load-grid">
      ${flights.map((f) => {
      const pct2 = Math.round(f.loadFactor * 100);
      const tone = pct2 >= 88 ? "high" : pct2 >= 82 ? "mid" : "low";
      return `
            <div class="load-cell tone-${tone}">
              <div class="load-top">
                <strong>${escapeHtml(f.flightNumber)}</strong>
                <span>${pct2}%</span>
              </div>
              <div class="load-route">${escapeHtml(f.route)}</div>
              <div class="load-track"><div class="load-fill" style="--w:${pct2}%"></div></div>
            </div>
          `;
    }).join("")}
    </div>
  `;
  }
  function formatShort(n) {
    if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
    if (n >= 1e3) return `${(n / 1e3).toFixed(n >= 1e4 ? 0 : 1)}k`;
    return n % 1 === 0 ? String(n) : n.toFixed(0);
  }
  function escapeHtml(s) {
    return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
  }

  // src/standalone-entry.ts
  var d = prototype_default;
  var { kpis } = d;
  var TABS = [
    { id: "overview", label: "Commercial Overview" },
    { id: "network", label: "Network Performance" },
    { id: "capacity", label: "Capacity & Load" },
    { id: "revenue", label: "Revenue & Distribution" },
    { id: "forecast", label: "Forecasting" }
  ];
  var WEEKS = [
    { id: "wk1", label: "WK-1", start: 1, end: 7 },
    { id: "wk2", label: "WK-2", start: 8, end: 14 },
    { id: "wk3", label: "WK-3", start: 15, end: 21 },
    { id: "wk4", label: "WK-4", start: 22, end: 31 }
  ];
  var MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  var state = {
    tab: "overview",
    grain: null,
    week: null,
    month: null
  };
  var yieldPerRpk = kpis.totalRpk ? kpis.passengerRevenueExTax / kpis.totalRpk * 100 : 0;
  var rask = kpis.totalAsk ? kpis.passengerRevenueExTax / kpis.totalAsk * 100 : 0;
  var ancillaryShare = kpis.passengerRevenueExTax ? kpis.ancillaryRevenue / kpis.passengerRevenueExTax : 0;
  var ticketShare = kpis.passengerRevenueExTax ? kpis.flownTicketRevenue / kpis.passengerRevenueExTax : 0;
  var emptySeats = kpis.operatedSeats - kpis.flownPax;
  var countryNames = {
    IN: "India",
    GB: "United Kingdom",
    AE: "UAE",
    US: "United States",
    CA: "Canada"
  };
  var stackMax = kpis.totalCollectedInclTax || 1;
  var ILLUSTRATIVE_MONTHLY_LF = [0.81, 0.83, 0.84, 0.82, 0.85, 0.86, 0.87, 0.86, 0.85, 0.84, kpis.avgLoadFactor, 0.83];
  function lfTone(lf) {
    const p = Math.round(lf * 100);
    return p >= 88 ? "high" : p >= 82 ? "mid" : "low";
  }
  function dayOf(f) {
    if (!f.date) return 0;
    return Number(f.date.slice(8, 10));
  }
  function filteredFlights() {
    let rows = [...d.flights];
    if (state.grain === "weekly" && state.week) {
      const wk = WEEKS.find((w) => w.id === state.week);
      if (wk) rows = rows.filter((f) => {
        const day = dayOf(f);
        return day >= wk.start && day <= wk.end;
      });
    }
    if (state.grain === "monthly" && state.month) {
      if (state.month !== "Nov") return [];
    }
    return rows;
  }
  function aggregateFlights(flights) {
    const operated = flights.reduce((s, f) => s + f.operatedSeats, 0);
    const flown = flights.reduce((s, f) => s + f.flownPax, 0);
    const ask = flights.reduce((s, f) => s + f.ask, 0);
    const rpk = flights.reduce((s, f) => s + f.rpk, 0);
    const scheduled = flights.reduce((s, f) => s + f.scheduledSeats, 0);
    const blocked = flights.reduce((s, f) => s + f.blockedSeats, 0);
    const sellable = flights.reduce((s, f) => s + f.sellableSeats, 0);
    const booked = flights.reduce((s, f) => s + f.bookedSeats, 0);
    const sampleRev = flights.reduce((s, f) => s + (f.sampleRevenue ?? 0), 0);
    const sampleAnc = flights.reduce((s, f) => s + (f.sampleAncillary ?? 0), 0);
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
      lf: operated ? flown / operated : 0
    };
  }
  function topIbOb(flights, limit = 10) {
    const map = /* @__PURE__ */ new Map();
    for (const f of flights) {
      const cities = [f.origin, f.destination].sort();
      const key = `${cities[0]}-${cities[1]}`;
      let pair = map.get(key);
      if (!pair) {
        pair = { key, revenue: 0, lf: 0, flown: 0, operated: 0 };
        map.set(key, pair);
      }
      if (f.origin === cities[0]) pair.ob = f;
      else pair.ib = f;
      pair.revenue += f.sampleRevenue ?? 0;
      pair.flown += f.flownPax;
      pair.operated += f.operatedSeats;
    }
    return [...map.values()].map((p) => ({
      ...p,
      lf: p.operated ? p.flown / p.operated : 0
    })).sort((a, b) => b.revenue - a.revenue).slice(0, limit);
  }
  function verticalBars(items, opts) {
    const max = Math.max(...items.map((i) => i.value), 0.01);
    const fmt = opts?.format ?? ((n) => `${Math.round(n * 100)}%`);
    return `
    <div class="vbar-chart" role="img" aria-label="Column chart">
      ${items.map((item) => {
      const h = Math.max(4, item.value / max * 100);
      const cls = [
        "vbar-col",
        item.highlight ? "is-highlight" : "",
        item.muted ? "is-muted" : ""
      ].filter(Boolean).join(" ");
      return `
            <div class="${cls}">
              <span class="vbar-val">${fmt(item.value)}${opts?.unit ?? ""}</span>
              <div class="vbar-track"><div class="vbar-fill" style="--h:${h}%"></div></div>
              <span class="vbar-label">${item.label}</span>
            </div>`;
    }).join("")}
    </div>
  `;
  }
  function carrierName(code, name) {
    const raw = name ?? d.meta.airlineNames?.[code] ?? code;
    return raw.replace(/\s*\(sample\)\s*/gi, "").trim();
  }
  function weekDateLabel(start, end) {
    const last = Math.min(end, 10);
    if (start > 10) return "No flights";
    return `${start}\u2013${last} Nov`;
  }
  function flightsInWeek(weekId) {
    const wk = WEEKS.find((w) => w.id === weekId);
    if (!wk) return [];
    return d.flights.filter((f) => {
      const day = dayOf(f);
      return day >= wk.start && day <= wk.end;
    });
  }
  function weekSummaries() {
    return WEEKS.map((w) => {
      const rows = flightsInWeek(w.id);
      const agg = aggregateFlights(rows);
      return {
        ...w,
        dates: weekDateLabel(w.start, w.end),
        flights: rows,
        count: rows.length,
        ...agg
      };
    });
  }
  function viewingContext(_flights) {
    if (!state.grain) {
      return { title: "All flights", range: "1\u201310 Nov 2026" };
    }
    if (state.grain === "daily") {
      return { title: "Daily view", range: "Each row is one flight date" };
    }
    if (state.grain === "weekly") {
      const wk = WEEKS.find((w) => w.id === state.week);
      if (!wk) return { title: "Weekly view", range: "Select a week below" };
      return {
        title: wk.label,
        range: weekDateLabel(wk.start, wk.end) + " 2026"
      };
    }
    return {
      title: state.month ?? "Monthly",
      range: state.month === "Nov" ? "November 2026" : `${state.month} 2026`
    };
  }
  function viewingBanner(flights) {
    const ctx = viewingContext(flights);
    const n = flights.length;
    return `
    <div class="viewing-banner">
      <div class="viewing-main">
        <span class="viewing-label">Showing</span>
        <strong>${ctx.title}</strong>
        <span class="viewing-range">${ctx.range}</span>
      </div>
      <div class="viewing-meta">
        <span>${n} flight${n === 1 ? "" : "s"}</span>
        ${state.grain ? `<button type="button" class="link-clear" data-clear="1">Clear filter</button>` : ""}
      </div>
    </div>
  `;
  }
  function renderShell() {
    const app = document.querySelector("#app");
    if (!app) throw new Error("#app missing");
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
        <button type="button" role="tab" class="ftab${state.tab === t.id ? " is-active" : ""}"
          data-tab="${t.id}" aria-selected="${state.tab === t.id}">
          ${t.label}
        </button>`
    ).join("")}
    </nav>

    <div class="period-bar" id="period-bar"></div>
    <main id="view" class="view"></main>
  `;
    app.querySelectorAll("[data-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.tab = btn.dataset.tab;
        syncPeriodToTab();
        render();
      });
    });
  }
  function periodOptionsForTab(tab) {
    if (tab === "network" || tab === "capacity") return ["daily", "weekly", "monthly"];
    if (tab === "forecast") return ["monthly"];
    return [];
  }
  function syncPeriodToTab() {
    const allowed = periodOptionsForTab(state.tab);
    if (!allowed.length) {
      state.grain = null;
      state.week = null;
      state.month = null;
      return;
    }
    if (state.grain && !allowed.includes(state.grain)) {
      state.grain = null;
      state.week = null;
      state.month = null;
    }
  }
  function bindClearButtons(root = document) {
    root.querySelectorAll("[data-clear]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.grain = null;
        state.week = null;
        state.month = null;
        render();
      });
    });
  }
  function renderPeriodBar() {
    const bar = document.querySelector("#period-bar");
    if (!bar) return;
    const options = periodOptionsForTab(state.tab);
    if (!options.length) {
      bar.innerHTML = "";
      return;
    }
    const helpVerb = state.tab === "network" ? "sectors and markets" : state.tab === "forecast" ? "outlook tables" : "KPIs and flight table";
    bar.innerHTML = `
    <div class="period-row">
      <div class="period-group" role="group" aria-label="Period">
        <span class="period-label">View by</span>
        ${options.map(
      (g) => `
          <button type="button" class="chip${state.grain === g ? " is-active" : ""}" data-grain="${g}">
            ${g[0].toUpperCase()}${g.slice(1)}
          </button>`
    ).join("")}
        <button type="button" class="chip chip-clear" data-clear="1">Clear Filter</button>
      </div>
    </div>
    ${state.grain === "weekly" && options.includes("weekly") ? `<div class="week-picker" role="group" aria-label="Select week">
            <p class="picker-help">Select a week \u2014 ${helpVerb} update below</p>
            <div class="week-cards">
              ${weekSummaries().map((w) => {
      const active = state.week === w.id;
      const disabled = w.count === 0;
      return `
                  <button type="button" class="week-card${active ? " is-active" : ""}${disabled ? " is-empty" : ""}"
                    data-week="${w.id}" ${disabled ? "disabled" : ""}>
                    <span class="week-card-id">${w.label}</span>
                    <span class="week-card-dates">${w.dates}</span>
                    <span class="week-card-stat">${w.count ? `${w.count} flights \xB7 LF ${pct(w.lf)}` : "No flights"}</span>
                  </button>`;
    }).join("")}
            </div>
          </div>` : ""}
    ${state.grain === "monthly" && options.includes("monthly") ? `<div class="week-picker">
            <p class="picker-help">Select a month \u2014 ${helpVerb} update below</p>
            <div class="period-sub month-strip" role="group" aria-label="Month">
              ${MONTHS.map((m) => {
      const has = m === "Nov";
      return `<button type="button" class="chip sub${state.month === m ? " is-active" : ""}${has ? "" : " is-empty"}"
                  data-month="${m}" ${has ? "" : "disabled"}>${m}</button>`;
    }).join("")}
            </div>
          </div>` : ""}
    ${state.grain === "daily" && options.includes("daily") ? `<p class="picker-help">Daily view \u2014 each flight date is listed in the detail below.</p>` : ""}
  `;
    bar.querySelectorAll("[data-grain]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.grain = btn.dataset.grain;
        state.week = state.grain === "weekly" ? "wk1" : null;
        state.month = state.grain === "monthly" ? "Nov" : null;
        render();
      });
    });
    bindClearButtons(bar);
    bar.querySelectorAll("[data-week]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.week = btn.dataset.week ?? null;
        render();
      });
    });
    bar.querySelectorAll("[data-month]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.month = btn.dataset.month ?? null;
        render();
      });
    });
  }
  function sectorsFromFlights(flights) {
    const map = /* @__PURE__ */ new Map();
    for (const f of flights) {
      const route = `${f.origin}-${f.destination}`;
      const row = map.get(route) ?? {
        route,
        flown: 0,
        operated: 0,
        revenue: 0,
        coupons: 0,
        ask: 0,
        rpk: 0,
        count: 0
      };
      row.flown += f.flownPax;
      row.operated += f.operatedSeats;
      row.revenue += f.sampleRevenue ?? 0;
      row.coupons += f.sampleCoupons ?? 0;
      row.ask += f.ask;
      row.rpk += f.rpk;
      row.count += 1;
      map.set(route, row);
    }
    return [...map.values()].map((s) => ({
      ...s,
      lf: s.operated ? s.flown / s.operated : 0,
      avgFare: s.coupons ? s.revenue / s.coupons : 0
    })).sort((a, b) => b.revenue - a.revenue);
  }
  function viewOverview() {
    const weak = [...d.flights].sort((a, b) => a.loadFactor - b.loadFactor)[0];
    const strongRev = [...d.routes].sort((a, b) => b.revenue - a.revenue)[0];
    return `
    <section class="page-head">
      <div>
        <h1>Commercial overview</h1>
        <p>Network revenue, traffic and load performance \xB7 1\u201310 Nov 2026</p>
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
        <span class="hint">Operated seats \xD7 distance</span>
      </div>
      <div class="kpi">
        <span class="label">RPK</span>
        <span class="value">${compactNumber(kpis.totalRpk)}</span>
        <span class="hint">Flown PAX \xD7 distance</span>
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
        <strong>${yieldPerRpk.toFixed(2)}\xA2</strong>
        <em>Passenger revenue \xF7 RPK</em>
      </div>
      <div class="metric">
        <span>RASK</span>
        <strong>${rask.toFixed(2)}\xA2</strong>
        <em>Passenger revenue \xF7 ASK</em>
      </div>
      <div class="metric">
        <span>Avg coupon value</span>
        <strong>${yieldPerPax(kpis.passengerRevenueExTax, kpis.couponRecords)}</strong>
        <em>Passenger revenue ex tax</em>
      </div>
      <div class="metric">
        <span>Empty seats</span>
        <strong>${number(emptySeats)}</strong>
        <em>${number(kpis.operatedSeats)} operated \u2212 ${number(kpis.flownPax)} flown</em>
      </div>
    </section>

    <section class="grid">
      <article class="panel">
        <h2>Items to review</h2>
        <p class="sub">Operational signals</p>
        <div class="signal-list">
          <div class="signal warn">
            <strong>${weak.flightNumber} \xB7 ${weak.origin}\u2013${weak.destination}</strong>
            <p>LF ${pct(weak.loadFactor)} vs network ${pct(kpis.avgLoadFactor)}.</p>
          </div>
          <div class="signal info">
            <strong>Top route: ${strongRev.route}</strong>
            <p>${money(strongRev.revenue)} \xB7 avg ${money(strongRev.avgFare ?? 0, true)}</p>
          </div>
        </div>
      </article>
      <article class="panel">
        <h2>Top routes</h2>
        <p class="sub">Snapshot \xB7 full detail on Network</p>
        <div class="table-wrap tight">
          <table>
            <thead>
              <tr><th>Route</th><th>Revenue</th><th>PAX</th><th>Avg</th></tr>
            </thead>
            <tbody>
              ${[...d.routes].sort((a, b) => b.revenue - a.revenue).slice(0, 5).map(
      (r) => `
                <tr>
                  <td><strong>${r.route}</strong></td>
                  <td class="num">${money(r.revenue)}</td>
                  <td class="num">${number(r.pax)}</td>
                  <td class="num">${money(r.avgFare ?? 0, true)}</td>
                </tr>`
    ).join("")}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  `;
  }
  function viewNetwork() {
    const flights = filteredFlights();
    const empty = flights.length === 0;
    const agg = aggregateFlights(flights);
    const sectors = sectorsFromFlights(flights);
    const topSector = sectors[0];
    const yieldPeriod = agg.rpk ? agg.sampleRev / agg.rpk * 100 : 0;
    return `
    <section class="page-head">
      <div>
        <h1>Network performance</h1>
        <p>Sectors and markets for the selected period.</p>
      </div>
    </section>

    ${viewingBanner(flights)}

    ${empty ? `<div class="empty-state">No flights in this period. Choose another week/month or clear the filter.</div>` : ""}

    <section class="kpi-strip light four">
      <div class="kpi">
        <span class="label">Pax revenue</span>
        <span class="value">${empty ? "\u2014" : money(agg.sampleRev)}</span>
        <span class="hint">Ex tax \xB7 selected period</span>
      </div>
      <div class="kpi">
        <span class="label">Top sector</span>
        <span class="value">${empty || !topSector ? "\u2014" : topSector.route}</span>
        <span class="hint">${empty || !topSector ? "\u2014" : money(topSector.revenue)}</span>
      </div>
      <div class="kpi">
        <span class="label">Sectors</span>
        <span class="value">${empty ? "\u2014" : number(sectors.length)}</span>
        <span class="hint">${empty ? "\u2014" : `${number(flights.length)} flights`}</span>
      </div>
      <div class="kpi">
        <span class="label">Yield</span>
        <span class="value">${empty ? "\u2014" : `${yieldPeriod.toFixed(2)}\xA2`}</span>
        <span class="hint">Per RPK \xB7 selected period</span>
      </div>
    </section>

    <section class="panel">
      <h2>Sector revenue</h2>
      <p class="sub">By flight sector \xB7 selected period</p>
      ${empty ? '<p class="note-inline">No sectors in range.</p>' : horizontalBars(
      sectors.map((r) => ({
        label: r.route,
        value: r.revenue,
        secondary: `LF ${pct(r.lf)} \xB7 avg ${money(r.avgFare, true)}`
      }))
    )}
    </section>

    <section class="panel">
      <h2>Sector scorecard</h2>
      <p class="sub">${viewingContext().title} \xB7 ${viewingContext().range}</p>
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
            ${empty ? `<tr><td colspan="7">No sectors in range.</td></tr>` : sectors.map((s) => {
      const tone = lfTone(s.lf);
      return `
                <tr>
                  <td><strong>${s.route}</strong></td>
                  <td class="num">${number(s.count)}</td>
                  <td class="num">${money(s.revenue)}</td>
                  <td class="num">${number(s.flown)}</td>
                  <td><span class="lf-pill ${tone}">${Math.round(s.lf * 100)}%</span></td>
                  <td class="num">${compactNumber(s.ask)}</td>
                  <td class="num">${compactNumber(s.rpk)}</td>
                </tr>`;
    }).join("")}
          </tbody>
        </table>
      </div>
    </section>

    ${!state.grain ? `<section class="panel" style="margin-top:1rem">
      <h2>O&amp;D markets</h2>
      <p class="sub">Full network itinerary view</p>
      ${horizontalBars(
      [...d.odMarkets].sort((a, b) => b.revenue - a.revenue).map((o) => ({
        label: o.market,
        value: o.revenue,
        secondary: `${o.pax} pax \xB7 avg ${money(o.avgFare ?? 0)}`
      }))
    )}
    </section>` : ""}
  `;
  }
  function weekCompareTable() {
    const rows = weekSummaries();
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
            ${rows.map((w) => {
      const active = state.week === w.id;
      const tone = w.count ? lfTone(w.lf) : "";
      return `
                <tr class="${active ? "is-active-row" : ""}${w.count ? "" : " is-empty-row"}" data-week-row="${w.id}">
                  <td><strong>${w.label}</strong></td>
                  <td>${w.dates}</td>
                  <td class="num">${w.count || "\u2014"}</td>
                  <td class="num">${w.count ? number(w.flown) : "\u2014"}</td>
                  <td class="num">${w.count ? number(w.operated) : "\u2014"}</td>
                  <td>${w.count ? `<span class="lf-pill ${tone}">${Math.round(w.lf * 100)}%</span>` : "\u2014"}</td>
                  <td class="num">${w.count ? compactNumber(w.ask) : "\u2014"}</td>
                  <td class="num">${w.count ? compactNumber(w.rpk) : "\u2014"}</td>
                </tr>`;
    }).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
  }
  function viewCapacity() {
    const flights = filteredFlights();
    const source = flights;
    const agg = aggregateFlights(source);
    const empty = source.length === 0;
    const pairs = topIbOb(empty ? d.flights : source, 10);
    return `
    <section class="page-head">
      <div>
        <h1>Capacity &amp; load</h1>
        <p>Seat supply, traffic and load factor.</p>
      </div>
    </section>

    ${viewingBanner(source)}

    ${state.grain === "weekly" ? weekCompareTable() : ""}

    ${empty ? `<div class="empty-state">No flights in this period. Choose another week/month or clear the filter.</div>` : ""}

    <section class="kpi-strip light four">
      <div class="kpi">
        <span class="label">ASK</span>
        <span class="value">${empty ? "\u2014" : compactNumber(agg.ask)}</span>
        <span class="hint">For selected period</span>
      </div>
      <div class="kpi">
        <span class="label">RPK</span>
        <span class="value">${empty ? "\u2014" : compactNumber(agg.rpk)}</span>
        <span class="hint">For selected period</span>
      </div>
      <div class="kpi accent">
        <span class="label">Load factor (LF)</span>
        <span class="value">${empty ? "\u2014" : pct(agg.lf)}</span>
        <span class="hint">${empty ? "\u2014" : `${number(agg.flown)} flown / ${number(agg.operated)} seats`}</span>
      </div>
      <div class="kpi">
        <span class="label">Operated seats</span>
        <span class="value">${empty ? "\u2014" : number(agg.operated)}</span>
        <span class="hint">For selected period</span>
      </div>
    </section>

    <section class="grid">
      <article class="panel">
        <h2>Load factor by flight</h2>
        <p class="sub">Flights in selected period</p>
        ${empty ? '<p class="note-inline">No flights in range.</p>' : loadMeter(
      source.map((f) => ({
        flightNumber: f.flightNumber,
        loadFactor: f.loadFactor,
        route: `${f.origin} \u2192 ${f.destination} \xB7 ${f.date ?? ""} \xB7 ${number(f.flownPax)}/${number(f.operatedSeats)}`
      }))
    )}
      </article>
      <article class="panel">
        <h2>Capacity reconciliation</h2>
        <p class="sub">For selected period</p>
        <div class="pipeline vertical">
          <div class="pipe-step"><span>Scheduled</span><strong>${empty ? "\u2014" : number(agg.scheduled)}</strong></div>
          <div class="pipe-step"><span>Operated</span><strong>${empty ? "\u2014" : number(agg.operated)}</strong></div>
          <div class="pipe-step"><span>Sellable</span><strong>${empty ? "\u2014" : number(agg.sellable)}</strong></div>
          <div class="pipe-step accent"><span>Flown</span><strong>${empty ? "\u2014" : number(agg.flown)}</strong></div>
        </div>
        <ul class="fact-list">
          <li><b>Blocked:</b> ${empty ? "\u2014" : number(agg.blocked)}</li>
          <li><b>Booked:</b> ${empty ? "\u2014" : number(agg.booked)}</li>
        </ul>
      </article>
    </section>

    <section class="panel">
      <h2>Top flights (IB &amp; OB)</h2>
      <p class="sub">City pairs \xB7 selected period</p>
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
            ${pairs.map((p, i) => {
      const tone = lfTone(p.lf);
      return `
                <tr>
                  <td class="num">${i + 1}</td>
                  <td><strong>${p.key}</strong></td>
                  <td>${p.ob ? `${p.ob.flightNumber} \xB7 ${p.ob.origin}\u2192${p.ob.destination}` : "\u2014"}</td>
                  <td>${p.ib ? `${p.ib.flightNumber} \xB7 ${p.ib.origin}\u2192${p.ib.destination}` : "\u2014"}</td>
                  <td class="num">${number(p.flown)}</td>
                  <td><span class="lf-pill ${tone}">${Math.round(p.lf * 100)}%</span></td>
                </tr>`;
    }).join("")}
          </tbody>
        </table>
      </div>
    </section>

    ${state.grain === "monthly" ? `<section class="panel">
      <h2>Load factor by month</h2>
      <p class="sub">Jan\u2013Dec</p>
      ${verticalBars(
      MONTHS.map((m, i) => ({
        label: m,
        value: ILLUSTRATIVE_MONTHLY_LF[i],
        highlight: m === state.month,
        muted: m !== "Nov"
      }))
    )}
    </section>` : ""}

    <section class="panel">
      <h2>Performance by flight no / route</h2>
      <p class="sub">${viewingContext(source).title} \xB7 ${viewingContext(source).range}</p>
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
            ${(empty ? [] : flights).map((f) => {
      const tone = lfTone(f.loadFactor);
      return `
                <tr>
                  <td><strong>${f.flightNumber}</strong><div class="cell-sub">${carrierName(f.airline, f.airlineName)}</div></td>
                  <td>${f.origin}\u2014${f.destination}</td>
                  <td>${f.date ?? "\u2014"}</td>
                  <td>${f.aircraft}</td>
                  <td class="num">${number(f.operatedSeats)}</td>
                  <td class="num">${number(f.bookedSeats)}</td>
                  <td class="num">${number(f.flownPax)}</td>
                  <td><span class="lf-pill ${tone}">${Math.round(f.loadFactor * 100)}%</span></td>
                  <td class="num">${compactNumber(f.ask)}</td>
                  <td class="num">${compactNumber(f.rpk)}</td>
                </tr>`;
    }).join("") || `<tr><td colspan="10">No flights in range.</td></tr>`}
          </tbody>
        </table>
      </div>
    </section>
  `;
  }
  function viewRevenue() {
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
        <span class="hint">${pct(ticketShare)} ticket \xB7 ${pct(ancillaryShare)} ancillary</span>
      </div>
      <div class="kpi">
        <span class="label">Passenger yield</span>
        <span class="value">${yieldPerRpk.toFixed(2)}\xA2</span>
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
            <div class="stack-track"><div class="stack-fill c-ticket" style="--w:${kpis.flownTicketRevenue / stackMax * 100}%"></div></div>
            <strong>${money(kpis.flownTicketRevenue)}</strong>
          </div>
          <div class="stack-row">
            <span>Ancillary</span>
            <div class="stack-track"><div class="stack-fill c-anc" style="--w:${kpis.ancillaryRevenue / stackMax * 100}%"></div></div>
            <strong>${money(kpis.ancillaryRevenue)}</strong>
          </div>
          <div class="stack-row">
            <span>Taxes</span>
            <div class="stack-track"><div class="stack-fill c-tax" style="--w:${kpis.taxAmount / stackMax * 100}%"></div></div>
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
      d.ancillaries.filter((a) => a.type !== "None").map((a) => ({
        label: a.type,
        value: a.revenue,
        secondary: `${a.count} \xB7 avg ${money(a.avg ?? 0, true)}`
      }))
    )}
      </article>
    </section>

    <section class="grid">
      <article class="panel">
        <h2>Cabin &amp; RBD</h2>
        <p class="sub">Fare class mix</p>
        ${donut(
      d.cabins.map((c) => ({ label: c.cabin, value: c.revenue })),
      "pax rev",
      money(kpis.passengerRevenueExTax)
    )}
        <div class="table-wrap tight" style="margin-top:1rem">
          <table>
            <thead><tr><th>RBD</th><th>PAX</th><th>Revenue</th><th>Avg</th></tr></thead>
            <tbody>
              ${d.rbds.map(
      (r) => `
                <tr>
                  <td><strong>${r.rbd}</strong></td>
                  <td class="num">${number(r.pax)}</td>
                  <td class="num">${money(r.revenue)}</td>
                  <td class="num">${money(r.avgFare ?? 0, true)}</td>
                </tr>`
    ).join("")}
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
        secondary: pct(c.share ?? 0)
      }))
    )}
        <div style="margin-top:1.25rem">
          ${horizontalBars(
      d.pointOfSale.map((p) => ({
        label: countryNames[p.country] ?? p.country,
        value: p.revenue,
        secondary: p.country
      }))
    )}
        </div>
      </article>
    </section>
  `;
  }
  function viewForecast() {
    const flights = filteredFlights();
    const empty = flights.length === 0;
    const agg = aggregateFlights(flights);
    const markets = sectorsFromFlights(flights);
    const watch = [...markets].sort((a, b) => a.lf - b.lf).slice(0, 3);
    return `
    <section class="page-head">
      <div>
        <h1>Forecasting</h1>
        <p>Forward demand, bookings and capacity outlook.</p>
      </div>
    </section>

    ${viewingBanner(flights)}

    ${empty ? `<div class="empty-state">No flights in this period. Choose another month or clear the filter.</div>` : ""}

    <section class="kpi-strip light four">
      <div class="kpi">
        <span class="label">Next 6-month revenue</span>
        <span class="value">\u2014</span>
        <span class="hint">Outlook</span>
      </div>
      <div class="kpi">
        <span class="label">Forward bookings</span>
        <span class="value">\u2014</span>
        <span class="hint">Scheduled flights</span>
      </div>
      <div class="kpi">
        <span class="label">Planned ASK</span>
        <span class="value">${empty ? "\u2014" : compactNumber(agg.ask)}</span>
        <span class="hint">Selected period</span>
      </div>
      <div class="kpi accent">
        <span class="label">Expected LF</span>
        <span class="value">${empty ? "\u2014" : pct(agg.lf)}</span>
        <span class="hint">Based on current flown / operated</span>
      </div>
    </section>

    <section class="grid">
      <article class="panel">
        <h2>Revenue outlook</h2>
        <p class="sub">${state.grain === "monthly" ? "Monthly horizon" : "Forward months"}</p>
        ${verticalBars(
      [
        { label: "Sep", value: 0.72, muted: true },
        { label: "Oct", value: 0.78, muted: true },
        { label: "Nov", value: 1, highlight: state.month === "Nov" || !state.grain },
        { label: "Dec", value: 0.85, muted: true },
        { label: "Jan", value: 0.88, muted: true },
        { label: "Feb", value: 0.8, muted: true }
      ],
      { format: () => "\u2014" }
    )}
      </article>
      <article class="panel">
        <h2>Watchlist</h2>
        <p class="sub">Markets to review \xB7 selected period</p>
        <div class="signal-list">
          ${empty ? '<p class="note-inline">No markets in range.</p>' : watch.map((m) => {
      const tone = m.lf < 0.82 ? "warn" : "info";
      return `
              <div class="signal ${tone}">
                <strong>${m.route}</strong>
                <p>LF ${pct(m.lf)} \xB7 ${number(m.flown)}/${number(m.operated)} seats</p>
              </div>`;
    }).join("")}
        </div>
      </article>
    </section>

    <section class="panel">
      <h2>Demand and capacity</h2>
      <p class="sub">Market roll-up \xB7 ${viewingContext().title} \xB7 ${viewingContext().range}</p>
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
            ${empty ? `<tr><td colspan="6">No markets in range.</td></tr>` : markets.map((m) => {
      const signal = m.lf >= 0.88 ? "On plan" : m.lf >= 0.82 ? "Monitor" : "Review";
      const cls = signal === "On plan" ? "sig-ok" : signal === "Monitor" ? "sig-mid" : "sig-bad";
      return `
                <tr>
                  <td><strong>${m.route}</strong></td>
                  <td class="num">${number(m.count)}</td>
                  <td class="num">${number(m.operated)}</td>
                  <td class="num">${number(m.flown)}</td>
                  <td><span class="lf-pill ${lfTone(m.lf)}">${Math.round(m.lf * 100)}%</span></td>
                  <td class="${cls}">${signal}</td>
                </tr>`;
    }).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
  }
  function renderView() {
    const view = document.querySelector("#view");
    if (!view) return;
    const map = {
      overview: viewOverview,
      network: viewNetwork,
      capacity: viewCapacity,
      revenue: viewRevenue,
      forecast: viewForecast
    };
    view.innerHTML = map[state.tab]();
    bindClearButtons(view);
    view.querySelectorAll("[data-week-row]").forEach((row) => {
      const id = row.dataset.weekRow;
      if (!id || row.classList.contains("is-empty-row")) return;
      row.style.cursor = "pointer";
      row.addEventListener("click", () => {
        state.grain = "weekly";
        state.week = id;
        state.month = null;
        render();
      });
    });
  }
  function render() {
    syncPeriodToTab();
    const app = document.querySelector("#app");
    if (!app?.querySelector(".floating-tabs")) {
      renderShell();
    } else {
      app.querySelectorAll("[data-tab]").forEach((btn) => {
        const active = btn.dataset.tab === state.tab;
        btn.classList.toggle("is-active", active);
        btn.setAttribute("aria-selected", String(active));
      });
    }
    renderPeriodBar();
    renderView();
  }
  render();
})();
