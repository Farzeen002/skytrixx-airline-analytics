"""
Generate expanded SkyTrixx prototype data:
- 50,000 Air India coupon rows (Jan 2024 – Dec 2025)
- Matching flight-capacity rows (IB/OB sectors)
- Aggregated prototype.json for the dashboard
"""

from __future__ import annotations

import calendar
import json
import math
import random
from collections import defaultdict
from datetime import date, datetime, timedelta
from pathlib import Path

import pandas as pd
from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.utils.dataframe import dataframe_to_rows

ROOT = Path(__file__).resolve().parents[1]
OUT_XLSX = ROOT / "data" / "SkyTrixx_Airline_Commercial_Analytics_Prototype.xlsx"
OUT_XLSX_ROOT = ROOT / "SkyTrixx_Airline_Commercial_Analytics_Prototype.xlsx"
OUT_JSON = ROOT / "src" / "data" / "prototype.json"

RNG = random.Random(42)
TARGET_COUPONS = 50_000
COUPONS_PER_FLIGHT = 10

AIRLINE = "AI"
AIRLINE_NAME = "Air India"

# Sector templates: OB + IB pairs. Distance is one-way km.
SECTORS = [
    # Direct long-haul Europe
    {
        "ob": ("AI127", "BOM", "LHR"),
        "ib": ("AI128", "LHR", "BOM"),
        "aircraft": "B787-8",
        "distance": 7200,
        "seats": 256,
        "region": "Europe",
        "journey": "Direct",
        "connect": "",
        "od_ob": "BOM-LHR",
        "od_ib": "LHR-BOM",
        "freq_per_month": 10,
    },
    # Connecting via DOH (legs BOM-DOH and DOH-LHR)
    {
        "ob": ("AI977", "BOM", "DOH"),
        "ib": ("AI978", "DOH", "BOM"),
        "aircraft": "A350-900",
        "distance": 2300,
        "seats": 316,
        "region": "GCC",
        "journey": "Connecting",
        "connect": "DOH",
        "od_ob": "BOM-DOH-LHR",
        "od_ib": "LHR-DOH-BOM",
        "freq_per_month": 8,
    },
    {
        "ob": ("AI149", "DOH", "LHR"),
        "ib": ("AI150", "LHR", "DOH"),
        "aircraft": "A350-900",
        "distance": 5250,
        "seats": 316,
        "region": "Europe",
        "journey": "Connecting",
        "connect": "DOH",
        "od_ob": "BOM-DOH-LHR",
        "od_ib": "LHR-DOH-BOM",
        "freq_per_month": 8,
    },
    # GCC
    {
        "ob": ("AI995", "DEL", "DXB"),
        "ib": ("AI996", "DXB", "DEL"),
        "aircraft": "A321neo",
        "distance": 2190,
        "seats": 188,
        "region": "GCC",
        "journey": "Direct",
        "connect": "",
        "od_ob": "DEL-DXB",
        "od_ib": "DXB-DEL",
        "freq_per_month": 12,
    },
    {
        "ob": ("AI909", "BOM", "DXB"),
        "ib": ("AI910", "DXB", "BOM"),
        "aircraft": "B787-8",
        "distance": 1930,
        "seats": 256,
        "region": "GCC",
        "journey": "Direct",
        "connect": "",
        "od_ob": "BOM-DXB",
        "od_ib": "DXB-BOM",
        "freq_per_month": 10,
    },
    # Asia
    {
        "ob": ("AI380", "DEL", "SIN"),
        "ib": ("AI381", "SIN", "DEL"),
        "aircraft": "B787-8",
        "distance": 4150,
        "seats": 256,
        "region": "Asia",
        "journey": "Direct",
        "connect": "",
        "od_ob": "DEL-SIN",
        "od_ib": "SIN-DEL",
        "freq_per_month": 8,
    },
    {
        "ob": ("AI330", "BOM", "BKK"),
        "ib": ("AI331", "BKK", "BOM"),
        "aircraft": "A321neo",
        "distance": 3020,
        "seats": 188,
        "region": "Asia",
        "journey": "Direct",
        "connect": "",
        "od_ob": "BOM-BKK",
        "od_ib": "BKK-BOM",
        "freq_per_month": 8,
    },
    # Africa
    {
        "ob": ("AI245", "DEL", "JNB"),
        "ib": ("AI246", "JNB", "DEL"),
        "aircraft": "B787-8",
        "distance": 8400,
        "seats": 256,
        "region": "Africa",
        "journey": "Direct",
        "connect": "",
        "od_ob": "DEL-JNB",
        "od_ib": "JNB-DEL",
        "freq_per_month": 6,
    },
    {
        "ob": ("AI211", "BOM", "NBO"),
        "ib": ("AI212", "NBO", "BOM"),
        "aircraft": "A350-900",
        "distance": 4550,
        "seats": 316,
        "region": "Africa",
        "journey": "Direct",
        "connect": "",
        "od_ob": "BOM-NBO",
        "od_ib": "NBO-BOM",
        "freq_per_month": 6,
    },
    # Americas
    {
        "ob": ("AI101", "BOM", "JFK"),
        "ib": ("AI102", "JFK", "BOM"),
        "aircraft": "B777-300ER",
        "distance": 12550,
        "seats": 342,
        "region": "Americas",
        "journey": "Direct",
        "connect": "",
        "od_ob": "BOM-JFK",
        "od_ib": "JFK-BOM",
        "freq_per_month": 8,
    },
    {
        "ob": ("AI187", "DEL", "YYZ"),
        "ib": ("AI188", "YYZ", "DEL"),
        "aircraft": "B787-9",
        "distance": 11600,
        "seats": 298,
        "region": "Americas",
        "journey": "Direct",
        "connect": "",
        "od_ob": "DEL-YYZ",
        "od_ib": "YYZ-DEL",
        "freq_per_month": 6,
    },
    # Domestic India
    {
        "ob": ("AI865", "BOM", "DEL"),
        "ib": ("AI866", "DEL", "BOM"),
        "aircraft": "A321",
        "distance": 1150,
        "seats": 182,
        "region": "Domestic India",
        "journey": "Direct",
        "connect": "",
        "od_ob": "BOM-DEL",
        "od_ib": "DEL-BOM",
        "freq_per_month": 14,
    },
    # Connecting via BOM (DEL-BOM-DXB style domestic+GCC)
    {
        "ob": ("AI801", "DEL", "BOM"),
        "ib": ("AI802", "BOM", "DEL"),
        "aircraft": "A320neo",
        "distance": 1150,
        "seats": 186,
        "region": "Domestic India",
        "journey": "Connecting",
        "connect": "BOM",
        "od_ob": "DEL-BOM-DXB",
        "od_ib": "DXB-BOM-DEL",
        "freq_per_month": 8,
    },
]

