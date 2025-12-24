"use client";

import { useState, useTransition } from "react";
import { deletePlayer } from "./actions";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import type { Tournament, Team, Player } from "@/generated/prisma/client";

type Props = {
  tournaments: Tournament[];
  teams: Team[];
  players: Player[];
};

export default function DeletePlayerForm({
  tournaments,
  teams,
  players,
}: Props) {
  const [selectedTournamentId, setSelectedTournamentId] = useState<
    number | null
  >(null);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const filteredTeams = selectedTournamentId
    ? teams.filter((t) => t.tournamentId === selectedTournamentId)
    : [];

  const filteredPlayers = selectedTeamId
    ? players.filter((p) => p.teamId === selectedTeamId)
    : [];

  const handleDelete = () => {
    if (!selectedPlayer) return;

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("PlayerId", selectedPlayer.id.toString());
        await deletePlayer(formData);
        setMessage("✅ Player deleted successfully!");
        setSelectedPlayer(null);
        setTimeout(() => setMessage(""), 1500);
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
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        onChange={(e) => setSelectedTeamId(Number(e.target.value))}
        required
      >
        <option value="">Select Team</option>
        {filteredTeams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </select>

      <select
        name="PlayerId"
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        value={selectedPlayer?.id || ""}
        onChange={(e) => {
          const player = players.find((p) => p.id === Number(e.target.value));
          setSelectedPlayer(player || null);
        }}
        required
        disabled={isPending || !selectedTournamentId || !selectedTeamId}
      >
        <option value="">Select Player to Delete</option>
        {filteredPlayers.map((p) => (
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
