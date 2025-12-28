"use client";

import { useState, useTransition } from "react";
import { deleteMatch } from "./actions";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import type { Tournament, Team, GroupMatch } from "@/generated/prisma/client";
import { fmtAR } from "@/lib/date-utils";

type MatchWithTeams = GroupMatch & {
  homeTeam: Team;
  awayTeam: Team;
};

type Props = {
  tournaments: Tournament[];
  groupMatches: MatchWithTeams[];
};

export default function DeleteMatchForm({ tournaments, groupMatches }: Props) {
  const [selectedTournamentId, setSelectedTournamentId] = useState<
    number | null
  >(null);
  const [selectedMatch, setSelectedMatch] = useState<MatchWithTeams | null>(
    null,
  );
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const filteredMatches = selectedTournamentId
    ? groupMatches.filter((m) => m.tournamentId === selectedTournamentId)
    : [];

  const handleDelete = () => {
    if (!selectedMatch) return;

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("MatchId", selectedMatch.id.toString());
        await deleteMatch(formData);
        setMessage("✅ Match deleted successfully!");
        setSelectedMatch(null);
        setTimeout(() => setMessage(""), 1500);
      } catch (error) {
        setMessage("❌ Error deleting match");
      }
    });
  };

  if (!groupMatches || groupMatches.length === 0) {
    return <p>No matches available</p>;
  }

  return (
    <div className="flex flex-col gap-4 form-container-small">
      <select
        name="tournamentId"
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        onChange={(e) => setSelectedTournamentId(Number(e.target.value))}
      >
        <option value="">Select Tournament</option>
        {tournaments.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      <select
        name="MatchId"
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        value={selectedMatch?.id || ""}
        onChange={(e) => {
          const match = filteredMatches.find(
            (m) => m.id === Number(e.target.value),
          );
          setSelectedMatch(match || null);
        }}
        disabled={isPending}
        required
      >
        <option value="">Select Group Match to Delete</option>
        {filteredMatches.map((m) => (
          <option key={m.id} value={m.id}>
            {fmtAR(m.date)} - {m.homeTeam.name} vs {m.awayTeam.name}
          </option>
        ))}
      </select>

      <ConfirmDeleteModal
        entityName="Match"
        itemName={
          `${selectedMatch?.homeTeam.name} vs ${selectedMatch?.awayTeam.name}` ||
          ""
        }
        onConfirm={handleDelete}
        disabled={!selectedMatch || isPending}
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
