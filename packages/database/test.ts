import db from "./src";
import { fundsWithBalances } from "./src/funds";

// const funds = await db.fund.findMany({
//   where: {
//     id: "037e5c68d1d15f8e9947d587b96374fb4c37b6331d0bc0a5d66b09c45fd51d00",
//   },
//   select: {
//     id: true,
//     name: true,
//   },
// });

const funds = await fundsWithBalances(db);

for (const f of funds) {
  console.log(f);
}
// const d = await fundsWithBalances(db);
// console.log(d[0].balances);
