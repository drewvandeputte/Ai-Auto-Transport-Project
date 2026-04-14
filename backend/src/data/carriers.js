// ============================================================
// AutoRoute AI — Mock Carrier Data (Phase 1)
// ============================================================
// In Phase 1 we use realistic but fictional carrier data.
// Phase 2 will replace this with live FMCSA/carrier API calls.
// ============================================================

const CARRIERS = [
  {
    id: 1,
    name: 'FastHaul Transport',
    priceUSD: 850,
    rating: 4.8,       // out of 5.0
    transitDays: 4,
    insuranceUSD: 100000,
  },
  {
    id: 2,
    name: 'MidWest Auto Movers',
    priceUSD: 920,
    rating: 4.5,
    transitDays: 5,
    insuranceUSD: 150000,
  },
  {
    id: 3,
    name: 'CoastLine Carriers',
    priceUSD: 780,
    rating: 4.2,
    transitDays: 7,
    insuranceUSD: 100000,
  },
  {
    id: 4,
    name: 'PrimeShip Auto',
    priceUSD: 1050,
    rating: 4.9,
    transitDays: 3,
    insuranceUSD: 200000,
  },
  {
    id: 5,
    name: 'DirectRoute LLC',
    priceUSD: 890,
    rating: 4.6,
    transitDays: 5,
    insuranceUSD: 125000,
  },
];

module.exports = CARRIERS;
