"use client";

import { useState, useRef } from "react";
import { editTournament } from "./actions";
import type { Tournament } from "@/generated/prisma/client";

type Props = {
  tournaments: Tournament[];
};

export default function EditTournamentForm({ tournaments }: Props) {
  const [selectedTournament, setSelectedTournament] =
    useState<Tournament | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const formatDateTimeLocal = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleSubmit = async (formData: FormData) => {
    await editTournament(formData);
    setSelectedTournament(null);
    formRef.current?.reset();
  };

  const handleSelectTournament = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    const tournament = tournaments.find((t) => t.id === selectedId) || null;
    setSelectedTournament(tournament);
  };

  if (!tournaments || tournaments.length === 0) {
    return <p>No tournaments available</p>;
  }

  return (
    <form
      action={handleSubmit}
      ref={formRef}
      className="flex flex-col gap-4"
      key={selectedTournament?.id || "no-selection"}
    >
      <input type="hidden" name="id" value={selectedTournament?.id || ""} />
      {/* 1. TOURNAMENT SELECTOR */}
      <select
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        onChange={handleSelectTournament}
        value={selectedTournament?.id || ""}
        required
      >
        <option value="" disabled>
          Select Tournament to Edit
        </option>
        {tournaments.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name} ({t.location})
          </option>
        ))}
      </select>

      {/* 2. FORM FIELDS */}
      <input
        name="name"
        placeholder="New Name"
        required
        disabled={!selectedTournament}
        defaultValue={selectedTournament?.name || ""}
      />
      <input
        name="location"
        placeholder="New Location"
        required
        disabled={!selectedTournament}
        defaultValue={selectedTournament?.location || ""}
      />
      <input
        type="number"
        name="teamCount"
        placeholder="New Team Count"
        disabled={!selectedTournament}
        defaultValue={selectedTournament?.teamCount?.toString() || ""}
      />
      <input
        type="datetime-local"
        name="date"
        required
        disabled={!selectedTournament}
        defaultValue={
          selectedTournament ? formatDateTimeLocal(selectedTournament.date) : ""
        }
      />

      {/* 3. SUBMIT BUTTON */}
      <button
        className={`text-white px-4 py-2 rounded-md ${selectedTournament ? "bg-blue-600" : "bg-gray-400"}`}
        type="submit"
        disabled={!selectedTournament}
      >
        Edit Tournament
      </button>
    </form>
  );
}
