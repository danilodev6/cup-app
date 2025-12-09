"use client";

import { createTeam } from "./actions";
import type { Tournament } from "@/generated/prisma/client";

type Props = {
  tournaments: Tournament[];
};

export default function CreateTeamForm({ tournaments }: Props) {
  return (
    <form action={createTeam} className="flex flex-col gap-4">
      <input name="name" placeholder="Name" required />
      <input name="shortName" placeholder="Short Name" required />
      <label className="text-white">Team Logo Image:</label>
      <input type="file" name="logoImage" accept="image/*" required />
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
      <input name="group" placeholder="Group" required />
      <button
        className="bg-green-600 text-white px-4 py-2 rounded-md"
        type="submit"
      >
        Create
      </button>
    </form>
  );
}
