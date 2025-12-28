import prisma from "@/lib/prisma";
import type { Player, MatchEvent } from "@/generated/prisma/client";
import { fmtAR } from "@/lib/date-utils";

type PlayerWithEvents = Player & {
  matchEvents: MatchEvent[];
};

export default async function MatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const groupMatch = await prisma.groupMatch.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      homeTeam: {
        include: {
          players: {
            include: { matchEvents: { where: { groupMatchId: Number(id) } } },
          },
        },
      },
      awayTeam: {
        include: {
          players: {
            include: { matchEvents: { where: { groupMatchId: Number(id) } } },
          },
        },
      },
    },
  });

  if (!groupMatch) {
    return <div>Match not found</div>;
  }

  return (
    <>
      <div className="explore-btn flex mx-auto">
        <span className="flex-1 text-right mr-1 text-xl">
          {groupMatch.homeTeam.name}
        </span>
        <img className="w-[30px]" src={groupMatch.homeTeam.logoUrl} />
        <span className="px-3 whitespace-nowrap text-xl">
          {groupMatch.homeScore} - {groupMatch.awayScore}
        </span>
        <img className="w-[30px]" src={groupMatch.awayTeam.logoUrl} />
        <span className="flex-1 text-left ml-1 text-xl">
          {groupMatch.awayTeam.name}
        </span>
      </div>
      <span className="mt-4 text-center text-xl">
        {" "}
        {fmtAR(groupMatch.date)}{" "}
      </span>

      <h3 className="text-center mt-4">Lineup</h3>

      <div className="flex flex-col md:flex-row justify-center gap-8 w-[95%] mx-auto mt-4">
        <div>
          <h4 className="text-center font-semibold mb-4">
            {groupMatch.homeTeam.name}
          </h4>
          <ul className="flex gap-2 flex-wrap justify-center">
            {groupMatch.homeTeam.players.map((player: PlayerWithEvents) => {
              const goals = player.matchEvents.filter(
                (e: MatchEvent) => e.eventType === "goal",
              ).length;
              const yellowCards = player.matchEvents.filter(
                (e: MatchEvent) => e.eventType === "yellow_card",
              ).length;
              const redCards = player.matchEvents.filter(
                (e: MatchEvent) => e.eventType === "red_card",
              ).length;

              return (
                <li className="explore-player" key={player.id}>
                  <div className="flex items-center gap-3">
                    {/* Photo and name */}
                    <div className="flex flex-col items-center gap-1 min-w-[80px]">
                      <img
                        className="w-16 h-16 rounded-full object-cover"
                        src={player.photoUrl}
                        alt={player.name}
                      />
                      <p className="text-md text-center leading-tight">
                        {player.name}
                      </p>
                    </div>
                    {/* Stats */}
                    <div className="flex flex-col justify-center gap-1.5">
                      <div className="flex items-center gap-2">
                        <img
                          className="h-5 w-5"
                          src="/icons/goals.png"
                          alt="goals"
                        />
                        <span className="text-sm min-w-[20px]">{goals}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <img
                          className="h-5 w-5"
                          src="/icons/yellow-card.png"
                          alt="yellowCards"
                        />
                        <span className="text-sm min-w-[20px]">
                          {yellowCards}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <img
                          className="h-5 w-5"
                          src="/icons/red-card.png"
                          alt="redCards"
                        />
                        <span className="text-sm min-w-[20px]">{redCards}</span>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <h4 className="text-center font-semibold mb-4">
            {groupMatch.awayTeam.name}
          </h4>
          <ul className="flex gap-2 flex-wrap justify-center">
            {groupMatch.awayTeam.players.map((player: PlayerWithEvents) => {
              const goals = player.matchEvents.filter(
                (e: MatchEvent) => e.eventType === "goal",
              ).length;
              const yellowCards = player.matchEvents.filter(
                (e: MatchEvent) => e.eventType === "yellow_card",
              ).length;
              const redCards = player.matchEvents.filter(
                (e: MatchEvent) => e.eventType === "red_card",
              ).length;

              return (
                <li className="explore-player" key={player.id}>
                  <div className="flex items-center gap-3">
                    {/* Photo and name */}
                    <div className="flex flex-col items-center gap-1 min-w-[80px]">
                      <img
                        className="w-16 h-16 rounded-full object-cover"
                        src={player.photoUrl}
                        alt={player.name}
                      />
                      <p className="text-md text-center leading-tight">
                        {player.name}
                      </p>
                    </div>
                    {/* Stats */}
                    <div className="flex flex-col justify-center gap-1.5">
                      <div className="flex items-center gap-2">
                        <img
                          className="h-5 w-5"
                          src="/icons/goals.png"
                          alt="goals"
                        />
                        <span className="text-sm min-w-[20px]">{goals}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <img
                          className="h-5 w-5"
                          src="/icons/yellow-card.png"
                          alt="yellowCards"
                        />
                        <span className="text-sm min-w-[20px]">
                          {yellowCards}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <img
                          className="h-5 w-5"
                          src="/icons/red-card.png"
                          alt="redCards"
                        />
                        <span className="text-sm min-w-[20px]">{redCards}</span>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
