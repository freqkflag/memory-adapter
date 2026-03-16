import { Operation } from "./operationLog";

export type ChangeListener = (op: Operation) => void;

export class ChangeBroadcast {
  private listeners: ChangeListener[] = [];

  subscribe(listener: ChangeListener): void {
    this.listeners.push(listener);
  }

  broadcast(op: Operation): void {
    for (const listener of this.listeners) {
      listener(op);
    }
  }
}

