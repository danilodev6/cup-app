import prisma from "@/lib/prisma";

export default async function StatsView({
  tournamentId,
}: {
  tournamentId: string;
}) {
  const playersList = await prisma.player.findMany({
    where: { team: { tournamentId: Number(tournamentId) } },
    include: {
      team: true,
      matchEvents: {
        where: {
          tournamentId: Number(tournamentId),
        },
      },
    },
  });

  // Calcular estadísticas desde matchEvents
  const playersWithStats = playersList.map((player) => ({
    ...player,
    goals: player.matchEvents.filter((e) => e.eventType === "goal").length,
    yellowCards: player.matchEvents.filter((e) => e.eventType === "yellow_card")
      .length,
    redCards: player.matchEvents.filter((e) => e.eventType === "red_card")
      .length,
  }));

  // Top 3 scorers
  const topScorers = [...playersWithStats]
    .filter((player) => player.goals > 0)
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 3);

  // Top 3 yellow cards
  const topYellowCards = [...playersWithStats]
    .filter((player) => player.yellowCards > 0)
    .sort((a, b) => b.yellowCards - a.yellowCards)
    .slice(0, 3);

  // Top 3 red cards
  const topRedCards = [...playersWithStats]
    .filter((player) => player.redCards > 0)
    .sort((a, b) => b.redCards - a.redCards)
    .slice(0, 3);

  return (
    <>
      <div className="space-y-8 md:w-[500px] mx-auto">
        {/* Goals */}
        <div className="explore-btn w-auto">
          <div className="flex items-center">
            <img className="w-10 h-10" src="/icons/goals.png" />
            <h3 className="text-2xl font-bold">Goals</h3>
          </div>
          <div className="space-y-2">
            {topScorers.map((player, index) => (
              <div key={player.id} className="flex items-center gap-3">
                <span className="ml-4 font-bold">{index + 1}.</span>
                <img
                  className="w-10 h-10 rounded-full object-contain ml-2"
                  src={player.photoUrl}
                />
                <span>{player.name}</span>
                <span className="text-gray-400">{player.team.name}</span>
                <span className="ml-auto mr-4 font-bold">{player.goals}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Yellow Cards */}
        <div className="explore-btn w-auto">
          <div className="flex items-center">
            <img className="w-10 h-10" src="/icons/yellow-card.png" />
            <h3 className="text-2xl font-bold">Yellow Cards</h3>
          </div>
          <div className="space-y-2">
            {topYellowCards.map((player, index) => (
              <div key={player.id} className="flex items-center gap-3">
                <span className="ml-4 font-bold">{index + 1}.</span>
                <img
                  className="w-10 h-10 rounded-full object-contain ml-2"
                  src={player.photoUrl}
                />
                <span>{player.name}</span>
                <span className="text-gray-400">{player.team.name}</span>
                <span className="ml-auto mr-4 font-bold">
                  {player.yellowCards}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Red Cards */}
        <div className="explore-btn w-auto">
          <div className="flex items-center">
            <img className="w-10 h-10" src="/icons/red-card.png" />
            <h3 className="text-2xl font-bold">Red Cards</h3>
          </div>
          <div className="space-y-2">
            {topRedCards.map((player, index) => (
              <div key={player.id} className="flex items-center gap-3">
                <span className="ml-4 font-bold">{index + 1}.</span>
                <img
                  className="w-10 h-10 rounded-full object-contain ml-2"
                  src={player.photoUrl}
                />
                <span>{player.name}</span>
                <span className="text-gray-400">{player.team.name}</span>
                <span className="ml-auto mr-4 font-bold">
                  {player.redCards}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
