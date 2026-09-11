# Reproducible Evaluation CLI

The repository contains an evaluation utility for externally labelled data.
It deliberately does not ship a benchmark dataset or claim accuracy results.

## CSV contract

The input must contain a header with these columns:

```csv
actualHighRisk,predictedHighRisk
true,true
false,true
false,false
true,false
```

`true`/`false` and `1`/`0` are accepted. The labels must be created and
documented by the evaluator; they are not inferred from the product score.

## Run

```bash
pnpm --filter @tradeguard/evaluation evaluate -- path/to/evaluation.csv
```

The command prints JSON containing the confusion matrix, sample count,
accuracy, precision, recall, specificity, and F1. Preserve the release tag,
commit, dataset hash, observation dates, threshold configuration, provider
availability, and labelling protocol alongside any reported result.

## Interpretation

The output is descriptive, not proof of generalisation. Evaluation should
include a held-out sample, confidence intervals or another uncertainty
analysis, class-balance reporting, and separate accounting for neutral or
provider-unavailable observations. Do not use a single aggregate metric as a
substitute for human review or regulatory assessment.
