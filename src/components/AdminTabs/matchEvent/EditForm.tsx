"use client";

import { useState, useRef, useTransition } from "react";
import { editMatchEvent } from "./actions";
import type {
  Tournament,
  GroupMatch,
  KnockoutLeg,
  Player,
  MatchEvent,
} from "@/generated/prisma/client";
import { formatArgentinianDate } from "@/lib/date-utils";

type MatchWithTeams = GroupMatch & {
  homeTeam: { id: number; name: string };
  awayTeam: { id: number; name: string };
};

type KnockoutLegWithTeams = KnockoutLeg & {
  homeTeam: { id: number; name: string };
  awayTeam: { id: number; name: string };
};

type MatchEventWithRelations = MatchEvent & {
  player: Player;
  groupMatch?: MatchWithTeams;
  knockoutLeg?: KnockoutLegWithTeams;
  tournament: Tournament;
};

type Props = {
  tournaments: Tournament[];
  groupMatches: MatchWithTeams[];
  knockoutLegs: KnockoutLegWithTeams[];
  players: Player[];
  matchEvents: MatchEventWithRelations[];
};

export default function EditMatchEventForm({
  tournaments,
  groupMatches,
  knockoutLegs,
  players,
  matchEvents,
}: Props) {
  const [selectedTournamentId, setSelectedTournamentId] = useState<
    number | null
  >(null);
  const [selectedMatchEvent, setSelectedMatchEvent] =
    useState<MatchEventWithRelations | null>(null);
  const [selectedMatchId, setSelectedMatchId] = useState("");
  const [selectedKoLegId, setSelectedKoLegId] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const formRef = useRef<HTMLFormElement>(null);

  const sortedMatchEvents = [...matchEvents].sort((a, b) => a.id - b.id);
  const filteredMatchEvents = selectedTournamentId
    ? sortedMatchEvents.filter((me) => me.tournamentId === selectedTournamentId)
    : [];

  // getting teams from selected match
  const selectedMatch = groupMatches.find(
    (m) => m.id === Number(selectedMatchId),
  );
  const selectedKoLeg = knockoutLegs.find(
    (leg) => leg.id === Number(selectedKoLegId),
  );

  const availableTeams = selectedMatch
    ? [selectedMatch.homeTeam, selectedMatch.awayTeam]
    : selectedKoLeg
      ? [selectedKoLeg.homeTeam, selectedKoLeg.awayTeam]
      : [];

  // getting players from selected team
  const filteredPlayers = selectedTeamId
    ? players.filter((p) => p.teamId === Number(selectedTeamId))
    : players;

  const handleSelectMatchEvent = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    const matchEvent = matchEvents.find((me) => me.id === selectedId) || null;
    setSelectedMatchEvent(matchEvent);
    setSelectedMatchId(matchEvent?.groupMatchId?.toString() || "");
    setSelectedKoLegId(matchEvent?.knockoutLegId?.toString() || "");
    setSelectedTeamId(matchEvent?.player.teamId.toString() || "");
  };

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await editMatchEvent(formData);
        setMessage("✅ Match Event updated successfully!");
        setSelectedMatchEvent(null);
        formRef.current?.reset();
        setTimeout(() => setMessage(""), 1500);
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
        name="tournamentId"
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        onChange={(e) => setSelectedTournamentId(Number(e.target.value))}
        disabled={isPending}
      >
        <option value="">Select Tournament</option>
        {tournaments.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      <select
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        onChange={handleSelectMatchEvent}
        value={selectedMatchEvent?.id || ""}
        disabled={isPending || !selectedTournamentId}
        required
      >
        <option value="" disabled>
          Select Match Event to Edit
        </option>
        {filteredMatchEvents.map((me) => {
          const matchInfo = me.groupMatch
            ? `[${formatArgentinianDate(me.groupMatch.date)}] GroupMatch: ${me.groupMatch.homeTeam.name} vs ${me.groupMatch.awayTeam.name}`
            : me.knockoutLeg
              ? `[${formatArgentinianDate(me.knockoutLeg.date)}] KO Leg ${me.knockoutLeg.legNumber} - ${me.knockoutLeg.homeTeam.name} vs ${me.knockoutLeg.awayTeam.name}`
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
        name="groupMatchId"
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        value={selectedMatchId}
        onChange={(e) => {
          setSelectedMatchId(e.target.value);
          setSelectedTeamId("");
          if (e.target.value) setSelectedKoLegId("");
        }}
        disabled={!selectedMatchEvent || !!selectedKoLegId || isPending}
      >
        <option value="">Select Group Match (optional)</option>
        {groupMatches.map((m) => (
          <option key={m.id} value={m.id}>
            {m.homeTeam.name} vs {m.awayTeam.name}
          </option>
        ))}
      </select>

      {/* CAMBIADO: Ahora es knockoutLegId */}
      <select
        name="knockoutLegId"
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        value={selectedKoLegId}
        onChange={(e) => {
          setSelectedKoLegId(e.target.value);
          setSelectedTeamId("");
          if (e.target.value) setSelectedMatchId("");
        }}
        disabled={!selectedMatchEvent || !!selectedMatchId || isPending}
      >
        <option value="">Select Knockout Leg (optional)</option>
        {knockoutLegs.map((leg) => (
          <option key={leg.id} value={leg.id}>
            Leg {leg.legNumber} - {leg.homeTeam.name} vs {leg.awayTeam.name}
          </option>
        ))}
      </select>

      {availableTeams.length > 0 && (
        <select
          className="bg-gray-600 text-white rounded-md px-4 py-2"
          value={selectedTeamId}
          onChange={(e) => setSelectedTeamId(e.target.value)}
          disabled={!selectedMatchEvent || isPending}
          required
        >
          <option value="">Select Team</option>
          {availableTeams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      )}

      <select
        name="playerId"
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        disabled={!selectedTeamId || isPending}
        defaultValue={selectedMatchEvent?.playerId || ""}
        required
      >
        <option value="">Select Player</option>
        {filteredPlayers.map((p) => (
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
