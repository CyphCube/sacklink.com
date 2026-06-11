/* Sacklink — RWA Page Data
   Fetches Real World Asset yield pools from DefiLlama.
   Risk scoring handled by risk.js. */

const RWA_ALLOWED_CHAINS = new Set([
  'Ethereum', 'Solana', 'BSC', 'Aptos', 'Stellar',
  'Avalanche', 'XRPL', 'Sui', 'Base'
]);

/* RWA category keywords — DefiLlama tags pools with category field */
const RWA_CATEGORIES = new Set([
  'RWA', 'Real World Assets', 'Tokenized Treasury',
  'Tokenized Stocks', 'Tokenized Commodities',
  'Undercollateralized Lending', 'Institutional'
]);

/* Tokens to exclude — stablecoins and crypto that slip through RWA filters */
const RWA_EXCLUDED_TOKENS = new Set([
  'USDC', 'USDT', 'YNETHX', 'YNLSDE', 'YNETH',
]);

/* Known RWA project slugs as fallback if category not set */
const RWA_PROJECTS = new Set([
  'ondo-finance', 'ondo', 'maple', 'maple-finance',
  'centrifuge', 'goldfinch', 'truefi', 'credix',
  'clearpool', 'superstate', 'backed-finance',
  'openeden', 'matrixdock', 'spiko', 'hashnote',
  'steakhouse', 'bprotocol', 'janus-henderson',
  'franklin-templeton', 'blackrock-buidl', 'buidl',
  'mountain-protocol', 'm0', 'agora', 'midas',
  'dinari', 'swarm', 'tangible', 'parcl',
  'realtoken', 'lofty', 'landshare', 'houseloan',
  'yieldnest', 'securitize', 'tokeny', 'libre',
  'etherfuse', 'popcorn', 'flux-finance',
]);

const RWA_PROTOCOL_NAMES = {
  'ondo-finance':        'Ondo Finance',
  'ondo':                'Ondo Finance',
  'maple':               'Maple Finance',
  'maple-finance':       'Maple Finance',
  'goldfinch':           'Goldfinch',
  'clearpool':           'Clearpool',
  'superstate':          'Superstate',
  'backed-finance':      'Backed Finance',
  'openeden':            'OpenEden',
  'matrixdock':          'MatrixDock',
  'spiko':               'Spiko',
  'hashnote':            'Hashnote',
  'mountain-protocol':   'Mountain Protocol',
  'midas':               'Midas',
  'dinari':              'Dinari',
  'swarm':               'Swarm',
  'flux-finance':        'Flux Finance',
  'etherfuse':           'Etherfuse',
  'franklin-templeton':  'Franklin Templeton',
  'blackrock-buidl':     'BlackRock BUIDL',
  'buidl':               'BlackRock BUIDL',
  'agora':               'Agora',
  'm0':                  'M0',
  'truefi':              'TrueFi',
  'yieldnest':           'YieldNest',
  'libre':               'Libre',
  'parcl':               'Parcl',
  'steakhouse':          'Steakhouse',
};

