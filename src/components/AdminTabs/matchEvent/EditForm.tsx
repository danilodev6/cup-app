"use client";

import { useState, useRef, useTransition } from "react";
import { editMatchEvent } from "./actions";
import type {
  Tournament,
  Match,
  KnockoutMatch,
  Player,
  MatchEvent,
} from "@/generated/prisma/client";
import { formatArgentinianDate } from "../../../lib/date-utils";

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
  tournament: Tournament;
};

type Props = {
  tournaments: Tournament[];
  matches: MatchWithTeams[];
  knockoutMatches: KnockoutMatchWithTeams[];
  players: Player[];
  matchEvents: MatchEventWithRelations[];
};

export default function EditMatchEventForm({
  tournaments,
  matches,
  knockoutMatches,
  players,
  matchEvents,
}: Props) {
  const [selectedMatchEvent, setSelectedMatchEvent] =
    useState<MatchEventWithRelations | null>(null);
  const [selectedMatchId, setSelectedMatchId] = useState("");
  const [selectedKoMatchId, setSelectedKoMatchId] = useState("");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const formRef = useRef<HTMLFormElement>(null);

  const handleSelectMatchEvent = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    const matchEvent = matchEvents.find((me) => me.id === selectedId) || null;
    setSelectedMatchEvent(matchEvent);
    setSelectedMatchId(matchEvent?.matchId?.toString() || "");
    setSelectedKoMatchId(matchEvent?.knockoutMatchId?.toString() || "");
  };

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await editMatchEvent(formData);
        setMessage("✅ Match Event updated successfully!");
        setSelectedMatchEvent(null);
        formRef.current?.reset();
        setTimeout(() => setMessage(""), 3000);
      } catch (error) {
        setMessage("❌ Error updating match event");
      }
    });
  };

  if (!matchEvents || matchEvents.length === 0) {
    return <p>No match events available</p>;
  }

  return (
    <form
      action={handleSubmit}
      ref={formRef}
      className="flex flex-col gap-4 form-container-small"
      key={selectedMatchEvent?.id || "no-selection"}
    >
      <input type="hidden" name="id" value={selectedMatchEvent?.id || ""} />

      <select
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        onChange={handleSelectMatchEvent}
        value={selectedMatchEvent?.id || ""}
        disabled={isPending}
        required
      >
        <option value="" disabled>
          Select Match Event to Edit
        </option>
        {matchEvents.map((me) => {
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

      <select
        name="tournamentId"
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        disabled={!selectedMatchEvent || isPending}
        defaultValue={selectedMatchEvent?.tournamentId || ""}
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
        name="matchId"
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        value={selectedMatchId}
        onChange={(e) => {
          setSelectedMatchId(e.target.value);
          if (e.target.value) setSelectedKoMatchId("");
        }}
        disabled={!selectedMatchEvent || !!selectedKoMatchId || isPending}
      >
        <option value="">Select Group Match (optional)</option>
        {matches.map((m) => (
          <option key={m.id} value={m.id}>
            {m.homeTeam.name} vs {m.awayTeam.name}
          </option>
        ))}
      </select>

      <select
        name="knockoutMatchId"
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        value={selectedKoMatchId}
        onChange={(e) => {
          setSelectedKoMatchId(e.target.value);
          if (e.target.value) setSelectedMatchId("");
        }}
        disabled={!selectedMatchEvent || !!selectedMatchId || isPending}
      >
        <option value="">Select Knockout Match (optional)</option>
        {knockoutMatches.map((km) => (
          <option key={km.id} value={km.id}>
            KO {km.koPosition} - {km.homeTeam.name} vs {km.awayTeam.name}
          </option>
        ))}
      </select>

      <select
        name="playerId"
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        disabled={!selectedMatchEvent || isPending}
        defaultValue={selectedMatchEvent?.playerId || ""}
        required
      >
        <option value="">Select Player</option>
        {players.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <select
        name="eventType"
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        disabled={!selectedMatchEvent || isPending}
        defaultValue={selectedMatchEvent?.eventType || ""}
        required
      >
        <option value="">Select Event Type</option>
        <option value="goal">Goal</option>
        <option value="yellow_card">Yellow Card</option>
        <option value="red_card">Red Card</option>
      </select>

      <button
        className={`text-white px-4 py-2 rounded-md ${selectedMatchEvent ? "bg-blue-600" : "bg-gray-400"}`}
        type="submit"
        disabled={!selectedMatchEvent || isPending}
      >
        {isPending ? "Updating..." : "Edit Match Event"}
      </button>
      {message && (
        <p
          className={`text-center text-sm font-medium ${message.includes("✅") ? "text-green-400" : "text-red-400"}`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
