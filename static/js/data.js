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
  'aave-v3':                        'Aave v3',
  'aave-v2':                        'Aave v2',
  'compound-v3':                    'Compound v3',
  'compound-v2':                    'Compound v2',
  'morpho-blue':                    'Morpho Blue',
  'morpho':                         'Morpho',
  'spark':                          'Spark',
  'spark-savings':                  'Spark Savings',
  'sparklend':                      'Spark',
  'fluid':                          'Fluid',
  'fluid-lite':                     'Fluid Lite',
  'fluid-lending':                  'Fluid Lending',
  'euler':                          'Euler',
  'euler-v2':                       'Euler v2',
  'kamino':                         'Kamino',
  'kamino-lend':                    'Kamino',
  'marginfi':                       'MarginFi',
  'drift-protocol':                 'Drift',
  'solend':                         'Solend',
  'venus':                          'Venus',
  'benqi':                          'Benqi',
  'benqi-lending':                  'Benqi Lending',
  'moonwell':                       'Moonwell',
  'moonwell-lending':               'Moonwell Lending',
  'radiant':                        'Radiant',
  'silo':                           'Silo',
  'clearpool':                      'Clearpool',
  'exactlyprotocol':                'Exactly',
  'seamless-protocol':              'Seamless',
  'maple':                          'Maple',
  'sprinter':                       'Sprinter',
  'lazy':                           'Lazy',
  'lazy-summer-protocol':           'Lazy Summer',
  'ember-protocol':                 'Ember',
  'avantis':                        'Avantis',
  'bracket-vaults':                 'Bracket Vaults',
  'yieldseeker':                    'YieldSeeker',
  'goldfinch':                      'Goldfinch',
  'harvest-finance':                'Harvest Finance',
  'dolomite':                       'Dolomite',
  'zerobase-cedefi':                'Zerobase',
  'autofinance':                    'Autofinance',
  'loopscale':                      'Loopscale',
  'deltaprime':                     'Deltaprime',
  'extra-finance-leverage-farming': 'Extra Finance',
  'gains-network':                  'Gains Network',
  'jupiter-lend':                   'Jupiter Lend',
  'beefy':                          'Beefy',
  'flux-finance':                   'Flux Finance',
  'ample':                          'Ample',
  'folks-finance-xchain':           'Folks Finance',
  'centrifuge-protocol':            'Centrifuge',
  'yo-protocol':                    'Yo Protocol',
  'termmax':                        'Termmax',
  'across':                         'Across',
  'yearn-finance':                  'Yearn Finance',
  'fusion-by-ipor':                 'Fusion by IPOR',
  'spectra-metavaults':             'Spectra',
  'save':                           'Save',
  'vesper':                         'Vesper',
  'lista-lending':                  'Lista Lending',
  'credix':                         'Credix',
  'allbridge-classic':              'Allbridge',
  'grove-finance':                  'Grove',
  'upshift':                        'Upshift',
  'veda':                           'Veda',
  'concrete':                       'Concrete',
  'lagoon':                         'Lagoon',
};

