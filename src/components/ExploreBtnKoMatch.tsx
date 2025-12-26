import Link from "next/link";
import type { KnockoutTieWithLegs } from "@/lib/types";
import { formatArgentinianDate } from "@/lib/date-utils";

const ExploreBtnKoMatch = ({ koMatch }: { koMatch: KnockoutTieWithLegs }) => {
  // Get the first and second legs
  const firstLeg = koMatch.legs.find((leg) => leg.legNumber === 1);
  const secondLeg = koMatch.legs.find((leg) => leg.legNumber === 2);

  const displayDate = firstLeg?.date || secondLeg?.date;

  let homeAggregate = 0;
  let awayAggregate = 0;

  // If there are two legs, calculate the aggregate score
  if (firstLeg && secondLeg) {
    homeAggregate = firstLeg.homeScore + secondLeg.awayScore;
    awayAggregate = firstLeg.awayScore + secondLeg.homeScore;
  } else if (firstLeg) {
    homeAggregate = firstLeg.homeScore;
    awayAggregate = firstLeg.awayScore;
  } else if (secondLeg) {
    homeAggregate = secondLeg.awayScore;
    awayAggregate = secondLeg.homeScore;
  }

  return (
    <Link
      href={`/komatches/${koMatch.id}`}
      id="explore-btn"
      className="flex flex-col items-center mt-7 mx-auto"
    >
      <div>
        <span className="text-center mr-3">
          {displayDate ? formatArgentinianDate(displayDate) : "Por definir"}
        </span>
      </div>
      <div className="flex items-center justify-center gap-2 mx-auto mt-2">
        <span className="text-right w-32 truncate">
          {koMatch.homeTeam.name}
        </span>
        <img
          className="w-[25px]"
          src={koMatch.homeTeam.logoUrl}
          alt={koMatch.homeTeam.name}
        />
        <span className="px-3 whitespace-nowrap font-bold">
          {homeAggregate} - {awayAggregate}
        </span>
        <img
          className="w-[25px]"
          src={koMatch.awayTeam.logoUrl}
          alt={koMatch.awayTeam.name}
        />
        <span className="text-left w-32 truncate">{koMatch.awayTeam.name}</span>
      </div>

      {/* Show details if there are more than one leg */}
      {koMatch.legs.length > 0 && (
        <div className="text-xs text-gray-400 mt-2">
          {firstLeg && (
            <span className="mr-3">
              1°: {firstLeg.homeScore}-{firstLeg.awayScore}
            </span>
          )}
          {secondLeg && (
            <span>
              2°: {secondLeg.homeScore}-{secondLeg.awayScore}
            </span>
          )}
        </div>
      )}
    </Link>
  );
};

export default ExploreBtnKoMatch;
