import { DoneraPrismaClient } from ".";

// Get all funds with their tokens as balances
export async function fundsWithBalances(client: DoneraPrismaClient) {
  return client.fund.findMany({
    include: {
      balances: {
        select: {
          tokenId: true,
          balance: true,
        },
      },
    },
  });
}
