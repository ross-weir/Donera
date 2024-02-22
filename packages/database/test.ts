import db from "./src";

const r = await db.fund.findMany({});
console.log(r);
