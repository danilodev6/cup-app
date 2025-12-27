"use client";

import { useState, useRef, useTransition } from "react";
import { editKnockoutLeg } from "./actions";
import type { Tournament, Team } from "@/generated/prisma/client";
import type { KnockoutTieWithLegs } from "@/lib/types";
import { fmtAR, toLocalInput } from "@/lib/date-utils";

type Props = {
  tournaments: Tournament[];
  teams: Team[];
  knockoutTies: KnockoutTieWithLegs[];
};

export default function EditKnockoutLegForm({
  tournaments,
  knockoutTies,
}: Props) {
  const [selectedTournamentId, setSelectedTournamentId] = useState<
    number | null
  >(null);
  const [selectedTieId, setSelectedTieId] = useState<number | null>(null);
  const [selectedLegNumber, setSelectedLegNumber] = useState<number | null>(
    null,
  );
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const filteredKnockoutTies = selectedTournamentId
    ? knockoutTies.filter((tie) => tie.tournamentId === selectedTournamentId)
    : [];

  const selectedTie = knockoutTies.find((tie) => tie.id === selectedTieId);
  const selectedLeg = selectedTie?.legs.find(
    (leg) => leg.legNumber === selectedLegNumber,
  );

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await editKnockoutLeg(formData);
        setMessage("✅ Knockout Leg updated successfully!");
        setSelectedTieId(null);
        setSelectedLegNumber(null);
        formRef.current?.reset();
        setTimeout(() => setMessage(""), 1500);
      } catch (error) {
        setMessage("❌ Error updating knockout leg");
      }
    });
  };

  if (!knockoutTies || knockoutTies.length === 0) {
    return <p>No knockout ties available</p>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <form
        action={handleSubmit}
        ref={formRef}
        className="flex flex-col gap-4 form-container-small"
        key={`${selectedTieId}-${selectedLegNumber}` || "no-selection"}
      >
        <input type="hidden" name="id" value={selectedLeg?.id || ""} />

        <select
          name="tournamentId"
          className="bg-gray-600 text-white rounded-md px-4 py-2"
          onChange={(e) => {
            setSelectedTournamentId(Number(e.target.value));
            setSelectedTieId(null);
            setSelectedLegNumber(null);
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
          onChange={(e) => {
            setSelectedTieId(Number(e.target.value));
            setSelectedLegNumber(null);
          }}
          value={selectedTieId || ""}
          disabled={isPending || !selectedTournamentId}
          required
        >
          <option value="">Select Knockout Tie</option>
          {filteredKnockoutTies.map((tie) => (
            <option key={tie.id} value={tie.id}>
              Pos {tie.koPosition}: {tie.homeTeam.name} vs {tie.awayTeam.name}(
              {tie.format === "single-leg" ? "1 leg" : "2 legs"})
            </option>
          ))}
        </select>

        {/* NUEVO: Mostrar información del tie seleccionado */}
        {selectedTie && (
          <div className="bg-gray-700 p-3 rounded-md text-sm">
            <p className="font-medium mb-2">Tie Information:</p>
            <p>
              <span className="text-gray-400">Format:</span>{" "}
              <span
                className={
                  selectedTie.format === "single-leg"
                    ? "text-blue-400"
                    : "text-purple-400"
                }
              >
                {selectedTie.format === "single-leg" ? "Single-Leg" : "Two-Leg"}
              </span>
            </p>
            <p>
              <span className="text-gray-400">Teams:</span>{" "}
              {selectedTie.homeTeam.name} vs {selectedTie.awayTeam.name}
            </p>
            <p>
              <span className="text-gray-400">Existing legs:</span>{" "}
              {selectedTie.legs.map((l) => `Leg ${l.legNumber}`).join(", ") ||
                "None"}
            </p>
          </div>
        )}

        {selectedTie && (
          <select
            className="bg-gray-600 text-white rounded-md px-4 py-2"
            onChange={(e) => setSelectedLegNumber(Number(e.target.value))}
            value={selectedLegNumber || ""}
            disabled={isPending || !selectedTieId}
            required
          >
            <option value="">Select Leg to Edit</option>
            {selectedTie.legs.map((leg) => (
              <option key={leg.id} value={leg.legNumber}>
                Leg {leg.legNumber} - {fmtAR(leg.date)} ({leg.homeScore}-
                {leg.awayScore})
              </option>
            ))}
          </select>
        )}

        <input
          type="datetime-local"
          name="date"
          required
          disabled={!selectedLeg || isPending}
          defaultValue={selectedLeg ? toLocalInput(selectedLeg.date) : ""}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">
              Home Team Score
              {selectedLeg &&
                selectedLeg.legNumber === 1 &&
                ` (${selectedTie?.homeTeam.name})`}
              {selectedLeg &&
                selectedLeg.legNumber === 2 &&
                ` (${selectedTie?.awayTeam.name})`}
            </label>
            <input
              type="number"
              name="homeScore"
              placeholder="0"
              disabled={!selectedLeg || isPending}
              defaultValue={selectedLeg?.homeScore || 0}
              className="w-full bg-gray-600 text-white rounded-md px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              Away Team Score
              {selectedLeg &&
                selectedLeg.legNumber === 1 &&
                ` (${selectedTie?.awayTeam.name})`}
              {selectedLeg &&
                selectedLeg.legNumber === 2 &&
                ` (${selectedTie?.homeTeam.name})`}
            </label>
            <input
              type="number"
              name="awayScore"
              placeholder="0"
              disabled={!selectedLeg || isPending}
              defaultValue={selectedLeg?.awayScore || 0}
              className="w-full bg-gray-600 text-white rounded-md px-4 py-2"
            />
          </div>
        </div>

        <label className="text-center">
          <input
            type="checkbox"
            name="isFinished"
            disabled={!selectedLeg || isPending}
            defaultChecked={selectedLeg?.isFinished || false}
          />{" "}
          Finished?
        </label>

        <button
          className={`text-white px-4 py-2 rounded-md ${selectedLeg && !isPending ? "bg-blue-600" : "bg-gray-400"}`}
          type="submit"
          disabled={!selectedLeg || isPending}
        >
          {isPending ? "Updating..." : "Edit Knockout Leg"}
        </button>

        {message && (
          <p
            className={`text-center text-sm font-medium ${message.includes("✅") ? "text-green-400" : "text-red-400"}`}
          >
            {message}
          </p>
        )}
      </form>

      <img
        src="/images/bracket-guide.png"
        alt="Bracket Guide"
        className="w-full md:w-auto md:max-w-[500px] object-contain"
      />
    </div>
  );
}
