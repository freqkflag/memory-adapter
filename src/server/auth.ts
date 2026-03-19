import type http from "node:http";
import { getRuntimeConfig } from "../config/runtime.js";

export class HttpUnauthorizedError extends Error {
  statusCode = 401;

  constructor(message = "Unauthorized") {
    super(message);
    this.name = "HttpUnauthorizedError";
  }
}

export function extractBearerToken(req: http.IncomingMessage): string | undefined {
  const header = req.headers.authorization;
  const raw = Array.isArray(header) ? header[0] : header;
  if (!raw) return undefined;

  const match = raw.match(/^Bearer\s+(.+)$/i);
  if (!match) return undefined;

  const token = match[1]?.trim();
  if (!token) return undefined;
  return token;
}

export function authorizeRequest(req: http.IncomingMessage): void {
  const expectedToken = getRuntimeConfig().authToken;
  if (!expectedToken) return; // Local/dev mode: no auth token configured.

  const provided = extractBearerToken(req);
  if (!provided || provided !== expectedToken) {
    throw new HttpUnauthorizedError();
  }
}

