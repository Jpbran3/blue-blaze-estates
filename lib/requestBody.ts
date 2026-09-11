export class RequestError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}

// Read incrementally: Content-Length alone does not bound a chunked request.
export async function readJsonObject(request: Request, maximum = 32768): Promise<Record<string, unknown>> {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    throw new RequestError("Expected a JSON request.", 415);
  }
  const length = Number(request.headers.get("content-length"));
  if (Number.isFinite(length) && length > maximum) throw new RequestError("Request is too large.", 413);
  const reader = request.body?.getReader();
  if (!reader) throw new RequestError("Invalid request body.");
  let bytes = 0;
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > maximum) {
        await reader.cancel();
        throw new RequestError("Request is too large.", 413);
      }
      chunks.push(value);
    }
    const text = Buffer.concat(chunks).toString("utf8");
    const body: unknown = JSON.parse(text);
    if (!body || Array.isArray(body) || typeof body !== "object") throw new Error();
    return body as Record<string, unknown>;
  } catch (error) {
    if (error instanceof RequestError) throw error;
    throw new RequestError("Invalid request body.");
  } finally { reader.releaseLock(); }
}

export function applicationText(body: Record<string, unknown>, key: string, required = false) {
  const value = body[key];
  if (value == null && !required) return null;
  if (typeof value !== "string" || value.length > 2000) throw new RequestError(`Invalid ${key}.`);
  const trimmed = value.trim();
  if (required && !trimmed) throw new RequestError(`${key} is required.`);
  return trimmed || null;
}
