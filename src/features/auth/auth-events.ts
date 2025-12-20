type AuthEvent = {
  isAuthenticated?: boolean;
};

type Listener = (event: AuthEvent) => void;

const listeners = new Set<Listener>();
let lastKnownIsAuthenticated: boolean | null = null;

export const authEvents = {
  getSnapshot() {
    return lastKnownIsAuthenticated;
  },
  emit(event: AuthEvent = {}) {
    if (typeof event.isAuthenticated === 'boolean') {
      lastKnownIsAuthenticated = event.isAuthenticated;
    }
    listeners.forEach((listener) => listener(event));
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
