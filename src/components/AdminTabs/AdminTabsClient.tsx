"use client";

import { useState } from "react";
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

import type {
  Tournament,
  Team,
  Player,
  Match,
  KnockoutMatch,
} from "@/generated/prisma/client";

type Props = {
  initialTab: "create" | "edit" | "delete";
  initialEntity:
    | "tournament"
    | "team"
    | "player"
    | "match"
    | "komatch"
    | "matchevent";
  tournaments: Tournament[];
  teams: Team[];
  players: Player[];
  matches: Match[];
  knockoutMatches: KnockoutMatch[];
};

export default function AdminTabsClient({
  initialTab,
  initialEntity,
  tournaments,
  teams,
  players,
  matches,
  knockoutMatches,
}: Props) {
  const [tab, setTab] = useState(initialTab);
  const [entity, setEntity] = useState(initialEntity);

  return (
    <>
      {/* TABS PRINCIPALES */}
      <div className="flex gap-6 mb-6 mt-6" id="explore-btn">
        <button
          onClick={() => setTab("create")}
          className={tab === "create" ? "active" : ""}
        >
          Create
        </button>
        <button
          onClick={() => setTab("edit")}
          className={tab === "edit" ? "active" : ""}
        >
          Edit
        </button>
        <button
          onClick={() => setTab("delete")}
          className={tab === "delete" ? "active" : ""}
        >
          Delete
        </button>
      </div>

      {/* ENTIDADES */}
      <div className="flex gap-6 mb-6 text-sm" id="explore-btn">
        <button
          onClick={() => setEntity("tournament")}
          className={entity === "tournament" ? "active" : ""}
        >
          Tournament
        </button>
        <button
          onClick={() => setEntity("team")}
          className={entity === "team" ? "active" : ""}
        >
          Team
        </button>
        <button
          onClick={() => setEntity("player")}
          className={entity === "player" ? "active" : ""}
        >
          Player
        </button>
        <button
          onClick={() => setEntity("match")}
          className={entity === "match" ? "active" : ""}
        >
          Match
        </button>
        <button
          onClick={() => setEntity("komatch")}
          className={entity === "komatch" ? "active" : ""}
        >
          Knockout Match
        </button>
        <button
          onClick={() => setEntity("matchevent")}
          className={entity === "matchevent" ? "active" : ""}
        >
          Match Event
        </button>
      </div>

      <div className="form-container">
        {tab === "create" && entity === "tournament" && (
          <CreateTournamentForm />
        )}
        {tab === "edit" && entity === "tournament" && (
          <EditTournamentForm tournaments={tournaments} />
        )}
        {tab === "delete" && entity === "tournament" && (
          <DeleteTournamentForm tournaments={tournaments} />
        )}
        {tab === "create" && entity === "team" && (
          <CreateTeamForm tournaments={tournaments} />
        )}
        {tab === "edit" && entity === "team" && <EditTeamForm teams={teams} />}
        {tab === "delete" && entity === "team" && (
          <DeleteTeamForm teams={teams} />
        )}
        {tab === "create" && entity === "player" && <CreatePlayerForm />}
        {tab === "edit" && entity === "player" && (
          <EditPlayerForm players={players} />
        )}
        {tab === "delete" && entity === "player" && (
          <DeletePlayerForm players={players} />
        )}
        {tab === "create" && entity === "match" && <CreateMatchForm />}
        {tab === "edit" && entity === "match" && (
          <EditMatchForm matches={matches} />
        )}
        {tab === "delete" && entity === "match" && (
          <DeleteMatchForm matches={matches} />
        )}
        {tab === "create" && entity === "komatch" && (
          <CreateKnockoutMatchForm />
        )}
        {tab === "edit" && entity === "komatch" && (
          <EditKnockoutMatchForm komatches={komatches} />
        )}
        {tab === "delete" && entity === "komatch" && (
          <DeleteKnockoutMatchForm komatches={komatches} />
        )}
        {tab === "create" && entity === "matchevent" && (
          <CreateMatchEventForm />
        )}
        {tab === "edit" && entity === "matchevent" && (
          <EditMatchEventForm matchevents={matchevents} />
        )}
        {tab === "delete" && entity === "matchevent" && (
          <DeleteMatchEventForm matchevents={matchevents} />
        )}
      </div>
    </>
  );
}
