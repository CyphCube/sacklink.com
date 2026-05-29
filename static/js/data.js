/* yield.fi — Real Data via DefiLlama Yields API
   https://yields.llama.fi/pools
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

const PROTOCOL_NAMES = {
  'aave-v3':            'Aave v3',
  'aave-v2':            'Aave v2',
  'compound-v3':        'Compound v3',
  'compound-v2':        'Compound v2',
  'morpho-blue':        'Morpho Blue',
  'morpho':             'Morpho',
  'spark':              'Spark',
  'sparklend':          'Spark',
  'fluid':              'Fluid',
  'euler':              'Euler',
  'euler-v2':           'Euler v2',
  'kamino':             'Kamino',
  'kamino-lend':        'Kamino',
  'marginfi':           'MarginFi',
  'drift-protocol':     'Drift',
  'solend':             'Solend',
  'venus':              'Venus',
  'benqi':              'Benqi',
  'moonwell':           'Moonwell',
  'radiant':            'Radiant',
  'silo':               'Silo',
  'clearpool':          'Clearpool',
  'exactlyprotocol':    'Exactly',
  'seamless-protocol':  'Seamless',
  'maple':              'Maple',
};

function protocolName(slug) {
  return PROTOCOL_NAMES[slug] ||
    slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

/* Direct product URLs — lending pages for each protocol */
const PRODUCT_URLS = {
  'aave-v3':           'https://app.aave.com/',
  'aave-v2':           'https://app.aave.com/',
  'compound-v3':       'https://app.compound.finance/',
  'compound-v2':       'https://app.compound.finance/',
  'morpho-blue':       'https://app.morpho.org/',
  'morpho':            'https://app.morpho.org/',
  'spark':             'https://app.spark.fi/',
  'sparklend':         'https://app.spark.fi/',
  'fluid':             'https://fluid.instadapp.io/',
  'euler':             'https://app.euler.finance/',
  'euler-v2':          'https://app.euler.finance/',
  'kamino':            'https://app.kamino.finance/',
  'kamino-lend':       'https://app.kamino.finance/',
  'marginfi':          'https://app.marginfi.com/',
  'drift-protocol':    'https://app.drift.trade/',
  'solend':            'https://solend.fi/dashboard',
  'venus':             'https://app.venus.io/markets',
  'benqi':             'https://app.benqi.fi/markets',
  'moonwell':          'https://moonwell.fi/markets',
  'radiant':           'https://app.radiant.capital/',
  'silo':              'https://app.silo.finance/',
  'clearpool':         'https://app.clearpool.finance/',
  'exactlyprotocol':   'https://exact.ly/',
  'seamless-protocol': 'https://app.seamlessprotocol.com/',
  'maple':             'https://app.maple.finance/',
};

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

  // Protocol logo from DefiLlama's CDN
  const logoUrl = `https://icons.llamao.fi/icons/protocols/${pool.project}.png`;

  // Direct link to this pool on DefiLlama (pool field is the UUID)
  const poolUrl = `https://defillama.com/yields/pool/${pool.pool}`;

  // Best-effort direct product URL per protocol
  const productUrl = PRODUCT_URLS[pool.project] || null;

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
    poolUrl,
    productUrl,
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

  // Deduplicate: keep highest-TVL pool per (project, chain, token)
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
