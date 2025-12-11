"use client";

import { useState } from "react";
import { editKnockoutMatch } from "./actions";
import type {
  Tournament,
  Team,
  KnockoutMatch,
} from "@/generated/prisma/client";

type KnockoutMatchWithTeams = KnockoutMatch & {
  homeTeam: Team;
  awayTeam: Team;
};

type Props = {
  tournaments: Tournament[];
  teams: Team[];
  knockoutMatches: KnockoutMatchWithTeams[];
};

export default function EditKnockoutMatchForm({
  tournaments,
  teams,
  knockoutMatches,
}: Props) {
  const [selectedKnockoutMatch, setSelectedKnockoutMatch] =
    useState<KnockoutMatchWithTeams | null>(null);

  const handleSelectKnockoutMatch = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedId = Number(e.target.value);
    const knockoutMatch =
      knockoutMatches.find((km) => km.id === selectedId) || null;
    setSelectedKnockoutMatch(knockoutMatch);
  };

  const handleSubmit = async (formData: FormData) => {
    await editKnockoutMatch(formData);
    setSelectedKnockoutMatch(null);
  };

  if (!knockoutMatches || knockoutMatches.length === 0) {
    return <p>No knockout matches available</p>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 items-start">
      <form
        action={handleSubmit}
        className="flex flex-col gap-4"
        key={selectedKnockoutMatch?.id || "no-selection"}
      >
        <input
          type="hidden"
          name="id"
          value={selectedKnockoutMatch?.id || ""}
        />

        <select
          className="bg-gray-600 text-white rounded-md px-4 py-2"
          onChange={handleSelectKnockoutMatch}
          value={selectedKnockoutMatch?.id || ""}
          required
        >
          <option value="" disabled>
            Select Knockout Match to Edit
          </option>
          {knockoutMatches.map((km) => (
            <option key={km.id} value={km.id}>
              KO {km.koPosition}: {km.homeTeam?.name || "Home"} vs{" "}
              {km.awayTeam?.name || "Away"}
            </option>
          ))}
        </select>

        <input
          type="datetime-local"
          name="date"
          required
          disabled={!selectedKnockoutMatch}
          defaultValue={
            selectedKnockoutMatch
              ? new Date(selectedKnockoutMatch.date).toISOString().slice(0, 16)
              : ""
          }
        />

        <select
          name="tournamentId"
          className="bg-gray-600 text-white rounded-md px-4 py-2"
          disabled={!selectedKnockoutMatch}
          defaultValue={selectedKnockoutMatch?.tournamentId || ""}
          required
        >
          <option value="">Select Tournament</option>
          {tournaments.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="koPosition"
          placeholder="KO Position (1-16)"
          min={1}
          max={16}
          disabled={!selectedKnockoutMatch}
          defaultValue={selectedKnockoutMatch?.koPosition || ""}
          required
        />

        <select
          name="homeTeamId"
          className="bg-gray-600 text-white rounded-md px-4 py-2"
          disabled={!selectedKnockoutMatch}
          defaultValue={selectedKnockoutMatch?.homeTeamId || ""}
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
          disabled={!selectedKnockoutMatch}
          defaultValue={selectedKnockoutMatch?.awayTeamId || ""}
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
          disabled={!selectedKnockoutMatch}
          defaultValue={selectedKnockoutMatch?.homeScore || 0}
        />

        <input
          type="number"
          name="awayScore"
          placeholder="Away Score"
          disabled={!selectedKnockoutMatch}
          defaultValue={selectedKnockoutMatch?.awayScore || 0}
        />

        <label>
          <input
            type="checkbox"
            name="isFinished"
            disabled={!selectedKnockoutMatch}
            defaultChecked={selectedKnockoutMatch?.isFinished || false}
          />{" "}
          Finished
        </label>

        <button
          className={`text-white px-4 py-2 rounded-md ${selectedKnockoutMatch ? "bg-blue-600" : "bg-gray-400"}`}
          type="submit"
          disabled={!selectedKnockoutMatch}
        >
          Edit Knockout Match
        </button>
      </form>

      <img
        src="/images/bracket-guide.png"
        alt="Bracket Guide"
        className="w-full md:w-auto md:max-w-[400px] object-contain"
      />
    </div>
  );
}
