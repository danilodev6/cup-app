import Link from "next/link";
import type { Tournament } from "@/generated/prisma/client";

const ExploreBtnTournament = ({ tournament }: { tournament: Tournament }) => {
  return (
    <Link
      href={`/tournaments/${tournament.id}`}
      className="explore-btn mt-4 mx-auto max-w-[350px]"
    >
      <span className="px-3 whitespace-nowrap text-sm sm:text-base">
        {tournament.name}
      </span>
    </Link>
  );
};

export default ExploreBtnTournament;
