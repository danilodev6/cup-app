"use client";

import { useState, useTransition } from "react";
import { deleteKnockoutMatch } from "./actions";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import type { KnockoutMatch, Team } from "@/generated/prisma/client";

type KnockoutMatchWithTeams = KnockoutMatch & {
  homeTeam: Team;
  awayTeam: Team;
};

type Props = {
  knockoutMatches: KnockoutMatchWithTeams[];
};

export default function DeleteKnockoutMatchForm({ knockoutMatches }: Props) {
  const [selectedKnockoutMatch, setSelectedKnockoutMatch] =
    useState<KnockoutMatchWithTeams | null>(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const handleDelete = () => {
    if (!selectedKnockoutMatch) return;

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("KnockoutMatchId", selectedKnockoutMatch.id.toString());
        await deleteKnockoutMatch(formData);
        setMessage("✅ Knockout Match deleted successfully!");
        setSelectedKnockoutMatch(null);
        setTimeout(() => setMessage(""), 3000);
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
        name="KnockoutMatchId"
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        value={selectedKnockoutMatch?.id || ""}
        onChange={(e) => {
          const match = knockoutMatches.find(
            (km) => km.id === Number(e.target.value),
          );
          setSelectedKnockoutMatch(match || null);
        }}
        disabled={isPending}
        required
      >
        <option value="">Select Knockout Match to Delete</option>
        {knockoutMatches.map((km) => (
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
