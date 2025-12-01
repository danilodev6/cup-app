import prisma from "@/lib/prisma";
import type { Team } from "@/generated/prisma/client";

const Teams = async () => {
  const teams = await prisma.team.findMany();

  return (
    <div className="flex mx-auto">
      <ul>
        {teams.map((team: Team) => (
          <li className="flex gap-4 mt-4" id="explore-btn" key={team.id}>
            <img className="w-[30px] h-[30px]" src={team.logoUrl} />
            <span className="text-2xl">{team.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Teams;
