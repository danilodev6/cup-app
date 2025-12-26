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
    | "groupmatch"
    | "komatch"
    | "matchevent";

  const tournaments = await prisma.tournament.findMany({});
  const teams = await prisma.team.findMany({
    orderBy: {
      name: "asc",
    },
  });
  const players = await prisma.player.findMany({
    orderBy: {
      name: "asc",
    },
  });
  const groupMatches = await prisma.groupMatch.findMany({
    include: {
      homeTeam: true,
      awayTeam: true,
    },
  });

  // Obtener ties con legs
  const knockoutTies = await prisma.knockoutTie.findMany({
    include: {
      homeTeam: true,
      awayTeam: true,
      legs: {
        include: {
          homeTeam: true,
          awayTeam: true,
        },
      },
    },
  });

  const matchEvents = await prisma.matchEvent.findMany({
    include: {
      player: true,
      tournament: true,
      groupMatch: {
        include: {
          homeTeam: true,
          awayTeam: true,
        },
      },
      knockoutLeg: {
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
        groupMatches={groupMatches}
        knockoutTies={knockoutTies}
        matchEvents={matchEvents}
      />
    </div>
  );
}
