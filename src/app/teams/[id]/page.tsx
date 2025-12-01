import prisma from "@/lib/prisma";

export default async function TeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const team = await prisma.team.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      players: true,
    },
  });

  if (!team) {
    return <div>Team not found</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <img className="w-24 h-24 mt-4" src={team.logoUrl} alt={team.name} />
      <h2 className="text-3xl mt-4">{team.name}</h2>
      <ul className="mt-6 flex gap-8 flex-wrap justify-center">
        {team.players.map((player) => (
          <li className="flex flex-col gap-4 items-center" key={player.id}>
            <img id="playerPhoto" src={player.photoUrl} alt={player.name} />
            <p>{player.name}</p>
            <div className="text-sm flex gap-1 items-center">
              <img className="w-10 h-10" src="@/../icons/goals.png" />
              <span>{player.score}</span>
              <img className="w-10 h-10" src="@/../icons/yellow-card.png" />
              <span>{player.yellowCards}</span>
              <img className="w-10 h-10" src="@/../icons/red-card.png" />
              <span>{player.redCards}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
