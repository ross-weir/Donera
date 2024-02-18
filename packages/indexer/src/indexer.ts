import { NodeProvider } from "@alephium/web3";
import { DoneraPrismaClient } from "@donera/database";

export type IndexerConfig = {
  db: DoneraPrismaClient;
  node: NodeProvider;
  chunkSize: number;
};

export interface Indexer {
  start(): Promise<void>;
  stop(): Promise<void>;
}

export abstract class BaseIndexer implements Indexer {
  protected readonly node: NodeProvider;
  protected readonly db: DoneraPrismaClient;
  protected readonly chunkSize: number;

  constructor(cfg: IndexerConfig) {
    this.node = cfg.node;
    this.db = cfg.db;
    this.chunkSize = cfg.chunkSize;
  }

  async getCurrentHeight(): Promise<number> {
    return this.db.indexer.findFirstOrThrow().then((i) => i.height);
  }

  abstract start(): Promise<void>;
  abstract stop(): Promise<void>;
}
