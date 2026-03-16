import assert from "assert";
import { parseELang } from "../emotion/elangParser";
export function runElangParserTests() {
    const v = parseELang("valence:0.5, arousal:0.2 -> valence:0.6, arousal:0.3");
    assert.strictEqual(v.source, "user");
    assert.ok(Math.abs(v.axes.valence - 0.5) < 1e-9);
    assert.ok(v.trajectory && v.trajectory.length === 1);
}
