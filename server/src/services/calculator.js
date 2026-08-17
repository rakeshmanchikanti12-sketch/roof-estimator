function calculateEstimate(config, answers) {
  const questions = config.questions;
  const modifiers = config.modifiers;

  const roofArea = Number(answers.roof_area);

  const getOption = (questionKey) => {
    const question = questions.find(
      (item) => item.key === questionKey
    );

    if (!question || !question.options) {
      return null;
    }

    return question.options.find(
      (option) => option.value === answers[questionKey]
    );
  };

  const material = getOption("material");
  const pitch = getOption("pitch");
  const layers = getOption("layers");
  const stories = getOption("stories");

  if (!material || !pitch || !layers || !stories) {
    throw new Error("Invalid estimator options");
  }

  const ratePerSqft = Number(material.rate_per_sqft || 0);
  const pitchMultiplier = Number(pitch.multiplier || 1);
  const tearOffRate = Number(layers.tear_off_per_sqft || 0);
  const storiesMultiplier = Number(stories.multiplier || 1);

  const wasteFactor = Number(
    modifiers.waste_factor || 0.10
  );

  const permitFee = Number(
    modifiers.permit_flat_fee || 350
  );

  const spread = Number(
    modifiers.range_spread_pct || 12
  ) / 100;

  const baseMaterialCost =
    roofArea * ratePerSqft * (1 + wasteFactor);

  const tearOffCost =
    roofArea * tearOffRate;

  const adjustedSubtotal =
    (baseMaterialCost + tearOffCost) *
    pitchMultiplier *
    storiesMultiplier;

  const midEstimate =
    adjustedSubtotal + permitFee;

  const estimateLow =
    Math.round(midEstimate * (1 - spread));

  const estimateHigh =
    Math.round(midEstimate * (1 + spread));

  return {
    estimate_low: estimateLow,
    estimate_high: estimateHigh
  };
}

module.exports = {
  calculateEstimate
};