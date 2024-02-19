export * from "@prisma/client";
import { PrismaClient } from "@prisma/client";

let _client: PrismaClient;

// we can add extensions via $extensions and they are strongly typed
// https://www.prisma.io/docs/orm/prisma-client/client-extensions
// although not currently used, if we use a factory function
// we can add them with no changes required later
export function getClient() {
  if (_client) {
    return _client;
  }
  _client = new PrismaClient();
  return _client;
}
