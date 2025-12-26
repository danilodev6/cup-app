import prisma from "@/lib/prisma";
import { fmtAR } from "@/lib/date-utils";
import Link from "next/link";

type TieWithLegs = {
  id: number;
  koPosition: number;
  homeTeamId: number;
  awayTeamId: number;
  homeTeam: { id: number; name: string; shortName: string; logoUrl: string };
  awayTeam: { id: number; name: string; shortName: string; logoUrl: string };
  winnerId: number | null;
  isFinished: boolean;
  legs: Array<{
    id: number;
    legNumber: number;
    date: Date;
    homeTeamId: number;
    awayTeamId: number;
    homeScore: number;
    awayScore: number;
    isFinished: boolean;
  }>;
};

export default async function KnockoutView({
  tournamentId,
}: {
  tournamentId: string;
}) {
  const ties = await prisma.knockoutTie.findMany({
    where: { tournamentId: Number(tournamentId) },
    include: {
      homeTeam: true,
      awayTeam: true,
      legs: {
        orderBy: { legNumber: "asc" },
      },
    },
    orderBy: { koPosition: "asc" },
  });

  const getTie = (position: number): TieWithLegs | null => {
    return ties.find((t) => t.koPosition === position) || null;
  };

  // Obtener resultados finales
  const finalTie = getTie(16);
  const thirdPlaceTie = getTie(15);

  return (
    <div className="md:w-[555px] md:mx-auto">
      {/* Mostrar resultados finales */}
      {finalTie?.isFinished && finalTie.winnerId && (
        <div className="mb-8 p-6 bg-gradient-to-b from-dark-100 to-dark-200 rounded-3xl border border-dark-200">
          <h2 className="text-2xl font-bold text-center mb-6 text-gradient">
            Tournament Results
          </h2>

          <div className="flex flex-col gap-4">
            {/* Champ */}
            <div className="flex items-center gap-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
              <div className="text-4xl">🏆</div>
              <img
                src={
                  finalTie.winnerId === finalTie.homeTeamId
                    ? finalTie.homeTeam.logoUrl
                    : finalTie.awayTeam.logoUrl
                }
                alt="Champion"
                className="w-12 h-12 object-contain"
              />
              <div>
                <div className="text-xs text-yellow-500 font-semibold">
                  CHAMPION
                </div>
                <div className="text-lg font-bold">
                  {finalTie.winnerId === finalTie.homeTeamId
                    ? finalTie.homeTeam.name
                    : finalTie.awayTeam.name}
                </div>
              </div>
            </div>

            {/* Runner-up */}
            <div className="flex items-center gap-4 p-4 bg-gray-500/10 border border-gray-500/30 rounded-xl">
              <div className="text-3xl">🥈</div>
              <img
                src={
                  finalTie.winnerId !== finalTie.homeTeamId
                    ? finalTie.homeTeam.logoUrl
                    : finalTie.awayTeam.logoUrl
                }
                alt="Runner-up"
                className="w-10 h-10 object-contain"
              />
              <div>
                <div className="text-xs text-gray-400 font-semibold">
                  RUNNER-UP
                </div>
                <div className="text-base font-bold">
                  {finalTie.winnerId !== finalTie.homeTeamId
                    ? finalTie.homeTeam.name
                    : finalTie.awayTeam.name}
                </div>
              </div>
            </div>

            {/* THiRD PLACE */}
            {thirdPlaceTie?.isFinished && thirdPlaceTie.winnerId && (
              <div className="flex items-center gap-4 p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl">
                <div className="text-2xl">🥉</div>
                <img
                  src={
                    thirdPlaceTie.winnerId === thirdPlaceTie.homeTeamId
                      ? thirdPlaceTie.homeTeam.logoUrl
                      : thirdPlaceTie.awayTeam.logoUrl
                  }
                  alt="Third place"
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <div className="text-xs text-orange-400 font-semibold">
                    THIRD PLACE
                  </div>
                  <div className="text-base font-bold">
                    {thirdPlaceTie.winnerId === thirdPlaceTie.homeTeamId
                      ? thirdPlaceTie.homeTeam.name
                      : thirdPlaceTie.awayTeam.name}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bracket layout */}
      <div className="bracket-flex justify-between">
        <MatchCard tournament={tournamentId} tie={getTie(1)} label="8vos" />
        <MatchCard tournament={tournamentId} tie={getTie(2)} label="8vos" />
        <div className="spacer-2" />
        <MatchCard tournament={tournamentId} tie={getTie(3)} label="8vos" />
        <MatchCard tournament={tournamentId} tie={getTie(4)} label="8vos" />
      </div>

      <div className="bracket-flex justify-around">
        <MatchCard tournament={tournamentId} tie={getTie(9)} label="4tos" />
        <MatchCard tournament={tournamentId} tie={getTie(10)} label="4tos" />
      </div>

      <div className="bracket-flex justify-center">
        <MatchCard tournament={tournamentId} tie={getTie(13)} label="Semi" />
      </div>

      <div className="bracket-flex justify-around">
        <div className="w-[97px]" />
        <MatchCard tournament={tournamentId} tie={getTie(16)} label="FINAL" />
        <MatchCard tournament={tournamentId} tie={getTie(15)} label="3ER POS" />
      </div>

      <div className="bracket-flex justify-around">
        <MatchCard tournament={tournamentId} tie={getTie(14)} label="Semi" />
      </div>

      <div className="bracket-flex justify-around">
        <MatchCard tournament={tournamentId} tie={getTie(11)} label="4tos" />
        <MatchCard tournament={tournamentId} tie={getTie(12)} label="4tos" />
      </div>

      <div className="bracket-flex justify-between">
        <MatchCard tournament={tournamentId} tie={getTie(5)} label="8vos" />
        <MatchCard tournament={tournamentId} tie={getTie(6)} label="8vos" />
        <div />
        <MatchCard tournament={tournamentId} tie={getTie(7)} label="8vos" />
        <MatchCard tournament={tournamentId} tie={getTie(8)} label="8vos" />
      </div>
    </div>
  );
}

function MatchCard({
  tournament,
  tie,
  label,
}: {
  tie: TieWithLegs | null;
  label?: string;
  tournament: string;
}) {
  if (!tie) return null;

  const leg1 = tie.legs.find((l) => l.legNumber === 1);
  const leg2 = tie.legs.find((l) => l.legNumber === 2);

  // Calcular marcador agregado si ambos legs existen
  let homeAggregate = 0;
  let awayAggregate = 0;
  let hasAggregateScore = false;

  if (leg1 && leg2) {
    // leg1: homeTeam juega en casa
    // leg2: awayTeam juega en casa (invertido)
    homeAggregate = leg1.homeScore + leg2.awayScore;
    awayAggregate = leg1.awayScore + leg2.homeScore;
    hasAggregateScore = true;
  }

  // Determinar quién perdió (para mostrar con line-through)
  const homeIsLoser = tie.isFinished && tie.winnerId === tie.awayTeamId;
  const awayIsLoser = tie.isFinished && tie.winnerId === tie.homeTeamId;

  return (
    <Link
      href={`/komatches?tournamentId=${tournament}`}
      className="ko-card flex flex-col"
    >
      {label && <div className="ko-label">{label}</div>}

      {/* Dates */}
      {(leg1?.date || leg2?.date) && (
        <div className="text-xs text-gray-400">
          {leg1?.date && fmtAR(leg1.date)}
          {leg2?.date && fmtAR(leg2.date)}
        </div>
      )}

      {/* Logos */}
      <div className="flex justify-center gap-3 mb-1 mt-1">
        <img
          className="ko-team-logo"
          src={tie.homeTeam.logoUrl}
          alt={tie.homeTeam.shortName}
        />
        <img
          className="ko-team-logo"
          src={tie.awayTeam.logoUrl}
          alt={tie.awayTeam.shortName}
        />
      </div>

      {/* Team names */}
      <div className="ko-teams flex gap-1 items-center">
        <span className={homeIsLoser ? "line-through text-gray-500" : ""}>
          {tie.homeTeam.shortName}
        </span>
        <span className={awayIsLoser ? "line-through text-gray-500" : ""}>
          {tie.awayTeam.shortName}
        </span>
      </div>

      {/* Scores */}
      <div className="flex gap-1 flex-col items-center text-sm">
        {leg1 && (
          <div className="text-gray-400">
            <span className="ko-scores">
              1°: {leg1.homeScore}-{leg1.awayScore}
            </span>
          </div>
        )}
        {leg2 && (
          <div className="text-gray-400">
            <span className="ko-scores">
              2°: {leg2.awayScore}-{leg2.homeScore}
            </span>
          </div>
        )}
        {hasAggregateScore && (
          <div className="text-white font-semibold text-xs mt-1">
            Agr: {homeAggregate}-{awayAggregate}
          </div>
        )}
      </div>

      {/* Pending indicator */}
      {!leg1 && !leg2 && (
        <div className="text-xs text-yellow-400 mt-1">Por definir</div>
      )}
      {((leg1 && !leg2) || (!leg1 && leg2)) && (
        <div className="text-xs text-blue-400 mt-1">Falta 1 leg</div>
      )}
    </Link>
  );
}
