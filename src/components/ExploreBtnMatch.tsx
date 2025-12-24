import Link from "next/link";
import type { MatchWithTeams } from "@/lib/types";
import { formatArgentinianDate } from "../lib/date-utils";

const ExploreBtnMatch = ({ match }: { match: MatchWithTeams }) => {
  return (
    <Link
      href={`/matches/${match.id}`}
      id="explore-btn"
      className="flex flex-col items-center mt-7 mx-auto"
    >
      <div>
        <span className="text-center mr-3">
          {formatArgentinianDate(match.date)}
        </span>
      </div>
      <div className="flex items-center mx-auto">
        <span className="flex-1 text-center mr-1">{match.homeTeam.name}</span>
        <img className="w-[25px] h-[25px]" src={match.homeTeam.logoUrl} />
        <span className="px-3 whitespace-nowrap">
          {match.homeScore} - {match.awayScore}
        </span>
        <img className="w-[25px] h-[25px]" src={match.awayTeam.logoUrl} />
        <span className="flex-1 text-center ml-1">{match.awayTeam.name}</span>
      </div>
    </Link>
  );
};

export default ExploreBtnMatch;
