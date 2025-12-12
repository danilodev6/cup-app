import prisma from "@/lib/prisma";
import KoExploreBtn from "@/components/KoExploreBtn";

export default async function KoMatchesPage({
  searchParams,
}: {
  searchParams: Promise<{ tournamentId?: string }>;
}) {
  const { tournamentId } = await searchParams;

  const matches = await prisma.knockoutMatch.findMany({
    where: tournamentId ? { tournamentId: Number(tournamentId) } : {},
    include: { homeTeam: true, awayTeam: true },
    orderBy: { koPosition: "asc" },
  });

  const rounds = [
    { title: "8vos", positions: [1, 2, 3, 4, 5, 6, 7, 8] },
    { title: "4tos", positions: [9, 10, 11, 12] },
    { title: "SEMI", positions: [13, 14] },
    { title: "3er pos", positions: [15] },
    { title: "FINAL", positions: [16] },
  ];

  return (
    <>
      <h2 className="text-center mt-5 mb-3">Knockout Matches</h2>
      <div className="mt-4 flex flex-col gap-4 mx-auto">
        {rounds.map((round) => {
          const roundMatches = matches.filter((m) =>
            round.positions.includes(m.koPosition),
          );
          if (roundMatches.length === 0) return null;
          return (
            <div key={round.title}>
              <h3 className="text-center text-xl font-bold mb-4">
                {round.title}
              </h3>
              <ul className="list-none p-0 m-0 mx-auto">
                {roundMatches.map((match) => (
                  <li key={match.id}>
                    <KoExploreBtn match={match} />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </>
  );
}
