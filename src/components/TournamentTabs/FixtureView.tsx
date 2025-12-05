import prisma from "@/lib/prisma";
import MatchDay from "@/components/MatchDay";

export default async function FixtureView({
  tournamentId,
}: {
  tournamentId: string;
}) {
  const matches = await prisma.match.findMany({
    where: { tournamentId: Number(tournamentId) },
    include: { homeTeam: true, awayTeam: true, tournament: true },
  });

  if (matches.length == 0) {
    return <h2 className="text-center">No matches yet</h2>;
  }

  return (
    <>
      <div className="text-center mt-5 space-y-7"></div>
      <div className="flex mx-auto">
        <MatchDay matches={matches} />
      </div>
    </>
  );
}
