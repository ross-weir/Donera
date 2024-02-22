import { Prisma } from ".";

// poor mans search
export function fundTextSearch(term: string = "") {
  if (!term) {
    return {};
  }

  return {
    OR: [
      {
        description: {
          contains: term,
          mode: "insensitive" as Prisma.QueryMode,
        },
      },
      {
        name: {
          contains: term,
          mode: "insensitive" as Prisma.QueryMode,
        },
      },
      {
        organizer: {
          contains: term,
          mode: "insensitive" as Prisma.QueryMode,
        },
      },
      {
        beneficiary: {
          contains: term,
          mode: "insensitive" as Prisma.QueryMode,
        },
      },
    ],
  };
}
