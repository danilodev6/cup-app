import Link from "next/link";
import type { KnockoutTieWithTeams } from "@/lib/types";
import { formatArgentinianDate } from "../lib/date-utils";

const KoMatchExploreBtn = ({ koMatch }: { koMatch: KnockoutTieWithTeams }) => {
  return (
    <Link
      href={`/komatches/${koMatch.id}`}
      id="explore-btn"
      className="flex flex-col items-center mt-7 mx-auto"
    >
      <div>
        <span className="text-center mr-3">
          {formatArgentinianDate(koMatch.date)}
        </span>
      </div>
      <div className="flex items-center justify-center gap-2 mx-auto mt-2">
        {" "}
        <span className="text-right w-32 truncate">
          {koMatch.homeTeam.name}
        </span>{" "}
        <img className="w-[25px]" src={koMatch.homeTeam.logoUrl} />
        <span className="px-3 whitespace-nowrap font-bold">
          {koMatch.homeScore} - {koMatch.awayScore}
        </span>
        <img className="w-[25px]" src={koMatch.awayTeam.logoUrl} />
        <span className="text-left w-32 truncate">
          {koMatch.awayTeam.name}
        </span>{" "}
      </div>
    </Link>
  );
};

export default KoMatchExploreBtn;
