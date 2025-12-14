"use client";

import { useState, useTransition } from "react";
import { deleteTeam } from "./actions";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import type { Team } from "@/generated/prisma/client";

type Props = {
  teams: Team[];
};

export default function DeleteTeamForm({ teams }: Props) {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const handleDelete = () => {
    if (!selectedTeam) return;

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("TeamId", selectedTeam.id.toString());
        await deleteTeam(formData);
        setMessage("✅ Team deleted successfully!");
        setSelectedTeam(null);
        setTimeout(() => setMessage(""), 1500);
      } catch (error) {
        setMessage("❌ Error deleting team");
      }
    });
  };

  if (!teams || teams.length === 0) {
    return <p>No teams available</p>;
  }

  return (
    <div className="flex flex-col gap-4 form-container-small">
      <select
        name="TeamId"
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        value={selectedTeam?.id || ""}
        onChange={(e) => {
          const team = teams.find((t) => t.id === Number(e.target.value));
          setSelectedTeam(team || null);
        }}
        required
      >
        <option value="">Select Team to Delete</option>
        {teams.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      <ConfirmDeleteModal
        entityName="Team"
        itemName={selectedTeam?.name || ""}
        onConfirm={handleDelete}
        disabled={!selectedTeam || isPending}
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
