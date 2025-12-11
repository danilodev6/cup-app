"use client";

import { deletePlayer } from "./actions";
import type { Player } from "@/generated/prisma/client";

type Props = {
  players: Player[];
};

export default function DeletePlayerForm({ players }: Props) {
  if (!players || players.length === 0) {
    return <p>No players available</p>;
  }

  return (
    <form action={deletePlayer} className="flex flex-col gap-4">
      <select
        name="PlayerId"
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        required
      >
        <option value="">Select Player to Delete</option>
        {players.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
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
