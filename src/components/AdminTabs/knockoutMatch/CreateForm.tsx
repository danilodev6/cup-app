"use client";

import { useState, useRef, useTransition } from "react";
import { createKnockoutTie, createKnockoutLeg } from "./actions";
import type { Tournament, Team } from "@/generated/prisma/client";
import type { KnockoutTieWithLegs } from "@/lib/types";

type Props = {
  tournaments: Tournament[];
  teams: Team[];
  existingTies?: KnockoutTieWithLegs[];
};

export default function CreateKnockoutLegForm({
  tournaments,
  teams,
  existingTies = [],
}: Props) {
  const [selectedTournamentId, setSelectedTournamentId] = useState<
    number | null
  >(null);
  const [mode, setMode] = useState<"tie" | "leg">("tie");
  const [selectedTieId, setSelectedTieId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const filteredTeams = selectedTournamentId
    ? teams.filter((t) => t.tournamentId === selectedTournamentId)
    : [];

  const filteredTies = selectedTournamentId
    ? existingTies.filter(
        (t) =>
          t.homeTeam && t.awayTeam && t.tournamentId === selectedTournamentId,
      )
    : [];

  const selectedTie = selectedTieId
    ? filteredTies.find((t) => t.id === selectedTieId)
    : null;

  const canCreateLeg1 =
    selectedTie && !selectedTie.legs.some((l) => l.legNumber === 1);
  const canCreateLeg2 =
    selectedTie && !selectedTie.legs.some((l) => l.legNumber === 2);

  const handleSubmitTie = async (fd: FormData) => {
    startTransition(async () => {
      try {
        const result = await createKnockoutTie(fd);
        if (result.ok) {
          setMessage("✅ Tie creado exitosamente!");
          formRef.current?.reset();
          setTimeout(() => setMessage(""), 2000);
        } else {
          setMessage(`❌ ${result.error}`);
          setTimeout(() => setMessage(""), 3000);
        }
      } catch (error) {
        setMessage("❌ Error al crear tie");
        setTimeout(() => setMessage(""), 3000);
      }
    });
  };

  const handleSubmitLeg = async (fd: FormData) => {
    if (!selectedTieId) {
      setMessage("❌ Debe seleccionar un tie");
      return;
    }

    fd.append("tieId", String(selectedTieId));

    startTransition(async () => {
      try {
        const result = await createKnockoutLeg(fd);
        if (result.ok) {
          setMessage("✅ Leg creado exitosamente!");
          formRef.current?.reset();
          setTimeout(() => setMessage(""), 2000);
        } else {
          setMessage(`❌ ${result.error}`);
          setTimeout(() => setMessage(""), 3000);
        }
      } catch (error) {
        setMessage("❌ Error al crear leg");
        setTimeout(() => setMessage(""), 3000);
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Toggle entre modos */}
      <div className="flex gap-4 justify-center">
        <button
          type="button"
          onClick={() => setMode("tie")}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            mode === "tie"
              ? "bg-purple-700 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Create New Tie
        </button>
        <button
          type="button"
          onClick={() => setMode("leg")}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            mode === "leg"
              ? "bg-purple-700 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Add Leg to Existing Tie
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Formulario para crear TIE */}
        {mode === "tie" && (
          <form
            action={handleSubmitTie}
            ref={formRef}
            className="flex flex-col gap-4 form-container-small"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmitTie(new FormData(e.currentTarget));
            }}
          >
            <h3 className="text-xl font-bold text-center">Create New Tie</h3>
            <p className="text-sm text-gray-400 text-center">
              First create the tie, then add the legs
            </p>

            <select
              name="tournamentId"
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

            <input
              type="number"
              name="koPosition"
              placeholder="Posición KO (1-16)"
              min={1}
              max={16}
              disabled={isPending}
              required
              className="bg-gray-600 text-white rounded-md px-4 py-2"
            />

            <label className="block text-sm font-medium">
              Home Team (from Tie)
            </label>
            <select
              name="homeTeamId"
              className="bg-gray-600 text-white rounded-md px-4 py-2"
              disabled={isPending || !selectedTournamentId}
              required
            >
              <option value="">Select Home Team</option>
              {filteredTeams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>

            <label className="block text-sm font-medium">
              Away Team (from Tie)
            </label>
            <select
              name="awayTeamId"
              className="bg-gray-600 text-white rounded-md px-4 py-2"
              disabled={isPending || !selectedTournamentId}
              required
            >
              <option value="">Select Away Team</option>
              {filteredTeams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>

            <button
              className="bg-green-600 text-white px-4 py-2 rounded-md disabled:opacity-50 hover:bg-green-700 transition-colors"
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Creating..." : "Create Tie"}
            </button>
          </form>
        )}

        {/* Formulario para crear LEG */}
        {mode === "leg" && (
          <form
            action={handleSubmitLeg}
            ref={formRef}
            className="flex flex-col gap-4 form-container-small"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmitLeg(new FormData(e.currentTarget));
            }}
          >
            <h3 className="text-xl font-bold text-center">Add Leg</h3>

            <select
              name="tournamentId"
              className="bg-gray-600 text-white rounded-md px-4 py-2"
              onChange={(e) => {
                const tid = Number(e.target.value);
                setSelectedTournamentId(tid);
                setSelectedTieId(null);
              }}
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
              name="tieSelection"
              className="bg-gray-600 text-white rounded-md px-4 py-2"
              onChange={(e) => setSelectedTieId(Number(e.target.value))}
              disabled={!selectedTournamentId}
              required
            >
              <option value="">Select Tie</option>
              {filteredTies.map((tie) => (
                <option key={tie.id} value={tie.id}>
                  Pos {tie.koPosition}: {tie.homeTeam.shortName} vs{" "}
                  {tie.awayTeam.shortName}
                </option>
              ))}
            </select>

            {selectedTie && (
              <div className="bg-gray-700 p-3 rounded-md text-sm">
                <p className="font-medium mb-2">Tie Information:</p>
                <p>
                  <span className="text-gray-400">Teams:</span>{" "}
                  {selectedTie.homeTeam.name} vs {selectedTie.awayTeam.name}
                </p>
                <p>
                  <span className="text-gray-400">Legs existing:</span>{" "}
                  {selectedTie.legs
                    .map((l) => `Leg ${l.legNumber}`)
                    .join(", ") || "None"}
                </p>
                <p className="mt-2 text-yellow-500">
                  {canCreateLeg1 && "✓ can create Leg 1"}
                  {canCreateLeg2 && " ✓ can create Leg 2"}
                  {!canCreateLeg1 &&
                    !canCreateLeg2 &&
                    "! both legs already exist"}
                </p>
              </div>
            )}

            <select
              name="legNumber"
              className="bg-gray-600 text-white rounded-md px-4 py-2"
              disabled={isPending || !selectedTieId}
              required
            >
              <option value="">Select Leg</option>
              {canCreateLeg1 && (
                <option value="1">
                  Leg 1 - {selectedTie?.homeTeam.shortName} (home) vs{" "}
                  {selectedTie?.awayTeam.shortName} (away)
                </option>
              )}
              {canCreateLeg2 && (
                <option value="2">
                  Leg 2 - {selectedTie?.awayTeam.shortName} (home) vs{" "}
                  {selectedTie?.homeTeam.shortName} (away)
                </option>
              )}
            </select>

            <input
              type="datetime-local"
              name="date"
              disabled={isPending || !selectedTieId}
              required
              className="bg-gray-600 text-white rounded-md px-4 py-2"
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Home Team Score</label>
                <input
                  type="number"
                  name="homeScore"
                  placeholder="0"
                  defaultValue={0}
                  disabled={isPending || !selectedTieId}
                  className="w-full bg-gray-600 text-white rounded-md px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Away Team Score</label>
                <input
                  type="number"
                  name="awayScore"
                  placeholder="0"
                  defaultValue={0}
                  disabled={isPending || !selectedTieId}
                  className="w-full bg-gray-600 text-white rounded-md px-4 py-2"
                />
              </div>
            </div>

            <label className="text-center">
              <input type="checkbox" name="isFinished" /> Finished?
            </label>

            <button
              className="bg-green-600 text-white px-4 py-2 rounded-md disabled:opacity-50 hover:bg-green-700 transition-colors"
              type="submit"
              disabled={
                isPending ||
                !selectedTieId ||
                (!canCreateLeg1 && !canCreateLeg2)
              }
            >
              {isPending ? "Creating..." : "Create Leg"}
            </button>
          </form>
        )}

        <img
          src="/images/bracket-guide.png"
          alt="Bracket Guide"
          className="w-full md:w-auto md:max-w-[500px] object-contain"
        />
      </div>

      {message && (
        <p
          className={`text-center text-lg font-medium ${
            message.includes("✅") ? "text-green-400" : "text-red-400"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
