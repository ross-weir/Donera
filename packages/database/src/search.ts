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
          mode: "insensitive",
        },
      },
      {
        name: {
          contains: term,
          mode: "insensitive",
        },
      },
      {
        organizer: {
          contains: term,
          mode: "insensitive",
        },
      },
      {
        beneficiary: {
          contains: term,
          mode: "insensitive",
        },
      },
    ],
  };
}
