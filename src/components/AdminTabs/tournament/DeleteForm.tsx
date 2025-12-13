"use client";

import { useState, useTransition } from "react";
import { deleteTournament } from "./actions";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import type { Tournament } from "@/generated/prisma/client";

type Props = {
  tournaments: Tournament[];
};

export default function DeleteTournamentForm({ tournaments }: Props) {
  const [selectedTournament, setSelectedTournament] =
    useState<Tournament | null>(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const handleDelete = () => {
    if (!selectedTournament) return;

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("tournamentId", selectedTournament.id.toString());
        await deleteTournament(formData);
        setMessage("✅ Tournament deleted successfully!");
        setSelectedTournament(null);
        setTimeout(() => setMessage(""), 3000);
      } catch (error) {
        setMessage("❌ Error deleting tournament");
      }
    });
  };

  if (!tournaments || tournaments.length === 0) {
    return <p>No tournaments available</p>;
  }

  return (
    <div className="flex flex-col gap-4 form-container-small">
      <select
        name="tournamentId"
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        value={selectedTournament?.id || ""}
        onChange={(e) => {
          const tournament = tournaments.find(
            (t) => t.id === Number(e.target.value),
          );
          setSelectedTournament(tournament || null);
        }}
        disabled={isPending}
        required
      >
        <option value="">Select Tournament to Delete</option>
        {tournaments.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      <ConfirmDeleteModal
        entityName="Tournament"
        itemName={selectedTournament?.name || ""}
        onConfirm={handleDelete}
        disabled={!selectedTournament || isPending}
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
