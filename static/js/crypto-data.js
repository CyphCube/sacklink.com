/* yield.fi — Cryptocurrencies Page Data
   Fetches ETH, SOL, SUI, HYPE lending pools from DefiLlama.
   Risk scoring handled by risk.js. */

const CRYPTO_ALLOWED_CHAINS = new Set([
  'Ethereum', 'Arbitrum', 'Base', 'Polygon',
  'Avalanche', 'Solana', 'BSC', 'Sui', 'Hyperliquid', 'Hyperliquid L1'
]);

const CRYPTO_TOKENS = new Set(['ETH', 'WETH', 'SOL', 'WSOL', 'SUI', 'HYPE']);

const CRYPTO_TOKEN_DISPLAY = {
  'ETH': 'ETH', 'WETH': 'ETH',
  'SOL': 'SOL', 'WSOL': 'SOL',
  'SUI': 'SUI',
  'HYPE': 'HYPE',
};

const CRYPTO_PROTOCOL_NAMES = {
  'aave-v3':           'Aave v3',
  'aave-v2':           'Aave v2',
  'compound-v3':       'Compound v3',
  'morpho-blue':       'Morpho Blue',
  'morpho':            'Morpho',
  'spark':             'SparkLend',
  'sparklend':         'SparkLend',
  'fluid':             'Fluid',
  'fluid-lending':     'Fluid Lending',
  'euler-v2':          'Euler v2',
  'kamino':            'Kamino',
  'kamino-lend':       'Kamino',
  'marginfi':          'MarginFi',
  'drift-protocol':    'Drift',
  'solend':            'Solend',
  'venus':             'Venus',
  'benqi':             'Benqi',
  'moonwell':          'Moonwell',
  'moonwell-lending':  'Moonwell Lending',
  'radiant':           'Radiant',
  'silo':              'Silo',
  'seamless-protocol': 'Seamless',
  'hyperlend':         'HyperLend',
  'felix':             'Felix',
  'harmonix-finance':  'Harmonix Finance',
  'harmonix':          'Harmonix Finance',
  'hyperlend':         'HyperLend',
  'hyperlend-pooled':  'HyperLend',
  'hypurrfi':          'HypurrFi',
  'hypurrfi-pooled':   'HypurrFi',
  'felix':             'Felix',
  'hyperdrive':        'Hyperdrive',
  'navi-protocol':     'Navi Lending',
  'navi':              'Navi Lending',
  'scallop-lend':      'Scallop Lend',
  'scallop':           'Scallop Lend',
};

