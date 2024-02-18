export type IndexerConfig = {};

export interface Indexer {
  run(): Promise<void>;
}
