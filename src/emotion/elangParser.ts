import { AXIS_KEY } from "./axisRegistry";
import { now } from "../utils/time";

export interface ELangVector {
  axes: Record<string, number>;
  timestamp: number;
  source: "user";
  trajectory?: ELangVector[];
}

export const ELANG_ABNF_GRAMMAR = `
expression = axes [";" trajectory]
axes       = axis *("," axis)
axis       = axis-key "=" signed-number
axis-key   = 1*(ALPHA / DIGIT / "_")
signed-number = ["-"] 1*DIGIT ["." 1*DIGIT]
trajectory = "->" expression
`;

function parseAxisToken(token: string): [string, number] | null {
  const trimmed = token.trim();
  if (!trimmed) return null;
  const parts = trimmed.split("=");
  if (parts.length !== 2) return null;
  const axisKey = parts[0].trim();
  const numeric = Number(parts[1].trim());
  if (!Number.isFinite(numeric)) return null;
  if (!AXIS_KEY[axisKey]) {
    throw new Error(`Unknown E-Lang axis "${axisKey}". Axis must be registered in AXIS_KEY.`);
  }
  return [axisKey, numeric];
}

function parseSingleExpression(expr: string): ELangVector {
  const [axesPart] = expr.split(";");
  const axisTokens = axesPart.split(",");
  const axes: Record<string, number> = {};
  for (const token of axisTokens) {
    const parsed = parseAxisToken(token);
    if (!parsed) continue;
    const [axisKey, value] = parsed;
    axes[axisKey] = value;
  }
  if (Object.keys(axes).length === 0) {
    throw new Error("E-Lang expression must define at least one axis.");
  }
  return {
    axes,
    timestamp: now(),
    source: "user"
  };
}

export function parseELang(input: string): ELangVector {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error("Cannot parse empty E-Lang expression.");
  }

  const parts = trimmed.split("->").map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) {
    throw new Error("Invalid E-Lang expression.");
  }

  const head = parseSingleExpression(parts[0]);
  if (parts.length === 1) {
    return head;
  }

  const trajectory: ELangVector[] = [];
  for (let i = 1; i < parts.length; i++) {
    trajectory.push(parseSingleExpression(parts[i]));
  }

  return {
    ...head,
    trajectory
  };
}

