"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createKnockoutMatch(formData: FormData) {
  const dateRaw = formData.get("date");
  const tournamentId = Number(formData.get("tournamentId"));
  const koPosition = Number(formData.get("koPosition"));
  const homeTeamId = Number(formData.get("homeTeamId"));
  const awayTeamId = Number(formData.get("awayTeamId"));
  const homeScore = Number(formData.get("homeScore") || 0);
  const awayScore = Number(formData.get("awayScore") || 0);
  const isFinished = formData.get("isFinished") === "on";

  const date = new Date(dateRaw as string);

  await prisma.knockoutMatch.create({
    data: {
      date,
      tournamentId,
      koPosition,
      homeTeamId,
      awayTeamId,
      homeScore,
      awayScore,
      isFinished,
    },
  });

  revalidatePath("/admin");
}

export async function editKnockoutMatch(formData: FormData) {
  const rawId = formData.get("id") as string;
  const id = Number(rawId);
  const dateRaw = formData.get("date");
  const tournamentId = Number(formData.get("tournamentId"));
  const koPosition = Number(formData.get("koPosition"));
  const homeTeamId = Number(formData.get("homeTeamId"));
  const awayTeamId = Number(formData.get("awayTeamId"));
  const homeScore = Number(formData.get("homeScore") || 0);
  const awayScore = Number(formData.get("awayScore") || 0);
  const isFinished = formData.get("isFinished") === "on";

  const date = new Date(dateRaw as string);

  await prisma.knockoutMatch.update({
    where: {
      id,
    },
    data: {
      date,
      tournamentId,
      koPosition,
      homeTeamId,
      awayTeamId,
      homeScore,
      awayScore,
      isFinished,
    },
  });

  revalidatePath("/admin");
}

export async function deleteKnockoutMatch(formData: FormData) {
  const rawId = formData.get("KnockoutMatchId") as string;
  const id = Number(rawId);

  await prisma.knockoutMatch.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin");
}
