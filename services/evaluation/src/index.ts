import { evaluateBinaryClassifier, type BinaryEvaluationMetrics, type EvaluationSample } from "@tradeguard/shared";

export function parseEvaluationCsv(csv: string): EvaluationSample[] {
  const rows = csv
    .trim()
    .split(/\r?\n/)
    .map((row) => row.trim())
    .filter(Boolean);
  if (rows.length < 2) throw new Error("CSV must include a header and at least one observation.");

  const header = rows[0].split(",").map((column) => column.trim());
  const actualIndex = header.indexOf("actualHighRisk");
  const predictedIndex = header.indexOf("predictedHighRisk");
  if (actualIndex < 0 || predictedIndex < 0) {
    throw new Error("CSV must contain actualHighRisk and predictedHighRisk columns.");
  }

  return rows.slice(1).map((row, index) => {
    const columns = row.split(",").map((column) => column.trim().toLowerCase());
    const actual = parseBoolean(columns[actualIndex]);
    const predicted = parseBoolean(columns[predictedIndex]);
    if (actual === undefined || predicted === undefined) {
      throw new Error(`Row ${index + 2} must use true or false for both evaluation columns.`);
    }
    return { actualHighRisk: actual, predictedHighRisk: predicted };
  });
}

export function evaluateCsv(csv: string): BinaryEvaluationMetrics {
  return evaluateBinaryClassifier(parseEvaluationCsv(csv));
}

function parseBoolean(value: string | undefined): boolean | undefined {
  if (value === "true" || value === "1") return true;
  if (value === "false" || value === "0") return false;
  return undefined;
}
