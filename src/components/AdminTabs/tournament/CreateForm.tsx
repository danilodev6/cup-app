"use client";

import { useState, useRef, useTransition } from "react";
import { createTournament } from "./actions";

export default function CreateTournamentForm() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await createTournament(formData);
        setMessage("✅ Tournament created successfully!");
        formRef.current?.reset();
        setTimeout(() => setMessage(""), 3000);
      } catch (error) {
        setMessage("❌ Error creating tournament");
      }
    });
  };

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="flex flex-col gap-4 form-container-small"
    >
      <input name="name" placeholder="Name" required disabled={isPending} />
      <input
        name="location"
        placeholder="Location"
        required
        disabled={isPending}
      />
      <input
        type="number"
        name="teamCount"
        placeholder="Team Count"
        disabled={isPending}
      />
      <input type="datetime-local" name="date" required disabled={isPending} />

      <button
        className="bg-green-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
        type="submit"
        disabled={isPending}
      >
        {isPending ? "Creating..." : "Create"}
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
