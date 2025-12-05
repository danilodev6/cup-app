import prisma from "@/lib/prisma";

export default async function GroupsView({
  tournamentId,
}: {
  tournamentId: string;
}) {
  const teams = await prisma.team.findMany({
    where: { tournamentId: Number(tournamentId) },
  });

  // const groups = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const groups = [...new Set(teams.map((team) => team.group))].sort();

  return (
    <div className="container mx-auto px-4 py-8 w-[90%]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {groups.map((groupName) => (
          <div
            key={groupName}
            className="border border-dark-200 bg-dark-100 rounded-3xl p-4"
          >
            <h3 className="text-xl font-semibold text-center mb-4">
              Group {groupName}
            </h3>

            <div className="space-y-3">
              {teams
                .filter((team) => team.group === groupName)
                .sort((a, b) => b.teamScore - a.teamScore)
                .map((team) => (
                  <div key={team.id} className="flex items-center gap-3">
                    <img
                      src={team.logoUrl}
                      alt={team.name}
                      className="w-6 h-6 object-contain ml-4"
                    />
                    <span className="text-left flex-1">{team.name}</span>
                    <span className="font-semibold mr-4">
                      {team.teamScore} pts
                    </span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
