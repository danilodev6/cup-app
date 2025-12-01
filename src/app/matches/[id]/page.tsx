import prisma from "@/lib/prisma";
import type { Player } from "@/generated/prisma/client";

export default async function MatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const match = await prisma.match.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      homeTeam: {
        include: {
          players: true,
        },
      },
      awayTeam: {
        include: {
          players: true,
        },
      },
    },
  });

  if (!match) {
    return <div>Match not found</div>;
  }

  return (
    <>
      <div className="flex" id="explore-btn">
        <span className="flex-1 text-right mr-1 text-xl">
          {match.homeTeam.name}
        </span>
        <img className="w-[30px] h-[30px]" src={match.homeTeam.logoUrl} />
        <span className="px-3 whitespace-nowrap text-xl">
          {match.homeScore} - {match.awayScore}
        </span>
        <img className="w-[30px] h-[30px]" src={match.awayTeam.logoUrl} />
        <span className="flex-1 text-left ml-1 text-xl">
          {match.awayTeam.name}
        </span>
      </div>
      <h3 className="text-center mt-4">Lineup</h3>

      <div className="flex justify-between w-[90%] mx-auto mt-4">
        <div>
          <ul>
            {match.homeTeam.players.map((player: Player) => (
              <li
                className="flex flex-col gap-4 items-center mt-4 text-xl"
                key={player.id}
              >
                {" "}
                <img id="playerPhoto" src={player.photoUrl} /> {
                  player.name
                }{" "}
              </li>
            ))}
          </ul>
        </div>
        <div className="ml-4">
          <ul>
            {match.awayTeam.players.map((player: Player) => (
              <li
                className="flex flex-col gap-4 items-center mt-4 text-xl"
                key={player.id}
              >
                {" "}
                <img id="playerPhoto" src={player.photoUrl} /> {
                  player.name
                }{" "}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
