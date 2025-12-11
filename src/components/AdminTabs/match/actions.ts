"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createMatch(formData: FormData) {
  const dateRaw = formData.get("date");
  const tournamentId = Number(formData.get("tournamentId"));
  const homeTeamId = Number(formData.get("homeTeamId"));
  const awayTeamId = Number(formData.get("awayTeamId"));
  const homeScore = Number(formData.get("homeScore") || 0);
  const awayScore = Number(formData.get("awayScore") || 0);
  const isFinished = formData.get("isFinished") === "on";

  const date = new Date(dateRaw as string);

  await prisma.match.create({
    data: {
      date,
      tournamentId,
      homeTeamId,
      awayTeamId,
      homeScore,
      awayScore,
      isFinished,
    },
  });

  revalidatePath("/admin");
}

export async function editMatch(formData: FormData) {
  const rawId = formData.get("id") as string;
  const id = Number(rawId);
  const dateRaw = formData.get("date");
  const tournamentId = Number(formData.get("tournamentId"));
  const homeTeamId = Number(formData.get("homeTeamId"));
  const awayTeamId = Number(formData.get("awayTeamId"));
  const homeScore = Number(formData.get("homeScore") || 0);
  const awayScore = Number(formData.get("awayScore") || 0);
  const isFinished = formData.get("isFinished") === "on";

  const date = new Date(dateRaw as string);

  await prisma.match.update({
    where: {
      id,
    },
    data: {
      date,
      tournamentId,
      homeTeamId,
      awayTeamId,
      homeScore,
      awayScore,
      isFinished,
    },
  });

  revalidatePath("/admin");
}

export async function deleteMatch(formData: FormData) {
  const rawId = formData.get("MatchId") as string;
  const id = Number(rawId);

  await prisma.match.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin");
}
