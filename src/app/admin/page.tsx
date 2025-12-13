import AdminTabsClient from "@/components/AdminTabs/AdminTabsClient";
import prisma from "@/lib/prisma";
import { getSession, logout } from "@/lib/auth-simple";
import { redirect } from "next/navigation";

type SearchParams = {
  tab?: string;
  entity?: string;
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-center flex-1">Admin</h2>
        <form action={logout}>
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
          >
            Logout
          </button>
        </form>
      </div>

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
