import prisma from "@/lib/prisma";
import MatchDay from "@/components/MatchDay";

export default async function MatchesPage({
  searchParams,
}: {
  searchParams: Promise<{ tournamentId?: string }>;
}) {
  const { tournamentId } = await searchParams;

  const matches = await prisma.match.findMany({
    where: tournamentId ? { tournamentId: Number(tournamentId) } : {},
    include: { homeTeam: true, awayTeam: true },
  });

  return (
    <>
      <h2 className="text-center mt-5 space-y-7">Group Matches</h2>
      <div className="flex mx-auto">
        <MatchDay matches={matches} />
      </div>
    </>
  );
}
