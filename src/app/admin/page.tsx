import AdminTabsClient from "@/components/AdminTabs/AdminTabsClient";
import prisma from "@/lib/prisma";

type SearchParams = {
  tab?: string;
  entity?: string;
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const rawParams = await searchParams;

  const { tab, entity } = rawParams;

  const initialTab = (tab ?? "create") as "create" | "edit" | "delete";
  const initialEntity = (entity ?? "tournament") as
    | "tournament"
    | "team"
    | "player"
    | "match"
    | "komatch"
    | "matchevent";

  const tournaments = await prisma.tournament.findMany({});
  const teams = await prisma.team.findMany({});
  const players = await prisma.player.findMany({});
  const matches = await prisma.match.findMany({
    include: {
      homeTeam: true,
      awayTeam: true,
    },
  });
  const knockoutMatches = await prisma.knockoutMatch.findMany({
    include: {
      homeTeam: true,
      awayTeam: true,
    },
  });
  const matchEvents = await prisma.matchEvent.findMany({
    include: {
      player: true,
      match: {
        include: {
          homeTeam: true,
          awayTeam: true,
        },
      },
      knockoutMatch: {
        include: {
          homeTeam: true,
          awayTeam: true,
        },
      },
    },
  });

  return (
    <div>
      <h2 className="text-center">Admin</h2>

      <AdminTabsClient
        initialTab={initialTab}
        initialEntity={initialEntity}
        tournaments={tournaments}
        teams={teams}
        players={players}
        matches={matches}
        knockoutMatches={knockoutMatches}
        matchEvents={matchEvents}
      />
    </div>
  );
}
