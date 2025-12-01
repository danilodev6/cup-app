import Link from "next/link";
import type { MatchWithTeams } from "@/lib/types";

const ExploreBtn = ({ match }: { match: MatchWithTeams }) => {
  return (
    <Link
      href={`/matches/${match.id}`}
      id="explore-btn"
      className="mt-7 mx-auto"
    >
      <span className="flex-1 text-right mr-1">{match.homeTeam.name}</span>
      <img className="w-[25px] h-[25px]" src={match.homeTeam.logoUrl} />
      <span className="px-3 whitespace-nowrap">
        {match.homeScore} - {match.awayScore}
      </span>
      <img className="w-[25px] h-[25px]" src={match.awayTeam.logoUrl} />
      <span className="flex-1 text-left ml-1">{match.awayTeam.name}</span>
    </Link>
  );
};

export default ExploreBtn;
