"use client";

import { useState } from "react";
import { editMatch } from "./actions";
import type { Tournament, Team, Match } from "@/generated/prisma/client";

type MatchWithTeams = Match & {
  homeTeam: Team;
  awayTeam: Team;
};

type Props = {
  tournaments: Tournament[];
  teams: Team[];
  matches: MatchWithTeams[];
};

export default function EditMatchForm({ tournaments, teams, matches }: Props) {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const handleSelectMatch = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    const match = matches.find((m) => m.id === selectedId) || null;
    setSelectedMatch(match);
  };

  const handleSubmit = async (formData: FormData) => {
    await editMatch(formData);
    setSelectedMatch(null);
  };

  if (!matches || matches.length === 0) {
    return <p>No matches available</p>;
  }

  return (
    <form
      action={handleSubmit}
      className="flex flex-col gap-4"
      key={selectedMatch?.id || "no-selection"}
    >
      <input type="hidden" name="id" value={selectedMatch?.id || ""} />

      <select
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        onChange={handleSelectMatch}
        value={selectedMatch?.id || ""}
        required
      >
        <option value="" disabled>
          Select Match to Edit
        </option>
        {matches.map((m) => (
          <option key={m.id} value={m.id}>
            {m.homeTeam?.name || "Home"} vs {m.awayTeam?.name || "Away"}
          </option>
        ))}
      </select>

      <input
        type="datetime-local"
        name="date"
        required
        disabled={!selectedMatch}
        defaultValue={
          selectedMatch
            ? new Date(selectedMatch.date).toISOString().slice(0, 16)
            : ""
        }
      />

      <select
        name="tournamentId"
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        disabled={!selectedMatch}
        defaultValue={selectedMatch?.tournamentId || ""}
        required
      >
        <option value="">Select Tournament</option>
        {tournaments.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      <select
        name="homeTeamId"
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        disabled={!selectedMatch}
        defaultValue={selectedMatch?.homeTeamId || ""}
        required
      >
        <option value="">Select Home Team</option>
        {teams.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      <select
        name="awayTeamId"
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        disabled={!selectedMatch}
        defaultValue={selectedMatch?.awayTeamId || ""}
        required
      >
        <option value="">Select Away Team</option>
        {teams.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        name="homeScore"
        placeholder="Home Score"
        disabled={!selectedMatch}
        defaultValue={selectedMatch?.homeScore || 0}
      />

      <input
        type="number"
        name="awayScore"
        placeholder="Away Score"
        disabled={!selectedMatch}
        defaultValue={selectedMatch?.awayScore || 0}
      />

      <label>
        <input
          type="checkbox"
          name="isFinished"
          disabled={!selectedMatch}
          defaultChecked={selectedMatch?.isFinished || false}
        />{" "}
        Finished?
      </label>

      <button
        className={`text-white px-4 py-2 rounded-md ${selectedMatch ? "bg-blue-600" : "bg-gray-400"}`}
        type="submit"
        disabled={!selectedMatch}
      >
        Edit Match
      </button>
    </form>
  );
}
