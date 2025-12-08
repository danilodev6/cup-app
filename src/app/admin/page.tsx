import Link from "next/link";
import CreateKnockoutMatchForm from "@/components/AdminTabs/knockoutMatch/CreateForm";
import CreateMatchForm from "@/components/AdminTabs/match/CreateForm";
import CreateMatchEventForm from "@/components/AdminTabs/matchEvent/CreateForm";
import CreatePlayerForm from "@/components/AdminTabs/player/CreateForm";
import CreateTeamForm from "@/components/AdminTabs/team/CreateForm";
import CreateTournamentForm from "@/components/AdminTabs/tournament/CreateForm";
import EditTournamentForm from "@/components/AdminTabs/tournament/EditForm";
import DeleteTournamentForm from "@/components/AdminTabs/tournament/DeleteForm";
import EditTeamForm from "@/components/AdminTabs/team/EditForm";
import DeleteTeamForm from "@/components/AdminTabs/team/DeleteForm";
import EditPlayerForm from "@/components/AdminTabs/player/EditForm";
import DeletePlayerForm from "@/components/AdminTabs/player/DeleteForm";
import EditMatchForm from "@/components/AdminTabs/match/EditForm";
import DeleteMatchForm from "@/components/AdminTabs/match/DeleteForm";
import EditKnockoutMatchForm from "@/components/AdminTabs/knockoutMatch/EditForm";
import DeleteKnockoutMatchForm from "@/components/AdminTabs/knockoutMatch/DeleteForm";
import EditMatchEventForm from "@/components/AdminTabs/matchEvent/EditForm";
import DeleteMatchEventForm from "@/components/AdminTabs/matchEvent/DeleteForm";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; entity?: string }>;
}) {
  const { tab, entity } = await searchParams;
  const activeTab = tab || "create";
  const activeEntity = entity || "tournament";

  console.log("Search Params:", await searchParams);

  return (
    <div>
      <h2 className="text-center">Admin</h2>
      <div className="flex gap-6 mb-6 mt-6" id="explore-btn">
        <Link
          href={`/admin?tab=create`}
          className={activeTab === "create" ? "active" : ""}
        >
          Create
        </Link>
        <Link
          href={`/admin?tab=edit`}
          className={activeTab === "edit" ? "active" : ""}
        >
          Edit
        </Link>
        <Link
          href={`/admin?tab=delete`}
          className={activeTab === "delete" ? "active" : ""}
        >
          Delete
        </Link>
      </div>
      <div
        className="flex items-center text-center text-sm gap-6 mb-6 mt-6"
        id="explore-btn"
      >
        <Link
          href={`/admin?tab=${activeTab}&entity=tournament`}
          className={activeEntity === "tournament" ? "active" : ""}
        >
          Tournament
        </Link>
        <Link
          href={`/admin?tab=${activeTab}&entity=team`}
          className={activeEntity === "team" ? "active" : ""}
        >
          Team
        </Link>
        <Link
          href={`/admin?tab=${activeTab}&entity=player`}
          className={activeEntity === "player" ? "active" : ""}
        >
          Player
        </Link>
        <Link
          href={`/admin?tab=${activeTab}&entity=match`}
          className={activeEntity === "match" ? "active" : ""}
        >
          Match
        </Link>
        <Link
          href={`/admin?tab=${activeTab}&entity=komatch`}
          className={activeEntity === "komatch" ? "active" : ""}
        >
          Knockout Match
        </Link>
        <Link
          href={`/admin?tab=${activeTab}&entity=matchevent`}
          className={activeEntity === "matchevent" ? "active" : ""}
        >
          Match Event
        </Link>
      </div>
      {/* Renderizado condicional */}
      <div className="form-container">
        {activeTab === "create" && activeEntity === "tournament" && (
          <CreateTournamentForm />
        )}
        {activeTab === "edit" && activeEntity === "tournament" && (
          <EditTournamentForm />
        )}
        {activeTab === "delete" && activeEntity === "tournament" && (
          <DeleteTournamentForm />
        )}
        {activeTab === "create" && activeEntity === "team" && (
          <CreateTeamForm />
        )}
        {activeTab === "edit" && activeEntity === "team" && <EditTeamForm />}
        {activeTab === "delete" && activeEntity === "team" && (
          <DeleteTeamForm />
        )}
        {activeTab === "create" && activeEntity === "player" && (
          <CreatePlayerForm />
        )}
        {activeTab === "edit" && activeEntity === "player" && (
          <EditPlayerForm />
        )}
        {activeTab === "delete" && activeEntity === "player" && (
          <DeletePlayerForm />
        )}
        {activeTab === "create" && activeEntity === "match" && (
          <CreateMatchForm />
        )}
        {activeTab === "edit" && activeEntity === "match" && <EditMatchForm />}
        {activeTab === "delete" && activeEntity === "match" && (
          <DeleteMatchForm />
        )}
        {activeTab === "create" && activeEntity === "komatch" && (
          <CreateKnockoutMatchForm />
        )}
        {activeTab === "edit" && activeEntity === "komatch" && (
          <EditKnockoutMatchForm />
        )}
        {activeTab === "delete" && activeEntity === "komatch" && (
          <DeleteKnockoutMatchForm />
        )}
        {activeTab === "create" && activeEntity === "matchevent" && (
          <CreateMatchEventForm />
        )}
        {activeTab === "edit" && activeEntity === "matchevent" && (
          <EditMatchEventForm />
        )}
        {activeTab === "delete" && activeEntity === "matchevent" && (
          <DeleteMatchEventForm />
        )}
      </div>
    </div>
  );
}
