import { describe, expect, it } from "vitest";
import { evaluateBinaryClassifier } from "./evaluation.js";

describe("evaluateBinaryClassifier", () => {
  it("calculates confusion-matrix metrics for a labelled sample", () => {
    const result = evaluateBinaryClassifier([
      { actualHighRisk: true, predictedHighRisk: true },
      { actualHighRisk: true, predictedHighRisk: false },
      { actualHighRisk: false, predictedHighRisk: true },
      { actualHighRisk: false, predictedHighRisk: false }
    ]);

    expect(result).toMatchObject({
      sampleCount: 4,
      truePositive: 1,
      falsePositive: 1,
      trueNegative: 1,
      falseNegative: 1,
      accuracy: 0.5,
      precision: 0.5,
      recall: 0.5,
      specificity: 0.5,
      f1: 0.5
    });
  });

  it("returns zero for undefined ratios instead of NaN", () => {
    expect(evaluateBinaryClassifier([])).toEqual({
      sampleCount: 0,
      truePositive: 0,
      falsePositive: 0,
      trueNegative: 0,
      falseNegative: 0,
      accuracy: 0,
      precision: 0,
      recall: 0,
      specificity: 0,
      f1: 0
    });
  });
});
