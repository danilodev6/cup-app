"use client";

import { deleteTournament } from "./actions";
import type { Tournament } from "@/generated/prisma/client";

type Props = {
  tournaments: Tournament[];
};

export default function DeleteTournamentForm({ tournaments }: Props) {
  if (!tournaments || tournaments.length === 0) {
    return <p>No tournaments available</p>;
  }

  return (
    <form action={deleteTournament} className="flex flex-col gap-4">
      <select
        name="tournamentId"
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        required
      >
        <option value="">Select Tournament to Delete</option>
        {tournaments.map((t) => (
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
