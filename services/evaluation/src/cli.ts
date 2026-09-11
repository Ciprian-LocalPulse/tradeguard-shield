import { readFile } from "node:fs/promises";
import { evaluateCsv } from "./index.js";

const inputPath = process.argv[2];
if (!inputPath) {
  console.error("Usage: pnpm --filter @tradeguard/evaluation evaluate -- path/to/evaluation.csv");
  process.exitCode = 2;
} else {
  try {
    const result = evaluateCsv(await readFile(inputPath, "utf8"));
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Unable to evaluate CSV.");
    process.exitCode = 1;
  }
}
