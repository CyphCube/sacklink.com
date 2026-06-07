/* yield.fi — Real Data via DefiLlama Yields API
   Risk scoring handled by risk.js (loaded before this file). */

window.CHAIN_STYLES = {
  Ethereum:  { color: '#627EEA' },
  Arbitrum:  { color: '#12AAFF' },
  Base:      { color: '#0052FF' },
  Polygon:   { color: '#8247E5' },
  Avalanche: { color: '#E84142' },
  Solana:    { color: '#9945FF' },
  BSC:       { color: '#F0B90B' },
  Sui:       { color: '#6FBCF0' },
};

const ALLOWED_CHAINS = new Set([
  'Ethereum', 'Arbitrum', 'Base', 'Polygon',
  'Avalanche', 'Solana', 'BSC', 'Sui'
]);

/* Excluded markets */
const EXCLUDED_MARKETS = new Set([
  'euler-v2|Avalanche|USDC',
  'credix|Ethereum|USDC',   'credix|Ethereum|USDT',
  'credix|Arbitrum|USDC',   'credix|Arbitrum|USDT',
  'credix|Polygon|USDC',    'credix|Polygon|USDT',
  'credix|Solana|USDC',     'credix|Solana|USDT',
  'credix|Base|USDC',       'credix|Base|USDT',
  'credix|BSC|USDC',        'credix|BSC|USDT',
  'credix|Sui|USDC',        'credix|Sui|USDT',
  'allbridge-classic|Ethereum|USDC', 'allbridge-classic|Ethereum|USDT',
  'allbridge-classic|Arbitrum|USDC', 'allbridge-classic|Arbitrum|USDT',
  'allbridge-classic|Polygon|USDC',  'allbridge-classic|Polygon|USDT',
  'allbridge-classic|Solana|USDC',   'allbridge-classic|Solana|USDT',
  'allbridge-classic|Base|USDC',     'allbridge-classic|Base|USDT',
  'allbridge-classic|BSC|USDC',      'allbridge-classic|BSC|USDT',
  'allbridge-classic|Sui|USDC',      'allbridge-classic|Sui|USDT',
]);

