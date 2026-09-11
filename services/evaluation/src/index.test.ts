import { describe, expect, it } from "vitest";
import { evaluateCsv, parseEvaluationCsv } from "./index.js";

describe("evaluation CSV", () => {
  it("parses labelled observations and computes metrics", () => {
    const csv = "actualHighRisk,predictedHighRisk\ntrue,true\ntrue,false\nfalse,true\nfalse,false";
    expect(parseEvaluationCsv(csv)).toHaveLength(4);
    expect(evaluateCsv(csv)).toMatchObject({ sampleCount: 4, accuracy: 0.5, f1: 0.5 });
  });

  it("rejects missing columns and invalid labels", () => {
    expect(() => parseEvaluationCsv("actual,predicted\ntrue,false")).toThrow("actualHighRisk");
    expect(() => parseEvaluationCsv("actualHighRisk,predictedHighRisk\nmaybe,false")).toThrow("Row 2");
  });
});
