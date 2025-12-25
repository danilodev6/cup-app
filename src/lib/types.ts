import type {
  GroupMatch,
  KnockoutTie,
  KnockoutLeg,
  Team,
} from "@/generated/prisma/client";

export type GroupMatchWithTeams = GroupMatch & {
  homeTeam: Team;
  awayTeam: Team;
};

export type KnockoutTieWithLegs = KnockoutTie & {
  homeTeam: Team;
  awayTeam: Team;
  legs: KnockoutLeg[];
};

// import type { Prisma } from "@/generated/prisma/client";
//
// export type GroupMatchWithTeams = Prisma.GroupMatchGetPayload<{
//   include: { homeTeam: true; awayTeam: true };
// }>;
//
// export type KnockoutTieWithTeams = Prisma.KnockoutTieGetPayload<{
//   include: { homeTeam: true; awayTeam: true; legs: true };
// }>;
