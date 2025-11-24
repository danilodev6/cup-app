import Link from "next/link";
import type { Match } from "@/lib/types";

const ExploreBtn = ({
  id,
  date,
  stage,
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
}: Match) => {
  return (
    <Link href="/">
      <button type="button" id="explore-btn" className="mt-7 mx-auto">
        <span className="flex-1 text-right mr-1">{homeTeam.name} </span>
        <img className="w-[25px] h-[25px]" src={homeTeam.logoUrl} />
        <span className="px-3 whitespace-nowrap">
          {homeScore} - {awayScore}
        </span>
        <img className="w-[25px] h-[25px]" src={awayTeam.logoUrl} />
        <span className="flex-1 text-left ml-1">{awayTeam.name}</span>
      </button>
    </Link>
  );
};

export default ExploreBtn;
