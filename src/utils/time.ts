export function now(): number {
  return Date.now();
}

export function hoursFromNow(hours: number): number {
  return now() + hours * 60 * 60 * 1000;
}

export function hasExpired(timestamp: number | undefined): boolean {
  if (!timestamp) return false;
  return timestamp <= now();
}

