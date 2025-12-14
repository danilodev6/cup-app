import prisma from "@/lib/prisma";
import type { Player, MatchEvent } from "@/generated/prisma/client";

type PlayerWithEvents = Player & {
  matchEvents: MatchEvent[];
};

export default async function KoMatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const match = await prisma.knockoutMatch.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      homeTeam: {
        include: {
          players: {
            include: {
              matchEvents: { where: { knockoutMatchId: Number(id) } },
            },
          },
        },
      },
      awayTeam: {
        include: {
          players: {
            include: {
              matchEvents: { where: { knockoutMatchId: Number(id) } },
            },
          },
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

      <div className="flex justify-between w-[90%] md:w-[60%] mx-auto mt-4">
        <div>
          <ul>
            {match.homeTeam.players.map((player: PlayerWithEvents) => (
              <li
                className="flex flex-col gap-4 items-center mt-4 text-xl"
                key={player.id}
              >
                {" "}
                <img id="playerPhoto" src={player.photoUrl} /> {player.name}{" "}
                <div className="text-sm flex gap-1 items-center">
                  <img className="w-10 h-10" src="/icons/goals.png" />
                  {
                    player.matchEvents.filter(
                      (e: MatchEvent) => e.eventType === "goal",
                    ).length
                  }
                  <img className="w-10 h-10" src="/icons/yellow-card.png" />
                  {
                    player.matchEvents.filter(
                      (e: MatchEvent) => e.eventType === "yellow_card",
                    ).length
                  }
                  <img className="w-10 h-10" src="/icons/red-card.png" />
                  {
                    player.matchEvents.filter(
                      (e: MatchEvent) => e.eventType === "red_card",
                    ).length
                  }
                  <span className="text-sm"></span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="ml-4">
          <ul>
            {match.awayTeam.players.map((player: PlayerWithEvents) => (
              <li
                className="flex flex-col gap-4 items-center mt-4 text-xl"
                key={player.id}
              >
                {" "}
                <img id="playerPhoto" src={player.photoUrl} /> {player.name}{" "}
                <div className="text-sm flex gap-1 items-center">
                  <img className="w-10 h-10" src="/icons/goals.png" />
                  {
                    player.matchEvents.filter(
                      (e: MatchEvent) => e.eventType === "goal",
                    ).length
                  }
                  <img className="w-10 h-10" src="/icons/yellow-card.png" />
                  {
                    player.matchEvents.filter(
                      (e: MatchEvent) => e.eventType === "yellow_card",
                    ).length
                  }
                  <img className="w-10 h-10" src="/icons/red-card.png" />
                  {
                    player.matchEvents.filter(
                      (e: MatchEvent) => e.eventType === "red_card",
                    ).length
                  }
                  <span className="text-sm"></span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
