"use client";

import { useState, useTransition } from "react";
import { deleteKnockoutTie, deleteKnockoutLeg } from "./actions";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import type { Tournament } from "@/generated/prisma/client";
import type { KnockoutTieWithLegs } from "@/lib/types";

type Props = {
  tournaments: Tournament[];
  knockoutTies: KnockoutTieWithLegs[];
};

export default function DeleteKnockoutLegForm({
  tournaments,
  knockoutTies,
}: Props) {
  const [selectedTournamentId, setSelectedTournamentId] = useState<
    number | null
  >(null);
  const [selectedTieId, setSelectedTieId] = useState<number | null>(null);
  const [deleteMode, setDeleteMode] = useState<"tie" | "leg">("tie");
  const [selectedLegId, setSelectedLegId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const filteredKnockoutTies = selectedTournamentId
    ? knockoutTies.filter((tie) => tie.tournamentId === selectedTournamentId)
    : [];

  const selectedTie = knockoutTies.find((tie) => tie.id === selectedTieId);
  const selectedLeg = selectedTie?.legs.find((leg) => leg.id === selectedLegId);

  const handleDeleteTie = () => {
    if (!selectedTieId) return;

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("tieId", selectedTieId.toString());
        await deleteKnockoutTie(formData);
        setMessage("✅ Knockout Tie deleted successfully!");
        setSelectedTieId(null);
        setTimeout(() => setMessage(""), 1500);
      } catch (error) {
        setMessage("❌ Error deleting knockout tie");
      }
    });
  };

  const handleDeleteLeg = () => {
    if (!selectedLegId) return;

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("legId", selectedLegId.toString());
        await deleteKnockoutLeg(formData);
        setMessage("✅ Knockout Leg deleted successfully!");
        setSelectedLegId(null);
        setTimeout(() => setMessage(""), 1500);
      } catch (error) {
        setMessage("❌ Error deleting knockout leg");
      }
    });
  };

  if (!knockoutTies || knockoutTies.length === 0) {
    return <p>No knockout ties available</p>;
  }

  return (
    <div className="flex flex-col gap-4 form-container-small">
      {/* Selector de modo */}
      <div className="flex gap-4 justify-center">
        <button
          type="button"
          onClick={() => setDeleteMode("tie")}
          className={`px-4 py-2 rounded-lg ${
            deleteMode === "tie"
              ? "bg-red-600 text-white"
              : "bg-gray-700 text-gray-300"
          }`}
        >
          Delete Entire Tie
        </button>
        <button
          type="button"
          onClick={() => setDeleteMode("leg")}
          className={`px-4 py-2 rounded-lg ${
            deleteMode === "leg"
              ? "bg-red-600 text-white"
              : "bg-gray-700 text-gray-300"
          }`}
        >
          Delete Single Leg
        </button>
      </div>

      <select
        name="tournamentId"
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        onChange={(e) => {
          setSelectedTournamentId(Number(e.target.value));
          setSelectedTieId(null);
          setSelectedLegId(null);
        }}
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
        value={selectedTieId || ""}
        onChange={(e) => {
          setSelectedTieId(Number(e.target.value));
          setSelectedLegId(null);
        }}
        disabled={isPending || !selectedTournamentId}
        required
      >
        <option value="">Select Knockout Tie</option>
        {filteredKnockoutTies.map((tie) => (
          <option key={tie.id} value={tie.id}>
            Pos {tie.koPosition}: {tie.homeTeam.name} vs {tie.awayTeam.name}
          </option>
        ))}
      </select>

      {deleteMode === "leg" && selectedTie && (
        <select
          className="bg-gray-600 text-white rounded-md px-4 py-2"
          value={selectedLegId || ""}
          onChange={(e) => setSelectedLegId(Number(e.target.value))}
          disabled={isPending || !selectedTieId}
          required
        >
          <option value="">Select Leg to Delete</option>
          {selectedTie.legs.map((leg) => (
            <option key={leg.id} value={leg.id}>
              Leg {leg.legNumber} ({leg.homeScore}-{leg.awayScore})
            </option>
          ))}
        </select>
      )}

      {deleteMode === "tie" ? (
        <ConfirmDeleteModal
          entityName="Knockout Tie"
          itemName={
            selectedTie
              ? `Pos ${selectedTie.koPosition} - ${selectedTie.homeTeam.name} vs ${selectedTie.awayTeam.name}`
              : ""
          }
          onConfirm={handleDeleteTie}
          disabled={!selectedTieId || isPending}
        />
      ) : (
        <ConfirmDeleteModal
          entityName="Knockout Leg"
          itemName={
            selectedLeg
              ? `Leg ${selectedLeg.legNumber} (${selectedLeg.homeScore}-${selectedLeg.awayScore})`
              : ""
          }
          onConfirm={handleDeleteLeg}
          disabled={!selectedLegId || isPending}
        />
      )}

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
