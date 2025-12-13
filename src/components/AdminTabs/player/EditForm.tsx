"use client";

import { useState, useRef, useTransition } from "react";
import { editPlayer } from "./actions";
import { supabase } from "@/lib/supabase";
import type { Team, Player } from "@/generated/prisma/client";

type Props = {
  teams: Team[];
  players: Player[];
};

export default function EditPlayerForm({ teams, players }: Props) {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSelectPlayer = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    const player = players.find((p) => p.id === selectedId) || null;
    setSelectedPlayer(player);
    setPhotoUrl(player?.photoUrl || "");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!e.target.files || e.target.files.length === 0) return;

      const file = e.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `players/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("Photos")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

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
        await editPlayer(formData);
        setMessage("✅ Player updated successfully!");
        setSelectedPlayer(null);
        setPhotoUrl("");
        formRef.current?.reset();
        setTimeout(() => setMessage(""), 3000);
      } catch (error) {
        setMessage("❌ Error updating player");
      }
    });
  };

  if (!players || players.length === 0) {
    return <p>No players available</p>;
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="flex flex-col gap-4 form-container-small"
      key={selectedPlayer?.id || "no-selection"}
    >
      <input type="hidden" name="id" value={selectedPlayer?.id || ""} />

      {/* SELECT PLAYER */}
      <select
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        onChange={handleSelectPlayer}
        value={selectedPlayer?.id || ""}
        disabled={isPending}
        required
      >
        <option value="" disabled>
          Select Player to Edit
        </option>
        {players.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      {/* FORM FIELDS */}
      <input
        name="name"
        placeholder="Name"
        required
        disabled={!selectedPlayer || uploading || isPending}
        defaultValue={selectedPlayer?.name || ""}
      />

      {/* PHOTO UPLOAD */}
      <div>
        <label className="block mb-2">Player photo:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading || !selectedPlayer || isPending}
          className="bg-gray-600 text-white rounded-md px-4 py-2"
        />
        {uploading && (
          <p className="text-sm text-gray-400 mt-1">Uploading...</p>
        )}
        {photoUrl && (
          <img
            src={photoUrl}
            alt="Preview"
            className="w-20 h-20 object-contain mt-2"
          />
        )}
      </div>
      <input
        type="hidden"
        name="photoUrl"
        value={photoUrl || selectedPlayer?.photoUrl || ""}
      />

      {/* TEAM SELECT */}
      <select
        name="teamId"
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        disabled={!selectedPlayer || isPending}
        defaultValue={selectedPlayer?.teamId || ""}
        required
      >
        <option value="">Select Team</option>
        {teams.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      {/* SUBMIT */}
      <button
        className={`text-white px-4 py-2 rounded-md ${selectedPlayer ? "bg-blue-600" : "bg-gray-400"}`}
        type="submit"
        disabled={!selectedPlayer || isPending}
      >
        {isPending ? "Updating..." : "Edit Player"}
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
