import prisma from "@/lib/prisma";
import type { KnockoutMatchWithTeams } from "@/lib/types";
import { formatArgentinianDateKo } from "@/lib/date-utils";
import Link from "next/link";
import { calculateWinner } from "@/lib/knockout-utils";

export default async function KnockoutView({
  tournamentId,
}: {
  tournamentId: string;
}) {
  const knockoutMatches = await prisma.knockoutMatch.findMany({
    where: { tournamentId: Number(tournamentId) },
    include: { homeTeam: true, awayTeam: true },
    orderBy: { koPosition: "asc" },
  });

  const getMatches = (
    position: number,
  ): {
    first: KnockoutMatchWithTeams | null;
    second: KnockoutMatchWithTeams | null;
  } => {
    const first =
      knockoutMatches.find(
        (m) => m.koPosition === position && m.leg === "first",
      ) || null;
    const second =
      knockoutMatches.find(
        (m) => m.koPosition === position && m.leg === "second",
      ) || null;
    return { first, second };
  };

  // set winner if final match is finished
  const finalMatches = getMatches(16);
  const thirdPlaceMatches = getMatches(15);

  const finalResult = calculateWinner(finalMatches);
  const thirdPlaceResult = calculateWinner(thirdPlaceMatches);

  return (
    <div className="md:w-[555px] md:mx-auto">
      {finalResult && (
        <div className="mb-8 p-6 bg-gradient-to-b from-dark-100 to-dark-200 rounded-3xl border border-dark-200">
          <h2 className="text-2xl font-bold text-center mb-6 text-gradient">
            Tournament Results
          </h2>

          <div className="flex flex-col gap-4">
            {/* Champ */}
            <div className="flex items-center gap-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
              <div className="text-4xl">🏆</div>
              <img
                src={finalResult.winner.logoUrl}
                alt={finalResult.winner.name}
                className="w-12 h-12 object-contain"
              />
              <div>
                <div className="text-xs text-yellow-500 font-semibold">
                  CHAMPION
                </div>
                <div className="text-lg font-bold">
                  {finalResult.winner.name}
                </div>
              </div>
            </div>

            {/* runner-up */}
            <div className="flex items-center gap-4 p-4 bg-gray-500/10 border border-gray-500/30 rounded-xl">
              <div className="text-3xl">🥈</div>
              <img
                src={finalResult.loser.logoUrl}
                alt={finalResult.loser.name}
                className="w-10 h-10 object-contain"
              />
              <div>
                <div className="text-xs text-gray-400 font-semibold">
                  RUNNER-UP
                </div>
                <div className="text-base font-bold">
                  {finalResult.loser.name}
                </div>
              </div>
            </div>

            {/* Third place */}
            {thirdPlaceResult && (
              <div className="flex items-center gap-4 p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl">
                <div className="text-2xl">🥉</div>
                <img
                  src={thirdPlaceResult.winner.logoUrl}
                  alt={thirdPlaceResult.winner.name}
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <div className="text-xs text-orange-400 font-semibold">
                    THIRD PLACE
                  </div>
                  <div className="text-base font-bold">
                    {thirdPlaceResult.winner.name}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Row 1 */}
      <div className="bracket-flex justify-between">
        <MatchCard
          tournament={tournamentId}
          matches={getMatches(1)}
          label="8vos"
        />
        <MatchCard
          tournament={tournamentId}
          matches={getMatches(2)}
          label="8vos"
        />
        <div className="spacer-2" />
        <MatchCard
          tournament={tournamentId}
          matches={getMatches(3)}
          label="8vos"
        />
        <MatchCard
          tournament={tournamentId}
          matches={getMatches(4)}
          label="8vos"
        />
      </div>
      {/* Row 2 */}
      <div className="bracket-flex justify-around">
        <MatchCard
          tournament={tournamentId}
          matches={getMatches(9)}
          label="4tos"
        />
        <MatchCard
          tournament={tournamentId}
          matches={getMatches(10)}
          label="4tos"
        />
      </div>
      {/* Row 3 */}
      <div className="bracket-flex justify-center">
        <MatchCard
          tournament={tournamentId}
          matches={getMatches(13)}
          label="Semi"
        />
      </div>
      {/* Row 4 */}
      <div className="bracket-flex justify-around">
        <div className="w-[97px]" />
        <MatchCard
          tournament={tournamentId}
          matches={getMatches(16)}
          label="FINAL"
        />
        <MatchCard
          tournament={tournamentId}
          matches={getMatches(15)}
          label="3ER POS"
        />
      </div>
      {/* Row 5 */}
      <div className="bracket-flex justify-around">
        <MatchCard
          tournament={tournamentId}
          matches={getMatches(14)}
          label="Semi"
        />
      </div>
      {/* Row 6 */}
      <div className="bracket-flex justify-around">
        <MatchCard
          tournament={tournamentId}
          matches={getMatches(11)}
          label="4tos"
        />
        <MatchCard
          tournament={tournamentId}
          matches={getMatches(12)}
          label="4tos"
        />
      </div>

      {/* Row 7 */}
      <div className="bracket-flex justify-between">
        <MatchCard
          tournament={tournamentId}
          matches={getMatches(5)}
          label="8vos"
        />
        <MatchCard
          tournament={tournamentId}
          matches={getMatches(6)}
          label="8vos"
        />
        <div />
        <MatchCard
          tournament={tournamentId}
          matches={getMatches(7)}
          label="8vos"
        />
        <MatchCard
          tournament={tournamentId}
          matches={getMatches(8)}
          label="8vos"
        />
      </div>
    </div>
  );
}

function MatchCard({
  tournament,
  matches,
  label,
}: {
  matches: {
    first: KnockoutMatchWithTeams | null;
    second: KnockoutMatchWithTeams | null;
  };
  label?: string;
  tournament: string;
}) {
  const { first, second } = matches;

  if (!first && !second) return null;

  const displayMatch = first ?? second;

  if (!displayMatch) return null;

  // Calculate winner/loser for visual indication
  const result = calculateWinner(matches);
  const loser = result
    ? result.loser === displayMatch.homeTeam
      ? "home"
      : "away"
    : null;

  return (
    <Link
      href={`/komatches?tournamentId=${tournament}`}
      className="ko-card flex flex-col"
    >
      {label && <div className="ko-label">{label}</div>}
      {displayMatch?.date && (
        <div className="text-xs">
          {formatArgentinianDateKo(displayMatch.date.toString())}
        </div>
      )}
      <div className="flex justify-center gap-3 mb-1 mt-1">
        <img
          className="ko-team-logo"
          src={displayMatch?.homeTeam.logoUrl}
          alt={displayMatch?.homeTeam.shortName}
        />
        <img
          className="ko-team-logo"
          src={displayMatch?.awayTeam.logoUrl}
          alt={displayMatch?.awayTeam.shortName}
        />
      </div>
      <div className="ko-teams flex gap-1 items-center">
        <span className={loser === "home" ? "line-through text-gray-500" : ""}>
          {displayMatch?.homeTeam.shortName}
        </span>
        <span className={loser === "away" ? "line-through text-gray-500" : ""}>
          {displayMatch?.awayTeam.shortName}
        </span>
      </div>

      {/* Mostrar ambos partidos */}
      <div className="flex gap-1 flex-col items-center text-sm">
        {first && (
          <div className="text-gray-400">
            <span className="ko-scores">1st: {first.homeScore}</span>
            <span>-</span>
            <span className="ko-scores">{first.awayScore}</span>
          </div>
        )}
        {second && (
          <div className="text-gray-400">
            <span className="ko-scores">2nd: {second.homeScore}</span>
            <span>-</span>
            <span className="ko-scores">{second.awayScore}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
