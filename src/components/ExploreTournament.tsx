import Link from "next/link";
import type { Tournament } from "@/generated/prisma/client";

const ExploreTournament = ({ tournament }: { tournament: Tournament }) => {
  return (
    <Link
      href={`/tournaments/${tournament.id}`}
      id="explore-btn"
      className="mt-7 mx-auto"
    >
      <span className="px-3 whitespace-nowrap">{tournament.name}</span>
    </Link>
  );
};

export default ExploreTournament;
