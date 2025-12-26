import prisma from "@/lib/prisma";
import GroupsView from "@/components/TournamentTabs/GroupsView";
import Link from "next/link";
import KnockoutView from "@/components/TournamentTabs/KnockoutView";
import FixtureView from "@/components/TournamentTabs/FixtureView";
import StatsView from "@/components/TournamentTabs/StatsView";
import TeamsView from "@/components/TournamentTabs/TeamsView";

export default async function TournamentPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const tournament = await prisma.tournament.findUnique({
    where: { id: parseInt(id) },
  });

  const { tab } = await searchParams;
  const activeTab = tab || "groups";

  return (
    <div>
      <h2 className="text-center">{tournament?.name}</h2>
      {/* Tabs navigation */}
      <div
        className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6 mt-6"
        id="explore-btn"
      >
        <Link
          href={`/tournaments/${id}?tab=groups`}
          className={`explore-tab text-center ${activeTab === "groups" ? "active" : ""}`}
        >
          Groups
        </Link>
        <Link
          href={`/tournaments/${id}?tab=knockout`}
          className={`explore-tab text-center ${activeTab === "knockout" ? "active" : ""}`}
        >
          Knockout
        </Link>
        <Link
          href={`/tournaments/${id}?tab=fixture`}
          className={`explore-tab text-center ${activeTab === "fixture" ? "active" : ""}`}
        >
          Fixture
        </Link>
        <Link
          href={`/tournaments/${id}?tab=teams`}
          className={`explore-tab text-center ${activeTab === "teams" ? "active" : ""}`}
        >
          Teams
        </Link>
        <Link
          href={`/tournaments/${id}?tab=stats`}
          className={`explore-tab text-center ${activeTab === "stats" ? "active" : ""}`}
        >
          Stats
        </Link>
      </div>
      {/* Renderizado condicional */}
      {activeTab === "groups" && <GroupsView tournamentId={id} />}
      {activeTab === "knockout" && <KnockoutView tournamentId={id} />}
      {activeTab === "fixture" && <FixtureView tournamentId={id} />}
      {activeTab === "stats" && <StatsView tournamentId={id} />}
      {activeTab === "teams" && <TeamsView tournamentId={id} />}
    </div>
  );
}