CABIN_MIX = [
    ("Economy", 0.72),
    ("Premium Economy", 0.14),
    ("Business", 0.11),
    ("First", 0.03),
]

CABIN_RBD = {
    "First": ["F", "A"],
    "Business": ["C", "J", "Z", "D"],
    "Premium Economy": ["W", "T", "P"],
    "Economy": ["Y", "B", "M", "H", "K", "Q", "V", "L", "S"],
}

CABIN_FARE = {
    "First": (1800, 4200),
    "Business": (900, 2800),
    "Premium Economy": (420, 980),
    "Economy": (90, 620),
}

# Domestic / short-haul fare scale
SHORT_FARE_SCALE = {
    "Domestic India": 0.35,
    "GCC": 0.55,
    "Asia": 0.7,
    "Africa": 0.85,
    "Europe": 1.0,
    "Americas": 1.15,
}

CHANNELS = ["Direct", "GDS", "OTA", "Travel Agent", "NDC"]
CHANNEL_W = [0.28, 0.22, 0.18, 0.16, 0.16]
BOOKING_SOURCES = ["PSS", "GDS", "NDC"]
POS = ["IN", "AE", "GB", "US", "CA", "SG", "TH", "KE", "ZA", "QA"]
POS_W = [0.42, 0.12, 0.12, 0.1, 0.06, 0.05, 0.04, 0.03, 0.03, 0.03]
PAX_TYPES = ["Adult", "Child"]
PAX_W = [0.9, 0.1]
ANCILLARIES = [
    (None, 0),
    ("Baggage", 35),
    ("Seat Selection", 28),
    ("Meal", 18),
    ("Upgrade", 95),
]
ANC_W = [0.42, 0.28, 0.16, 0.1, 0.04]

MONTH_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


def week_label(day: int) -> str:
    if day <= 7:
        return "Wk-1"
    if day <= 14:
        return "Wk-2"
    if day <= 21:
        return "Wk-3"
    return "Wk-4"


def season_lf(month: int) -> float:
    # Soft seasonal LF base
    peaks = {1: 0.88, 4: 0.82, 5: 0.8, 6: 0.79, 7: 0.86, 8: 0.87, 10: 0.84, 11: 0.85, 12: 0.9}
    return peaks.get(month, 0.83)


def pick_weighted(items, weights):
    return RNG.choices(items, weights=weights, k=1)[0]


def month_dates(year: int, month: int, count: int) -> list[date]:
    last = calendar.monthrange(year, month)[1]
    # Spread across weeks; prefer mid-week + weekend mix
    pool = list(range(1, last + 1))
    RNG.shuffle(pool)
    days = sorted(pool[: min(count, last)])
    # If need more than unique days, wrap with slight jitter reuse (same day multiple flights OK for different numbers)
    while len(days) < count:
        days.append(RNG.randint(1, last))
    days = sorted(days[:count])
    return [date(year, month, d) for d in days]


def build_flight_schedule() -> list[dict]:
    flights: list[dict] = []
    fid = 1
    for year in (2024, 2025):
        for month in range(1, 13):
            for sec in SECTORS:
                n = sec["freq_per_month"]
                # Slight capacity ramp in 2025
                if year == 2025:
                    n = max(4, int(round(n * 1.05)))
                dates = month_dates(year, month, n)
                for direction in ("ob", "ib"):
                    fn, origin, dest = sec[direction]
                    od = sec["od_ob"] if direction == "ob" else sec["od_ib"]
                    for op_date in dates:
                        lf_base = season_lf(op_date.month)
                        lf = min(0.97, max(0.62, lf_base + RNG.uniform(-0.08, 0.08)))
                        scheduled = sec["seats"]
                        operated = scheduled - RNG.choice([0, 0, 0, 2, 4, 6])
                        blocked = RNG.randint(4, 14)
                        sellable = max(operated - blocked, int(operated * 0.85))
                        flown = int(round(operated * lf))
                        booked = min(sellable + RNG.randint(0, 8), max(flown + RNG.randint(0, 18), flown))
                        ask = operated * sec["distance"]
                        rpk = flown * sec["distance"]
                        flights.append(
                            {
                                "Flight_ID": f"F{fid:05d}",
                                "Airline_Code": AIRLINE,
                                "Operating_Date": op_date,
                                "Flight_Number": fn,
                                "Origin": origin,
                                "Destination": dest,
                                "Aircraft_Type": sec["aircraft"],
                                "Distance_KM": sec["distance"],
                                "Scheduled_Seats": scheduled,
                                "Operated_Seats": operated,
                                "Blocked_Seats": blocked,
                                "Sellable_Seats": sellable,
                                "Booked_Seats": booked,
                                "Flown_PAX": flown,
                                "Load_Factor": round(flown / operated, 4) if operated else 0,
                                "ASK": ask,
                                "RPK": rpk,
                                "Sample_Coupon_Rows": COUPONS_PER_FLIGHT,
                                "Capacity_Source": "Synthetic schedule / DCS aggregate",
                                "Region": sec["region"],
                                "Journey_Type": sec["journey"],
                                "Connecting_Point": sec["connect"] or None,
                                "OD_Market": od,
                                "Week_Label": week_label(op_date.day),
                                "Year": op_date.year,
                                "Month": op_date.month,
                                "Month_Name": MONTH_ABBR[op_date.month - 1],
                                "Direction": "O/B" if direction == "ob" else "I/B",
                            }
                        )
                        fid += 1
    return flights


def fare_for(cabin: str, region: str) -> tuple[float, float, float]:
    lo, hi = CABIN_FARE[cabin]
    scale = SHORT_FARE_SCALE.get(region, 1.0)
    base = RNG.uniform(lo, hi) * scale
    # Compress domestic first/business slightly less extreme
    if region == "Domestic India" and cabin in ("First", "Business"):
        base *= 0.55
    surcharge = base * RNG.uniform(0.05, 0.12)
    tax = (base + surcharge) * RNG.uniform(0.08, 0.14)
    return round(base, 2), round(surcharge, 2), round(tax, 2)


def choose_cabin() -> str:
    names, weights = zip(*CABIN_MIX)
    return pick_weighted(list(names), list(weights))


