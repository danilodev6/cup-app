"use client";

import { useState, useRef, useTransition } from "react";
import { editTournament } from "./actions";
import type { Tournament } from "@/generated/prisma/client";
import { toDateTimeLocalValue } from "@/lib/date-utils";

type Props = {
  tournaments: Tournament[];
};

export default function EditTournamentForm({ tournaments }: Props) {
  const [selectedTournament, setSelectedTournament] =
    useState<Tournament | null>(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await editTournament(formData);
        setMessage("✅ Tournament updated successfully!");
        setSelectedTournament(null);
        formRef.current?.reset();
        setTimeout(() => setMessage(""), 1500);
      } catch (error) {
        setMessage("❌ Error updating tournament");
      }
    });
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
      className="flex flex-col gap-4 form-container-small"
      key={selectedTournament?.id || "no-selection"}
    >
      <input type="hidden" name="id" value={selectedTournament?.id || ""} />

      <select
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        onChange={handleSelectTournament}
        value={selectedTournament?.id || ""}
        disabled={isPending}
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

      <input
        name="name"
        placeholder="New Name"
        required
        disabled={!selectedTournament || isPending}
        defaultValue={selectedTournament?.name || ""}
      />
      <input
        name="location"
        placeholder="New Location"
        required
        disabled={!selectedTournament || isPending}
        defaultValue={selectedTournament?.location || ""}
      />
      <input
        type="number"
        name="teamCount"
        placeholder="New Team Count"
        disabled={!selectedTournament || isPending}
        defaultValue={selectedTournament?.teamCount?.toString() || ""}
      />
      <input
        type="datetime-local"
        name="date"
        required
        disabled={!selectedTournament || isPending}
        defaultValue={
          selectedTournament
            ? toDateTimeLocalValue(selectedTournament.date)
            : ""
        }
      />

      <button
        className={`text-white px-4 py-2 rounded-md ${selectedTournament && !isPending ? "bg-blue-600" : "bg-gray-400"}`}
        type="submit"
        disabled={!selectedTournament || isPending}
      >
        {isPending ? "Updating..." : "Edit Tournament"}
      </button>

      {message && (
        <p
          className={`text-center text-sm font-medium ${message.includes("✅") ? "text-green-400" : "text-red-400"}`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
