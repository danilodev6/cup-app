import Link from "next/link";
import type { KnockoutMatchWithTeams } from "@/lib/types";
import { formatArgentinianDate } from "../lib/date-utils";

const KoExploreBtn = ({ match }: { match: KnockoutMatchWithTeams }) => {
  return (
    <Link
      href={`/komatches/${match.id}`}
      id="explore-btn"
      className="flex flex-col items-center mt-7 mx-auto"
    >
      <div>
        <span className="text-center mr-3">
          {formatArgentinianDate(match.date)}
        </span>
      </div>
      <div className="flex items-center justify-center gap-2 mx-auto mt-2">
        {" "}
        <span className="text-right w-32 truncate">{match.homeTeam.name}</span>{" "}
        <img className="w-[25px] h-[25px]" src={match.homeTeam.logoUrl} />
        <span className="px-3 whitespace-nowrap font-bold">
          {match.homeScore} - {match.awayScore}
        </span>
        <img className="w-[25px] h-[25px]" src={match.awayTeam.logoUrl} />
        <span className="text-left w-32 truncate">
          {match.awayTeam.name}
        </span>{" "}
      </div>
    </Link>
  );
};

export default KoExploreBtn;
