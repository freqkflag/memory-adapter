export class ChangeBroadcast {
    listeners = [];
    subscribe(listener) {
        this.listeners.push(listener);
    }
    broadcast(op) {
        for (const listener of this.listeners) {
            listener(op);
        }
    }
}
