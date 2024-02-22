import { DoneraPrismaClient, Fund, Prisma } from ".";

const defaultDonationSelect: Prisma.DonationSelect = {
  id: true,
  donor: true,
  tokenId: true,
  amount: true,
};

export function fundWithDonations(
  db: DoneraPrismaClient,
  fundId: string,
  donationCount: number,
  orderBy: "desc" | "asc" = "desc"
) {
  return db.fund.findFirst({
    where: {
      id: fundId,
    },
    include: {
      donations: {
        take: donationCount,
        orderBy: {
          createdAt: orderBy,
        },
        select: {
          ...defaultDonationSelect,
        },
      },
    },
  });
}

export function fundDonationCount(db: DoneraPrismaClient, fundId: string) {
  return db.donation.count({ where: { fundId } });
}

export type FundSummary = {
  fund: Fund;
  donationCount: number;
};

export async function fundSummary(db: DoneraPrismaClient, fundId: string) {
  const [fund, donationCount] = await db.$transaction([
    fundWithDonations(db, fundId, 3),
    fundDonationCount(db, fundId),
  ]);

  return { fund, donationCount };
}
