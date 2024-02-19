import { PrismaClient, Prisma, Fund } from "@prisma/client";
import { getPrismaClient } from "@prisma/client/runtime/library";

console.log("testing");
const client = new PrismaClient();
const count = await client.fund.count();
console.log(count);
// await client.fund.create({
//   data: {
//     fundContractId: "ff",
//     name: "testing",
//     description: "testing desc",
//     deadline: new Date(),
//     beneficiary: "beniAddress",
//     goal: 100n,
//     creationTx: {
//       id: "c",
//       createdAt: new Date(),
//       confirmed: false,
//       verified: false,
//     },
//   },
// });

client.fund.findFirst({
  include: {
    _count: {
      select: { donations: true },
    },
  },
  where: {},
});
