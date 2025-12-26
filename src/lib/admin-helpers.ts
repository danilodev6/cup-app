import type { KnockoutTieWithLegs } from "@/lib/types";
import type { KnockoutLeg } from "@/generated/prisma/client";

/**
 * Takes all the legs from the ties to use in the MatchEvent forms
 **/
export function extractLegsFromTies(ties: KnockoutTieWithLegs[]): Array<
  KnockoutLeg & {
    homeTeam: { id: number; name: string };
    awayTeam: { id: number; name: string };
  }
> {
  const legs: Array<
    KnockoutLeg & {
      homeTeam: { id: number; name: string };
      awayTeam: { id: number; name: string };
    }
  > = [];

  for (const tie of ties) {
    for (const leg of tie.legs) {
      legs.push({
        ...leg,
        homeTeam: {
          id: leg.homeTeamId,
          name: tie.homeTeam.name,
        },
        awayTeam: {
          id: leg.awayTeamId,
          name: tie.awayTeam.name,
        },
      });
    }
  }

  return legs;
}
