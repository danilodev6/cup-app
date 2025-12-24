"use client";

import { createMatch } from "./actions";
import type { Tournament, Team } from "@/generated/prisma/client";
import { useRef, useState, useTransition } from "react";

type Props = {
  tournaments: Tournament[];
  teams: Team[];
};

export default function CreateMatchForm({ tournaments, teams }: Props) {
  const [selectedTournamentId, setSelectedTournamentId] = useState<
    number | null
  >(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const filteredTeams = selectedTournamentId
    ? teams.filter((t) => t.tournamentId === selectedTournamentId)
    : [];

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await createMatch(formData);
        setMessage("✅ Match created successfully!");
        formRef.current?.reset();
        setTimeout(() => setMessage(""), 1500);
      } catch (error) {
        setMessage("❌ Error creating match");
      }
    });
  };

  return (
    <form
      action={handleSubmit}
      ref={formRef}
      className="flex flex-col gap-4 form-container-small"
    >
      <input type="datetime-local" name="date" required disabled={isPending} />

      <select
        name="tournamentId"
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        onChange={(e) => setSelectedTournamentId(Number(e.target.value))}
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
        disabled={isPending || !selectedTournamentId}
        required
      >
        <option value="">Select Home Team</option>
        {filteredTeams.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      <label className="block text-sm">Away Team</label>
      <select
        name="awayTeamId"
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        disabled={isPending || !selectedTournamentId}
        required
      >
        <option value="">Select Away Team</option>
        {filteredTeams.map((t) => (
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
            defaultValue={0}
            disabled={isPending}
            className="w-full bg-gray-600 text-white rounded-md px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Away Team Score</label>
          <input
            type="number"
            name="awayScore"
            placeholder="0"
            defaultValue={0}
            disabled={isPending}
            className="w-full bg-gray-600 text-white rounded-md px-4 py-2"
          />
        </div>
      </div>

      <label className="text-center">
        <input type="checkbox" name="isFinished" /> Finished?
      </label>

      <button
        className="bg-green-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
        type="submit"
        disabled={isPending}
      >
        {isPending ? "Creating..." : "Create"}
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
