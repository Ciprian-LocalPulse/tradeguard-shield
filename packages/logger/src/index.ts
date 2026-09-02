const sensitiveKeyPattern = /token|secret|password|api[-_]?key|authorization|cookie/i;

export function redactSensitive(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(redactSensitive);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, inner]) => [
        key,
        sensitiveKeyPattern.test(key) ? "[REDACTED]" : redactSensitive(inner)
      ])
    );
  }

  return value;
}

export function createLogEvent(level: "info" | "warn" | "error", message: string, context: Record<string, unknown> = {}) {
  return {
    level,
    message,
    time: new Date().toISOString(),
    ...(redactSensitive(context) as Record<string, unknown>)
  };
}
