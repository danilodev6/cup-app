import prisma from "@/lib/prisma";
import type { KnockoutMatchWithTeams } from "@/lib/types";
import { formatArgentinianDateKo } from "@/lib/date-utils";
import Link from "next/link";

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

  return (
    <div className="md:w-[555px] md:mx-auto">
      {/* Row 1 */}
      <div className="bracket-flex justify-between">
        <MatchCard matches={getMatches(1)} label="8vos" />
        <MatchCard matches={getMatches(2)} label="8vos" />
        <div className="spacer-2" />
        <MatchCard matches={getMatches(3)} label="8vos" />
        <MatchCard matches={getMatches(4)} label="8vos" />
      </div>
      {/* Row 2 */}
      <div className="bracket-flex justify-around">
        <MatchCard matches={getMatches(9)} label="4tos" />
        <MatchCard matches={getMatches(10)} label="4tos" />
      </div>
      {/* Row 3 */}
      <div className="bracket-flex justify-center">
        <MatchCard matches={getMatches(13)} label="Semi" />
      </div>
      {/* Row 4 */}
      <div className="bracket-flex justify-around">
        <div className="w-[103px]" />
        <MatchCard matches={getMatches(16)} label="FINAL" />
        <MatchCard matches={getMatches(15)} label="3ER POS" />
      </div>
      {/* Row 5 */}
      <div className="bracket-flex justify-around">
        <MatchCard matches={getMatches(14)} label="Semi" />
      </div>
      {/* Row 6 */}
      <div className="bracket-flex justify-around">
        <MatchCard matches={getMatches(11)} label="4tos" />
        <MatchCard matches={getMatches(12)} label="4tos" />
      </div>

      {/* Row 7 */}
      <div className="bracket-flex justify-between">
        <MatchCard matches={getMatches(5)} label="8vos" />
        <MatchCard matches={getMatches(6)} label="8vos" />
        <div />
        <MatchCard matches={getMatches(7)} label="8vos" />
        <MatchCard matches={getMatches(8)} label="8vos" />
      </div>
    </div>
  );
}

function MatchCard({
  matches,
  label,
}: {
  matches: {
    first: KnockoutMatchWithTeams | null;
    second: KnockoutMatchWithTeams | null;
  };
  label?: string;
}) {
  const { first, second } = matches;

  if (!first && !second) return null;

  const displayMatch = first || second;

  return (
    <Link href="/komatches" className="ko-card flex flex-col">
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
        <span>{displayMatch?.homeTeam.shortName}</span>
        <span>{displayMatch?.awayTeam.shortName}</span>
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
