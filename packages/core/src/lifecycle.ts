export interface Lifecycle {
  start(): Promise<void>;
  stop(): Promise<void>;
}
