"use client";

import { useState, useTransition } from "react";
import { deleteMatchEvent } from "./actions";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import type {
  Tournament,
  MatchEvent,
  Player,
  Match,
  KnockoutMatch,
} from "@/generated/prisma/client";
import { formatArgentinianDate } from "@/lib/date-utils";

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
  tournaments: Tournament[];
  matchEvents: MatchEventWithRelations[];
};

export default function DeleteMatchEventForm({
  tournaments,
  matchEvents,
}: Props) {
  const [selectedTournamentId, setSelectedTournamentId] = useState<
    number | null
  >(null);
  const [selectedMatchEvent, setSelectedMatchEvent] =
    useState<MatchEventWithRelations | null>(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const filteredMatchEvents = selectedTournamentId
    ? matchEvents.filter((me) => me.tournamentId === selectedTournamentId)
    : [];

  const handleDelete = () => {
    if (!selectedMatchEvent) return;

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("MatchEventId", selectedMatchEvent.id.toString());
        await deleteMatchEvent(formData);
        setMessage("✅ Match Event deleted successfully!");
        setSelectedMatchEvent(null);
        setTimeout(() => setMessage(""), 1500);
      } catch (error) {
        setMessage("❌ Error deleting match event");
      }
    });
  };

  if (!matchEvents || matchEvents.length === 0) {
    return <p>No match events available</p>;
  }

  const itemName = selectedMatchEvent
    ? selectedMatchEvent.match
      ? `${selectedMatchEvent.player.name} - ${selectedMatchEvent.eventType} - group match: (${selectedMatchEvent.match.homeTeam.name} vs ${selectedMatchEvent.match.awayTeam.name})`
      : selectedMatchEvent.knockoutMatch
        ? `${selectedMatchEvent.player.name} - ${selectedMatchEvent.eventType} - ko match: (${selectedMatchEvent.knockoutMatch.homeTeam.name} vs ${selectedMatchEvent.knockoutMatch.awayTeam.name})`
        : ""
    : "";

  return (
    <div className="flex flex-col gap-4 form-container-small">
      <select
        name="tournamentId"
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        onChange={(e) => setSelectedTournamentId(Number(e.target.value))}
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
        name="MatchEventId"
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        value={selectedMatchEvent?.id || ""}
        onChange={(e) => {
          const matchEvent = matchEvents.find(
            (me) => me.id === Number(e.target.value),
          );
          setSelectedMatchEvent(matchEvent || null);
        }}
        disabled={isPending || !selectedTournamentId}
        required
      >
        <option value="">Select Match Event to Delete</option>
        {filteredMatchEvents.map((me) => {
          const matchInfo = me.match
            ? `[${formatArgentinianDate(me.match.date)}] GroupMatch: ${me.match.homeTeam.name} vs ${me.match.awayTeam.name}`
            : me.knockoutMatch
              ? `[${formatArgentinianDate(me.knockoutMatch.date)}] KO ${me.knockoutMatch.koPosition} ${me.knockoutMatch.leg} - ${me.knockoutMatch.homeTeam.name} vs ${me.knockoutMatch.awayTeam.name}`
              : "No match";
          return (
            <option key={me.id} value={me.id}>
              {me.player.name} - {me.eventType} ({matchInfo})
            </option>
          );
        })}
      </select>

      <ConfirmDeleteModal
        entityName="Match Event"
        itemName={itemName || ""}
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