function rwaProtocolName(slug) {
  return RWA_PROTOCOL_NAMES[slug] ||
    slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function rwaLogoUrl(slug) {
  return `https://icons.llamao.fi/icons/protocols/${slug}?w=48&h=48`;
}

const RWA_FALLBACK_URLS = {
  'ondo-finance':       () => 'https://ondo.finance/ousg',
  'ondo':               () => 'https://ondo.finance/ousg',
  'maple':              () => 'https://app.maple.finance/earn',
  'maple-finance':      () => 'https://app.maple.finance/earn',
  'goldfinch':          () => 'https://app.goldfinch.finance/earn',
  'clearpool':          () => 'https://app.clearpool.finance/earn',
  'superstate':         () => 'https://app.superstate.co/',
  'backed-finance':     () => 'https://backed.fi/',
  'openeden':           () => 'https://app.openeden.com/',
  'matrixdock':         () => 'https://www.matrixdock.com/',
  'spiko':              () => 'https://app.spiko.io/',
  'hashnote':           () => 'https://app.hashnote.com/',
  'mountain-protocol':  () => 'https://mountainprotocol.com/',
  'midas':              () => 'https://app.midas.app/',
  'dinari':             () => 'https://app.dinari.com/',
  'swarm':              () => 'https://swarm.com/',
  'flux-finance':       () => 'https://fluxfinance.com/lend',
  'etherfuse':          () => 'https://etherfuse.com/',
  'franklin-templeton': () => 'https://www.franklintempleton.com/',
  'blackrock-buidl':    () => 'https://securitize.io/invest/BlackRock-USD-Institutional-Digital-Liquidity-Fund',
  'buidl':              () => 'https://securitize.io/invest/BlackRock-USD-Institutional-Digital-Liquidity-Fund',
  'agora':              () => 'https://agora.finance/',
  'm0':                 () => 'https://m0.org/',
  'truefi':             () => 'https://truefi.io/',
  'yieldnest':          () => 'https://app.yieldnest.finance/',
  'libre':              () => 'https://libre.xyz/',
};

function rwaResolveUrl(pool) {
  if (pool.url && pool.url.startsWith('http')) return pool.url;
  const entry = RWA_FALLBACK_URLS[pool.project];
  if (entry) return typeof entry === 'function' ? entry(pool.chain) : entry;
  return null;
}

function rwaToMarket(pool) {
  const apy     = parseFloat((pool.apy || 0).toFixed(2));
  const tvlM    = parseFloat(((pool.tvlUsd || 0) / 1e6).toFixed(4));
  const util    = pool.utilization != null
    ? Math.min(Math.round(pool.utilization * 100), 99) : 75;
  const trend   = pool.apyMean30d != null
    ? parseFloat((apy - pool.apyMean30d).toFixed(2)) : 0;
  const riskObj = window.scoreRisk(pool);

  return {
    protocol:   rwaProtocolName(pool.project),
    slug:       pool.project,
    chain:      pool.chain,
    token:      pool.symbol.toUpperCase(),
    apy,
    tvl:        tvlM,
    util,
    risk:       riskObj.tier,
    riskScore:  riskObj.score,
    riskDetail: riskObj.penalties,
    trend,
    logoUrl:    rwaLogoUrl(pool.project),
    url:        rwaResolveUrl(pool),
  };
}

window.RWA_MARKETS = [];

window.fetchRwaMarkets = async function () {
  const res  = await fetch('https://yields.llama.fi/pools');
  if (!res.ok) throw new Error('DefiLlama API error: ' + res.status);
  const json = await res.json();

  const pools = (json.data || []).filter(p => {
    if (!RWA_ALLOWED_CHAINS.has(p.chain))      return false;
    if (p.status !== 'active' && p.status)      return false;
    if (!p.symbol)                               return false;
    if ((p.apy || 0) <= 0)                      return false;
    if ((p.tvlUsd || 0) < 1_000_000)           return false;
    if (RWA_EXCLUDED_TOKENS.has(p.symbol.toUpperCase())) return false;
    /* Match by category or known project slug */
    const cat = (p.category || '').trim();
    if (RWA_CATEGORIES.has(cat)) return true;
    if (RWA_PROJECTS.has(p.project)) return true;
    return false;
  });

  const seen = new Map();
  pools.forEach(p => {
    const key = `${p.project}|${p.chain}|${p.symbol.toUpperCase()}`;
    if (!seen.has(key) || p.tvlUsd > seen.get(key).tvlUsd) {
      seen.set(key, p);
    }
  });

  let _id = 30001;
  window.RWA_MARKETS = Array.from(seen.values())
    .map(rwaToMarket)
    .sort((a, b) => b.apy - a.apy)
    .map(r => ({ ...r, id: _id++ }));

  return window.RWA_MARKETS;
};
