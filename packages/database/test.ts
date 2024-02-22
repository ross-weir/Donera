import db from "./src";
import { search } from "./src/search";

const term = "1DrDyTr9RpRsQnDnXo2YRiPzPW4ooHX5LLoqXrqfMrpQH";
// let r = await db.$runCommandRaw({
//   find: "Fund",
//   filter: {
//     $or: [
//       { name: { $regex: term, $options: "i" } },
//       { description: { $regex: term, $options: "i" } },
//     ],
//   },
// });

// let r = await db.fund.findMany({
//   where: {
//     OR: [
//       {
//         description: {
//           contains: term,
//         },
//       },
//       {
//         name: {
//           contains: term,
//         },
//       },
//     ],
//   },
// });
const r = await search(db, term, { offset: 0, size: 2 });
console.log(r);
