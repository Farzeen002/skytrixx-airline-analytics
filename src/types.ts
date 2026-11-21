export type AirlineRow = {
  code: string
  name?: string
  pax: number
  revenue: number
  ancillary: number
  flownTicket: number
  avgFare?: number
  ancillaryShare?: number
}

export type RouteRow = { route: string; pax: number; revenue: number; avgFare?: number }
export type ChannelRow = {
  channel: string
  pax: number
  revenue: number
  avgFare?: number
  share?: number
}
export type AncillaryRow = { type: string; count: number; revenue: number; avg?: number }
export type CabinRow = {
  cabin: string
  pax: number
  revenue: number
  avgFare?: number
  share?: number
}
export type RbdRow = { rbd: string; pax: number; revenue: number; avgFare?: number }
export type PosRow = {
  country: string
  pax: number
  revenue: number
  avgFare?: number
  share?: number
}
export type OdRow = { market: string; pax: number; revenue: number; avgFare?: number }

export type FlightRow = {
  flightId: string
  airline: string
  airlineName?: string
  date: string | null
  flightNumber: string
  origin: string
  destination: string
  sector?: string
  aircraft: string
  distanceKm: number
  scheduledSeats: number
  operatedSeats: number
  blockedSeats: number
  sellableSeats: number
  bookedSeats: number
  flownPax: number
  loadFactor: number
  ask: number
  rpk: number
  sampleCoupons?: number
  sampleRevenue?: number
  sampleAncillary?: number
  sampleFlownTicket?: number
  sampleTax?: number
  sampleAvgFare?: number
  cabinMix?: Record<string, number>
  channelMix?: Record<string, number>
}

export type PrototypeData = {
  meta: {
    title: string
    note: string
    currency: string
    source: string
    grain?: {
      coupon: string
      capacity: string
      warning: string
    }
    airlineNames?: Record<string, string>
  }
  kpis: {
    couponRecords: number
    flightSectors: number
    passengerRevenueExTax: number
    flownTicketRevenue: number
    ancillaryRevenue: number
    taxAmount: number
    totalCollectedInclTax: number
    operatedSeats: number
    flownPax: number
    totalAsk: number
    totalRpk: number
    avgLoadFactor: number
  }
  airlines: AirlineRow[]
  routes: RouteRow[]
  channels: ChannelRow[]
  ancillaries: AncillaryRow[]
  cabins: CabinRow[]
  rbds: RbdRow[]
  pointOfSale: PosRow[]
  odMarkets: OdRow[]
  flights: FlightRow[]
}
