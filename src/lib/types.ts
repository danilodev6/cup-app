import type { Prisma } from "@/generated/prisma/client";

export type MatchWithTeams = Prisma.MatchGetPayload<{
  include: { homeTeam: true; awayTeam: true };
}>;
