"use client";

import { useState, useRef, useTransition } from "react";
import { createTeam } from "./actions";
import { supabase } from "@/lib/supabase";
import type { Tournament } from "@/generated/prisma/client";

type Props = {
  tournaments: Tournament[];
};

export default function CreateTeamForm({ tournaments }: Props) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!e.target.files || e.target.files.length === 0) {
        return;
      }

      const file = e.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `teams/${fileName}`;

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

      setLogoUrl(data.publicUrl);
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
        await createTeam(formData);
        setMessage("✅ Team created successfully!");
        formRef.current?.reset();
        setUploading(false);
        setLogoUrl("");
        setTimeout(() => setMessage(""), 1500);
      } catch (error) {
        setMessage("❌ Error creating team");
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
      <input
        name="shortName"
        placeholder="Short Name (3 letters)"
        maxLength={3}
        disabled={isPending}
        required
      />

      {/* Input de archivo */}
      <div>
        <label className="block mb-2">Team Logo:</label>
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
        {logoUrl && (
          <div className="mt-2">
            <img
              src={logoUrl}
              alt="Preview"
              className="w-20 h-20 object-contain ml-6"
            />
          </div>
        )}
      </div>

      {/* Hidden input con la URL */}
      <input
        type="hidden"
        name="logoUrl"
        value={logoUrl}
        disabled={isPending}
      />

      <select
        name="tournamentId"
        className="bg-gray-600 text-white rounded-md px-4 py-2"
        disabled={isPending}
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
        name="group"
        placeholder="Group (A, B, C...)"
        required
        disabled={isPending}
      />

      <button
        className="bg-green-600 text-white px-4 py-2 rounded-md disabled:bg-gray-400"
        type="submit"
        disabled={uploading || !logoUrl || isPending}
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
