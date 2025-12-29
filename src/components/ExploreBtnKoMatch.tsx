import Link from "next/link";
import type { KnockoutTieWithLegs } from "@/lib/types";
import { fmtAR } from "@/lib/date-utils";

const ExploreBtnKoMatch = ({ koMatch }: { koMatch: KnockoutTieWithLegs }) => {
  const leg1 = koMatch.legs.find((leg) => leg.legNumber === 1);
  const leg2 = koMatch.legs.find((leg) => leg.legNumber === 2);

  let homeAggregate = 0;
  let awayAggregate = 0;

  if (leg1 && leg2) {
    homeAggregate = leg1.homeScore + leg2.awayScore;
    awayAggregate = leg1.awayScore + leg2.homeScore;
  } else if (leg1) {
    homeAggregate = leg1.homeScore;
    awayAggregate = leg1.awayScore;
  } else if (leg2) {
    homeAggregate = leg2.awayScore;
    awayAggregate = leg2.homeScore;
  }

  return (
    <Link
      href={`/komatches/${koMatch.id}`}
      className="explore-match flex-col items-center mt-7 mx-auto"
    >
      <div className="flex flex-col items-center">
        <span className="text-center text-xs sm:text-base">
          {leg1 && <span> 1er: {fmtAR(leg1.date)} </span>}
        </span>
        <span className="text-center text-xs sm:text-base">
          {leg2 && <span> 2do: {fmtAR(leg2.date)} </span>}
        </span>
      </div>
      <div className="flex items-center justify-center gap-1 sm:gap-2 mx-auto mt-2">
        <span className="text-right w-20 sm:w-32 truncate text-xs sm:text-base">
          {koMatch.homeTeam.name}
        </span>
        <img
          className="w-[20px] sm:w-[25px]"
          src={koMatch.homeTeam.logoUrl}
          alt={koMatch.homeTeam.name}
        />
        <span className="px-2 sm:px-3 whitespace-nowrap font-bold text-sm sm:text-base">
          {homeAggregate} - {awayAggregate}
        </span>
        <img
          className="w-[20px] sm:w-[25px]"
          src={koMatch.awayTeam.logoUrl}
          alt={koMatch.awayTeam.name}
        />
        <span className="text-left w-20 sm:w-32 truncate text-xs sm:text-base">
          {koMatch.awayTeam.name}
        </span>
      </div>

      {koMatch.legs.length > 0 && (
        <div className="text-xs text-gray-400 mt-2">
          {leg1 && (
            <span className="mr-2 sm:mr-3">
              1°: {leg1.homeScore}-{leg1.awayScore}
            </span>
          )}
          {leg2 && (
            <span>
              2°: {leg2.awayScore}-{leg2.homeScore}
            </span>
          )}
        </div>
      )}
    </Link>
  );
};

export default ExploreBtnKoMatch;
