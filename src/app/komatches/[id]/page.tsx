import prisma from "@/lib/prisma";
import type { Player, MatchEvent } from "@/generated/prisma/client";
import { fmtAR } from "@/lib/date-utils";
import Link from "next/link";

type PlayerWithEvents = Player & {
  matchEvents: MatchEvent[];
};

export default async function KoMatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Get complete tie with its legs
  const koTie = await prisma.knockoutTie.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      homeTeam: {
        include: {
          players: {
            include: {
              matchEvents: {
                where: {
                  knockoutLeg: {
                    tieId: Number(id),
                  },
                },
              },
            },
          },
        },
      },
      awayTeam: {
        include: {
          players: {
            include: {
              matchEvents: {
                where: {
                  knockoutLeg: {
                    tieId: Number(id),
                  },
                },
              },
            },
          },
        },
      },
      legs: {
        orderBy: { legNumber: "asc" },
      },
    },
  });

  if (!koTie) {
    return <div>Match not found</div>;
  }

  const leg1 = koTie.legs.find((leg) => leg.legNumber === 1);
  const leg2 = koTie.legs.find((leg) => leg.legNumber === 2);

  // Calculate added marker
  let homeAggregate = 0;
  let awayAggregate = 0;

  if (leg1 && leg2) {
    homeAggregate = leg1.homeScore + leg2.awayScore;
    awayAggregate = leg1.awayScore + leg2.homeScore;
  } else if (leg1) {
    homeAggregate = leg1.homeScore;
    awayAggregate = leg1.awayScore;
  } else if (leg2) {
    homeAggregate = leg2.awayScore;
    awayAggregate = leg2.homeScore;
  }

  return (
    <>
      <Link
        href="/komatches"
        className="flex items-center gap-2 mb-4 text-gray-400 hover:text-white transition-colors"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Knockout Matches
      </Link>

      {/* Header with added marker */}
      <div className="explore-btn flex flex-col items-center gap-3 mb-2 mx-auto">
        <div className="flex items-center justify-around">
          <span className="flex-1 text-right mr-1 text-xl">
            {koTie.homeTeam.name}
          </span>
          <img
            className="w-[30px] mx-2"
            src={koTie.homeTeam.logoUrl}
            alt={koTie.homeTeam.name}
          />
          <span className="px-3 whitespace-nowrap text-2xl font-bold">
            {homeAggregate} - {awayAggregate}
          </span>
          <img
            className="w-[30px] mx-2"
            src={koTie.awayTeam.logoUrl}
            alt={koTie.awayTeam.name}
          />
          <span className="flex-1 text-left ml-1 text-xl">
            {koTie.awayTeam.name}
          </span>
        </div>
        <div className="text-sm text-gray-400">Aggregate Score</div>
      </div>

      {/* leg details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2 max-w-4xl mx-auto">
        {/* Leg 1 */}
        {leg1 && (
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 className="text-center font-bold text-lg mb-1">Primer Match</h3>
            <div className="text-center mb-1">
              <span className="text-gray-400 text-sm">{fmtAR(leg1.date)}</span>
            </div>
            <div className="flex justify-center items-center gap-4">
              <div className="text-right flex-1">
                <div className="font-medium">{koTie.homeTeam.shortName}</div>
                <div className="text-xs text-gray-400">Local</div>
              </div>
              <div className="text-2xl font-bold">
                {leg1.homeScore} - {leg1.awayScore}
              </div>
              <div className="text-left flex-1">
                <div className="font-medium">{koTie.awayTeam.shortName}</div>
                <div className="text-xs text-gray-400">Visitante</div>
              </div>
            </div>
          </div>
        )}

        {/* Leg 2 */}
        {leg2 && (
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 className="text-center font-bold text-lg mb-3">
              Segundo Match
            </h3>
            <div className="text-center mb-2">
              <span className="text-gray-400 text-sm">{fmtAR(leg2.date)}</span>
            </div>
            <div className="flex justify-center items-center gap-4">
              <div className="text-right flex-1">
                <div className="font-medium">{koTie.awayTeam.shortName}</div>
                <div className="text-xs text-gray-400">Local</div>
              </div>
              <div className="text-2xl font-bold">
                {leg2.homeScore} - {leg2.awayScore}
              </div>
              <div className="text-left flex-1">
                <div className="font-medium">{koTie.homeTeam.shortName}</div>
                <div className="text-xs text-gray-400">Visitante</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tie winner if defined */}
      {koTie.isFinished && koTie.winnerId && (
        <div className="text-center mb-6">
          <div className="inline-block bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-6 py-3">
            <div className="text-sm text-yellow-500 font-semibold mb-1">
              GANADOR DEL TIE
            </div>
            <div className="text-xl font-bold">
              {koTie.winnerId === koTie.homeTeamId
                ? koTie.homeTeam.name
                : koTie.awayTeam.name}
            </div>
          </div>
        </div>
      )}

      {/* Lineup and stats */}
      <h3 className="text-center mb-2 text-xl font-bold">
        Lineup & Estadísticas
      </h3>

      <div className="flex flex-col md:flex-row justify-center gap-8 w-[95%] mx-auto">
        {/* Home Team */}
        <div>
          <h4 className="text-center font-semibold mb-4">
            {koTie.homeTeam.name}
          </h4>
          <ul className="flex gap-2 flex-wrap justify-center">
            {koTie.homeTeam.players.map((player: PlayerWithEvents) => {
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

        {/* Away Team */}
        <div>
          <h4 className="text-center font-semibold mb-4">
            {koTie.awayTeam.name}
          </h4>
          <ul className="flex gap-2 flex-wrap justify-center">
            {koTie.awayTeam.players.map((player: PlayerWithEvents) => {
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
