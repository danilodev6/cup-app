import prisma from "@/lib/prisma";
import MatchDay from "@/components/MatchDay";
import Link from "next/link";

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
      {tournamentId && (
        <Link
          href={`/tournaments/${tournamentId}?tab=fixture`}
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
          Back to Fixture
        </Link>
      )}
      <h2 className="text-center mt-5 space-y-7">Group Matches</h2>
      <div className="flex mx-auto">
        <MatchDay matches={matches} />
      </div>
    </>
  );
}
