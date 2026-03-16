export function now() {
    return Date.now();
}
export function hoursFromNow(hours) {
    return now() + hours * 60 * 60 * 1000;
}
export function hasExpired(timestamp) {
    if (!timestamp)
        return false;
    return timestamp <= now();
}
