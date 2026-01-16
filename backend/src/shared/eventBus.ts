// Event Bus - Simple in-memory event emitter for microservices communication
import { EventEmitter } from 'events';

export interface Event {
  type: string;
  data: any;
  timestamp: number;
  source: string;
}

class EventBus extends EventEmitter {
  publish(event: Event): void {
    console.log(`[EventBus] Publishing event: ${event.type} from ${event.source}`);
    this.emit(event.type, event);
    this.emit('*', event); // Wildcard for all events
  }

  subscribe(eventType: string, handler: (event: Event) => void): void {
    console.log(`[EventBus] Subscribing to event: ${eventType}`);
    this.on(eventType, handler);
  }

  unsubscribe(eventType: string, handler: (event: Event) => void): void {
    this.off(eventType, handler);
  }
}

// Singleton instance
export const eventBus = new EventBus();
