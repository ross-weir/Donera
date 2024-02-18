import { BaseIndexer } from "./indexer";

export class SimpleIndexer extends BaseIndexer {
  private taskHandle?: Timer;

  async start(): Promise<void> {
    const startingHeight = await this.getCurrentHeight();

    this.taskHandle = setInterval(() => this.indexForever(startingHeight), 5000);
  }

  async stop(): Promise<void> {
    clearInterval(this.taskHandle);
  }

  private async indexForever(startHeight: number): Promise<void> {
    console.log(startHeight);
  }
}
