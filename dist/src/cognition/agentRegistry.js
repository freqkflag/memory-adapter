export class AgentRegistry {
    agents = new Map();
    register(agent) {
        this.agents.set(agent.id, agent);
    }
    touch(id, timestamp) {
        const existing = this.agents.get(id);
        if (existing) {
            existing.lastSeen = timestamp;
            this.agents.set(id, existing);
        }
    }
    list() {
        return Array.from(this.agents.values());
    }
}
