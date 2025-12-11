"use client";

import { deleteMatch } from "./actions";
import type { Team, Match } from "@/generated/prisma/client";

type MatchWithTeams = Match & {
  homeTeam: Team;
  awayTeam: Team;
};

type Props = {
  matches: MatchWithTeams[];
};

export default function DeleteMatchForm({ matches }: Props) {
  if (!matches || matches.length === 0) {
    return <p>No matches available</p>;
  }

  return (
    <form action={deleteMatch} className="flex flex-col gap-4">
      <select
        name="MatchId"
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        required
      >
        <option value="">Select Match to Delete</option>
        {matches.map((m) => (
          <option key={m.id} value={m.id}>
            {m.homeTeam.name} vs {m.awayTeam.name}
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
