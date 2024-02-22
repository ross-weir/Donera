// https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices
export * from "@prisma/client";
export * from "./setup";
import { PrismaClient } from "@prisma/client";

export type DoneraPrismaClient = ReturnType<typeof prismaClientSingleton>;

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  // eslint-disable-next-line no-var
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
