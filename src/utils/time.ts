export function now(): number {
  return Date.now();
}

export function hoursFromNow(hours: number): number {
  return now() + hours * 60 * 60 * 1000;
}

export function hasExpired(timestamp: number): boolean {
  return timestamp <= now();
}

export function toIso(timestamp: number): string {
  return new Date(timestamp).toISOString();
}

