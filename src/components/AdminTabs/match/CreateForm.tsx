"use client";

import { createMatch } from "./actions";
import type { Tournament, Team } from "@/generated/prisma/client";
import { useRef } from "react";

type Props = {
  tournaments: Tournament[];
  teams: Team[];
};

export default function CreateMatchForm({ tournaments, teams }: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    await createMatch(formData);
    formRef.current?.reset();
  };

  return (
    <form
      action={handleSubmit}
      ref={formRef}
      className="flex flex-col gap-4 form-container-small"
    >
      <input type="datetime-local" name="date" required />

      <select
        name="tournamentId"
        className="bg-gray-600 text-white rounded-md px-4 py-2"
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
        defaultValue={0}
      />

      <input
        type="number"
        name="awayScore"
        placeholder="Away Score"
        defaultValue={0}
      />

      <label className="text-center">
        <input type="checkbox" name="isFinished" /> Finished?
      </label>

      <button
        className="bg-green-600 text-white px-4 py-2 rounded-md"
        type="submit"
      >
        Create Match
      </button>
    </form>
  );
}
