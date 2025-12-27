import type {
  Team,
  GroupMatch,
  KnockoutTie,
  KnockoutLeg,
} from "@/generated/prisma/client";

// Type for group matches with teams
export type GroupMatchWithTeams = GroupMatch & {
  homeTeam: Team;
  awayTeam: Team;
};

// Type for knockout ties with teams and legs
export type KnockoutTieWithLegs = KnockoutTie & {
  homeTeam: Team;
  awayTeam: Team;
  legs: KnockoutLeg[];
  format: string; // "single-leg" | "two-leg"
};

// Type for knockout legs with teams
export type KnockoutLegWithTeams = KnockoutLeg & {
  homeTeam: Team;
  awayTeam: Team;
};

// Type for knockout ties with teams and legs
export type KnockoutTieWithLegsAndTeams = KnockoutTie & {
  homeTeam: Team;
  awayTeam: Team;
  legs: KnockoutLegWithTeams[];
  format: string; // "single-leg" | "two-leg"
};
