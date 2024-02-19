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

  // ensure the indexer is initialized in the db
  protected async maybeInit(): Promise<void> {
    const exists = (await this.db.indexer.count()) > 0;
    if (exists) {
      return;
    }
    await this.db.indexer.create({});
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected incHeight(): PrismaPromise<any> {
    return this.db.indexer.updateMany({
      data: {
        height: {
          increment: 1,
        },
      },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected updateHeight(newHeight: number): PrismaPromise<any> {
    // use update many so we dont need a `where` clause
    // there should only ever be one document
    return this.db.indexer.updateMany({
      data: {
        height: {
          set: newHeight,
        },
      },
    });
  }

  async start(): Promise<void> {
    await this.maybeInit();
    this.currentHeight = await this.getCurrentHeight();
    await this.run();
  }

  async stop(): Promise<void> {
    return Promise.resolve();
  }

  protected abstract run(): Promise<void>;
}
