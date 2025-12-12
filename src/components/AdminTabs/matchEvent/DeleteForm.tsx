"use client";

import { deleteMatchEvent } from "./actions";
import type {
  MatchEvent,
  Player,
  Match,
  KnockoutMatch,
} from "@/generated/prisma/client";

type MatchWithTeams = Match & {
  homeTeam: { id: number; name: string };
  awayTeam: { id: number; name: string };
};

type KnockoutMatchWithTeams = KnockoutMatch & {
  homeTeam: { id: number; name: string };
  awayTeam: { id: number; name: string };
};

type MatchEventWithRelations = MatchEvent & {
  player: Player;
  match?: MatchWithTeams;
  knockoutMatch?: KnockoutMatchWithTeams;
};

type Props = {
  matchEvents: MatchEventWithRelations[];
};

export default function DeleteMatchEventForm({ matchEvents }: Props) {
  if (!matchEvents || matchEvents.length === 0) {
    return <p>No match events available</p>;
  }

  return (
    <form
      action={deleteMatchEvent}
      className="flex flex-col gap-4 form-container-small"
    >
      <select
        name="MatchEventId"
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        required
      >
        <option value="">Select Match Event to Delete</option>
        {matchEvents.map((me) => {
          const matchInfo = me.match
            ? `${me.match.homeTeam.name} vs ${me.match.awayTeam.name}`
            : me.knockoutMatch
              ? `KO ${me.knockoutMatch.koPosition} - ${me.knockoutMatch.homeTeam.name} vs ${me.knockoutMatch.awayTeam.name}`
              : "No match";
          return (
            <option key={me.id} value={me.id}>
              {me.player.name} - {me.eventType} ({matchInfo})
            </option>
          );
        })}
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
