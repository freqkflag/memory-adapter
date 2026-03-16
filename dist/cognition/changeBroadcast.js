"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeBroadcast = void 0;
class ChangeBroadcast {
    constructor() {
        this.listeners = [];
    }
    subscribe(listener) {
        this.listeners.push(listener);
    }
    broadcast(op) {
        for (const listener of this.listeners) {
            listener(op);
        }
    }
}
exports.ChangeBroadcast = ChangeBroadcast;
