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
      <button type="button" id="explore-btn" className=" mt-7 mx-auto">
        <span className="flex-1 text-right">{homeTeam}</span>
        <span className="px-3 whitespace-nowrap">
          {homeScore} - {awayScore}
        </span>
        <span className="flex-1 text-left">{awayTeam}</span>
      </button>
    </Link>
  );
};

export default ExploreBtn;
