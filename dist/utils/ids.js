"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateId = generateId;
function generateId(prefix = "id") {
    const random = Math.random().toString(36).slice(2, 10);
    const time = Date.now().toString(36);
    return `${prefix}_${time}_${random}`;
}
