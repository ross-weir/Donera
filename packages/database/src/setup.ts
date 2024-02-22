import { DoneraPrismaClient } from ".";

// create indexer collection
// singleton keeping track of indexed height
async function initIndexer(db: DoneraPrismaClient): Promise<void> {
  const exists = (await db.indexer.count()) > 0;
  if (exists) {
    return;
  }
  await db.indexer.create({});
}

export async function configure(db: DoneraPrismaClient): Promise<void> {
  await initIndexer(db);
}
