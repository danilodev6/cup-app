"use client";

import { useState } from "react";
import CreateKnockoutLegForm from "@/components/AdminTabs/knockoutMatch/CreateForm";
import CreateMatchForm from "@/components/AdminTabs/groupMatch/CreateForm";
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
import EditMatchForm from "@/components/AdminTabs/groupMatch/EditForm";
import DeleteMatchForm from "@/components/AdminTabs/groupMatch/DeleteForm";
import EditKnockoutLegForm from "@/components/AdminTabs/knockoutMatch/EditForm";
import DeleteKnockoutLegForm from "@/components/AdminTabs/knockoutMatch/DeleteForm";
import EditMatchEventForm from "@/components/AdminTabs/matchEvent/EditForm";
import DeleteMatchEventForm from "@/components/AdminTabs/matchEvent/DeleteForm";

import type { Tournament, Team, Player } from "@/generated/prisma/client";

import type { GroupMatchWithTeams, KnockoutTieWithLegs } from "@/lib/types";

type Props = {
  initialTab: "create" | "edit" | "delete";
  initialEntity:
    | "tournament"
    | "team"
    | "player"
    | "groupmatch"
    | "komatch"
    | "matchevent";
  tournaments: Tournament[];
  teams: Team[];
  players: Player[];
  groupMatches: GroupMatchWithTeams[];
  knockoutTies: KnockoutTieWithLegs[];
  matchEvents: any[];
};

export default function AdminTabsClient({
  initialTab,
  initialEntity,
  tournaments,
  teams,
  players,
  groupMatches,
  knockoutTies,
  matchEvents,
}: Props) {
  const [tab, setTab] = useState(initialTab);
  const [entity, setEntity] = useState(initialEntity);

  const knockoutLegs = knockoutTies.flatMap((tie) =>
    tie.legs.map((leg) => ({
      ...leg,
      homeTeam: tie.homeTeam,
      awayTeam: tie.awayTeam,
    })),
  );

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
      <div className="flex gap-6 mb-6 md:text-sm text-xs" id="explore-btn">
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
          onClick={() => setEntity("groupmatch")}
          className={entity === "groupmatch" ? "active" : ""}
        >
          Group Match
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
        {tab === "edit" && entity === "team" && (
          <EditTeamForm teams={teams} tournaments={tournaments} />
        )}
        {tab === "delete" && entity === "team" && (
          <DeleteTeamForm tournaments={tournaments} teams={teams} />
        )}
        {tab === "create" && entity === "player" && (
          <CreatePlayerForm teams={teams} tournaments={tournaments} />
        )}
        {tab === "edit" && entity === "player" && (
          <EditPlayerForm
            tournaments={tournaments}
            teams={teams}
            players={players}
          />
        )}
        {tab === "delete" && entity === "player" && (
          <DeletePlayerForm
            tournaments={tournaments}
            teams={teams}
            players={players}
          />
        )}
        {tab === "create" && entity === "groupmatch" && (
          <CreateMatchForm teams={teams} tournaments={tournaments} />
        )}
        {tab === "edit" && entity === "groupmatch" && (
          <EditMatchForm
            tournaments={tournaments}
            teams={teams}
            groupMatches={groupMatches}
          />
        )}
        {tab === "delete" && entity === "groupmatch" && (
          <DeleteMatchForm
            tournaments={tournaments}
            groupMatches={groupMatches}
          />
        )}
        {tab === "create" && entity === "komatch" && (
          <CreateKnockoutLegForm
            tournaments={tournaments}
            teams={teams}
            existingTies={knockoutTies}
          />
        )}
        {tab === "edit" && entity === "komatch" && (
          <EditKnockoutLegForm
            tournaments={tournaments}
            teams={teams}
            knockoutTies={knockoutTies}
          />
        )}
        {tab === "delete" && entity === "komatch" && (
          <DeleteKnockoutLegForm
            tournaments={tournaments}
            knockoutTies={knockoutTies}
          />
        )}
        {tab === "create" && entity === "matchevent" && (
          <CreateMatchEventForm
            tournaments={tournaments}
            groupMatches={groupMatches}
            knockoutLegs={knockoutLegs}
            players={players}
          />
        )}
        {tab === "edit" && entity === "matchevent" && (
          <EditMatchEventForm
            tournaments={tournaments}
            groupMatches={groupMatches}
            knockoutLegs={knockoutLegs}
            players={players}
            matchEvents={matchEvents}
          />
        )}
        {tab === "delete" && entity === "matchevent" && (
          <DeleteMatchEventForm
            tournaments={tournaments}
            matchEvents={matchEvents}
          />
        )}
      </div>
    </>
  );
}
