import prisma from "@/lib/prisma";
import type { KnockoutMatchWithTeams } from "@/lib/types";
import {
  formatArgentinianDate,
  formatArgentinianDateTime,
} from "@/lib/date-utils";

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

  const getMatch = (position: number): KnockoutMatchWithTeams | null => {
    const match = knockoutMatches.find((m) => m.koPosition === position);
    return match || null;
  };

  return (
    <div className="md:w-[505px] md:mx-auto">
      {/* Row 1 */}
      <div className="bracket-flex justify-between">
        <MatchCard match={getMatch(1)} label="8vos" />
        <MatchCard match={getMatch(2)} label="8vos" />
        <div className="spacer-2" />
        <MatchCard match={getMatch(3)} label="8vos" />
        <MatchCard match={getMatch(4)} label="8vos" />
      </div>
      {/* Row 2 */}
      <div className="bracket-flex justify-around">
        <MatchCard match={getMatch(9)} label="4tos" />
        <MatchCard match={getMatch(10)} label="4tos" />
      </div>
      {/* Row 3 */}
      <div className="bracket-flex justify-center">
        <MatchCard match={getMatch(13)} label="Semi" />
      </div>
      {/* Row 4 */}
      <div className="bracket-flex justify-around">
        <div className="w-[83px] md:w-[105px]" />
        <MatchCard match={getMatch(16)} label="FINAL" />
        <MatchCard match={getMatch(15)} label="3ER" />
      </div>
      {/* Row 5 */}
      <div className="bracket-flex justify-around">
        <MatchCard match={getMatch(14)} label="Semi" />
      </div>
      {/* Row 6 */}
      <div className="bracket-flex justify-around">
        <MatchCard match={getMatch(11)} label="4tos" />
        <MatchCard match={getMatch(12)} label="4tos" />
      </div>

      {/* Row 7 */}
      <div className="bracket-flex justify-between">
        <MatchCard match={getMatch(5)} label="8vos" />
        <MatchCard match={getMatch(6)} label="8vos" />
        <div />
        <MatchCard match={getMatch(7)} label="8vos" />
        <MatchCard match={getMatch(8)} label="8vos" />
      </div>
    </div>
  );
}

function MatchCard({
  match,
  label,
}: {
  match: KnockoutMatchWithTeams | null;
  label?: string;
}) {
  if (!match) {
    return;
  }
  return (
    <div className="ko-card md:w-[105px]">
      {label && <div className="ko-label">{label}</div>}
      {match.date && <div>{formatArgentinianDate(match.date.toString())}</div>}
      {match.date && (
        <div className="mb-1">{formatArgentinianDateTime(match.date)}</div>
      )}
      <div className="flex justify-center gap-3 mb-1">
        <img
          className="ko-team-logo"
          src={match.homeTeam.logoUrl}
          alt={match.homeTeam.shortName}
        />
        <img
          className="ko-team-logo"
          src={match.awayTeam.logoUrl}
          alt={match.awayTeam.shortName}
        />
      </div>
      <div className="ko-teams">
        <span>{match.homeTeam.shortName}</span>
        <span>-</span>
        <span>{match.awayTeam.shortName}</span>
      </div>
      <div className="ko-scores">
        <span>{match.homeScore}</span>
        <span>-</span>
        <span>{match.awayScore}</span>
      </div>
    </div>
  );
}
