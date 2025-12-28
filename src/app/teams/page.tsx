import prisma from "@/lib/prisma";
import type { Team } from "@/generated/prisma/client";
import Link from "next/link";

const Teams = async () => {
  const teams = await prisma.team.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="flex mx-auto">
      <ul>
        {teams.map((team: Team) => (
          <Link key={team.id} href={`/teams/${team.id}`}>
            <li key={team.id} className="explore-btn flex">
              <img className="w-[30px]" src={team.logoUrl} />
              <span className="text-2xl ml-4">{team.name}</span>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default Teams;
