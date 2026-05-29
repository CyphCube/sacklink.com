/* yield.fi — Scored Risk Model
   Produces a numeric score 0–100 (lower = safer) from real DefiLlama signals.
   Maps to 3 tiers: Low (0–39) / Med (40–69) / High (70–100)

   Signals used (all from yields.llama.fi/pools):
   ┌─────────────────────────┬────────┬─────────────────────────────────────────┐
   │ Field                   │ Weight │ Rationale                               │
   ├─────────────────────────┼────────┼─────────────────────────────────────────┤
   │ tvlUsd                  │  25%   │ Large TVL = battle-tested, more auditors│
   │ sigma                   │  25%   │ APY volatility — high sigma = unstable  │
   │ count                   │  20%   │ Data points = protocol age/track record │
   │ apyPct30D               │  15%   │ APY trend stability over 30 days        │
   │ predictions.binnedConf  │  10%   │ DefiLlama's ML confidence (1–3)         │
   │ outlier                 │   5%   │ Flagged as statistical outlier          │
   └─────────────────────────┴────────┴─────────────────────────────────────────┘
*/

/* ── Scoring helpers (each returns a penalty 0–100) ── */

/**
 * TVL penalty: smaller TVL = higher penalty.
 * Scale: <$1M=100, $1M=80, $10M=55, $100M=25, $500M=10, $1B+=0
 */
function scoreTVL(tvlUsd) {
  if (!tvlUsd || tvlUsd <= 0) return 100;
  const m = tvlUsd / 1e6; // millions
  if (m >= 1000) return 0;
  if (m >= 500)  return 5;
  if (m >= 100)  return 20;
  if (m >= 50)   return 30;
  if (m >= 10)   return 45;
  if (m >= 5)    return 60;
  if (m >= 1)    return 75;
  return 100;
}

/**
 * Sigma (APY std-dev) penalty: high volatility = risky.
 * DefiLlama sigma is expressed as a fraction of APY.
 * Scale: <0.05=0, 0.1=20, 0.2=45, 0.4=70, >0.6=100
 */
function scoreSigma(sigma) {
  if (sigma == null || sigma <= 0) return 50; // unknown → neutral
  if (sigma <= 0.03) return 0;
  if (sigma <= 0.07) return 15;
  if (sigma <= 0.15) return 35;
  if (sigma <= 0.30) return 55;
  if (sigma <= 0.50) return 75;
  return 95;
}

/**
 * Count (number of daily data points) penalty: fewer points = less history.
 * Scale: <30=90, 30=70, 90=45, 180=25, 365+=5
 */
function scoreCount(count) {
  if (!count || count <= 0) return 90;
  if (count >= 730) return 0;
  if (count >= 365) return 5;
  if (count >= 180) return 20;
  if (count >= 90)  return 40;
  if (count >= 30)  return 65;
  return 90;
}

/**
 * 30-day APY drift penalty: large swings (up or down) = less stable.
 * apyPct30D is a % change in APY over 30 days.
 * Scale: |drift| < 5%=0, 10%=20, 20%=40, 50%=70, >100%=100
 */
function scoreApyDrift30d(apyPct30D) {
  if (apyPct30D == null) return 40; // unknown → mild penalty
  const abs = Math.abs(apyPct30D);
  if (abs <= 5)   return 0;
  if (abs <= 10)  return 15;
  if (abs <= 20)  return 35;
  if (abs <= 50)  return 60;
  if (abs <= 100) return 80;
  return 100;
}

/**
 * DefiLlama ML confidence penalty.
 * binnedConfidence: 3=high, 2=med, 1=low, null=unknown
 */
function scorePredictionConf(binnedConfidence) {
  if (binnedConfidence === 3) return 0;
  if (binnedConfidence === 2) return 30;
  if (binnedConfidence === 1) return 65;
  return 50; // null → neutral
}

/**
 * Outlier flag: if DefiLlama marks this pool as a statistical outlier, penalise.
 */
function scoreOutlier(outlier) {
  return outlier === true ? 100 : 0;
}

/* ── Main scorer ── */
window.scoreRisk = function(pool) {
  const weights = {
    tvl:    0.25,
    sigma:  0.25,
    count:  0.20,
    drift:  0.15,
    conf:   0.10,
    outlier:0.05,
  };

  const penalties = {
    tvl:     scoreTVL(pool.tvlUsd),
    sigma:   scoreSigma(pool.sigma),
    count:   scoreCount(pool.count),
    drift:   scoreApyDrift30d(pool.apyPct30D),
    conf:    scorePredictionConf(pool.predictions?.binnedConfidence),
    outlier: scoreOutlier(pool.outlier),
  };

  const score = Math.round(
    penalties.tvl     * weights.tvl   +
    penalties.sigma   * weights.sigma +
    penalties.count   * weights.count +
    penalties.drift   * weights.drift +
    penalties.conf    * weights.conf  +
    penalties.outlier * weights.outlier
  );

  const tier =
    score <= 39 ? 'Low' :
    score <= 69 ? 'Med' :
                  'High';

  return { score, tier, penalties };
};

/* ── Expose tier label from a pre-computed score object ── */
window.riskTier = function(riskObj) {
  return riskObj ? riskObj.tier : 'High';
};