def generate_coupons(flights: list[dict]) -> list[dict]:
    # Keep coverage across Jan 2024–Dec 2025 (even subsample, don't truncate the end)
    needed_flights = TARGET_COUPONS // COUPONS_PER_FLIGHT
    if len(flights) > needed_flights:
        # Stratify by year-month so every month (incl. Dec 2025) remains represented
        by_ym: dict[tuple[int, int], list[dict]] = defaultdict(list)
        for f in flights:
            by_ym[(f["Year"], f["Month"])].append(f)
        months = sorted(by_ym.keys())
        per_month = needed_flights // len(months)
        remainder = needed_flights - per_month * len(months)
        sampled: list[dict] = []
        for i, ym in enumerate(months):
            pool = by_ym[ym]
            take = per_month + (1 if i < remainder else 0)
            if take >= len(pool):
                chosen = list(pool)
            else:
                # even stride through the month's flights
                step = len(pool) / take
                idxs = sorted({min(len(pool) - 1, int(j * step)) for j in range(take)})
                while len(idxs) < take:
                    idxs.append(len(idxs) % len(pool))
                chosen = [pool[j] for j in idxs[:take]]
            sampled.extend(chosen)
        # If stride logic undershot, top up from unused flights
        if len(sampled) < needed_flights:
            have = {f["Flight_ID"] for f in sampled}
            for f in flights:
                if f["Flight_ID"] not in have:
                    sampled.append(f)
                    if len(sampled) >= needed_flights:
                        break
        flights = sampled[:needed_flights]
        # Re-sequence Flight_IDs for clean joins
        for i, f in enumerate(flights, start=1):
            f["Flight_ID"] = f"F{i:05d}"
    elif len(flights) < needed_flights:
        # duplicate rarer days by cloning with new IDs / shifted dates within month
        extra = []
        i = 0
        while len(flights) + len(extra) < needed_flights:
            src = flights[i % len(flights)].copy()
            i += 1
            src = {**src}
            fid_num = needed_flights + len(extra) + 1
            src["Flight_ID"] = f"F{fid_num:05d}"
            # keep same operating date — distinct flight id for capacity join
            extra.append(src)
        flights = flights + extra

    assert len(flights) * COUPONS_PER_FLIGHT == TARGET_COUPONS

    coupons: list[dict] = []
    rec = 1
    ticket_n = 98010000
    for f in flights:
        op_date: date = f["Operating_Date"]
        for _ in range(COUPONS_PER_FLIGHT):
            cabin = choose_cabin()
            rbd = RNG.choice(CABIN_RBD[cabin])
            fare_basis = f"{rbd}{RNG.choice(['FLEX', 'SAVER', 'LOW'])}"
            base, surcharge, tax = fare_for(cabin, f["Region"])
            anc_type, anc_rev = pick_weighted(ANCILLARIES, ANC_W)
            if anc_type is None:
                anc_type_out = None
                anc_rev = 0.0
            else:
                anc_type_out = anc_type
                anc_rev = float(anc_rev + RNG.randint(-5, 12))
                if anc_rev < 0:
                    anc_rev = 0.0

            # Ticketed ahead of flown (forecasting lag)
            lead = RNG.randint(7, 120)
            ticket_date = op_date - timedelta(days=lead)
            booking_date = ticket_date - timedelta(days=RNG.randint(0, 14))
            if booking_date < date(2023, 10, 1):
                booking_date = date(2023, 10, 1)
            if ticket_date < booking_date:
                ticket_date = booking_date

            channel = pick_weighted(CHANNELS, CHANNEL_W)
            pos = pick_weighted(POS, POS_W)
            pax_type = pick_weighted(PAX_TYPES, PAX_W)
            source = pick_weighted(BOOKING_SOURCES, [0.45, 0.3, 0.25])

            hour = RNG.choice([2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22])
            sched_dep = datetime(op_date.year, op_date.month, op_date.day, hour, 0, 0)
            delay = RNG.randint(-8, 25)
            actual_dep = sched_dep + timedelta(minutes=delay)

            pax_rev = round(base + surcharge + anc_rev, 2)
            total_coll = round(base + surcharge + tax + anc_rev, 2)
            flown_ticket = round(base + surcharge, 2)

            pnr = f"PNR{10000 + (rec // 2):05d}"
            coupons.append(
                {
                    "Record_ID": f"SD-{rec:05d}",
                    "Airline_Code": AIRLINE,
                    "PNR": pnr,
                    "Booking_Date": booking_date,
                    "Booking_Status": "Ticketed",
                    "Passenger_ID": f"PAX{rec:05d}",
                    "Passenger_Type": pax_type,
                    "Ticket_Number": str(ticket_n + rec),
                    "Ticket_Issue_Date": ticket_date,
                    "Flown_Departure_Date": op_date,
                    "Coupon_Number": 1,
                    "Coupon_Status": "Flown",
                    "Segment_Number": 1,
                    "Flight_ID": f["Flight_ID"],
                    "Flight_Number": f["Flight_Number"],
                    "Operating_Date": op_date,
                    "Origin": f["Origin"],
                    "Destination": f["Destination"],
                    "OD_Market": f["OD_Market"],
                    "Journey_Type": f["Journey_Type"],
                    "Connecting_Point": f["Connecting_Point"],
                    "Region": f["Region"],
                    "Direction": f["Direction"],
                    "Week_Label": f["Week_Label"],
                    "Year": f["Year"],
                    "Month": f["Month"],
                    "Month_Name": f["Month_Name"],
                    "Operating_Carrier": AIRLINE,
                    "Aircraft_Type": f["Aircraft_Type"],
                    "Cabin": cabin,
                    "RBD": rbd,
                    "Fare_Basis": fare_basis,
                    "Fare_Currency": "USD",
                    "Base_Fare": base,
                    "Carrier_Surcharge": surcharge,
                    "Tax_Amount": tax,
                    "Ancillary_Type": anc_type_out,
                    "Ancillary_Revenue": anc_rev,
                    "Distribution_Channel": channel,
                    "Booking_Source": source,
                    "Point_of_Sale": pos,
                    "Scheduled_Departure": sched_dep,
                    "Actual_Departure": actual_dep,
                    "Flight_Status": "Operated",
                    "Source_System": source,
                    "Source_File": f"{source}_SAMPLE_{op_date.year}.csv",
                    "Passenger_Revenue_Ex_Tax": pax_rev,
                    "Total_Collected_Incl_Tax": total_coll,
                    "Flown_Ticket_Revenue": flown_ticket,
                }
            )
            rec += 1
    return coupons, flights


