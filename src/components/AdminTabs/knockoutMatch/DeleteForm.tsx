"use client";

import { deleteKnockoutMatch } from "./actions";
import type { KnockoutMatch, Team } from "@/generated/prisma/client";

type KnockoutMatchWithTeams = KnockoutMatch & {
  homeTeam: Team;
  awayTeam: Team;
};

type Props = {
  knockoutMatches: KnockoutMatchWithTeams[];
};

export default function DeleteKnockoutMatchForm({ knockoutMatches }: Props) {
  if (!knockoutMatches || knockoutMatches.length === 0) {
    return <p>No knockout matches available</p>;
  }

  return (
    <form action={deleteKnockoutMatch} className="flex flex-col gap-4">
      <select
        name="KnockoutMatchId"
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        required
      >
        <option value="">Select Knockout Match to Delete</option>
        {knockoutMatches.map((km) => (
          <option key={km.id} value={km.id}>
            KO {km.koPosition}: {km.homeTeam.name} vs {km.awayTeam.name}
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
