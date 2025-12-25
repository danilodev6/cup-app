"use client";

import { useState, useRef, useTransition } from "react";
import { editTeam } from "./actions";
import { supabase } from "@/lib/supabase";
import type { Team, Tournament } from "@/generated/prisma/client";

type Props = {
  teams: Team[];
  tournaments: Tournament[];
};

export default function EditTeamForm({ teams, tournaments }: Props) {
  const [selectedTournamentId, setSelectedTournamentId] = useState<
    number | null
  >(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const filteredTeams = selectedTournamentId
    ? teams.filter((t) => t.tournamentId === selectedTournamentId)
    : [];

  const handleSelectTeam = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    const team = teams.find((t) => t.id === selectedId) || null;
    setSelectedTeam(team);
    setLogoUrl(team?.logoUrl || "");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!e.target.files || e.target.files.length === 0) return;

      const file = e.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`; // Only if file change
      const filePath = `teams/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("Photos")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("Photos").getPublicUrl(filePath);

      setLogoUrl(data.publicUrl); // Only if file change
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
        await editTeam(formData);
        setMessage("✅ Team updated successfully!");
        setSelectedTeam(null);
        setLogoUrl("");
        formRef.current?.reset();
        setTimeout(() => setMessage(""), 1500);
      } catch (error) {
        setMessage("❌ Error updating team");
      }
    });
  };

  if (!teams || teams.length === 0) {
    return <p>No teams available</p>;
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="flex flex-col gap-4 form-container-small"
      key={selectedTeam?.id || "no-selection"}
    >
      <input type="hidden" name="id" value={selectedTeam?.id || ""} />

      {/* SELECT TOURNAMENT FILTER */}
      <select
        name="tournamentId"
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        onChange={(e) => setSelectedTournamentId(Number(e.target.value))}
      >
        <option value="">Select Tournament</option>
        {tournaments.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      {/* SELECT TEAM */}
      <select
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        onChange={handleSelectTeam}
        value={selectedTeam?.id || ""}
        disabled={isPending}
        required
      >
        <option value="" disabled>
          Select Team to Edit
        </option>
        {filteredTeams.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      {/* FORM FIELDS */}
      <input
        name="name"
        placeholder="Name"
        required
        disabled={!selectedTeam || isPending}
        defaultValue={selectedTeam?.name || ""}
      />

      <input
        name="shortName"
        placeholder="Short Name"
        required
        disabled={!selectedTeam || isPending}
        defaultValue={selectedTeam?.shortName || ""}
      />

      {/* LOGO UPLOAD */}
      <div>
        <label className="block mb-2">Team Logo:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading || !selectedTeam || isPending}
          className="bg-gray-600 text-white rounded-md px-4 py-2"
        />
        {uploading && (
          <p className="text-sm text-gray-400 mt-1">Uploading...</p>
        )}
        {logoUrl && (
          <img
            src={logoUrl}
            alt="Preview"
            className="w-20 h-20 object-contain mt-2"
          />
        )}
      </div>
      <input
        type="hidden"
        name="logoUrl"
        value={logoUrl || selectedTeam?.logoUrl || ""}
      />

      {/* TOURNAMENT SELECT */}
      <select
        name="tournamentId"
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        disabled={!selectedTeam || isPending}
        defaultValue={selectedTeam?.tournamentId || ""}
        required
      >
        <option value="">Select Tournament</option>
        {tournaments.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      {/* FORM FIELDS */}
      <input
        name="group"
        placeholder="Group"
        disabled={!selectedTeam || isPending}
        defaultValue={selectedTeam?.group || ""}
      />

      {/* SUBMIT */}
      <button
        className={`text-white px-4 py-2 rounded-md ${selectedTeam ? "bg-blue-600" : "bg-gray-400"}`}
        type="submit"
        disabled={!selectedTeam || isPending}
      >
        {isPending ? "Updating..." : "Edit Team"}
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
