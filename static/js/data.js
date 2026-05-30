/* yield.fi — Real Data via DefiLlama Yields API
   Risk scoring handled by risk.js (loaded before this file). */

window.CHAIN_STYLES = {
  Ethereum:  { color: '#627EEA' },
  Arbitrum:  { color: '#12AAFF' },
  Base:      { color: '#0052FF' },
  Polygon:   { color: '#8247E5' },
  Avalanche: { color: '#E84142' },
  Solana:    { color: '#9945FF' },
  Optimism:  { color: '#FF0420' },
};

const ALLOWED_CHAINS = new Set([
  'Ethereum', 'Arbitrum', 'Base', 'Polygon',
  'Avalanche', 'Solana', 'Optimism'
]);

/* Display names */
const PROTOCOL_NAMES = {
  'aave-v3':           'Aave v3',
  'aave-v2':           'Aave v2',
  'compound-v3':       'Compound v3',
  'compound-v2':       'Compound v2',
  'morpho-blue':       'Morpho Blue',
  'morpho':            'Morpho',
  'spark':             'Spark',
  'sparklend':         'Spark',
  'fluid':             'Fluid',
  'euler':             'Euler',
  'euler-v2':          'Euler v2',
  'kamino':            'Kamino',
  'kamino-lend':       'Kamino',
  'marginfi':          'MarginFi',
  'drift-protocol':    'Drift',
  'solend':            'Solend',
  'venus':             'Venus',
  'benqi':             'Benqi',
  'moonwell':          'Moonwell',
  'radiant':           'Radiant',
  'silo':              'Silo',
  'clearpool':         'Clearpool',
  'exactlyprotocol':   'Exactly',
  'seamless-protocol': 'Seamless',
  'maple':             'Maple',
  'sprinter':          'Sprinter',
  'ember-protocol':    'Ember',
  'avantis':           'Avantis',
  'yieldseeker':       'YieldSeeker',
  'grove-finance':     'Grove',
  'upshift':           'Upshift',
  'veda':              'Veda',
  'concrete':          'Concrete',
  'lagoon':            'Lagoon',
};

