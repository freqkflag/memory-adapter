type Listener = (event: string, payload: unknown) => void;

export class ChangeBroadcast {
  private listeners: Set<Listener> = new Set();

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  broadcast(event: string, payload: unknown): void {
    for (const listener of this.listeners) {
      listener(event, payload);
    }
  }
}

type Listener = (payload: any) => void;

export class ChangeBroadcast {
  private listeners: Set<Listener> = new Set();

  onChange(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  emitChange(payload: any): void {
    for (const listener of this.listeners) {
      try {
        listener(payload);
      } catch {
        // ignore listener errors
      }
    }
  }
}

