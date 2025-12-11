"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function createPlayer(formData: FormData) {
  const name = formData.get("name") as string;
  const photoUrl = formData.get("photoUrl") as string;
  const rawTeamId = formData.get("teamId");

  const teamId = Number(rawTeamId);

  await prisma.player.create({
    data: {
      name,
      photoUrl,
      teamId,
    },
  });

  revalidatePath("/admin");
}

export async function editPlayer(formData: FormData) {
  const rawId = formData.get("id") as string;
  const id = Number(rawId);
  const name = formData.get("name") as string;
  const photoUrl = formData.get("photoUrl") as string;
  const teamId = Number(formData.get("teamId"));

  await prisma.player.update({
    where: {
      id,
    },
    data: {
      name,
      photoUrl,
      teamId,
    },
  });

  revalidatePath("/admin");
}

export async function deletePlayer(formData: FormData) {
  const rawId = formData.get("PlayerId") as string;
  const id = Number(rawId);

  // 1. Get player from DB
  const player = await prisma.player.findUnique({
    where: { id },
    select: { photoUrl: true },
  });

  if (!player) {
    throw new Error("Player not found");
  }

  // 2. Get Path from URl
  // URL: https://xxx.supabase.co/storage/v1/object/public/Photos/players/123.png
  // Path: players/123.png
  if (player.photoUrl) {
    const urlParts = player.photoUrl.split("/Photos/");
    if (urlParts.length > 1) {
      const filePath = urlParts[1]; // "players/123.png"

      // 3. Delete image from storage
      const { error: storageError } = await supabaseAdmin.storage
        .from("Photos")
        .remove([filePath]);

      if (storageError) {
        console.error("Error deleting image from storage:", storageError);
      }
    }
  }

  // 4. delete player from DB
  await prisma.player.delete({
    where: { id },
  });

  revalidatePath("/admin");
}
