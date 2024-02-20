import { NextResponse } from "next/server";
import db from "@donera/database";
import { unstable_cache } from "next/cache";

type PathParam = {
  shortId: string;
};

const getUrl = async (baseUrl: string, shortId: string) => {
  const fund = await db.fund.findFirst({
    where: {
      shortId,
    },
    select: {
      id: true,
    },
  });

  if (!fund) {
    return new URL("/", baseUrl);
  }

  return new URL(`/funds/${fund.id}`, baseUrl);
};

const getCachedUrl = unstable_cache(getUrl, ["short-link-fund"]);

export async function GET(request: Request, { params }: { params: PathParam }) {
  const url = await getCachedUrl(request.url, params.shortId);
  return NextResponse.redirect(url);
}
