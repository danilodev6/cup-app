"use client";

import { useState, useRef, useTransition } from "react";
import { createPlayer } from "./actions";
import { supabase } from "@/lib/supabase";
import type { Tournament, Team } from "@/generated/prisma/client";

type Props = {
  tournaments: Tournament[];
  teams: Team[];
};

export default function CreatePlayerForm({ tournaments, teams }: Props) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedTournamentId, setSelectedTournamentId] = useState<
    number | null
  >(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const filteredTeams = selectedTournamentId
    ? teams.filter((t) => t.tournamentId === selectedTournamentId)
    : [];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!e.target.files || e.target.files.length === 0) {
        return;
      }

      const file = e.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `players/${fileName}`;

      // Upload to supabase
      const { error: uploadError } = await supabase.storage
        .from("Photos")
        .upload(filePath, file, {
          contentType: file.type,
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get URL
      const { data } = supabase.storage.from("Photos").getPublicUrl(filePath);

      setPhotoUrl(data.publicUrl);
    } catch (error) {
      alert("Error uploading image!");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await createPlayer(formData);
        setMessage("✅ Player created successfully!");
        formRef.current?.reset();
        setUploading(false);
        setPhotoUrl("");
        setTimeout(() => setMessage(""), 1500);
      } catch (error) {
        setMessage("❌ Error creating player");
      }
    });
  };

  return (
    <form
      action={handleSubmit}
      ref={formRef}
      className="flex flex-col gap-4 form-container-small"
    >
      <input name="name" placeholder="Name" required disabled={isPending} />
      {/* Input de archivo */}
      <div>
        <label className="block mb-2">Player photo:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading || isPending}
          className="bg-gray-600 text-white rounded-md px-4 py-2"
        />
        {uploading && (
          <p className="text-sm text-gray-400 mt-1">Uploading...</p>
        )}
        {photoUrl && (
          <div className="mt-2">
            <img
              src={photoUrl}
              alt="Preview"
              className="w-20 h-20 rounded-full object-contain ml-6"
            />
          </div>
        )}
      </div>

      {/* Hidden input con la URL */}
      <input type="hidden" name="photoUrl" value={photoUrl} />

      <select
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

      <select
        name="teamId"
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        disabled={isPending || !selectedTournamentId}
        required
      >
        <option value="">Select Team</option>
        {filteredTeams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </select>

      <button
        className="bg-green-600 text-white px-4 py-2 rounded-md disabled:bg-gray-400"
        type="submit"
        disabled={uploading || !photoUrl || isPending}
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
