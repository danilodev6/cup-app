import type { KnockoutLegWithTeams } from "@/lib/types";

export type KnockoutPair = {
  first: KnockoutLegWithTeams | null;
  second: KnockoutLegWithTeams | null;
};

export function calculateWinner(matches: KnockoutPair) {
  const { first, second } = matches;
  if (!first || !first.isFinished) return null;

  const isTwoLegged = second && second.isFinished;

  const totalHome = isTwoLegged
    ? first.homeScore + second.homeScore
    : first.homeScore;

  const totalAway = isTwoLegged
    ? first.awayScore + second.awayScore
    : first.awayScore;

  if (totalHome > totalAway) {
    return { winner: first.homeTeam, loser: first.awayTeam };
  }

  if (totalAway > totalHome) {
    return { winner: first.awayTeam, loser: first.homeTeam };
  }

  // tie
  return { winner: first.homeTeam, loser: first.awayTeam };
}
