import Link from "next/link";
import type { Tournament } from "@/generated/prisma/client";

const ExploreTournament = ({ tournament }: { tournament: Tournament }) => {
  return (
    <Link
      href={`/tournaments/${tournament.id}`}
      id="explore-btn"
      className="mt-4 mx-auto w-[350px]"
    >
      <span className="px-3 whitespace-nowrap">{tournament.name}</span>
    </Link>
  );
};

export default ExploreTournament;