def aggregate(coupons: list[dict], flights: list[dict]) -> dict:
    def sum_field(rows, key):
        return round(sum(r[key] for r in rows), 2)

    total_rev = sum_field(coupons, "Passenger_Revenue_Ex_Tax")
    flown_ticket = sum_field(coupons, "Flown_Ticket_Revenue")
    anc = sum_field(coupons, "Ancillary_Revenue")
    tax = sum_field(coupons, "Tax_Amount")
    total_coll = sum_field(coupons, "Total_Collected_Incl_Tax")

    operated = sum(f["Operated_Seats"] for f in flights)
    flown_pax = sum(f["Flown_PAX"] for f in flights)
    total_ask = sum(f["ASK"] for f in flights)
    total_rpk = sum(f["RPK"] for f in flights)
    avg_lf = flown_pax / operated if operated else 0

    # Airlines (single)
    airlines = [
        {
            "code": AIRLINE,
            "name": AIRLINE_NAME,
            "pax": len(coupons),
            "revenue": total_rev,
            "ancillary": anc,
            "flownTicket": flown_ticket,
            "avgFare": round(total_rev / len(coupons), 2),
            "ancillaryShare": round(anc / total_rev, 4) if total_rev else 0,
        }
    ]

    def group_sum(rows, key_fn, rev_key="Passenger_Revenue_Ex_Tax"):
        buckets: dict[str, dict] = {}
        for r in rows:
            k = key_fn(r)
            b = buckets.setdefault(k, {"pax": 0, "revenue": 0.0})
            b["pax"] += 1
            b["revenue"] += r[rev_key]
        out = []
        for k, b in buckets.items():
            out.append(
                {
                    "key": k,
                    "pax": b["pax"],
                    "revenue": round(b["revenue"], 2),
                    "avgFare": round(b["revenue"] / b["pax"], 2) if b["pax"] else 0,
                }
            )
        out.sort(key=lambda x: -x["revenue"])
        return out

    route_g = group_sum(coupons, lambda r: f"{r['Origin']}-{r['Destination']}")
    routes = [{"route": g["key"], "pax": g["pax"], "revenue": g["revenue"], "avgFare": g["avgFare"]} for g in route_g]

    ch_g = group_sum(coupons, lambda r: r["Distribution_Channel"])
    channels = [
        {
            "channel": g["key"],
            "pax": g["pax"],
            "revenue": g["revenue"],
            "avgFare": g["avgFare"],
            "share": round(g["revenue"] / total_rev, 4) if total_rev else 0,
        }
        for g in ch_g
    ]

    anc_map: dict[str, dict] = {}
    for r in coupons:
        t = r["Ancillary_Type"] or "None"
        b = anc_map.setdefault(t, {"count": 0, "revenue": 0.0})
        b["count"] += 1
        b["revenue"] += r["Ancillary_Revenue"]
    ancillaries = [
        {
            "type": t,
            "count": v["count"],
            "revenue": round(v["revenue"], 2),
            "avg": round(v["revenue"] / v["count"], 2) if v["count"] else 0,
        }
        for t, v in sorted(anc_map.items(), key=lambda x: -x[1]["revenue"])
    ]

    cabin_g = group_sum(coupons, lambda r: r["Cabin"])
    # Keep cabin order
    cabin_order = ["First", "Business", "Premium Economy", "Economy"]
    cabin_lookup = {g["key"]: g for g in cabin_g}
    cabins = []
    for c in cabin_order:
        g = cabin_lookup.get(c)
        if not g:
            continue
        cabins.append(
            {
                "cabin": c,
                "pax": g["pax"],
                "revenue": g["revenue"],
                "avgFare": g["avgFare"],
                "share": round(g["revenue"] / total_rev, 4) if total_rev else 0,
            }
        )

    rbd_g = group_sum(coupons, lambda r: r["RBD"])
    rbds = [{"rbd": g["key"], "pax": g["pax"], "revenue": g["revenue"], "avgFare": g["avgFare"]} for g in rbd_g]

    pos_g = group_sum(coupons, lambda r: r["Point_of_Sale"])
    point_of_sale = [
        {
            "country": g["key"],
            "pax": g["pax"],
            "revenue": g["revenue"],
            "avgFare": g["avgFare"],
            "share": round(g["revenue"] / total_rev, 4) if total_rev else 0,
        }
        for g in pos_g
    ]

    od_g = group_sum(coupons, lambda r: r["OD_Market"])
    od_markets = [{"market": g["key"], "pax": g["pax"], "revenue": g["revenue"], "avgFare": g["avgFare"]} for g in od_g]

    region_g = group_sum(coupons, lambda r: r["Region"])
    regions = [
        {
            "region": g["key"],
            "pax": g["pax"],
            "revenue": g["revenue"],
            "avgFare": g["avgFare"],
            "share": round(g["revenue"] / total_rev, 4) if total_rev else 0,
        }
        for g in region_g
    ]

    journey_g = group_sum(coupons, lambda r: r["Journey_Type"])
    journey_types = [
        {
            "type": g["key"],
            "pax": g["pax"],
            "revenue": g["revenue"],
            "avgFare": g["avgFare"],
            "share": round(g["revenue"] / total_rev, 4) if total_rev else 0,
        }
        for g in journey_g
    ]

    # Coupon join helpers per flight
    by_fid: dict[str, list] = defaultdict(list)
    for c in coupons:
        by_fid[c["Flight_ID"]].append(c)

    flight_rows = []
    for f in flights:
        sample = by_fid[f["Flight_ID"]]
        cabin_mix: dict[str, int] = defaultdict(int)
        channel_mix: dict[str, int] = defaultdict(int)
        for c in sample:
            cabin_mix[c["Cabin"]] += 1
            channel_mix[c["Distribution_Channel"]] += 1
        s_rev = round(sum(c["Passenger_Revenue_Ex_Tax"] for c in sample), 2)
        s_anc = round(sum(c["Ancillary_Revenue"] for c in sample), 2)
        s_ft = round(sum(c["Flown_Ticket_Revenue"] for c in sample), 2)
        s_tax = round(sum(c["Tax_Amount"] for c in sample), 2)
        flight_rows.append(
            {
                "flightId": f["Flight_ID"],
                "airline": AIRLINE,
                "airlineName": AIRLINE_NAME,
                "date": f["Operating_Date"].isoformat(),
                "flownDepartureDate": f["Operating_Date"].isoformat(),
                "flightNumber": f["Flight_Number"],
                "origin": f["Origin"],
                "destination": f["Destination"],
                "sector": f"{f['Origin']}-{f['Destination']}",
                "aircraft": f["Aircraft_Type"],
                "distanceKm": f["Distance_KM"],
                "scheduledSeats": f["Scheduled_Seats"],
                "operatedSeats": f["Operated_Seats"],
                "blockedSeats": f["Blocked_Seats"],
                "sellableSeats": f["Sellable_Seats"],
                "bookedSeats": f["Booked_Seats"],
                "flownPax": f["Flown_PAX"],
                "loadFactor": f["Load_Factor"],
                "ask": f["ASK"],
                "rpk": f["RPK"],
                "region": f["Region"],
                "journeyType": f["Journey_Type"],
                "connectingPoint": f["Connecting_Point"],
                "odMarket": f["OD_Market"],
                "weekLabel": f["Week_Label"],
                "year": f["Year"],
                "month": f["Month"],
                "monthName": f["Month_Name"],
                "direction": f["Direction"],
                "sampleCoupons": len(sample),
                "sampleRevenue": s_rev,
                "sampleAncillary": s_anc,
                "sampleFlownTicket": s_ft,
                "sampleTax": s_tax,
                "sampleAvgFare": round(s_rev / len(sample), 2) if sample else 0,
                "cabinMix": dict(cabin_mix),
                "channelMix": dict(channel_mix),
            }
        )

    # Monthly series for charts / forecast
    monthly: dict[tuple[int, int], dict] = {}
    for f in flights:
        key = (f["Year"], f["Month"])
        m = monthly.setdefault(
            key,
            {
                "year": f["Year"],
                "month": f["Month"],
                "monthName": f["Month_Name"],
                "operated": 0,
                "flown": 0,
                "ask": 0,
                "rpk": 0,
                "sampleRevenue": 0.0,
                "flights": 0,
            },
        )
        m["operated"] += f["Operated_Seats"]
        m["flown"] += f["Flown_PAX"]
        m["ask"] += f["ASK"]
        m["rpk"] += f["RPK"]
        m["flights"] += 1
    for c in coupons:
        key = (c["Year"], c["Month"])
        if key in monthly:
            monthly[key]["sampleRevenue"] += c["Passenger_Revenue_Ex_Tax"]

    monthly_series = []
    for key in sorted(monthly.keys()):
        m = monthly[key]
        monthly_series.append(
            {
                "year": m["year"],
                "month": m["month"],
                "monthName": m["monthName"],
                "label": f"{m['monthName']} {m['year']}",
                "flights": m["flights"],
                "operatedSeats": m["operated"],
                "flownPax": m["flown"],
                "ask": m["ask"],
                "rpk": m["rpk"],
                "loadFactor": round(m["flown"] / m["operated"], 4) if m["operated"] else 0,
                "sampleRevenue": round(m["sampleRevenue"], 2),
            }
        )

    # Ticketed vs flown lag summary for forecasting
    lag_buckets = defaultdict(int)
    for c in coupons:
        lag = (c["Flown_Departure_Date"] - c["Ticket_Issue_Date"]).days
        if lag <= 14:
            lag_buckets["0-14d"] += 1
        elif lag <= 30:
            lag_buckets["15-30d"] += 1
        elif lag <= 60:
            lag_buckets["31-60d"] += 1
        elif lag <= 90:
            lag_buckets["61-90d"] += 1
        else:
            lag_buckets["91d+"] += 1
    booking_lag = [{"bucket": k, "pax": lag_buckets[k]} for k in ["0-14d", "15-30d", "31-60d", "61-90d", "91d+"]]

    return {
        "meta": {
            "title": "SkyTrixx Airline Commercial Analytics",
            "note": (
                f"Synthetic prototype data — {TARGET_COUPONS:,} Air India coupon records "
                f"across {len(flights):,} flight sectors (USD), Jan 2024–Dec 2025."
            ),
            "currency": "USD",
            "source": "SkyTrixx_Airline_Commercial_Analytics_Prototype.xlsx",
            "period": {"start": "2024-01-01", "end": "2025-12-31"},
            "grain": {
                "coupon": "One row = one flown passenger coupon on one flight leg.",
                "capacity": "One row = one operated flight sector/date (full plane totals).",
                "warning": (
                    f"Coupon sheet samples {COUPONS_PER_FLIGHT} rows per flight. "
                    "Capacity Flown_PAX is the full flight total — do not treat sample coupon count as total passengers."
                ),
            },
            "airlineNames": {AIRLINE: AIRLINE_NAME},
        },
        "kpis": {
            "couponRecords": len(coupons),
            "flightSectors": len(flights),
            "passengerRevenueExTax": total_rev,
            "flownTicketRevenue": flown_ticket,
            "ancillaryRevenue": anc,
            "taxAmount": tax,
            "totalCollectedInclTax": total_coll,
            "operatedSeats": operated,
            "flownPax": flown_pax,
            "totalAsk": total_ask,
            "totalRpk": total_rpk,
            "avgLoadFactor": round(avg_lf, 4),
        },
        "airlines": airlines,
        "routes": routes,
        "channels": channels,
        "ancillaries": ancillaries,
        "cabins": cabins,
        "rbds": rbds,
        "pointOfSale": point_of_sale,
        "odMarkets": od_markets,
        "regions": regions,
        "journeyTypes": journey_types,
        "monthlySeries": monthly_series,
        "bookingLag": booking_lag,
        "flights": flight_rows,
    }


