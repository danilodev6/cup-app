import prisma from "@/lib/prisma";
import type { Player, MatchEvent } from "@/generated/prisma/client";
import { formatArgentinianDate } from "@/lib/date-utils";

type PlayerWithEvents = Player & {
  matchEvents: MatchEvent[];
};

export default async function KoMatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const koMatch = await prisma.knockoutMatch.findUnique({
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

  if (!koMatch) {
    return <div>Match not found</div>;
  }

  return (
    <>
      <div className="flex" id="explore-btn">
        <span className="flex-1 text-right mr-1 text-xl">
          {koMatch.homeTeam.name}
        </span>
        <img className="w-[30px]" src={koMatch.homeTeam.logoUrl} />
        <span className="px-3 whitespace-nowrap text-xl">
          {koMatch.homeScore} - {koMatch.awayScore}
        </span>
        <img className="w-[30px]" src={koMatch.awayTeam.logoUrl} />
        <span className="flex-1 text-left ml-1 text-xl">
          {koMatch.awayTeam.name}
        </span>
      </div>

      <span className="mt-4 text-center text-xl">
        {" "}
        {formatArgentinianDate(koMatch.date)}{" "}
      </span>

      <h3 className="text-center mt-4">Lineup</h3>

      <div className="flex justify-between w-[90%] md:w-[60%] mx-auto mt-4">
        <div>
          <ul>
            {koMatch.homeTeam.players.map((player: PlayerWithEvents) => (
              <li
                className="flex flex-col text-center gap-4 items-center mt-4 md:text-xl"
                key={player.id}
              >
                {" "}
                <img id="playerPhoto" src={player.photoUrl} /> {player.name}{" "}
                <div className="text-sm flex gap-1 items-center">
                  <img className="w-7 h-7" src="/icons/goals.png" />
                  {
                    player.matchEvents.filter(
                      (e: MatchEvent) => e.eventType === "goal",
                    ).length
                  }
                  <img className="w-7 h-7" src="/icons/yellow-card.png" />
                  {
                    player.matchEvents.filter(
                      (e: MatchEvent) => e.eventType === "yellow_card",
                    ).length
                  }
                  <img className="w-7 h-7" src="/icons/red-card.png" />
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
            {koMatch.awayTeam.players.map((player: PlayerWithEvents) => (
              <li
                className="flex flex-col text-center gap-4 items-center mt-4 md:text-xl"
                key={player.id}
              >
                {" "}
                <img id="playerPhoto" src={player.photoUrl} /> {player.name}{" "}
                <div className="text-sm flex gap-1 items-center">
                  <img className="w-7 h-7" src="/icons/goals.png" />
                  {
                    player.matchEvents.filter(
                      (e: MatchEvent) => e.eventType === "goal",
                    ).length
                  }
                  <img className="w-7 h-7" src="/icons/yellow-card.png" />
                  {
                    player.matchEvents.filter(
                      (e: MatchEvent) => e.eventType === "yellow_card",
                    ).length
                  }
                  <img className="w-7 h-7" src="/icons/red-card.png" />
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
