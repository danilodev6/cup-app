import prisma from "@/lib/prisma";
import MatchDay from "@/components/MatchDay";

export default async function MatchesPage() {
  const matches = await prisma.match.findMany({
    include: { homeTeam: true, awayTeam: true },
  });

  return (
    <>
      <h2 className="text-center mt-5 space-y-7">All Matches</h2>
      <div className="flex mx-auto">
        <MatchDay matches={matches} />
      </div>
    </>
  );
}
