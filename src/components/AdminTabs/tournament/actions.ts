"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTournament(formData: FormData) {
  const name = formData.get("name") as string;
  const location = formData.get("location") as string;
  const dateRaw = formData.get("date");
  const teamCountRaw = formData.get("teamCount");

  if (!dateRaw || !teamCountRaw) {
    throw new Error("Missing required fields");
  }

  const date = new Date(dateRaw as string);
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
}

export async function editTournament(formData: FormData) {
  const rawId = formData.get("id") as string;
  const id = Number(rawId);
  const name = formData.get("name") as string;
  const location = formData.get("location") as string;
  const dateRaw = formData.get("date");
  const teamCountRaw = formData.get("teamCount");

  if (!dateRaw || !teamCountRaw) {
    throw new Error("Missing required fields");
  }

  const date = new Date(dateRaw as string);
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
}

export async function deleteTournament(formData: FormData) {
  const rawId = formData.get("tournamentId") as string;
  const id = Number(rawId);

  await prisma.tournament.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin");
}
