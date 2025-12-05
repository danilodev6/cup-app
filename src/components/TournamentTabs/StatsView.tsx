import prisma from "@/lib/prisma";

export default async function StatsView({
  tournamentId,
}: {
  tournamentId: string;
}) {
  // const teams = await prisma.team.findMany({
  //   where: { tournamentId: Number(tournamentId) },
  //   include: { players: true },
  // });
  // const playersList = teams.flatMap((team) => team.players);

  const playersList = await prisma.player.findMany({
    where: { team: { tournamentId: Number(tournamentId) } },
    include: {
      team: true,
    },
  });

  // Top 3 scorers
  const topScorers = [...playersList]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  // Top 3 yellow cards
  const topYellowCards = [...playersList]
    .sort((a, b) => b.yellowCards - a.yellowCards)
    .slice(0, 3);

  // Top 3 red cards
  const topRedCards = [...playersList]
    .sort((a, b) => b.redCards - a.redCards)
    .slice(0, 3);

  return (
    <>
      <div className="space-y-8">
        {/* Goals */}
        <div>
          <div className="flex items-center mb-4">
            <img
              className="w-10 h-10 mr-2"
              src="https://xtvwxpyhtnmwykecdtad.supabase.co/storage/v1/object/sign/Photos/icons/goals.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yNTk1ZDdkNC03ODA5LTQ5MmQtYWRmMy1lYTgzZmU5Yzk1OTAiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJQaG90b3MvaWNvbnMvZ29hbHMucG5nIiwiaWF0IjoxNzY0OTY3OTg2LCJleHAiOjMzMjY5NDMxOTg2fQ.lhAciwVd73xxRXWJRg3g7OKLCWbH48DnHId7_KcEU0E"
            />
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
                <span className="ml-auto mr-4 font-bold">{player.score}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Yellow Cards */}
        <div>
          <div className="flex items-center mb-4">
            <img
              className="w-10 h-10 mr-2"
              src="https://xtvwxpyhtnmwykecdtad.supabase.co/storage/v1/object/sign/Photos/icons/yellow-card.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yNTk1ZDdkNC03ODA5LTQ5MmQtYWRmMy1lYTgzZmU5Yzk1OTAiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJQaG90b3MvaWNvbnMveWVsbG93LWNhcmQucG5nIiwiaWF0IjoxNzY0OTY4MTc1LCJleHAiOjMzMjY5NDMyMTc1fQ.ydCtGOToqJ3d3-gSbR94hmzVhSVAcaz7W0fZ72biEjI"
            />
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
        <div>
          <div className="flex items-center mb-4">
            <img
              className="w-10 h-10 mr-2"
              src="https://xtvwxpyhtnmwykecdtad.supabase.co/storage/v1/object/sign/Photos/icons/red-card.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yNTk1ZDdkNC03ODA5LTQ5MmQtYWRmMy1lYTgzZmU5Yzk1OTAiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJQaG90b3MvaWNvbnMvcmVkLWNhcmQucG5nIiwiaWF0IjoxNzY0OTY4MDcxLCJleHAiOjMzMjY5NDMyMDcxfQ.2AS2fE5918-jtTNst3NSIuScoOWZJcIOoHviWvFloIU"
            />
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
