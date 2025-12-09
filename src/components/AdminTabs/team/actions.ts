"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
