export class PublicApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string
  ) {
    super(message);
  }
}

export function badRequest(code: string, message: string) {
  return new PublicApiError(400, code, message);
}
