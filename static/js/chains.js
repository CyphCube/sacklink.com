/* yield.fi — Chain logos via DefiLlama's icon CDN */

window.CHAIN_META = {
  BTC:       { slug: 'bitcoin',   color: '#F7931A' },
  Ethereum:  { slug: 'ethereum',  color: '#627EEA' },
  Arbitrum:  { slug: 'arbitrum',  color: '#12AAFF' },
  Base:      { slug: 'base',      color: '#0052FF' },
  Polygon:   { slug: 'polygon',   color: '#8247E5' },
  Avalanche: { slug: 'avalanche', color: '#E84142' },
  Solana:    { slug: 'solana',    color: '#9945FF' },
  BSC:       { slug: 'bsc',       color: '#F0B90B' },
  Sui:            { slug: 'sui',            color: '#6FBCF0' },
  Hyperliquid:    { slug: 'hyperliquid-l1',  color: '#00E5C0' },
  'Hyperliquid L1': { slug: 'hyperliquid-l1', color: '#00E5C0' },
  Aptos:          { slug: 'aptos',           color: '#2DD8A3' },
  Stellar:        { slug: 'stellar',         color: '#7B7BEE' },
  XRPL:           { slug: 'xrpl',            color: '#346AA9' },
};

window.chainLogo = function(chain, size) {
  const imgSize = size || 22;
  const meta = window.CHAIN_META[chain];
  if (!meta) {
    return `<span class="chain-icon-fallback"
      style="width:${imgSize}px;height:${imgSize}px;background:#444"
      aria-label="${chain}">${chain[0]}</span>`;
  }
  /* DefiLlama icon CDN — try jpg, fallback to colored initial */
  return `<img
    class="chain-icon-img"
    src="https://icons.llamao.fi/icons/chains/rsz_${meta.slug}.jpg"
    alt="${chain}"
    width="${imgSize}"
    height="${imgSize}"
    loading="lazy"
    onerror="this.outerHTML='<span class=\\'chain-icon-fallback\\' style=\\'width:${imgSize}px;height:${imgSize}px;background:${meta.color}\\'>${chain[0]}</span>'"
  />`;
};

window.CHAIN_STYLES = Object.fromEntries(
  Object.entries(window.CHAIN_META).map(([k, v]) => [k, { color: v.color }])
);
