"use client";

import { useState, useRef, useTransition } from "react";
import { editMatch } from "./actions";
import type { Tournament, Team, Match } from "@/generated/prisma/client";
import { formatArgentinianDate } from "@/lib/date-utils";

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
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const sortedMatches = [...matches].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const handleSelectMatch = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    const match = matches.find((m) => m.id === selectedId) || null;
    setSelectedMatch(match);
    formRef.current?.reset();
  };

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await editMatch(formData);
        setMessage("✅ Match updated successfully!");
        setSelectedMatch(null);
        formRef.current?.reset();
        setTimeout(() => setMessage(""), 1500);
      } catch (error) {
        setMessage("❌ Error updating match");
      }
    });
  };

  if (!matches || matches.length === 0) {
    return <p>No matches available</p>;
  }

  return (
    <form
      action={handleSubmit}
      ref={formRef}
      className="flex flex-col gap-4 form-container-small"
      key={selectedMatch?.id || "no-selection"}
    >
      <input type="hidden" name="id" value={selectedMatch?.id || ""} />

      <select
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        onChange={handleSelectMatch}
        value={selectedMatch?.id || ""}
        disabled={isPending}
        required
      >
        <option value="" disabled>
          Select Match to Edit
        </option>
        {sortedMatches.map((m) => (
          <option key={m.id} value={m.id}>
            {formatArgentinianDate(m.date)} : {m.homeTeam?.name || "Home"} vs{" "}
            {m.awayTeam?.name || "Away"}
          </option>
        ))}
      </select>

      <input
        type="datetime-local"
        name="date"
        required
        disabled={!selectedMatch || isPending}
        defaultValue={
          selectedMatch
            ? new Date(selectedMatch.date).toISOString().slice(0, 16)
            : ""
        }
      />

      <select
        name="tournamentId"
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        disabled={!selectedMatch || isPending}
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

      <label className="block text-sm">Home Team</label>
      <select
        name="homeTeamId"
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        disabled={!selectedMatch || isPending}
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

      <label className="block text-sm">Away Team</label>
      <select
        name="awayTeamId"
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        disabled={!selectedMatch || isPending}
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Home Team Score</label>
          <input
            type="number"
            name="homeScore"
            placeholder="0"
            disabled={!selectedMatch || isPending}
            defaultValue={selectedMatch?.homeScore || 0}
            className="w-full bg-gray-600 text-white rounded-md px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Away Team Score</label>
          <input
            type="number"
            name="awayScore"
            placeholder="0"
            disabled={!selectedMatch || isPending}
            defaultValue={selectedMatch?.awayScore || 0}
            className="w-full bg-gray-600 text-white rounded-md px-4 py-2"
          />
        </div>
      </div>

      <label className="text-center">
        <input
          type="checkbox"
          name="isFinished"
          disabled={!selectedMatch || isPending}
          defaultChecked={selectedMatch?.isFinished || false}
        />{" "}
        Finished?
      </label>

      <button
        className={`text-white px-4 py-2 rounded-md ${selectedMatch ? "bg-blue-600" : "bg-gray-400"}`}
        type="submit"
        disabled={!selectedMatch || isPending}
      >
        {isPending ? "Updating..." : "Edit Match"}
      </button>
      {message && (
        <p
          className={`text-center text-sm font-medium ${message.includes("✅") ? "text-green-400" : "text-red-400"}`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