function protocolName(slug) {
  return PROTOCOL_NAMES[slug] ||
    slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

/*
 * Inline SVG logos for protocols that don't have an icon on DefiLlama CDN.
 * Keyed by project slug. These show instead of the broken <img>.
 */
const INLINE_LOGOS = {
  'sprinter': `<svg viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
    <rect width="28" height="28" rx="6" fill="#1a1a2e"/>
    <path d="M6 10h10c3.3 0 6 1.3 6 4s-2.7 4-6 4H6" stroke="#7B61FF" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M6 14h8" stroke="#7B61FF" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`,

  'ember-protocol': `<svg viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
    <rect width="28" height="28" rx="6" fill="#1a0e00"/>
    <path d="M14 5 C14 5 20 10 20 16 C20 19.3 17.3 22 14 22 C10.7 22 8 19.3 8 16 C8 12 11 8 14 5Z" fill="#FF6B00" opacity="0.9"/>
    <path d="M14 11 C14 11 17 14 17 17 C17 18.7 15.7 20 14 20 C12.3 20 11 18.7 11 17 C11 14.5 12.5 12 14 11Z" fill="#FFD166"/>
  </svg>`,

  'avantis': `<svg viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
    <rect width="28" height="28" rx="6" fill="#0d1117"/>
    <polygon points="14,5 23,20 5,20" fill="none" stroke="#00E5FF" stroke-width="2" stroke-linejoin="round"/>
    <line x1="14" y1="9" x2="14" y2="17" stroke="#00E5FF" stroke-width="1.5"/>
  </svg>`,

  'yieldseeker': `<svg viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
    <rect width="28" height="28" rx="6" fill="#0a1628"/>
    <circle cx="12" cy="12" r="5" fill="none" stroke="#4ADE80" stroke-width="2"/>
    <line x1="16" y1="16" x2="22" y2="22" stroke="#4ADE80" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="12" y1="9" x2="12" y2="15" stroke="#4ADE80" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="9" y1="12" x2="15" y2="12" stroke="#4ADE80" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,

  'grove-finance': `<svg viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
    <rect width="28" height="28" rx="6" fill="#0a1a0a"/>
    <path d="M14 6 L14 16" stroke="#22C55E" stroke-width="2" stroke-linecap="round"/>
    <path d="M14 10 Q10 7 7 10" stroke="#22C55E" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <path d="M14 13 Q18 10 21 13" stroke="#16A34A" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <path d="M10 22 Q14 16 18 22" stroke="#22C55E" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  </svg>`,

  'upshift': `<svg viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
    <rect width="28" height="28" rx="6" fill="#0d0d1a"/>
    <path d="M14 6 L22 18 H6 Z" fill="#818CF8"/>
    <rect x="11" y="18" width="6" height="4" rx="1" fill="#818CF8" opacity="0.6"/>
  </svg>`,

  'veda': `<svg viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
    <rect width="28" height="28" rx="6" fill="#100a1f"/>
    <path d="M6 8 L14 20 L22 8" stroke="#A78BFA" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M9 8 L14 16 L19 8" stroke="#7C3AED" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  'concrete': `<svg viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
    <rect width="28" height="28" rx="6" fill="#111"/>
    <rect x="6" y="6" width="7" height="7" rx="1" fill="#9CA3AF"/>
    <rect x="15" y="6" width="7" height="7" rx="1" fill="#6B7280"/>
    <rect x="6" y="15" width="7" height="7" rx="1" fill="#6B7280"/>
    <rect x="15" y="15" width="7" height="7" rx="1" fill="#9CA3AF"/>
  </svg>`,

  'lagoon': `<svg viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
    <rect width="28" height="28" rx="6" fill="#001a2e"/>
    <path d="M4 18 Q9 12 14 16 Q19 20 24 14" stroke="#38BDF8" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M4 22 Q9 16 14 20 Q19 24 24 18" stroke="#0EA5E9" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.6"/>
    <circle cx="14" cy="10" r="3" fill="#38BDF8" opacity="0.8"/>
  </svg>`,
};

/*
 * Fallback URLs used when pool.url is absent from the API.
 * Priority: pool.url (from DefiLlama API) → this map → null (row not clickable)
 */
const FALLBACK_URLS = {
  'aave-v3': chain => ({
    Ethereum:  'https://app.aave.com/markets/?marketName=proto_mainnet_v3',
    Arbitrum:  'https://app.aave.com/markets/?marketName=proto_arbitrum_v3',
    Base:      'https://app.aave.com/markets/?marketName=proto_base_v3',
    Polygon:   'https://app.aave.com/markets/?marketName=proto_polygon_v3',
    Avalanche: 'https://app.aave.com/markets/?marketName=proto_avalanche_v3',
    Optimism:  'https://app.aave.com/markets/?marketName=proto_optimism_v3',
  }[chain] || 'https://app.aave.com/markets/'),
  'aave-v2':           () => 'https://app.aave.com/markets/?marketName=proto_mainnet',
  'compound-v3': chain => ({
    Ethereum: 'https://app.compound.finance/?market=usdc-mainnet',
    Arbitrum: 'https://app.compound.finance/?market=usdc-arbitrum',
    Base:     'https://app.compound.finance/?market=usdc-basemainnet',
    Polygon:  'https://app.compound.finance/?market=usdc-polygon',
  }[chain] || 'https://app.compound.finance/'),
  'compound-v2':       () => 'https://app.compound.finance/',
  'morpho-blue':       () => 'https://app.morpho.org/earn',
  'morpho':            () => 'https://app.morpho.org/earn',
  'spark':             () => 'https://app.spark.fi/savings',
  'sparklend':         () => 'https://app.spark.fi/savings',
  'fluid': chain => chain === 'Arbitrum'
    ? 'https://fluid.instadapp.io/lending/arbitrum'
    : 'https://fluid.instadapp.io/lending/mainnet',
  'euler':             () => 'https://app.euler.finance/',
  'euler-v2':          () => 'https://app.euler.finance/',
  'kamino':            () => 'https://app.kamino.finance/lending',
  'kamino-lend':       () => 'https://app.kamino.finance/lending',
  'marginfi':          () => 'https://app.marginfi.com/',
  'drift-protocol':    () => 'https://app.drift.trade/earn',
  'solend':            () => 'https://solend.fi/dashboard',
  'venus': chain => chain === 'Avalanche'
    ? 'https://app.venus.io/markets?chainId=43114'
    : 'https://app.venus.io/markets',
  'benqi':             () => 'https://app.benqi.fi/markets',
  'moonwell': chain => chain === 'Base'
    ? 'https://moonwell.fi/markets/supply/base/usdc'
    : 'https://moonwell.fi/markets',
  'radiant':           () => 'https://app.radiant.capital/',
  'silo':              () => 'https://app.silo.finance/',
  'clearpool':         () => 'https://app.clearpool.finance/earn',
  'exactlyprotocol':   () => 'https://exact.ly/',
  'seamless-protocol': () => 'https://app.seamlessprotocol.com/',
  'maple':             () => 'https://app.maple.finance/earn',
  'sprinter':          () => 'https://app.sprinter.tech/stash',
  'ember-protocol':    () => 'https://app.emberprotocol.xyz/',
  'grove-finance':     () => 'https://app.grove.finance/',
  'yieldseeker':       () => 'https://app.yieldseeker.xyz/',
  'upshift':           () => 'https://app.upshift.finance/',
  'veda':              () => 'https://app.veda.tech/',
  'lagoon':            () => 'https://app.lagoon.finance/',
};

function resolveUrl(pool) {
  /* 1. Use URL the protocol itself registered with DefiLlama */
  if (pool.url && pool.url.startsWith('http')) return pool.url;
  /* 2. Our curated map */
  const entry = FALLBACK_URLS[pool.project];
  if (!entry) return null;
  return typeof entry === 'function' ? entry(pool.chain) : entry;
}

function toMarket(pool) {
  const apy  = parseFloat((pool.apy || 0).toFixed(2));
  const tvlM = Math.round((pool.tvlUsd || 0) / 1e6);

  const util = pool.utilization != null
    ? Math.min(Math.round(pool.utilization * 100), 99)
    : 75;

  const trend = pool.apyMean30d != null
    ? parseFloat((apy - pool.apyMean30d).toFixed(2))
    : 0;

  const riskObj = window.scoreRisk(pool);

  const logoUrl = `https://icons.llamao.fi/icons/protocols/${pool.project}.png`;
  const logoSvg = INLINE_LOGOS[pool.project] || null;
  const url     = resolveUrl(pool);

  return {
    protocol:   protocolName(pool.project),
    slug:       pool.project,
    chain:      pool.chain,
    token:      pool.symbol.toUpperCase().includes('USDC') ? 'USDC' : 'USDT',
    apy,
    tvl:        tvlM,
    util,
    risk:       riskObj.tier,
    riskScore:  riskObj.score,
    riskDetail: riskObj.penalties,
    trend,
    sigma:      pool.sigma,
    count:      pool.count,
    prediction: pool.predictions?.predictedClass || null,
    logoUrl,
    logoSvg,   // inline SVG string or null
    url,
  };
}

window.MARKETS = [];

window.fetchMarkets = async function () {
  const res  = await fetch('https://yields.llama.fi/pools');
  if (!res.ok) throw new Error('DefiLlama API error: ' + res.status);
  const json = await res.json();

  const pools = (json.data || []).filter(p => {
    if (!ALLOWED_CHAINS.has(p.chain))      return false;
    if (p.status !== 'active' && p.status) return false;
    if (!p.symbol)                          return false;
    const sym = p.symbol.toUpperCase();
    if (sym !== 'USDC' && sym !== 'USDT')  return false;
    if ((p.apy || 0) <= 0)                 return false;
    if ((p.tvlUsd || 0) < 1_000_000)      return false;
    return true;
  });

  const seen = new Map();
  pools.forEach(p => {
    const key = `${p.project}|${p.chain}|${p.symbol.toUpperCase()}`;
    if (!seen.has(key) || p.tvlUsd > seen.get(key).tvlUsd) {
      seen.set(key, p);
    }
  });

  window.MARKETS = Array.from(seen.values())
    .map(toMarket)
    .sort((a, b) => b.apy - a.apy);

  return window.MARKETS;
};
