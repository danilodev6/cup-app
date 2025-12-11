"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function createTeam(formData: FormData) {
  const name = formData.get("name") as string;
  const rawShortName = formData.get("shortName") as string;
  const logoUrl = formData.get("logoUrl") as string;
  const rawTournamentId = formData.get("tournamentId");
  const rawGroup = formData.get("group") as string;

  const tournamentId = Number(rawTournamentId);
  const shortName = rawShortName.toUpperCase();
  const group = rawGroup.toUpperCase();

  await prisma.team.create({
    data: {
      name,
      shortName,
      logoUrl,
      tournamentId,
      group,
    },
  });

  revalidatePath("/admin");
}

export async function editTeam(formData: FormData) {
  const rawId = formData.get("id") as string;
  const id = Number(rawId);
  const name = formData.get("name") as string;
  const shortName = formData.get("shortName") as string;
  const logoUrl = formData.get("logoUrl") as string;
  const tournamentId = Number(formData.get("tournamentId"));
  const group = formData.get("group") as string;

  await prisma.team.update({
    where: {
      id,
    },
    data: {
      name,
      shortName,
      logoUrl,
      tournamentId,
      group,
    },
  });

  revalidatePath("/admin");
}

export async function deleteTeam(formData: FormData) {
  const rawId = formData.get("TeamId") as string;
  const id = Number(rawId);

  const team = await prisma.team.findUnique({
    where: { id },
    include: { players: true },
  });

  if (!team) {
    throw new Error("Team not found");
  }

  // Delete photo players
  for (const player of team.players) {
    if (player.photoUrl) {
      const filePath = player.photoUrl.split("/Photos/")[1];
      await supabaseAdmin.storage.from("Photos").remove([filePath]);
    }
  }

  // Delete photo team
  if (team.logoUrl) {
    const urlParts = team.logoUrl.split("/Photos/");
    if (urlParts.length > 1) {
      const filePath = urlParts[1];
      const { error: storageError } = await supabaseAdmin.storage
        .from("Photos")
        .remove([filePath]);

      if (storageError) {
        console.error("Error deleting image from storage:", storageError);
      }
    }
  }

  await prisma.team.delete({
    where: { id },
  });

  revalidatePath("/admin");
}