function protocolName(slug) {
  return PROTOCOL_NAMES[slug] ||
    slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

/*
 * Logo slug map: project slug → DefiLlama CDN slug (when different).
 * All entries below resolve to https://icons.llamao.fi/icons/protocols/{cdnSlug}?w=48&h=48
 * If a slug isn't listed here, we use the project slug directly.
 */
const LOGO_SLUGS = {
  'aave-v3':                        'aave-v3',
  'aave-v2':                        'aave-v2',
  'compound-v3':                    'compound-v3',
  'compound-v2':                    'compound-v3',   // v2 has no separate icon
  'morpho-blue':                    'morpho-blue',
  'morpho':                         'morpho-blue',
  'spark':                          'spark',
  'spark-savings':                  'spark-savings',
  'sparklend':                      'spark',
  'fluid':                          'fluid',
  'fluid-lite':                     'fluid-lite',
  'fluid-lending':                  'fluid-lending',
  'euler-v2':                       'euler-v2',
  'kamino':                         'kamino',
  'kamino-lend':                    'kamino',
  'benqi':                          'benqi-lending',
  'benqi-lending':                  'benqi-lending',
  'moonwell':                       'moonwell-lending',
  'moonwell-lending':               'moonwell-lending',
  'sprinter':                       'sprinter',
  'lazy':                           'lazy',
  'lazy-summer-protocol':           'lazy-summer-protocol',
  'ember-protocol':                 'ember-protocol',
  'avantis':                        'avantis',
  'bracket-vaults':                 'bracket-vaults',
  'yieldseeker':                    'yieldseeker',
  'goldfinch':                      'goldfinch',
  'harvest-finance':                'harvest-finance',
  'dolomite':                       'dolomite',
  'zerobase-cedefi':                'zerobase-cedefi',
  'autofinance':                    'autofinance',
  'loopscale':                      'loopscale',
  'deltaprime':                     'deltaprime',
  'extra-finance-leverage-farming': 'extra-finance-leverage-farming',
  'gains-network':                  'gains-network',
  'jupiter-lend':                   'jupiter-lend',
  'beefy':                          'beefy',
  'maple':                          'maple',
  'flux-finance':                   'flux-finance',
  'ample':                          'ample',
  'folks-finance-xchain':           'folks-finance-xchain',
  'centrifuge-protocol':            'centrifuge-protocol',
  'yo-protocol':                    'yo-protocol',
  'termmax':                        'termmax',
  'across':                         'across',
  'yearn-finance':                  'yearn-finance',
  'fusion-by-ipor':                 'fusion-by-ipor',
  'spectra-metavaults':             'spectra-metavaults',
  'save':                           'save',
  'vesper':                         'vesper',
  'lista-lending':                  'lista-lending',
  'credix':                         'credix',
  'allbridge-classic':              'allbridge-classic',
};

function logoUrl(slug) {
  const cdnSlug = LOGO_SLUGS[slug] || slug;
  return `https://icons.llamao.fi/icons/protocols/${cdnSlug}?w=48&h=48`;
}

/*
 * Fallback URLs — used when pool.url is absent from the API response.
 * Priority: pool.url → this map → null (row not clickable)
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
  'compound-v2':                    () => 'https://app.compound.finance/',
  'morpho-blue':                    () => 'https://app.morpho.org/earn',
  'morpho':                         () => 'https://app.morpho.org/earn',
  'spark':                          () => 'https://app.spark.fi/savings',
  'spark-savings':                  () => 'https://app.spark.fi/savings',
  'sparklend':                      () => 'https://app.spark.fi/savings',
  'fluid': chain => chain === 'Arbitrum'
    ? 'https://fluid.instadapp.io/lending/arbitrum'
    : 'https://fluid.instadapp.io/lending/mainnet',
  'fluid-lite':                     () => 'https://fluid.instadapp.io/',
  'fluid-lending':                  () => 'https://fluid.instadapp.io/',
  'euler':                          () => 'https://app.euler.finance/',
  'euler-v2':                       () => 'https://app.euler.finance/',
  'kamino':                         () => 'https://app.kamino.finance/lending',
  'kamino-lend':                    () => 'https://app.kamino.finance/lending',
  'marginfi':                       () => 'https://app.marginfi.com/',
  'drift-protocol':                 () => 'https://app.drift.trade/earn',
  'solend':                         () => 'https://solend.fi/dashboard',
  'venus': chain => chain === 'Avalanche'
    ? 'https://app.venus.io/markets?chainId=43114'
    : 'https://app.venus.io/markets',
  'benqi':                          () => 'https://app.benqi.fi/markets',
  'benqi-lending':                  () => 'https://app.benqi.fi/markets',
  'moonwell':                       () => 'https://moonwell.fi/markets',
  'moonwell-lending':               () => 'https://moonwell.fi/markets',
  'radiant':                        () => 'https://app.radiant.capital/',
  'silo':                           () => 'https://app.silo.finance/',
  'clearpool':                      () => 'https://app.clearpool.finance/earn',
  'exactlyprotocol':                () => 'https://exact.ly/',
  'seamless-protocol':              () => 'https://app.seamlessprotocol.com/',
  'maple':                          () => 'https://app.maple.finance/earn',
  'sprinter':                       () => 'https://app.sprinter.tech/stash',
  'lazy':                           () => 'https://lazy.finance/',
  'lazy-summer-protocol':           () => 'https://app.summer.fi/',
  'ember-protocol':                 () => 'https://app.emberprotocol.xyz/',
  'avantis':                        () => 'https://www.avantisfi.com/',
  'bracket-vaults':                 () => 'https://bracketvaults.com/',
  'yieldseeker':                    () => 'https://app.yieldseeker.xyz/',
  'goldfinch':                      () => 'https://app.goldfinch.finance/earn',
  'harvest-finance':                () => 'https://app.harvest.finance/',
  'dolomite':                       () => 'https://app.dolomite.io/balances',
  'zerobase-cedefi':                () => 'https://app.zerobase.fi/',
  'autofinance':                    () => 'https://autofinance.fi/',
  'loopscale':                      () => 'https://app.loopscale.com/',
  'deltaprime':                     () => 'https://app.deltaprime.io/',
  'extra-finance-leverage-farming': () => 'https://app.extrafi.io/lend',
  'gains-network':                  () => 'https://gainsnetwork.io/vault/',
  'jupiter-lend':                   () => 'https://jup.ag/lend',
  'beefy':                          () => 'https://app.beefy.com/',
  'flux-finance':                   () => 'https://fluxfinance.com/',
  'ample':                          () => 'https://ample.finance/',
  'folks-finance-xchain':           () => 'https://app.folks.finance/lend',
  'centrifuge-protocol':            () => 'https://app.centrifuge.io/',
  'yo-protocol':                    () => 'https://yo.xyz/',
  'termmax':                        () => 'https://termmax.fi/',
  'across':                         () => 'https://across.to/',
  'yearn-finance':                  () => 'https://yearn.fi/vaults',
  'fusion-by-ipor':                 () => 'https://fusion.ipor.io/',
  'spectra-metavaults':             () => 'https://app.spectra.finance/',
  'save':                           () => 'https://www.save.finance/',
  'vesper':                         () => 'https://vesper.finance/',
  'lista-lending':                  () => 'https://lista.org/lending',
  'credix':                         () => 'https://app.credix.finance/',
  'allbridge-classic':              () => 'https://app.allbridge.io/',
  'grove-finance':                  () => 'https://app.grove.finance/',
  'upshift':                        () => 'https://app.upshift.finance/',
  'veda':                           () => 'https://app.veda.tech/',
  'lagoon':                         () => 'https://app.lagoon.finance/',
};

function resolveUrl(pool) {
  if (pool.url && pool.url.startsWith('http')) return pool.url;
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
    logoUrl:    logoUrl(pool.project),
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
