import { DoneraPrismaClient } from ".";

export type SearchQuery = {
  offset: number;
  size: number;
};

export type SearchResult<T = unknown> = {
  data: T;
  next?: SearchQuery;
};

// poor mans search
// if there's ever a need for scale we could
// swap it out for a real solution
function searchQuery(term: string, q: SearchQuery) {
  return {
    where: {
      OR: [
        {
          description: {
            contains: term,
          },
        },
        {
          name: {
            contains: term,
          },
        },
        {
          organizer: {
            contains: term,
          },
        },
        {
          beneficiary: {
            contains: term,
          },
        },
      ],
    },
    take: q.size,
    skip: q.offset,
  };
}

export async function search(
  db: DoneraPrismaClient,
  term: string,
  q: SearchQuery
): Promise<SearchResult> {
  const [data, count] = await db.$transaction([
    db.fund.findMany(searchQuery(term, q)),
    db.fund.count(searchQuery(term, q)),
  ]);
  const next = {
    offset: q.offset + q.size,
    size: q.size,
  };

  return next.offset > count ? { data } : { data, next };
}
