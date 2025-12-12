"use client";

import { deleteTeam } from "./actions";
import type { Team } from "@/generated/prisma/client";

type Props = {
  teams: Team[];
};

export default function DeleteTeamForm({ teams }: Props) {
  if (!teams || teams.length === 0) {
    return <p>No teams available</p>;
  }

  return (
    <form
      action={deleteTeam}
      className="flex flex-col gap-4 form-container-small"
    >
      <select
        name="TeamId"
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        required
      >
        <option value="">Select Team to Delete</option>
        {teams.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      <button
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
        type="submit"
      >
        Delete
      </button>
    </form>
  );
}
