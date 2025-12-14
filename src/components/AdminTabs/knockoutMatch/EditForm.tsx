"use client";

import { useState, useRef, useTransition } from "react";
import { editKnockoutMatch } from "./actions";
import type {
  Tournament,
  Team,
  KnockoutMatch,
} from "@/generated/prisma/client";

type KnockoutMatchWithTeams = KnockoutMatch & {
  homeTeam: Team;
  awayTeam: Team;
};

type Props = {
  tournaments: Tournament[];
  teams: Team[];
  knockoutMatches: KnockoutMatchWithTeams[];
};

export default function EditKnockoutMatchForm({
  tournaments,
  teams,
  knockoutMatches,
}: Props) {
  const [selectedKnockoutMatch, setSelectedKnockoutMatch] =
    useState<KnockoutMatchWithTeams | null>(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSelectKnockoutMatch = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedId = Number(e.target.value);
    const knockoutMatch =
      knockoutMatches.find((km) => km.id === selectedId) || null;
    setSelectedKnockoutMatch(knockoutMatch);
  };

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await editKnockoutMatch(formData);
        setMessage("✅ Knockout Match updated successfully!");
        setSelectedKnockoutMatch(null);
        formRef.current?.reset();
        setTimeout(() => setMessage(""), 1500);
      } catch (error) {
        setMessage("❌ Error updating knockout match");
      }
    });
  };

  if (!knockoutMatches || knockoutMatches.length === 0) {
    return <p>No knockout matches available</p>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <form
        action={handleSubmit}
        ref={formRef}
        className="flex flex-col gap-4 form-container-small"
        key={selectedKnockoutMatch?.id || "no-selection"}
      >
        <input
          type="hidden"
          name="id"
          value={selectedKnockoutMatch?.id || ""}
        />

        <select
          className="bg-gray-600 text-white rounded-md px-4 py-2"
          onChange={handleSelectKnockoutMatch}
          value={selectedKnockoutMatch?.id || ""}
          disabled={isPending}
          required
        >
          <option value="" disabled>
            Select Knockout Match to Edit
          </option>
          {knockoutMatches.map((km) => (
            <option key={km.id} value={km.id}>
              KO {km.koPosition} {km.leg}: {km.homeTeam?.name || "Home"} vs{" "}
              {km.awayTeam?.name || "Away"}
            </option>
          ))}
        </select>

        <input
          type="datetime-local"
          name="date"
          required
          disabled={!selectedKnockoutMatch || isPending}
          defaultValue={
            selectedKnockoutMatch
              ? new Date(selectedKnockoutMatch.date).toISOString().slice(0, 16)
              : ""
          }
        />

        <select
          name="tournamentId"
          className="bg-gray-600 text-white rounded-md px-4 py-2"
          disabled={!selectedKnockoutMatch || isPending}
          defaultValue={selectedKnockoutMatch?.tournamentId || ""}
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
          placeholder="KO Position (1-16)"
          min={1}
          max={16}
          disabled={!selectedKnockoutMatch || isPending}
          defaultValue={selectedKnockoutMatch?.koPosition || ""}
          required
        />

        <select
          name="leg"
          className="bg-gray-600 text-white rounded-md px-4 py-2"
          disabled={!selectedKnockoutMatch || isPending}
          defaultValue={selectedKnockoutMatch?.leg || ""}
          required
        >
          <option value="" disabled>
            Select Leg
          </option>
          <option value="first">First Leg</option>
          <option value="second">Second Leg</option>
        </select>

        <label className="block text-sm">Home Team</label>
        <select
          name="homeTeamId"
          className="bg-gray-600 text-white rounded-md px-4 py-2"
          disabled={!selectedKnockoutMatch || isPending}
          defaultValue={selectedKnockoutMatch?.homeTeamId || ""}
          required
        >
          <option value="">Select Home Team</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <label className="block text-sm">Away Team</label>
        <select
          name="awayTeamId"
          className="bg-gray-600 text-white rounded-md px-4 py-2"
          disabled={!selectedKnockoutMatch || isPending}
          defaultValue={selectedKnockoutMatch?.awayTeamId || ""}
          required
        >
          <option value="">Select Away Team</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Home Team Score</label>
            <input
              type="number"
              name="homeScore"
              placeholder="0"
              disabled={!selectedKnockoutMatch || isPending}
              defaultValue={selectedKnockoutMatch?.homeScore || 0}
              className="w-full bg-gray-600 text-white rounded-md px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Away Team Score</label>
            <input
              type="number"
              name="awayScore"
              placeholder="0"
              disabled={!selectedKnockoutMatch || isPending}
              defaultValue={selectedKnockoutMatch?.awayScore || 0}
              className="w-full bg-gray-600 text-white rounded-md px-4 py-2"
            />
          </div>
        </div>

        <label className="text-center">
          <input
            type="checkbox"
            name="isFinished"
            disabled={!selectedKnockoutMatch || isPending}
            defaultChecked={selectedKnockoutMatch?.isFinished || false}
          />{" "}
          Finished?
        </label>

        <button
          className={`text-white px-4 py-2 rounded-md ${selectedKnockoutMatch && !isPending ? "bg-blue-600" : "bg-gray-400"}`}
          type="submit"
          disabled={!selectedKnockoutMatch || isPending}
        >
          {isPending ? "Updating..." : "Edit Knockout Match"}
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
