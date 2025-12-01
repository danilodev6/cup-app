import prisma from "@/lib/prisma";
import MatchDay from "@/components/MatchDay";

export default async function MatchesPageTournament({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const matches = await prisma.match.findMany({
    where: { tournamentId: Number(id) },
    include: { homeTeam: true, awayTeam: true, tournament: true },
  });
  console.log("Matches for tournament", id, matches);

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
