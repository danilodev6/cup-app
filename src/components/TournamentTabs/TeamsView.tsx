import prisma from "@/lib/prisma";
import type { Team } from "@/generated/prisma/client";
import Link from "next/link";

export default async function TeamsView({
  tournamentId,
}: {
  tournamentId: string;
}) {
  const teams = await prisma.team.findMany({
    where: { tournamentId: Number(tournamentId) },
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex items-center mx-auto">
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-auto">
        {teams.map((team: Team) => (
          <Link key={team.id} href={`/teams/${team.id}`}>
            <li
              key={team.id}
              className="explore-btn flex gap-4 text-center m-3"
            >
              <img className="w-[30px]" src={team.logoUrl} />
              <span className="text-2xl">{team.name}</span>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}