def style_header(ws):
    fill = PatternFill("solid", fgColor="0B3D5C")
    font = Font(name="Arial", bold=True, color="FFFFFF", size=10)
    for cell in ws[1]:
        cell.fill = fill
        cell.font = font
        cell.alignment = Alignment(vertical="center", wrap_text=True)


def write_overview(wb: Workbook, coupons: list[dict], flights: list[dict], data: dict):
    ws = wb.create_sheet("Overview", 0)
    font = Font(name="Arial", size=11)
    bold = Font(name="Arial", bold=True, size=12, color="0B3D5C")
    ws["A1"] = "SkyTrixx Airline Commercial Analytics Prototype"
    ws["A1"].font = Font(name="Arial", bold=True, size=16, color="0B3D5C")
    ws["A2"] = data["meta"]["note"]
    ws["A2"].font = Font(name="Arial", size=10, italic=True)

    ws["A4"] = "Prototype measure"
    ws["B4"] = "Value"
    ws["D4"] = "Capacity measure"
    ws["E4"] = "Value"
    for c in ("A4", "B4", "D4", "E4"):
        ws[c].font = bold

    k = data["kpis"]
    rows = [
        ("Coupon-level records", k["couponRecords"], "Average flight load factor", k["avgLoadFactor"]),
        ("Unique flight sectors", k["flightSectors"], "Total operated seats", k["operatedSeats"]),
        ("Passenger revenue ex tax (USD)", k["passengerRevenueExTax"], "Total ASK", k["totalAsk"]),
        ("Flown ticket revenue (USD)", k["flownTicketRevenue"], "Total RPK", k["totalRpk"]),
        ("Ancillary revenue (USD)", k["ancillaryRevenue"], "", ""),
    ]
    for i, row in enumerate(rows, start=5):
        ws[f"A{i}"] = row[0]
        ws[f"B{i}"] = row[1]
        ws[f"D{i}"] = row[2]
        ws[f"E{i}"] = row[3]
        for col in "ABDE":
            ws[f"{col}{i}"].font = font

    notes = [
        (11, "Prototype design notes", ""),
        (12, "1. Coupon Data grain", "One row represents one flown passenger coupon on one flight leg."),
        (
            13,
            "2. Capacity grain",
            "One row in Flight Capacity represents one flight sector/date. Capacity and Flown_PAX are synthetic flight-level aggregates; coupon rows are a sample, 10 per flight.",
        ),
        (
            14,
            "3. Airline scope",
            "All records are Air India (AI) with inbound and outbound flight numbers. Regions include Asia, Africa, GCC, Europe, Americas and Domestic India.",
        ),
        (
            15,
            "4. Journey types",
            "Direct examples (e.g. BOM-LHR) and connecting examples (e.g. BOM-DOH-LHR with Connecting_Point = DOH) are both included.",
        ),
        (
            16,
            "5. Forecasting dates",
            "Ticket_Issue_Date = ticketed date; Flown_Departure_Date = departure/flown date. Use the lag between them for demand forecasting.",
        ),
        (
            17,
            "6. Period / weeks",
            "Operating period covers January 2024–December 2025. Week_Label uses Wk-1 (1–7), Wk-2 (8–14), Wk-3 (15–21), Wk-4 (22–end).",
        ),
        (
            18,
            "7. Dummy data",
            "All records, values and identifiers are fictional examples for prototyping only.",
        ),
    ]
    for r, title, body in notes:
        ws[f"A{r}"] = title
        ws[f"A{r}"].font = bold
        ws[f"B{r}"] = body
        ws[f"B{r}"].font = font

    ws.column_dimensions["A"].width = 36
    ws.column_dimensions["B"].width = 28
    ws.column_dimensions["D"].width = 28
    ws.column_dimensions["E"].width = 16


