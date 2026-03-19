import os from "node:os";
import path from "node:path";
let cached;
function readEnv(name) {
    const raw = process.env[name];
    if (raw === undefined)
        return undefined;
    const trimmed = raw.trim();
    if (!trimmed)
        return undefined;
    return trimmed;
}
function expandHomeDir(input) {
    if (input === "~")
        return os.homedir();
    if (input.startsWith("~/"))
        return path.join(os.homedir(), input.slice(2));
    return input;
}
function sanitizePath(input) {
    // Minimal path-safety: reject control characters/newlines to reduce accidental injection.
    if (/[\r\n\t]/.test(input)) {
        throw new Error(`Invalid path for PAM_DATA_DIR`);
    }
    return expandHomeDir(input);
}
export function getRuntimeConfig() {
    if (cached)
        return cached;
    const host = readEnv("PAM_HOST") ?? "127.0.0.1";
    const portRaw = readEnv("PAM_PORT");
    const port = portRaw ? Number(portRaw) : 3000;
    const baseUrl = readEnv("PAM_BASE_URL") ?? "https://pam.cultofjoey.com";
    const authToken = readEnv("PAM_AUTH_TOKEN");
    const pamDataDirRaw = readEnv("PAM_DATA_DIR") ?? "./memory";
    const pamDataDirExpanded = sanitizePath(pamDataDirRaw);
    // Preserve legacy behavior by default (`./memory` relative to process cwd),
    // while still supporting absolute and `~/...` paths.
    const pamDataDir = path.isAbsolute(pamDataDirExpanded)
        ? pamDataDirExpanded
        : path.resolve(process.cwd(), pamDataDirExpanded);
    cached = {
        host,
        port: Number.isFinite(port) ? port : 3000,
        baseUrl,
        authToken,
        pamDataDir
    };
    return cached;
}
export function getPamDataDir() {
    return getRuntimeConfig().pamDataDir;
}
export function pamDataFile(relativePathWithinDataDir) {
    return path.join(getPamDataDir(), relativePathWithinDataDir);
}
