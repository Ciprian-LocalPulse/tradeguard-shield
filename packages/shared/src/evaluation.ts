export interface EvaluationSample {
  actualHighRisk: boolean;
  predictedHighRisk: boolean;
}

export interface ConfusionMatrix {
  truePositive: number;
  falsePositive: number;
  trueNegative: number;
  falseNegative: number;
}

export interface BinaryEvaluationMetrics extends ConfusionMatrix {
  sampleCount: number;
  accuracy: number;
  precision: number;
  recall: number;
  specificity: number;
  f1: number;
}

function safeRatio(numerator: number, denominator: number): number {
  return denominator === 0 ? 0 : numerator / denominator;
}

export function evaluateBinaryClassifier(samples: readonly EvaluationSample[]): BinaryEvaluationMetrics {
  const matrix: ConfusionMatrix = { truePositive: 0, falsePositive: 0, trueNegative: 0, falseNegative: 0 };

  for (const sample of samples) {
    if (sample.actualHighRisk && sample.predictedHighRisk) matrix.truePositive += 1;
    else if (!sample.actualHighRisk && sample.predictedHighRisk) matrix.falsePositive += 1;
    else if (!sample.actualHighRisk && !sample.predictedHighRisk) matrix.trueNegative += 1;
    else matrix.falseNegative += 1;
  }

  const sampleCount = samples.length;
  const accuracy = safeRatio(matrix.truePositive + matrix.trueNegative, sampleCount);
  const precision = safeRatio(matrix.truePositive, matrix.truePositive + matrix.falsePositive);
  const recall = safeRatio(matrix.truePositive, matrix.truePositive + matrix.falseNegative);
  const specificity = safeRatio(matrix.trueNegative, matrix.trueNegative + matrix.falsePositive);

  return {
    ...matrix,
    sampleCount,
    accuracy,
    precision,
    recall,
    specificity,
    f1: safeRatio(2 * precision * recall, precision + recall)
  };
}
