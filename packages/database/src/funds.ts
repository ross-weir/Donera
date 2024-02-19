import { DoneraPrismaClient } from ".";

// Get all funds token balances in format:
// {fundId, tokenId, balance}
export function tokenBalances(client: DoneraPrismaClient) {
  return client.donation.aggregateRaw({
    pipeline: [
      {
        $addFields: {
          amountNum: { $toDecimal: "$amount" },
        },
      },
      {
        $group: {
          _id: {
            fundId: "$fundId",
            tokenId: "$tokenId",
          },
          balance: { $sum: "$amountNum" },
        },
      },
      {
        $project: {
          _id: 0,
          fundId: "$_id.fundId",
          tokenId: "$_id.tokenId",
          balance: { $toString: "$balance" },
        },
      },
    ],
  });
}

type Balance = {
  fundId: string;
  tokenId: string;
  balance: string;
};

type BalanceMap = Record<string, [{ tokenId: string; balance: string }]>;

export type FundWithBalance = Awaited<ReturnType<typeof fundsWithBalances>>[0];

// Get all funds with their tokens as balances
export async function fundsWithBalances(client: DoneraPrismaClient) {
  const [funds, rawBalances] = await client.$transaction([
    client.fund.findMany({}),
    tokenBalances(client),
  ]);
  const balances = rawBalances as unknown as Balance[];
  const balanceMap = balances.reduce((acc: BalanceMap, { fundId, tokenId, balance }) => {
    const entry = acc[fundId];
    if (entry) {
      entry.push({ tokenId, balance });
    } else {
      acc[fundId] = [{ tokenId, balance }];
    }
    return acc;
  }, {});
  return funds.map((f) => ({ ...f, balances: balanceMap[f.id] ?? [] }));
}
