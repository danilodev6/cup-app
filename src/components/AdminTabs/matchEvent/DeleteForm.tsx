"use client";

import { useState, useTransition } from "react";
import { deleteMatchEvent } from "./actions";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
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
  const [selectedMatchEvent, setSelectedMatchEvent] =
    useState<MatchEventWithRelations | null>(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const handleDelete = () => {
    if (!selectedMatchEvent) return;

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("MatchEventId", selectedMatchEvent.id.toString());
        await deleteMatchEvent(formData);
        setMessage("✅ Match Event deleted successfully!");
        setSelectedMatchEvent(null);
        setTimeout(() => setMessage(""), 3000);
      } catch (error) {
        setMessage("❌ Error deleting match event");
      }
    });
  };

  if (!matchEvents || matchEvents.length === 0) {
    return <p>No match events available</p>;
  }

  return (
    <div className="flex flex-col gap-4 form-container-small">
      <select
        name="MatchEventId"
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        value={selectedMatchEvent?.id || ""}
        onChange={(e) => {
          const matchEvent = matchEvents.find(
            (me) => me.id === Number(e.target.value),
          );
          setSelectedMatchEvent(matchEvent || null);
        }}
        disabled={isPending}
        required
      >
        <option value="">Select Match Event to Delete</option>
        {matchEvents.map((me) => (
          <option key={me.id} value={me.id}>
            {me.player.name} - {me.eventType} ({me.match?.homeTeam.name} vs{" "}
            {me.match?.awayTeam.name})
          </option>
        ))}
      </select>

      <ConfirmDeleteModal
        entityName="Match Event"
        itemName={
          `${selectedMatchEvent?.player.name} - ${selectedMatchEvent?.eventType} (${selectedMatchEvent?.match?.homeTeam.name} vs ${selectedMatchEvent?.match?.awayTeam.name})` ||
          ""
        }
        onConfirm={handleDelete}
        disabled={!selectedMatchEvent || isPending}
      />

      {message && (
        <p
          className={`text-center text-sm font-medium ${message.includes("✅") ? "text-green-400" : "text-red-400"}`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
