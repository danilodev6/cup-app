import Link from "next/link";
import type { GroupMatchWithTeams } from "@/lib/types";
import { formatArgentinianDate } from "../lib/date-utils";

const ExploreBtn = ({ groupMatch }: { groupMatch: GroupMatchWithTeams }) => {
  return (
    <Link
      href={`/groupmatches/${groupMatch.id}`}
      id="explore-btn"
      className="mt-7 mx-auto"
    >
      <span className="text-center mr-3">
        {formatArgentinianDate(groupMatch.date)}
      </span>
      <span className="flex-1 text-center mr-1">
        {groupMatch.homeTeam.name}
      </span>
      <img className="w-[25px] h-[25px]" src={groupMatch.homeTeam.logoUrl} />
      <span className="px-3 whitespace-nowrap">
        {groupMatch.homeScore} - {groupMatch.awayScore}
      </span>
      <img className="w-[25px] h-[25px]" src={groupMatch.awayTeam.logoUrl} />
      <span className="flex-1 text-center ml-1">
        {groupMatch.awayTeam.name}
      </span>
    </Link>
  );
};

export default ExploreBtn;