def write_dictionary(wb: Workbook):
    # Start from prior dictionary fields + new ones
    rows = [
        ("Record_ID", "Control / lineage", "Unique row identifier for the prototype record.", "Text", "Generated in prototype", "Required; unique."),
        ("Airline_Code", "Airline master", "Two-character airline code (AI = Air India).", "Text", "PSS / airline master", "Map to airline master."),
        ("PNR", "Bookings & Reservations", "Booking reference linking passengers and segments.", "Text", "PSS / GDS / NDC", "One PNR may contain multiple passengers and segments."),
        ("Booking_Date", "Bookings & Reservations", "Date the reservation was created.", "Date", "PSS / GDS / NDC", "Must be on or before ticket issue date."),
        ("Booking_Status", "Bookings & Reservations", "Current or final booking state.", "Category", "PSS", "Example values: Held, Ticketed, Cancelled."),
        ("Passenger_ID", "Bookings & Reservations", "Pseudonymous passenger key for joining records.", "Text", "PSS / DCS", "Do not use names or direct personal identifiers in prototype."),
        ("Passenger_Type", "Bookings & Reservations", "Passenger category.", "Category", "PSS", "Example values: Adult, Child, Infant."),
        ("Ticket_Number", "Ticketing & Coupons", "Unique ticket/document number.", "Text", "PSS / GDS / revenue accounting", "Treat as text to preserve leading zeros."),
        ("Ticket_Issue_Date", "Ticketing & Coupons", "Date ticket was issued (ticketed date).", "Date", "PSS / GDS", "Use for booking curve / forecasting vs flown date."),
        ("Flown_Departure_Date", "Flight & Schedule", "Passenger flown / flight departure date for forecasting.", "Date", "DCS / schedule", "Aligns with Operating_Date for flown coupons in this prototype."),
        ("Coupon_Number", "Ticketing & Coupons", "Coupon sequence within the ticket.", "Integer", "PSS / revenue accounting", "A ticket may have multiple coupons."),
        ("Coupon_Status", "Ticketing & Coupons", "Coupon lifecycle state.", "Category", "PSS / DCS / revenue accounting", "Example values: Open, Flown, Refunded, Exchanged."),
        ("Segment_Number", "Bookings & Reservations", "Segment position within the itinerary.", "Integer", "PSS / GDS", "Itinerary segment is distinct from ticket coupon."),
        ("Flight_ID", "Flight & Schedule", "Standard key for one operated flight sector/date.", "Text", "SkyTrixx generated key", "Join key to Flight Capacity."),
        ("Flight_Number", "Flight & Schedule", "Marketing or operating flight number.", "Text", "PSS / schedule / DCS", "Retain carrier code separately."),
        ("Operating_Date", "Flight & Schedule", "Local operating date of the flight sector.", "Date", "Schedule / DCS", "Agree local versus UTC date convention."),
        ("Origin", "Market & O&D", "Origin airport code for this coupon flight leg.", "Text", "PSS / schedule", "Use standard airport code set."),
        ("Destination", "Market & O&D", "Destination airport code for this coupon flight leg.", "Text", "PSS / schedule", "Use standard airport code set."),
        ("OD_Market", "Market & O&D", "Passenger itinerary origin-destination market.", "Text", "PSS / GDS", "May include connecting points, e.g. BOM-DOH-LHR."),
        ("Journey_Type", "Market & O&D", "Whether the passenger itinerary is Direct or Connecting.", "Category", "PSS / GDS", "Example: Direct, Connecting."),
        ("Connecting_Point", "Market & O&D", "Connection airport when Journey_Type is Connecting.", "Text", "PSS / GDS", "Blank for Direct; e.g. DOH for BOM-DOH-LHR."),
        ("Region", "Market & O&D", "Commercial region of the sector/market.", "Category", "Network planning", "Example: Asia, Africa, GCC, Europe, Americas, Domestic India."),
        ("Direction", "Flight & Schedule", "Outbound (O/B) or inbound (I/B) relative to India hub.", "Category", "Network planning", "Example: O/B, I/B."),
        ("Week_Label", "Flight & Schedule", "Week bucket within the operating month.", "Category", "Calculated", "Wk-1 (1–7), Wk-2 (8–14), Wk-3 (15–21), Wk-4 (22–end)."),
        ("Year", "Flight & Schedule", "Operating year.", "Integer", "Calculated", "2024 or 2025 in this prototype."),
        ("Month", "Flight & Schedule", "Operating month number (1–12).", "Integer", "Calculated", "Use with Year for period filters."),
        ("Month_Name", "Flight & Schedule", "Operating month short name.", "Text", "Calculated", "Jan–Dec."),
        ("Operating_Carrier", "Flight & Schedule", "Carrier operating the flight.", "Text", "Schedule / DCS", "May differ from marketing carrier."),
        ("Aircraft_Type", "Flight & Schedule", "Aircraft type operated or scheduled.", "Text", "Schedule / fleet records", "Configuration may change by tail/flight."),
        ("Cabin", "Fare & Inventory", "Cabin associated with passenger coupon.", "Category", "PSS / revenue management", "First, Business, Premium Economy, Economy."),
        ("RBD", "Fare & Inventory", "Reservation booking designator.", "Text", "PSS / GDS", "Map source values to standard class definition."),
        ("Fare_Basis", "Fare & Inventory", "Fare basis code associated with ticketed fare.", "Text", "PSS / GDS", "Source formats vary by airline."),
        ("Fare_Currency", "Revenue Accounting", "Currency code for fare components.", "Text", "Ticket / revenue accounting", "Use ISO currency codes."),
        ("Base_Fare", "Revenue Accounting", "Allocated base fare for the coupon/record.", "Decimal", "Ticket / revenue accounting", "Document coupon-level allocation rule."),
        ("Carrier_Surcharge", "Revenue Accounting", "Carrier-imposed surcharge allocated to record.", "Decimal", "Ticket / revenue accounting", "Keep taxes separate."),
        ("Tax_Amount", "Revenue Accounting", "Tax amount allocated to record.", "Decimal", "Ticket / revenue accounting", "Excluded from commercial passenger revenue unless specified."),
        ("Ancillary_Type", "Ancillary Revenue", "Type of ancillary service.", "Category", "PSS / NDC / revenue accounting", "Example: Baggage, seat, upgrade, meal, none."),
        ("Ancillary_Revenue", "Ancillary Revenue", "Ancillary amount attributed to passenger record.", "Decimal", "PSS / NDC / revenue accounting", "Currency follows Fare_Currency."),
        ("Distribution_Channel", "Distribution", "Standardised sales channel.", "Category", "PSS / GDS / NDC", "Example: Direct, GDS, OTA, Travel Agent, NDC."),
        ("Booking_Source", "Distribution", "System/source through which booking was created.", "Category", "PSS / GDS / NDC", "Retain raw system and mapped channel separately."),
        ("Point_of_Sale", "Distribution", "Country or market in which sale occurred.", "Text", "PSS / GDS / NDC", "Standardise country codes."),
        ("Scheduled_Departure", "Flight & Schedule", "Scheduled departure timestamp.", "Date/time", "Schedule / PSS", "Store timezone convention."),
        ("Actual_Departure", "Flight & Schedule", "Actual departure timestamp.", "Date/time", "DCS / operations source", "May be blank when unavailable."),
        ("Flight_Status", "Flight & Schedule", "Operational status of flight.", "Category", "DCS / operations source", "Example: Operated, Cancelled, Diverted."),
        ("Source_System", "Source mapping", "System providing this record.", "Category", "Ingestion metadata", "Keep source provenance."),
        ("Source_File", "Source mapping", "Original file or batch reference.", "Text", "Ingestion metadata", "Use for lineage and troubleshooting."),
        ("Passenger_Revenue_Ex_Tax", "Calculated", "Base fare + surcharge + ancillary revenue.", "Decimal", "Calculated in workbook", "Prototype formula; excludes taxes."),
        ("Total_Collected_Incl_Tax", "Calculated", "Base fare + surcharge + taxes + ancillary revenue.", "Decimal", "Calculated in workbook", "Prototype collection amount."),
        ("Flown_Ticket_Revenue", "Calculated", "Base fare + surcharge for flown coupons.", "Decimal", "Calculated in workbook", "Simplified prototype recognition rule."),
        ("Distance_KM", "Capacity & Schedule Intelligence", "Distance for one flight sector.", "Integer", "Schedule / airport reference", "Use one documented distance methodology."),
        ("Scheduled_Seats", "Capacity & Schedule Intelligence", "Seats planned for the scheduled aircraft/configuration.", "Integer", "Schedule planning / fleet config", "One value per flight."),
        ("Operated_Seats", "Capacity & Schedule Intelligence", "Seats on aircraft that actually operated.", "Integer", "DCS / aircraft configuration", "Reflect aircraft substitution where applicable."),
        ("Blocked_Seats", "Capacity & Schedule Intelligence", "Operated seats unavailable for sale/use.", "Integer", "PSS / DCS / inventory", "Define whether technical blocks are included."),
        ("Sellable_Seats", "Fare & Inventory", "Operated seats less blocked seats.", "Integer", "Calculated from capacity inputs", "Capacity basis used for commercial availability."),
        ("Booked_Seats", "Fare & Inventory", "Seats with active bookings at a defined snapshot.", "Integer", "PSS inventory snapshot", "Snapshot timestamp is required in production."),
        ("Flown_PAX", "Capacity & Schedule Intelligence", "Aggregate passengers carried on the flight sector.", "Integer", "DCS / coupon data", "Synthetic flight-level total; do not confuse with sample coupon count."),
        ("Load_Factor", "Capacity & Schedule Intelligence", "Flown passengers divided by operated seats.", "Percentage", "Calculated", "Not a profitability measure."),
        ("ASK", "Capacity & Schedule Intelligence", "Operated seats multiplied by sector distance.", "Seat-km", "Calculated", "Use operated seats and sector distance."),
        ("RPK", "Capacity & Schedule Intelligence", "Revenue passengers multiplied by sector distance.", "Passenger-km", "Calculated", "Use revenue passenger definition consistently."),
        ("Sample_Coupon_Rows", "Prototype sampling", "Number of coupon-level sample rows included for the flight.", "Integer", "Calculated from Coupon Data", "Sample only — not full flown PAX."),
        ("Capacity_Source", "Capacity & Schedule Intelligence", "Source/basis used for capacity values.", "Text", "Schedule / configuration source", "Keep capacity provenance per flight."),
    ]
    ws = wb.create_sheet("Data Dictionary")
    headers = ["Standard_Field", "Domain", "Definition", "Data_Type", "Typical_Source", "Rule_or_Validation"]
    ws.append(headers)
    style_header(ws)
    for row in rows:
        ws.append(list(row))
        for cell in ws[ws.max_row]:
            cell.font = Font(name="Arial", size=10)
    for col, width in zip("ABCDEF", [24, 28, 70, 14, 28, 55]):
        ws.column_dimensions[col].width = width


