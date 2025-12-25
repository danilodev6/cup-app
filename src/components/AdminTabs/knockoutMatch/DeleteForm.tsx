"use client";

import { useState, useTransition } from "react";
import { deleteKnockoutMatch } from "./actions";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import type {
  Tournament,
  KnockoutMatch,
  Team,
} from "@/generated/prisma/client";

type KnockoutMatchWithTeams = KnockoutMatch & {
  homeTeam: Team;
  awayTeam: Team;
};

type Props = {
  tournaments: Tournament[];
  knockoutMatches: KnockoutMatchWithTeams[];
};

export default function DeleteKnockoutMatchForm({
  tournaments,
  knockoutMatches,
}: Props) {
  const [selectedTournamentId, setSelectedTournamentId] = useState<
    number | null
  >(null);
  const [selectedKnockoutMatch, setSelectedKnockoutMatch] =
    useState<KnockoutMatchWithTeams | null>(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const filteredKnockoutMatches = selectedTournamentId
    ? knockoutMatches.filter((km) => km.tournamentId === selectedTournamentId)
    : [];

  const handleDelete = () => {
    if (!selectedKnockoutMatch) return;

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("KnockoutMatchId", selectedKnockoutMatch.id.toString());
        await deleteKnockoutMatch(formData);
        setMessage("✅ Knockout Match deleted successfully!");
        setSelectedKnockoutMatch(null);
        setTimeout(() => setMessage(""), 1500);
      } catch (error) {
        setMessage("❌ Error deleting knockout match");
      }
    });
  };

  if (!knockoutMatches || knockoutMatches.length === 0) {
    return <p>No knockout matches available</p>;
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
        name="KnockoutMatchId"
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        value={selectedKnockoutMatch?.id || ""}
        onChange={(e) => {
          const match = knockoutMatches.find(
            (km) => km.id === Number(e.target.value),
          );
          setSelectedKnockoutMatch(match || null);
        }}
        disabled={isPending || !selectedTournamentId}
        required
      >
        <option value="">Select Knockout Match to Delete</option>
        {filteredKnockoutMatches.map((km) => (
          <option key={km.id} value={km.id}>
            KO {km.koPosition} {km.leg}: {km.homeTeam?.name || "Home"} vs{" "}
            {km.awayTeam?.name || "Away"}
          </option>
        ))}
      </select>

      <ConfirmDeleteModal
        entityName="Knockout Match"
        itemName={
          `KO ${selectedKnockoutMatch?.koPosition} ${selectedKnockoutMatch?.leg} - ${selectedKnockoutMatch?.homeTeam.name} vs ${selectedKnockoutMatch?.awayTeam.name}` ||
          ""
        }
        onConfirm={handleDelete}
        disabled={!selectedKnockoutMatch || isPending}
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
