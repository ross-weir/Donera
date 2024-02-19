import { NodeProvider } from "@alephium/web3";
import { PrismaClient, PrismaPromise } from "@donera/database";

export type IndexerConfig = {
  db: PrismaClient;
  node: NodeProvider;
};

export interface Indexer {
  start(): Promise<void>;
  stop(): Promise<void>;
}

export abstract class BaseIndexer implements Indexer {
  protected currentHeight: number;
  protected readonly node: NodeProvider;
  protected readonly db: PrismaClient;

  constructor(cfg: IndexerConfig) {
    this.currentHeight = 0;
    this.node = cfg.node;
    this.db = cfg.db;
  }

  async getCurrentHeight(): Promise<number> {
    return this.db.indexer.findFirstOrThrow().then((i) => i.height);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected incrementHeight(): PrismaPromise<any> {
    // use update many so we dont need a `where` clause
    // there should only ever be one document
    return this.db.indexer.updateMany({
      data: {
        height: {
          increment: 1,
        },
      },
    });
  }

  abstract start(): Promise<void>;
  abstract stop(): Promise<void>;
}
