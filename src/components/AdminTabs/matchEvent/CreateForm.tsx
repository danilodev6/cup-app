"use client";

import { useState, useRef, useTransition } from "react";
import { createMatchEvent } from "./actions";
import type {
  Tournament,
  GroupMatch,
  KnockoutLeg,
  Player,
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

type Props = {
  tournaments: Tournament[];
  groupMatches: MatchWithTeams[];
  knockoutLegs: KnockoutLegWithTeams[];
  players: Player[];
};

export default function CreateMatchEventForm({
  tournaments,
  groupMatches,
  knockoutLegs,
  players,
}: Props) {
  const [selectedTournamentId, setSelectedTournamentId] = useState<
    number | null
  >(null);
  const [selectedMatchId, setSelectedMatchId] = useState("");
  const [selectedKoLegId, setSelectedKoLegId] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const formRef = useRef<HTMLFormElement>(null);

  const sortedMatches = [...groupMatches].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const sortedKnockoutLegs = [...knockoutLegs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const filteredMatches = selectedTournamentId
    ? sortedMatches.filter((m) => m.tournamentId === selectedTournamentId)
    : [];

  const filteredKnockoutLegs = selectedTournamentId
    ? sortedKnockoutLegs.filter((leg) => {
        return true;
      })
    : [];

  // getting teams from selected match
  const selectedMatch = filteredMatches.find(
    (m) => m.id === Number(selectedMatchId),
  );
  const selectedKoLeg = filteredKnockoutLegs.find(
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

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await createMatchEvent(formData);
        setMessage("✅ Match Event created successfully!");
        formRef.current?.reset();
        setTimeout(() => setMessage(""), 1500);
      } catch (error) {
        setMessage("❌ Error creating match event");
      }
    });
  };

  return (
    <form
      action={handleSubmit}
      ref={formRef}
      className="flex flex-col gap-4 form-container-small"
    >
      <select
        name="tournamentId"
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        onChange={(e) => setSelectedTournamentId(Number(e.target.value))}
        disabled={isPending}
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
        disabled={!!selectedKoLegId || isPending || !selectedTournamentId}
      >
        <option value="">Select Group Match (optional)</option>
        {filteredMatches.map((m) => (
          <option key={m.id} value={m.id}>
            {formatArgentinianDate(m.date)}: {m.homeTeam.name} vs{" "}
            {m.awayTeam.name}
          </option>
        ))}
      </select>

      <select
        name="knockoutLegId"
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        value={selectedKoLegId}
        onChange={(e) => {
          setSelectedKoLegId(e.target.value);
          setSelectedTeamId("");
          if (e.target.value) setSelectedMatchId("");
        }}
        disabled={!!selectedMatchId || isPending || !selectedTournamentId}
      >
        <option value="">Select Knockout Leg (optional)</option>
        {filteredKnockoutLegs.map((leg) => (
          <option key={leg.id} value={leg.id}>
            {formatArgentinianDate(leg.date)}: Leg {leg.legNumber} :{" "}
            {leg.homeTeam.name} vs {leg.awayTeam.name}
          </option>
        ))}
      </select>

      {availableTeams.length > 0 && (
        <select
          className="bg-gray-600 text-white rounded-md px-4 py-2"
          value={selectedTeamId}
          onChange={(e) => setSelectedTeamId(e.target.value)}
          disabled={isPending}
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
        disabled={isPending || !selectedTournamentId || !selectedTeamId}
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
        disabled={isPending || !selectedTournamentId}
        required
      >
        <option value="">Select Event Type</option>
        <option value="goal">Goal</option>
        <option value="yellow_card">Yellow Card</option>
        <option value="red_card">Red Card</option>
      </select>

      <button
        className="bg-green-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
        type="submit"
        disabled={isPending}
      >
        {isPending ? "Creating..." : "Create"}
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
