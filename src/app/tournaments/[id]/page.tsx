import prisma from "@/lib/prisma";
import GroupsView from "@/components/TournamentTabs/GroupsView";
import Link from "next/link";
import { KnockoutView } from "@/components/TournamentTabs/KnockoutView";
import FixtureView from "@/components/TournamentTabs/FixtureView";
import { StatsView } from "@/components/TournamentTabs/StatsView";

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
      <h2>{tournament?.name}</h2>
      {/* Tabs navigation */}
      <div className="flex gap-4 mb-6">
        <Link
          href={`/tournaments/${id}?tab=groups`}
          className={activeTab === "groups" ? "active" : ""}
        >
          Groups
        </Link>
        <Link href={`/tournaments/${id}?tab=knockout`}>Knockout</Link>
        <Link href={`/tournaments/${id}?tab=fixture`}>Fixture</Link>
        <Link href={`/tournaments/${id}?tab=stats`}>Stats</Link>
      </div>
      {/* Renderizado condicional */}
      {activeTab === "groups" && <GroupsView tournamentId={id} />}
      {activeTab === "knockout" && <KnockoutView />}
      {activeTab === "fixture" && <FixtureView tournamentId={id} />}
      {activeTab === "stats" && <StatsView />}
    </div>
  );
}