def write_readme(wb: Workbook):
    ws = wb.create_sheet("Read Me")
    ws.append(["Implementation Roadmap", "Work to complete", "Primary output", "Dependency / note"])
    style_header(ws)
    rows = [
        ("1. Confirm scope and definitions", "Confirm commercial KPI definitions, data grains, and the nine-domain scope.", "Approved prototype requirements", "Commercial Analytics is the recommended first product scope."),
        ("2. Obtain airline samples", "Collect booking, ticket/coupon, schedule, revenue, fare/inventory, and capacity samples.", "Representative source files", "Target two or three distinct source environments."),
        ("3. Build the data dictionary", "Agree field names, definitions, types, relationships, valid values, and quality rules.", "Airline Master Data Dictionary", "Use the Data Dictionary tab as the starting template."),
        ("4. Map sources", "Map each airline source field to a standard field and retain lineage.", "Source mapping specification", "Validate mappings against actual sample files."),
        ("5. Define reconciliations and calculations", "Agree ticket, coupon, revenue, passenger, capacity, currency, and period rules.", "Calculation and reconciliation library", "Document every numerator, denominator, and exclusion."),
        ("6. Build initial analytics", "Create views for revenue, PAX, yield, fare/RBD, route/O&D, distribution, ancillary, capacity, and load factor.", "Commercial analytics prototype", "Use flight-sector capacity records for capacity measures."),
        ("7. Add predictive intelligence", "Introduce demand forecasting using Ticket_Issue_Date vs Flown_Departure_Date after measures stabilise.", "Forecasting and decision-support features", "Validate forecasts against historical periods."),
    ]
    for r in rows:
        ws.append(list(r))
        for cell in ws[ws.max_row]:
            cell.font = Font(name="Arial", size=10)
    for col, width in zip("ABCD", [36, 80, 40, 55]):
        ws.column_dimensions[col].width = width


