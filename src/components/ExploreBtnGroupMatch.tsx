import Link from "next/link";
import type { GroupMatchWithTeams } from "@/lib/types";
import { fmtAR } from "@/lib/date-utils";

const ExploreBtnGroupMatch = ({
  groupMatch,
}: {
  groupMatch: GroupMatchWithTeams;
}) => {
  return (
    <Link
      href={`/groupmatches/${groupMatch.id}`}
      className="explore-match flex-col items-center mt-7 mx-auto"
    >
      <div>
        <span className="text-center text-xs sm:text-base">
          {fmtAR(groupMatch.date)}
        </span>
      </div>
      <div className="flex items-center justify-center gap-1 sm:gap-2 mx-auto mt-1">
        <span className="text-right w-20 sm:w-32 truncate text-xs sm:text-base">
          {groupMatch.homeTeam.name}
        </span>
        <img
          className="w-[20px] sm:w-[25px]"
          src={groupMatch.homeTeam.logoUrl}
          alt={groupMatch.homeTeam.name}
        />
        <span className="px-2 sm:px-3 whitespace-nowrap font-bold text-sm sm:text-base">
          {groupMatch.homeScore} - {groupMatch.awayScore}
        </span>
        <img
          className="w-[20px] sm:w-[25px]"
          src={groupMatch.awayTeam.logoUrl}
          alt={groupMatch.awayTeam.name}
        />
        <span className="text-left w-20 sm:w-32 truncate text-xs sm:text-base">
          {groupMatch.awayTeam.name}
        </span>
      </div>
    </Link>
  );
};

export default ExploreBtnGroupMatch;
