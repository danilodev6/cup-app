import type { Prisma } from "@/generated/prisma/client";

export type MatchWithTeams = Prisma.MatchGetPayload<{
  include: { homeTeam: true; awayTeam: true };
}>;

export type KnockoutMatchWithTeams = Prisma.KnockoutMatchGetPayload<{
  include: { homeTeam: true; awayTeam: true };
}>;
