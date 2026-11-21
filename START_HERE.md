# SkyTrixx — Client handoff pack

This folder is a **standalone airline commercial analytics prototype**.  
It is **not** part of Caelix / Voyant travel analytics.

You can open this folder in **Cursor** and ask the AI anything about the data, charts, KPIs, or how to extend the product.

---

## What’s inside

| Item | Purpose |
|------|---------|
| `SkyTrixx_Airline_Commercial_Analytics_Prototype.xlsx` | Source Excel (coupon + capacity sample data) |
| `data/` | Same Excel, kept under a data folder |
| `src/` | Frontend dashboard code |
| `src/data/prototype.json` | Excel data prepared for the UI |
| `share/SkyTrixx-Airline-Analytics-Prototype.html` | One-file page (double-click to open, no install) |
| `package.json` | How to run the live dashboard |

---

## Option A — Open the page immediately (no coding)

1. Open: `share/SkyTrixx-Airline-Analytics-Prototype.html`
2. Double-click it — opens in Chrome / Edge

---

## Option B — Run the project in Cursor (recommended)

### 1. Open the folder in Cursor
- Cursor → **File → Open Folder…**
- Select this folder: `SkyTrixx-Client-Handoff`

### 2. Install & run
In Cursor’s terminal:

```bash
npm install
npm run dev
```

Then open the local URL (usually `http://localhost:5173`).

### Requirements
- Node.js 18+ (https://nodejs.org)
- npm (comes with Node)

---

## Ask Cursor anything (example prompts)

Copy/paste these into Cursor chat:

1. **Explain the data**  
   `Read the Excel in this folder and explain coupon data vs flight capacity in simple words for an airline commercial team.`

2. **Explain a KPI**  
   `What is load factor, ASK, RPK, yield and RASK on this dashboard? How are they calculated from the files here?`

3. **Find a number**  
   `Which route has the highest sample passenger revenue? Show the calculation from prototype.json.`

4. **Product ideas**  
   `If we productise this for airlines, what screens should come after this commercial prototype?`

5. **Change the UI**  
   `Add a filter by airline code on the dashboard using the existing data.`

6. **Data dictionary**  
   `Using the Excel Data Dictionary sheet, list every field and what airline system it usually comes from (PSS, DCS, GDS, etc.).`

---

## Important data notes

- This is **synthetic prototype data** (fictional sample airlines/values).
- **Coupon sample** = 100 rows (10 per flight) for fare / channel / ancillary mix.
- **Flight capacity** = full plane totals (use this for load factor / ASK / RPK).
- Do **not** treat 10 sample coupons as total passengers on a flight.

---

## Rebuild the shareable HTML (optional)

```bash
npm install
npm run share
```

Creates/updates `share/SkyTrixx-Airline-Analytics-Prototype.html`.

---

## Questions for the product team

If something is unclear, ask Cursor first with the files open, then escalate with:

- Which KPIs must match your airline’s official definitions?
- Which source systems can you provide samples from (PSS / DCS / revenue accounting / NDC)?
- Should v1 focus on commercial analytics only, or also forecasting?
