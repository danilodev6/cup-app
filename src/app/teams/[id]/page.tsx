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
      <img className="w-32 h-32 mt-4" src={team.logoUrl} alt={team.name} />
      <h2 className="text-3xl mt-4">{team.name}</h2>
      <ul className="mt-6 grid grid-cols-3 gap-4">
        {team.players.map((player) => (
          <li className="flex flex-col gap-4 items-center" key={player.id}>
            <img id="playerPhoto" src={player.photoUrl} alt={player.name} />
            <p>{player.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
