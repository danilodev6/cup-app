"use client";

import { useState, useRef, useTransition } from "react";
import { createMatchEvent } from "./actions";
import type {
  Tournament,
  Match,
  KnockoutMatch,
  Player,
} from "@/generated/prisma/client";

type MatchWithTeams = Match & {
  homeTeam: { id: number; name: string };
  awayTeam: { id: number; name: string };
};

type KnockoutMatchWithTeams = KnockoutMatch & {
  homeTeam: { id: number; name: string };
  awayTeam: { id: number; name: string };
};

type Props = {
  tournaments: Tournament[];
  matches: MatchWithTeams[];
  knockoutMatches: KnockoutMatchWithTeams[];
  players: Player[];
};

export default function CreateMatchEventForm({
  tournaments,
  matches,
  knockoutMatches,
  players,
}: Props) {
  const [selectedMatchId, setSelectedMatchId] = useState("");
  const [selectedKoMatchId, setSelectedKoMatchId] = useState("");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await createMatchEvent(formData);
        setMessage("✅ Match Event created successfully!");
        formRef.current?.reset();
        setTimeout(() => setMessage(""), 3000);
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
        name="matchId"
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        value={selectedMatchId}
        onChange={(e) => {
          setSelectedMatchId(e.target.value);
          if (e.target.value) setSelectedKoMatchId("");
        }}
        disabled={!!selectedKoMatchId || isPending}
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
        disabled={!!selectedMatchId || isPending}
      >
        <option value="">Select Knockout Match (optional)</option>
        {knockoutMatches.map((km) => (
          <option key={km.id} value={km.id}>
            KO {km.koPosition} - {km.leg} : {km.homeTeam.name} vs{" "}
            {km.awayTeam.name}
          </option>
        ))}
      </select>

      <select
        name="playerId"
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        disabled={isPending}
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
        disabled={isPending}
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
