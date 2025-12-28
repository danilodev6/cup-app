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
      <div className="space-y-8 w-full max-w-[500px] mx-auto px-4">
        {/* Goals */}
        <div className="explore-stat flex flex-col w-full">
          <div className="flex items-center mb-4">
            <img
              className="w-10 h-10 mr-2"
              src="/icons/goals.png"
              alt="Goals"
            />
            <h3 className="text-2xl font-bold">Goals</h3>
          </div>
          <div className="space-y-3">
            {topScorers.map((player, index) => (
              <div key={player.id} className="flex items-center gap-3">
                <span className="font-bold w-6 text-center">{index + 1}.</span>
                <img
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  src={player.photoUrl}
                  alt={player.name}
                />
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-medium truncate">{player.name}</span>
                  <span className="text-xs text-gray-400 truncate">
                    {player.team.name}
                  </span>
                </div>
                <span className="font-bold text-lg flex-shrink-0">
                  {player.goals}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Yellow Cards */}
        <div className="explore-stat flex flex-col w-full">
          <div className="flex items-center mb-4">
            <img
              className="w-10 h-10 mr-2"
              src="/icons/yellow-card.png"
              alt="Yellow Cards"
            />
            <h3 className="text-2xl font-bold">Yellow Cards</h3>
          </div>
          <div className="space-y-3">
            {topYellowCards.map((player, index) => (
              <div key={player.id} className="flex items-center gap-3">
                <span className="font-bold w-6 text-center">{index + 1}.</span>
                <img
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  src={player.photoUrl}
                  alt={player.name}
                />
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-medium truncate">{player.name}</span>
                  <span className="text-xs text-gray-400 truncate">
                    {player.team.name}
                  </span>
                </div>
                <span className="font-bold text-lg flex-shrink-0">
                  {player.yellowCards}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Red Cards */}
        <div className="explore-stat flex flex-col w-full">
          <div className="flex items-center mb-4">
            <img
              className="w-10 h-10 mr-2"
              src="/icons/red-card.png"
              alt="Red Cards"
            />
            <h3 className="text-2xl font-bold">Red Cards</h3>
          </div>
          <div className="space-y-3">
            {topRedCards.map((player, index) => (
              <div key={player.id} className="flex items-center gap-3">
                <span className="font-bold w-6 text-center">{index + 1}.</span>
                <img
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  src={player.photoUrl}
                  alt={player.name}
                />
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-medium truncate">{player.name}</span>
                  <span className="text-xs text-gray-400 truncate">
                    {player.team.name}
                  </span>
                </div>
                <span className="font-bold text-lg flex-shrink-0">
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