def df_from_records(records: list[dict]) -> pd.DataFrame:
    return pd.DataFrame(records)


def write_excel(coupons: list[dict], flights: list[dict], data: dict):
    print("Writing Excel…")
    wb = Workbook()
    # remove default
    wb.remove(wb.active)
    write_overview(wb, coupons, flights, data)

    coupon_cols = list(coupons[0].keys())
    flight_cols = [
        "Flight_ID",
        "Airline_Code",
        "Operating_Date",
        "Flown_Departure_Date",
        "Flight_Number",
        "Origin",
        "Destination",
        "Direction",
        "Region",
        "Journey_Type",
        "Connecting_Point",
        "OD_Market",
        "Week_Label",
        "Year",
        "Month",
        "Month_Name",
        "Aircraft_Type",
        "Distance_KM",
        "Scheduled_Seats",
        "Operated_Seats",
        "Blocked_Seats",
        "Sellable_Seats",
        "Booked_Seats",
        "Flown_PAX",
        "Load_Factor",
        "ASK",
        "RPK",
        "Sample_Coupon_Rows",
        "Capacity_Source",
    ]
    flight_rows = []
    for f in flights:
        row = {**f, "Flown_Departure_Date": f["Operating_Date"]}
        flight_rows.append({c: row.get(c) for c in flight_cols})

    # Use pandas ExcelWriter for speed on large sheets
    tmp = ROOT / "data" / "_tmp_skytrixx.xlsx"
    with pd.ExcelWriter(tmp, engine="openpyxl") as writer:
        # Overview etc written after via openpyxl merge — write data sheets first
        df_from_records(coupons).to_excel(writer, sheet_name="Coupon Data", index=False)
        pd.DataFrame(flight_rows).to_excel(writer, sheet_name="Flight Capacity", index=False)

    # Re-open and add overview / dictionary / readme in order
    from openpyxl import load_workbook

    wb2 = load_workbook(tmp)
    # Style headers on data sheets
    for name in ("Coupon Data", "Flight Capacity"):
        ws = wb2[name]
        style_header(ws)
        for cell in ws[1]:
            cell.font = Font(name="Arial", bold=True, color="FFFFFF", size=10)
        # light Arial on a sample of rows is expensive; set default font via workbook styles not needed

    # Insert overview at front
    write_overview(wb2, coupons, flights, data)
    # move Overview to index 0
    wb2.move_sheet("Overview", offset=-len(wb2.sheetnames) + 1)
    write_dictionary(wb2)
    write_readme(wb2)

    # Desired order
    order = ["Overview", "Coupon Data", "Flight Capacity", "Data Dictionary", "Read Me"]
    for i, name in enumerate(order):
        wb2.move_sheet(name, offset=i - wb2.sheetnames.index(name))

    OUT_XLSX.parent.mkdir(parents=True, exist_ok=True)
    wb2.save(OUT_XLSX)
    wb2.save(OUT_XLSX_ROOT)
    tmp.unlink(missing_ok=True)
    print(f"Excel saved: {OUT_XLSX}")


def main():
    print("Building flight schedule…")
    schedule = build_flight_schedule()
    print(f"Scheduled sectors before trim: {len(schedule)}")
    print("Generating coupons…")
    coupons, flights = generate_coupons(schedule)
    print(f"Coupons: {len(coupons):,} | Flights: {len(flights):,}")
    print("Aggregating dashboard JSON…")
    data = aggregate(coupons, flights)
    write_excel(coupons, flights, data)
    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    with OUT_JSON.open("w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    print(f"JSON saved: {OUT_JSON}")
    print("Done.")
    print(
        "KPIs:",
        data["kpis"]["couponRecords"],
        "coupons,",
        data["kpis"]["flightSectors"],
        "flights,",
        "LF",
        data["kpis"]["avgLoadFactor"],
    )


if __name__ == "__main__":
    main()
