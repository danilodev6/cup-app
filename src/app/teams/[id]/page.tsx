import prisma from "@/lib/prisma";

export default async function TeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // First get the tournamentId of the team
  const teamBasic = await prisma.team.findUnique({
    where: { id: Number(id) },
    select: { tournamentId: true },
  });

  if (!teamBasic) {
    return <div>Team not found</div>;
  }

  // Second, get the team with players and their match events for that tournament
  const team = await prisma.team.findUnique({
    where: { id: Number(id) },
    include: {
      players: {
        include: {
          matchEvents: {
            where: { tournamentId: teamBasic.tournamentId },
          },
        },
      },
    },
  });

  if (!team) {
    return <div>Team not found</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <img className="w-24 mt-4" src={team.logoUrl} alt={team.name} />
      <h2 className="text-3xl mt-4">{team.name}</h2>
      <ul className="mt-6 flex gap-8 flex-wrap justify-center">
        {team.players.map((player) => {
          const goals = player.matchEvents.filter(
            (e) => e.eventType === "goal",
          ).length;
          const yellowCards = player.matchEvents.filter(
            (e) => e.eventType === "yellow_card",
          ).length;
          const redCards = player.matchEvents.filter(
            (e) => e.eventType === "red_card",
          ).length;

          return (
            <li className="explore-player" key={player.id}>
              <div className="flex items-center gap-3">
                {/* Photo and name */}
                <div className="flex flex-col items-center gap-1 min-w-[80px]">
                  <img
                    className="w-12 h-12 rounded-full object-cover"
                    src={player.photoUrl}
                    alt={player.name}
                  />
                  <p className="text-xs text-center leading-tight">
                    {player.name}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <img
                      className="h-5 w-5"
                      src="/icons/goals.png"
                      alt="Goles"
                    />
                    <span className="text-sm min-w-[20px]">{goals}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <img
                      className="h-5 w-5"
                      src="/icons/yellow-card.png"
                      alt="Tarjetas amarillas"
                    />
                    <span className="text-sm min-w-[20px]">{yellowCards}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <img
                      className="h-5 w-5"
                      src="/icons/red-card.png"
                      alt="Tarjetas rojas"
                    />
                    <span className="text-sm min-w-[20px]">{redCards}</span>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
