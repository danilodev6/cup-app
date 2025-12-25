import type { Prisma } from "@/generated/prisma/client";

export type GroupMatchWithTeams = Prisma.GroupMatchGetPayload<{
  include: { homeTeam: true; awayTeam: true };
}>;

export type KnockoutTieWithTeams = Prisma.KnockoutTieGetPayload<{
  include: { homeTeam: true; awayTeam: true };
}>;
