"use client";

import { createTournament } from "./actions";

export default function CreateTournamentForm() {
  return (
    <form action={createTournament} className="flex flex-col gap-4">
      <input name="name" placeholder="Name" required />
      <input name="location" placeholder="Location" required />
      <input type="number" name="teamCount" placeholder="Team Count" />
      <input type="datetime-local" name="date" required />
      <button
        className="bg-green-600 text-white px-4 py-2 rounded-md"
        type="submit"
      >
        Create
      </button>
    </form>
  );
}
