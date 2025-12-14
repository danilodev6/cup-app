"use client";

import { useState, useTransition } from "react";
import { deleteMatch } from "./actions";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import type { Team, Match } from "@/generated/prisma/client";

type MatchWithTeams = Match & {
  homeTeam: Team;
  awayTeam: Team;
};

type Props = {
  matches: MatchWithTeams[];
};

export default function DeleteMatchForm({ matches }: Props) {
  const [selectedMatch, setSelectedMatch] = useState<MatchWithTeams | null>(
    null,
  );
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

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

  if (!matches || matches.length === 0) {
    return <p>No matches available</p>;
  }

  return (
    <div className="flex flex-col gap-4 form-container-small">
      <select
        name="MatchId"
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        value={selectedMatch?.id || ""}
        onChange={(e) => {
          const match = matches.find((m) => m.id === Number(e.target.value));
          setSelectedMatch(match || null);
        }}
        disabled={isPending}
        required
      >
        <option value="">Select Group Match to Delete</option>
        {matches.map((m) => (
          <option key={m.id} value={m.id}>
            {m.homeTeam.name} vs {m.awayTeam.name}
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
