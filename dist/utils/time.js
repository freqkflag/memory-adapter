"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.now = now;
exports.hoursFromNow = hoursFromNow;
exports.hasExpired = hasExpired;
function now() {
    return Date.now();
}
function hoursFromNow(hours) {
    return now() + hours * 60 * 60 * 1000;
}
function hasExpired(timestamp) {
    if (!timestamp)
        return false;
    return timestamp <= now();
}