function cryptoProtocolName(slug) {
  return CRYPTO_PROTOCOL_NAMES[slug] ||
    slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function cryptoLogoUrl(slug) {
  return `https://icons.llamao.fi/icons/protocols/${slug}?w=48&h=48`;
}

/* Specific per-market URLs for crypto tokens (slug|Chain|TOKEN) */
const CRYPTO_MARKET_URLS = {
  'aave-v3|Base|ETH':                          'https://app.aave.com/reserve-overview/?underlyingAsset=0x4200000000000000000000000000000000000006&marketName=proto_base_v3',
  'aave-v3|Ethereum|ETH':                      'https://app.aave.com/reserve-overview/?underlyingAsset=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2&marketName=proto_mainnet_v3',
  'aave-v3|Arbitrum|ETH':                      'https://app.aave.com/reserve-overview/?underlyingAsset=0x82af49447d8a07e3bd95bd0d56f35241523fbab1&marketName=proto_arbitrum_v3',
  'aave-v3|BSC|ETH':                           'https://app.aave.com/reserve-overview/?underlyingAsset=0x2170ed0880ac9a755fd29b2688956bd959f933f8&marketName=proto_bnb_v3',
  'aave-v3|Polygon|ETH':                       'https://app.aave.com/reserve-overview/?underlyingAsset=0x7ceb23fd6bc0add59e62ac25578270cff1b9f619&marketName=proto_polygon_v3',
  'aave-v4|Ethereum|ETH':                      'https://pro.aave.com/explore/asset/1/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  'autofinance|Ethereum|ETH':                  'https://app.auto.finance/pools/autoETH',
  'bancor-v3|Ethereum|ETH':                    'https://app.bancor.network/earn',
  'bancor|Ethereum|ETH':                       'https://app.bancor.network/earn',
  'compound-v3|Ethereum|ETH':                  'https://v3-app.compound.finance/markets/weth-mainnet',
  'dolomite|Arbitrum|ETH':                     'https://app.dolomite.io/earn',
  'dolomite|Ethereum|ETH':                     'https://app.dolomite.io/earn',
  'extra-finance-leverage-farming|Base|ETH':   'https://app.extrafi.io/lend',
  'fluid-lending|Ethereum|ETH':                'https://fluid.io/vaults/1/11',
  'fluid-lending|Ethereum|WETH':               'https://fluid.io/lending/1/WETH',
  'fluid-lending|Base|ETH':                    'https://fluid.io/vaults/8453/1',
  'fluid-lending|Arbitrum|ETH':                'https://fluid.io/vaults/42161/1',
  'fluid-lite|Ethereum|ETH':                   'https://fluid.io/lite/1/ETH',
  'fusion-by-ipor|Base|ETH':                   'https://app.ipor.io/fusion/base/0x17d0f109ee895bad0b68aa104aa72bd0b003ad8e',
  'harvest-finance|Base|ETH':                  'https://app.harvest.finance/base/0x7872893e528Fe2c0829e405960db5B742112aa97',
  'lazy-summer-protocol|Ethereum|ETH':         'https://summer.fi/earn/mainnet/position/0x2e6abcbcced9af05bc3b8a4908e0c98c29a88e10',
  'moonwell-lending|Base|ETH':                 'https://moonwell.fi/markets/supply/base/eth',
  'moonwell|Base|ETH':                         'https://moonwell.fi/markets/supply/base/eth',
  'spark-savings|Ethereum|ETH':                'https://app.spark.fi/savings/mainnet/speth',
  'spark|Ethereum|ETH':                        'https://app.spark.fi/markets/1/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  'sparklend|Ethereum|ETH':                    'https://app.spark.fi/markets/1/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  'venus-core-pool|BSC|ETH':                   'https://venus.io/markets',
  'venus|BSC|ETH':                             'https://venus.io/markets',
  'vesper|Ethereum|ETH':                       'https://app.vesper.finance/eth/pools/0xd1C117319B3595fbc39b471AB1fd485629eb05F2',
  'yearn-finance|Ethereum|ETH':                'https://yearn.fi/v3/1/0xc56413869c6CDf96496f2b1eF801fEDBdFA7dDB0',
  'yo-protocol|Base|ETH':                      'https://app.yo.xyz/vault/base/yoeth',
  'yo-protocol|Ethereum|ETH':                  'https://app.yo.xyz/vault/ethereum/yoeth',
};

const CRYPTO_FALLBACK_URLS = {
  /* ETH pools */
  'aave-v3':           chain => ({
    Ethereum:  'https://app.aave.com/markets/?marketName=proto_mainnet_v3',
    Arbitrum:  'https://app.aave.com/markets/?marketName=proto_arbitrum_v3',
    Base:      'https://app.aave.com/markets/?marketName=proto_base_v3',
    Polygon:   'https://app.aave.com/markets/?marketName=proto_polygon_v3',
    Avalanche: 'https://app.aave.com/markets/?marketName=proto_avalanche_v3',
    Optimism:  'https://app.aave.com/markets/?marketName=proto_optimism_v3',
  }[chain] || 'https://app.aave.com/markets/'),
  'aave-v2':           () => 'https://app.aave.com/markets/?marketName=proto_mainnet',
  'compound-v3':       () => 'https://app.compound.finance/',
  'morpho-blue':       () => 'https://app.morpho.org/earn',
  'morpho':            () => 'https://app.morpho.org/earn',
  'spark':             () => 'https://app.spark.fi/',
  'sparklend':         () => 'https://app.spark.fi/',
  'fluid':             () => 'https://fluid.instadapp.io/',
  'fluid-lending':     () => 'https://fluid.io/',
  'fluid-lite':        () => 'https://fluid.io/',
  'euler-v2':          () => 'https://app.euler.finance/',
  'seamless-protocol': () => 'https://app.seamlessprotocol.com/',
  'exactly':           () => 'https://exact.ly/',
  'exactlyprotocol':   () => 'https://exact.ly/',
  'dolomite':          () => 'https://app.dolomite.io/balances',
  'silo':              () => 'https://app.silo.finance/',
  'silo-v2':           () => 'https://v2.silo.finance/',
  'vesper':            () => 'https://app.vesper.finance/',
  'yearn-finance':     () => 'https://yearn.fi/vaults',
  'beefy':             () => 'https://app.beefy.com/',
  'harvest-finance':   () => 'https://app.harvest.finance/',
  'gains-network':     () => 'https://gains.trade/vaults',
  'radiant':           () => 'https://app.radiant.capital/',
  'across':            () => 'https://across.to/pool',
  'fusion-by-ipor':    () => 'https://app.ipor.io/fusion',
  /* SOL pools */
  'kamino':            () => 'https://app.kamino.finance/lending',
  'kamino-lend':       () => 'https://app.kamino.finance/lending',
  'marginfi':          () => 'https://app.marginfi.com/',
  'drift-protocol':    () => 'https://app.drift.trade/earn',
  'solend':            () => 'https://solend.fi/dashboard',
  'jupiter-lend':      () => 'https://jup.ag/lend',
  'loopscale':         () => 'https://app.loopscale.com/',
  /* SUI pools */
  'navi-protocol':     () => 'https://app.naviprotocol.io/',
  'navi':              () => 'https://app.naviprotocol.io/',
  'scallop-lend':      () => 'https://app.scallop.io/',
  'scallop':           () => 'https://app.scallop.io/',
  'kai-finance':       () => 'https://kai.finance/vaults',
  'kai':               () => 'https://kai.finance/vaults',
  'current':           () => 'https://app.current.finance/',
  'ember-protocol':    chain => chain === 'Sui'
    ? 'https://ember.so/earn/eTHIRD'
    : 'https://ember.so/earn/pALPHA',
  /* HYPE pools */
  'hyperlend':         () => 'https://app.hyperlend.finance/',
  'felix':             () => 'https://app.felix.finance/',
  'hyperunit':         () => 'https://hyperunit.xyz/',
  'harmonix-finance':  () => 'https://harmonix.fi/',
  'harmonix':          () => 'https://harmonix.fi/',
  'hyperlend':         () => 'https://app.hyperlend.finance/',
  'hyperlend-pooled':  () => 'https://app.hyperlend.finance/',
  'hypurrfi':          () => 'https://app.hypurr.fi/',
  'hypurrfi-pooled':   () => 'https://app.hypurr.fi/',
  'felix':             () => 'https://app.felix.finance/',
  'hyperdrive':        () => 'https://hyperdrive.fi/',
};

function cryptoResolveUrl(pool) {
  const sym   = pool.symbol.toUpperCase();
  const token = CRYPTO_TOKEN_DISPLAY[sym] || sym;
  const mkey  = `${pool.project}|${pool.chain}|${token}`;
  if (CRYPTO_MARKET_URLS[mkey]) return CRYPTO_MARKET_URLS[mkey];
  if (pool.url && pool.url.startsWith('http')) return pool.url;
  const entry = CRYPTO_FALLBACK_URLS[pool.project];
  if (entry) return typeof entry === 'function' ? entry(pool.chain) : entry;
  return null;
}

function cryptoToMarket(pool) {
  const sym      = pool.symbol.toUpperCase();
  const token    = CRYPTO_TOKEN_DISPLAY[sym] || sym;
  const apy      = parseFloat((pool.apy || 0).toFixed(2));
  const tvlM     = parseFloat(((pool.tvlUsd || 0) / 1e6).toFixed(4));
  const util     = pool.utilization != null
    ? Math.min(Math.round(pool.utilization * 100), 99) : 75;
  const trend    = pool.apyMean30d != null
    ? parseFloat((apy - pool.apyMean30d).toFixed(2)) : 0;
  const riskObj  = window.scoreRisk(pool);

  return {
    protocol:   cryptoProtocolName(pool.project),
    slug:       pool.project,
    chain:      pool.chain,
    token,
    apy,
    tvl:        tvlM,
    util,
    risk:       riskObj.tier,
    riskScore:  riskObj.score,
    riskDetail: riskObj.penalties,
    trend,
    logoUrl:    cryptoLogoUrl(pool.project),
    url:        cryptoResolveUrl(pool),
  };
}

window.CRYPTO_MARKETS = [];

window.fetchCryptoMarkets = async function () {
  const res  = await fetch('https://yields.llama.fi/pools');
  if (!res.ok) throw new Error('DefiLlama API error: ' + res.status);
  const json = await res.json();

  const pools = (json.data || []).filter(p => {
    if (!CRYPTO_ALLOWED_CHAINS.has(p.chain))      return false;
    if (p.status !== 'active' && p.status)         return false;
    if (!p.symbol)                                  return false;
    if (!CRYPTO_TOKENS.has(p.symbol.toUpperCase())) return false;
    if ((p.apy || 0) <= 0)                         return false;
    if ((p.tvlUsd || 0) < 1_000_000)              return false;
    return true;
  });

  // No deduplication — show all pools, different pools can have same protocol/chain/token
  let _id = 20001;
  window.CRYPTO_MARKETS = pools
    .map(cryptoToMarket)
    .sort((a, b) => b.apy - a.apy)
    .map(r => ({ ...r, id: _id++ }));

  return window.CRYPTO_MARKETS;
};