/* Display names */
const PROTOCOL_NAMES = {
  'aave-v3':                        'Aave v3',
  'aave-v2':                        'Aave v2',
  'compound-v3':                    'Compound v3',
  'compound-v2':                    'Compound v2',
  'morpho-blue':                    'Morpho Blue',
  'morpho':                         'Morpho',
  'spark':                          'SparkLend',
  'spark-savings':                  'Spark Savings',
  'sparklend':                      'SparkLend',
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
  'ember-protocol':                 'Ember Protocol',
  'avantis':                        'Avantis',
  'bracket-vaults':                 'Bracket Vaults',
  'yieldseeker':                    'YieldSeeker',
  'goldfinch':                      'Goldfinch',
  'harvest-finance':                'Harvest Finance',
  'dolomite':                       'Dolomite',
  'zerobase-cedefi':                'Zerobase',
  'autofinance':                    'Autofinance',
  'loopscale':                      'Loopscale',
  'deltaprime':                     'DeltaPrime',
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
  'accountable':                    'Accountable',
  'symbiosis':                      'Symbiosis',
  'gami-labs':                      'Gami Labs',
  'gami':                           'Gami Labs',
  'silo-v2':                        'Silo V2',
  'project-0':                      'Project 0',
  'project0':                       'Project 0',
  'scallop-lend':                   'Scallop Lend',
  'scallop':                        'Scallop Lend',
  'bitway':                         'Bitway Earn',
  'bitway-earn':                    'Bitway Earn',
  'current':                        'Current',
  'navi-protocol':                  'Navi Lending',
  'navi':                           'Navi Lending',
  'navi-lending':                   'Navi Lending',
  'accountable':                    'Accountable',
  'symbiosis':                      'Symbiosis',
  'gami-labs':                      'Gami Labs',
  'silo-v2':                        'Silo V2',
  'silo-finance-v2':                'Silo V2',
  'project-0':                      'Project 0',
  'scallop-lend':                   'Scallop Lend',
  'scallop':                        'Scallop Lend',
  'kai-finance':                    'Kai Finance',
  'kai':                            'Kai Finance',
  'venus-core-pool':                'Venus Core Pool',
  'venus-flux':                     'Venus Flux',
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
/* Specific per-market URLs (slug|Chain|TOKEN) — highest priority */
const MARKET_URLS = {
  'spark|Ethereum|USDC':                'https://app.spark.fi/markets/1/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  'spark|Ethereum|USDT':                'https://app.spark.fi/markets/1/0xdAC17F958D2ee523a2206206994597C13D831ec7',
  'sparklend|Ethereum|USDC':            'https://app.spark.fi/markets/1/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  'sparklend|Ethereum|USDT':            'https://app.spark.fi/markets/1/0xdAC17F958D2ee523a2206206994597C13D831ec7',
  'spark-savings|Ethereum|USDC':        'https://app.spark.fi/savings/mainnet/spusdc',
  'spark-savings|Ethereum|USDT':        'https://app.spark.fi/savings/mainnet/spusdt',
  'spark-savings|Avalanche|USDC':       'https://app.spark.fi/savings/avalanche/spusdc',
  'aave-v4|Ethereum|USDT':              'https://pro.aave.com/explore/asset/1/0xdAC17F958D2ee523a2206206994597C13D831ec7',
  'kamino|Solana|USDC':                 'https://kamino.com/borrow',
  'kamino|Solana|USDT':                 'https://kamino.com/borrow',
  'kamino-lend|Solana|USDC':            'https://kamino.com/borrow',
  'kamino-lend|Solana|USDT':            'https://kamino.com/borrow',
  'loopscale|Solana|USDC':              'https://app.loopscale.com/vault/7PeYxZpM2dpc4RRDQovexMJ6tkSVLWtRN4mbNywsU3e6',
  'fluid-lending|Ethereum|USDC':        'https://fluid.io/lending/1',
  'fluid-lending|Ethereum|USDT':        'https://fluid.io/lending/1',
  'fluid-lending|Arbitrum|USDC':        'https://fluid.io/lending/42161',
  'fluid-lending|Base|USDC':            'https://fluid.io/lending/8453',
  'fluid-lite|Ethereum|USDC':           'https://fluid.io/lite/8453',
  'compound-v3|Ethereum|USDC':          'https://app.compound.finance/?market=usdc-mainnet',
  'compound-v3|Ethereum|USDT':          'https://app.compound.finance/?market=usdt-mainnet',
  'compound-v3|Arbitrum|USDC':          'https://app.compound.finance/?market=usdc-arb',
  'compound-v3|Arbitrum|USDT':          'https://app.compound.finance/?market=usd%E2%82%AE0-arb',
  'yearn-finance|Ethereum|USDC':        'https://yearn.fi/vaults?chains=1',
  'yearn-finance|Ethereum|USDT':        'https://yearn.fi/vaults?chains=1',
  'yearn-finance|Base|USDC':            'https://yearn.fi/vaults?chains=8453',
  'ember-protocol|Ethereum|USDC':       'https://ember.so/earn/pALPHA',
  'yo-protocol|Ethereum|USDC':          'https://app.yo.xyz/vault/base/yousd',
  'yo-protocol|Base|USDC':              'https://app.yo.xyz/vault/base/yousd',
  'avantis|Base|USDC':                  'https://www.avantisfi.com/earn',
  'zerobase-cedefi|Ethereum|USDT':      'https://app.zerobase.pro/en',
  'zerobase-cedefi|Arbitrum|USDT':      'https://app.zerobase.pro/en',
  'euler-v2|Ethereum|USDC':             'https://app.euler.finance/lend/0xAB2726DAf820Aa9270D14Db9B18c8d187cbF2f30?network=1',
  'lazy-summer-protocol|Ethereum|USDC': 'https://summer.fi/earn/mainnet/position/0x98c49e13bf99d7cad8069faa2a370933ec9ecf17',
  'lazy-summer-protocol|Base|USDC':     'https://summer.fi/earn/base/position/0x98c49e13bf99d7cad8069faa2a370933ec9ecf17',
  'lazy|Ethereum|USDC':                 'https://getlazy.xyz/',
  'autofinance|Ethereum|USDC':          'https://app.auto.finance/pools/autoUSD',
  'autofinance|Base|USDC':              'https://app.auto.finance/pools/baseUSD',
  'termmax|Ethereum|USDC':              'https://app.termmax.ts.finance/earn/eth/0xf488ccdf04079cc03183cdb6a147d12cf97f9317?chain=eth',
  'termmax|Base|USDC':                  'https://app.termmax.ts.finance/earn/base/0xd42c1bf2aca1dd771795453277cc14f6c3b2c388?chain=base',
  'spectra-metavaults|Base|USDC':       'https://app.spectra.finance/metavaults/base:0x5e93e1193a5e297cba0856e9b3f22b6e05429b9a',
  'gains-network|Arbitrum|USDC':        'https://gains.trade/vaults/gUSDC',
  'gains-network|Base|USDC':            'https://gains.trade/vaults/gUSDC',
  'ample|Base|USDC':                    'https://ample.money/deposit',
  'sprinter|Base|USDC':                 'https://app.sprinter.tech/stash',
  'bracket-vaults|Ethereum|USDC':       'https://www.bracket.fi/',
  'beefy|Ethereum|USDC':                'https://app.beefy.com/vault/morpho-smokehouse-usdc',
  'beefy|Base|USDC':                    'https://app.beefy.com/vault/morpho-base-steakhouse-high-yield-usdc',
  'flux-finance|Ethereum|USDC':         'https://fluxfinance.com/lend',
  'flux-finance|Ethereum|USDT':         'https://fluxfinance.com/lend',
  'harvest-finance|Ethereum|USDC':      'https://app.harvest.finance/ethereum/0xf0358e8c3CD5Fa238a29301d0bEa3D63A17bEdBE',
  'harvest-finance|Base|USDC':          'https://app.harvest.finance/base/0xC777031D50F632083Be7080e51E390709062263E',
  'benqi-lending|Avalanche|USDC':       'https://app.benqi.fi/lending/core/usdc',
  'benqi-lending|Avalanche|USDT':       'https://app.benqi.fi/lending/core/usdt',
  'benqi|Avalanche|USDC':               'https://app.benqi.fi/lending/core/usdc',
  'benqi|Avalanche|USDT':               'https://app.benqi.fi/lending/core/usdt',
  'across|Ethereum|USDC':               'https://across.to/pool',
  'across|Ethereum|USDT':               'https://across.to/pool',
  'fusion-by-ipor|Ethereum|USDC':       'https://app.ipor.io/fusion/ethereum/0xb0f56bb0bf13ee05fef8cd2d8df5ffdfcac7a74f',
  'moonwell-lending|Base|USDC':         'https://moonwell.fi/markets/supply/base/usdc',
  'moonwell|Base|USDC':                 'https://moonwell.fi/markets/supply/base/usdc',
  'deltaprime|Avalanche|USDC':          'https://app.deltaprime.io/#/pools',
  'folks-finance-xchain|Polygon|USDT':  'https://xapp.folks.finance/',
  'lista-lending|Ethereum|USDC':        'https://lista.org/lending/vault/ethereum/0x9651ae50a5763c6f9b883f9d50e8116281cfcab2?tab=vault',
  'lista-lending|Ethereum|USDT':        'https://lista.org/lending/vault/ethereum/0x28643ffd79256719d6acbcf25cb44576caebcf12?tab=vault',
  'vesper|Ethereum|USDC':               'https://app.vesper.finance/eth/pools/0xa8b607Aa09B6A2E306F93e74c282Fb13f6A80452',
  'aave-v4|Ethereum|USDC':              'https://pro.aave.com/explore/asset/1/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  'accountable|Ethereum|USDC':          'https://yield.accountable.capital/vaults/0xCBbbd21C793218bB5F18d4159C5709619EcaFca6',
  'symbiosis|Ethereum|USDC':            'https://app.symbiosis.finance/liquidity-v2/pools',
  'gami-labs|Avalanche|USDC':           'https://gamilabs.io/vaults/43114/0x1F0570a081FeE0e4dF6eAC470f9d2D53CDEDa1c5',
  'silo-v2|Avalanche|USDC':             'https://v2.silo.finance/markets/avalanche/susdp-usdc-162?action=deposit',
  'silo-finance-v2|Avalanche|USDC':     'https://v2.silo.finance/markets/avalanche/susdp-usdc-162?action=deposit',
  'project-0|Solana|USDC':              'https://app.0.xyz/markets/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  'scallop-lend|Sui|USDC':              'https://app.scallop.io/',
  'scallop|Sui|USDC':                   'https://app.scallop.io/',
  'gami|Avalanche|USDC':                'https://app.gamilabs.io/',
  'project0|Solana|USDC':               'https://app.0.xyz/',
  'bitway|BSC|USDT':                    'https://app.bitway.com/explore',
  'bitway|BSC|USDC':                    'https://app.bitway.com/explore',
  'bitway-earn|BSC|USDT':               'https://app.bitway.com/explore',
  'bitway-earn|BSC|USDC':               'https://app.bitway.com/explore',
  'aave-v3|BSC|USDT':                   'https://app.aave.com/reserve-overview/?underlyingAsset=0x55d398326f99059ff775485246999027b3197955&marketName=proto_bnb_v3',
  'aave-v3|BSC|USDC':                   'https://app.aave.com/reserve-overview/?underlyingAsset=0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d&marketName=proto_bnb_v3',
  'lista-lending|BSC|USDT':             'https://lista.org/lending/vault/bsc/0x6d6783c146f2b0b2774c1725297f1845dc502525?tab=vault',
  'termmax|BSC|USDC':                   'https://app.termmax.ts.finance/earn/bnb/0xb5a2224bc5a4f42f319242ac089cdce97ff8a004?chain=bnb',
  'termmax|BSC|USDT':                   'https://app.termmax.ts.finance/earn/bnb/0xb5a2224bc5a4f42f319242ac089cdce97ff8a004?chain=bnb',
  'venus-core-pool|BSC|USDC':           'https://venus.io/markets#/markets/0xfD36E2c2a6789Db23113685031d7F16329158384/0xecA88125a5ADbe82614ffC12D0DB554E2e2867C8?chainId=56&tab=supply',
  'venus-core-pool|BSC|USDT':           'https://venus.io/markets#/markets/0xfD36E2c2a6789Db23113685031d7F16329158384/0xfD5840Cd36d94D7229439859C0112a4185BC0255?chainId=56&tab=supply',
  'venus|BSC|USDC':                     'https://venus.io/markets#/markets/0xfD36E2c2a6789Db23113685031d7F16329158384/0xecA88125a5ADbe82614ffC12D0DB554E2e2867C8?chainId=56&tab=supply',
  'venus|BSC|USDT':                     'https://venus.io/markets#/markets/0xfD36E2c2a6789Db23113685031d7F16329158384/0xfD5840Cd36d94D7229439859C0112a4185BC0255?chainId=56&tab=supply',
  'venus-flux|BSC|USDC':                'https://flux.venus.io/lending/56/USDC',
  'venus-flux|BSC|USDT':                'https://flux.venus.io/lending/56/USDT',
  'zerobase-cedefi|BSC|USDC':           'https://app.zerobase.pro/en',
  'zerobase-cedefi|BSC|USDT':           'https://app.zerobase.pro/en',
  'current|Sui|USDC':                   'https://app.current.finance/market/fe1d8929d13b00aaecd7642dec1c6d41cab82882a1b139efa46bf61dfd6380bf::market_type::MainMarket/dba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC',
  'ember-protocol|Sui|USDC':            'https://ember.so/earn/eTHIRD',
  'navi-protocol|Sui|USDC':             'https://app.naviprotocol.io/',
  'navi-protocol|Sui|USDT':             'https://app.naviprotocol.io/',
  'navi|Sui|USDC':                      'https://app.naviprotocol.io/',
  'navi|Sui|USDT':                      'https://app.naviprotocol.io/',
  'navi-lending|Sui|USDC':              'https://app.naviprotocol.io/',
  'navi-lending|Sui|USDT':              'https://app.naviprotocol.io/',
  'kai-finance|Sui|USDC':               'https://kai.finance/vaults/USDC',
  'kai-finance|Sui|USDT':               'https://kai.finance/vaults/suiUSDT',
  'kai|Sui|USDC':                       'https://kai.finance/vaults/USDC',
  'kai|Sui|USDT':                       'https://kai.finance/vaults/suiUSDT',
};

const FALLBACK_URLS = {
  'aave-v3': chain => ({
    Ethereum:  'https://app.aave.com/markets/?marketName=proto_mainnet_v3',
    Arbitrum:  'https://app.aave.com/markets/?marketName=proto_arbitrum_v3',
    Base:      'https://app.aave.com/markets/?marketName=proto_base_v3',
    Polygon:   'https://app.aave.com/markets/?marketName=proto_polygon_v3',
    Avalanche: 'https://app.aave.com/markets/?marketName=proto_avalanche_v3',
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
  'bitway':                         () => 'https://app.bitway.com/explore',
  'bitway-earn':                    () => 'https://app.bitway.com/explore',
  'accountable':                    () => 'https://yield.accountable.capital/',
  'symbiosis':                      () => 'https://app.symbiosis.finance/farm',
  'gami-labs':                      () => 'https://app.gamilabs.io/',
  'gami':                           () => 'https://app.gamilabs.io/',
  'silo-v2':                        () => 'https://app.silo.finance/',
  'project-0':                      () => 'https://app.0.xyz/',
  'project0':                       () => 'https://app.0.xyz/',
  'scallop-lend':                   () => 'https://app.scallop.io/',
  'scallop':                        () => 'https://app.scallop.io/',
  'current':                        () => 'https://app.current.finance/',
  'navi-protocol':                  () => 'https://app.naviprotocol.io/',
  'navi':                           () => 'https://app.naviprotocol.io/',
  'navi-lending':                   () => 'https://app.naviprotocol.io/',
  'accountable':                    () => 'https://yield.accountable.capital/',
  'symbiosis':                      () => 'https://app.symbiosis.finance/liquidity-v2/pools',
  'gami-labs':                      () => 'https://gamilabs.io/',
  'silo-v2':                        () => 'https://v2.silo.finance/',
  'silo-finance-v2':                () => 'https://v2.silo.finance/',
  'project-0':                      () => 'https://app.0.xyz/',
  'scallop-lend':                   () => 'https://app.scallop.io/',
  'scallop':                        () => 'https://app.scallop.io/',
  'kai-finance':                    () => 'https://kai.finance/vaults',
  'kai':                            () => 'https://kai.finance/vaults',
};


/* ── GitHub adapter URL fetcher ──────────────────────────────────────────
   For protocols where pool.url is absent and FALLBACK_URLS has no entry,
   we fetch the adapter's index.js from DefiLlama's yield-server GitHub repo
   and extract the module-level `url:` field — the same URL DefiLlama uses.
   Results are cached in memory for the session so we only fetch once.
*/
const _adapterUrlCache = {};

async function fetchAdapterUrl(slug) {
  if (_adapterUrlCache[slug] !== undefined) return _adapterUrlCache[slug];
  try {
    const raw = `https://raw.githubusercontent.com/DefiLlama/yield-server/master/src/adaptors/${slug}/index.js`;
    const res = await fetch(raw);
    if (!res.ok) { _adapterUrlCache[slug] = null; return null; }
    const text = await res.text();
    // Match: url: 'https://...' or url: "https://..."
    const match = text.match(/url:\s*['"]( *https?:\/\/[^'"]+)['"]/m);
    const url = match ? match[1].trim() : null;
    _adapterUrlCache[slug] = url;
    return url;
  } catch {
    _adapterUrlCache[slug] = null;
    return null;
  }
}

function resolveUrl(pool) {
  const token = pool.symbol.toUpperCase().includes('USDC') ? 'USDC' : 'USDT';
  /* 1. Specific per-market URL (highest priority) */
  const mkey = `${pool.project}|${pool.chain}|${token}`;
  if (MARKET_URLS[mkey]) return MARKET_URLS[mkey];
  /* 2. URL the protocol registered with DefiLlama API */
  if (pool.url && pool.url.startsWith('http')) return pool.url;
  /* 3. Generic protocol fallback */
  const entry = FALLBACK_URLS[pool.project];
  if (entry) return typeof entry === 'function' ? entry(pool.chain) : entry;
  /* 4. Return slug for async GitHub fetch (resolved in toMarket) */
  return null;
}

function toMarket(pool) {
  const apy  = parseFloat((pool.apy || 0).toFixed(2));
  const tvlM = parseFloat(((pool.tvlUsd || 0) / 1e6).toFixed(4));

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
    if (p.project === 'centrifuge-protocol') return false;
    const _tok = p.symbol.toUpperCase().includes('USDC') ? 'USDC' : 'USDT';
    if (EXCLUDED_MARKETS.has(`${p.project}|${p.chain}|${_tok}`)) return false;
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

  /* Async-patch missing URLs from GitHub adapter files */
  const missing = window.MARKETS.filter(m => !m.url);
  if (missing.length) {
    const slugs = [...new Set(missing.map(m => m.slug))];
    await Promise.all(slugs.map(async slug => {
      const url = await fetchAdapterUrl(slug);
      if (url) {
        window.MARKETS.forEach(m => { if (m.slug === slug && !m.url) m.url = url; });
      }
    }));
  }

  return window.MARKETS;
};
