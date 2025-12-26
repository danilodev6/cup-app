"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { fromLocalInput } from "@/lib/date-utils";

export async function createTournament(formData: FormData) {
  const name = formData.get("name") as string;
  const location = formData.get("location") as string;
  const dateRaw = formData.get("date");
  const teamCountRaw = formData.get("teamCount");
  const date = fromLocalInput(formData.get("date") as string);

  if (!dateRaw || typeof dateRaw !== "string" || !teamCountRaw) {
    throw new Error("Missing required fields");
  }

  const teamCount = Number(teamCountRaw);

  await prisma.tournament.create({
    data: {
      name,
      location,
      date,
      teamCount,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/tournaments");
}

export async function editTournament(formData: FormData) {
  const rawId = formData.get("id") as string;
  const id = Number(rawId);
  const name = formData.get("name") as string;
  const location = formData.get("location") as string;
  const dateRaw = formData.get("date");
  const teamCountRaw = formData.get("teamCount");
  const date = fromLocalInput(formData.get("date") as string);

  if (!dateRaw || typeof dateRaw !== "string" || !teamCountRaw) {
    throw new Error("Missing required fields");
  }

  const teamCount = Number(teamCountRaw);

  await prisma.tournament.update({
    where: {
      id,
    },
    data: {
      name,
      location,
      date,
      teamCount,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/tournaments");
}

export async function deleteTournament(formData: FormData) {
  const rawId = formData.get("tournamentId") as string;
  const id = Number(rawId);

  const teams = await prisma.team.findMany({
    where: { tournamentId: id },
    include: { players: true },
  });

  // Delete photo players
  for (const team of teams) {
    for (const player of team.players) {
      if (player.photoUrl) {
        const filePath = player.photoUrl.split("/Photos/")[1];
        await supabaseAdmin.storage.from("Photos").remove([filePath]);
      }
    }
  }

  // Delete photo teams
  for (const team of teams) {
    if (team.logoUrl) {
      const filePath = team.logoUrl.split("/Photos/")[1];
      await supabaseAdmin.storage.from("Photos").remove([filePath]);
    }
  }

  await prisma.tournament.delete({
    where: { id },
  });

  revalidatePath("/admin");
  revalidatePath("/");
}
