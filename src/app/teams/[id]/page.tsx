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
            <li className="flex flex-col gap-4 items-center" key={player.id}>
              <img id="playerPhoto" src={player.photoUrl} alt={player.name} />
              <p>{player.name}</p>
              <div className="text-sm flex gap-1 items-center">
                <img className="w-10 h-10" src="/icons/goals.png" />
                <span>{goals}</span>
                <img className="w-10 h-10" src="/icons/yellow-card.png" />
                <span>{yellowCards}</span>
                <img className="w-10 h-10" src="/icons/red-card.png" />
                <span>{redCards}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
