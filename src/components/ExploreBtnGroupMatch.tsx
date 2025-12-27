import Link from "next/link";
import type { GroupMatchWithTeams } from "@/lib/types";
import { fmtAR } from "@/lib/date-utils";

const ExploreBtnGourpMatch = ({
  groupMatch,
}: {
  groupMatch: GroupMatchWithTeams;
}) => {
  return (
    <Link
      href={`/groupmatches/${groupMatch.id}`}
      className="explore-btn flex flex-col items-center mt-7 mx-auto"
    >
      <div>
        <span className="text-center mr-3">{fmtAR(groupMatch.date)}</span>
      </div>
      <div className="flex items-center justify-center gap-2 mx-auto mt-2">
        {" "}
        <span className="text-right w-32 truncate">
          {groupMatch.homeTeam.name}
        </span>{" "}
        <img className="w-[25px]" src={groupMatch.homeTeam.logoUrl} />
        <span className="px-3 whitespace-nowrap font-bold">
          {groupMatch.homeScore} - {groupMatch.awayScore}
        </span>
        <img className="w-[25px]" src={groupMatch.awayTeam.logoUrl} />
        <span className="text-left w-32 truncate">
          {groupMatch.awayTeam.name}
        </span>{" "}
      </div>
    </Link>
  );
};

export default ExploreBtnGourpMatch;
