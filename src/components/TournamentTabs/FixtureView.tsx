import prisma from "@/lib/prisma";
import MatchDay from "@/components/MatchDay";
import KoMatchDay from "../KoMatchDay";

export default async function FixtureView({
  tournamentId,
}: {
  tournamentId: string;
}) {
  const matches = await prisma.match.findMany({
    where: { tournamentId: Number(tournamentId) },
    include: { homeTeam: true, awayTeam: true, tournament: true },
  });

  const koMatches = await prisma.knockoutMatch.findMany({
    where: { tournamentId: Number(tournamentId) },
    include: { homeTeam: true, awayTeam: true, tournament: true },
  });

  if (matches.length == 0) {
    return <h2 className="text-center">No matches yet</h2>;
  }

  return (
    <div className="flex flex-col text-center mt-5 space-y-7">
      <div className="mx-auto">
        <h2>Groups Matches</h2>
        <MatchDay matches={matches} />
      </div>
      <div className="mx-auto">
        <h2>Knockout Matches</h2>
        <KoMatchDay matches={koMatches} />
      </div>
    </div>
  );
}
