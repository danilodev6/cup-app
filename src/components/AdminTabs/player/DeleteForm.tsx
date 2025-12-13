"use client";

import { useState, useTransition } from "react";
import { deletePlayer } from "./actions";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import type { Player } from "@/generated/prisma/client";

type Props = {
  players: Player[];
};

export default function DeletePlayerForm({ players }: Props) {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const handleDelete = () => {
    if (!selectedPlayer) return;

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("PlayerId", selectedPlayer.id.toString());
        await deletePlayer(formData);
        setMessage("✅ Player deleted successfully!");
        setSelectedPlayer(null);
        setTimeout(() => setMessage(""), 3000);
      } catch (error) {
        setMessage("❌ Error deleting player");
      }
    });
  };

  if (!players || players.length === 0) {
    return <p>No players available</p>;
  }

  return (
    <div className="flex flex-col gap-4 form-container-small">
      <select
        name="PlayerId"
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        value={selectedPlayer?.id || ""}
        onChange={(e) => {
          const player = players.find((p) => p.id === Number(e.target.value));
          setSelectedPlayer(player || null);
        }}
        required
      >
        <option value="">Select Player to Delete</option>
        {players.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <ConfirmDeleteModal
        entityName="Player"
        itemName={selectedPlayer?.name || ""}
        onConfirm={handleDelete}
        disabled={!selectedPlayer || isPending}
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
