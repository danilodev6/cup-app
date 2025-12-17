"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createKnockoutMatch(
  formData: FormData,
): Promise<{ ok: boolean; error?: string }> {
  const dateRaw = formData.get("date");
  const date = new Date(dateRaw as string);
  const tournamentId = Number(formData.get("tournamentId"));
  const koPosition = Number(formData.get("koPosition"));
  const leg = formData.get("leg") as string;
  const homeTeamId = Number(formData.get("homeTeamId"));
  const awayTeamId = Number(formData.get("awayTeamId"));
  const homeScore = Number(formData.get("homeScore") || 0);
  const awayScore = Number(formData.get("awayScore") || 0);
  const isFinished = formData.get("isFinished") === "on";

  // Validations
  if (homeScore < 0 || awayScore < 0) {
    return {
      ok: false,
      error: "Error: Scores cannot be negative.",
    };
  }

  if (homeTeamId === awayTeamId) {
    return {
      ok: false,
      error: "Error: Home and away teams cannot be the same.",
    };
  }

  if (koPosition < 1 || koPosition > 16) {
    return {
      ok: false,
      error: "Error: KO position must be between 1 and 16.",
    };
  }

  const exists = await prisma.knockoutMatch.findUnique({
    where: { tournamentId_koPosition_leg: { tournamentId, koPosition, leg } },
  });

  if (exists) {
    return {
      ok: false,
      error: "Error:Position already used for this tournament.",
    };
  }

  await prisma.knockoutMatch.create({
    data: {
      date,
      tournamentId,
      koPosition,
      leg,
      homeTeamId,
      awayTeamId,
      homeScore,
      awayScore,
      isFinished,
    },
  });

  revalidatePath("/admin");
  return { ok: true };
}

export async function editKnockoutMatch(
  formData: FormData,
): Promise<{ ok: boolean; error?: string }> {
  const rawId = formData.get("id") as string;
  const id = Number(rawId);
  const dateRaw = formData.get("date");
  const tournamentId = Number(formData.get("tournamentId"));
  const koPosition = Number(formData.get("koPosition"));
  const leg = formData.get("leg") as string;
  const homeTeamId = Number(formData.get("homeTeamId"));
  const awayTeamId = Number(formData.get("awayTeamId"));
  const homeScore = Number(formData.get("homeScore") || 0);
  const awayScore = Number(formData.get("awayScore") || 0);
  const isFinished = formData.get("isFinished") === "on";

  const date = new Date(dateRaw as string);

  // Validations
  if (homeScore < 0 || awayScore < 0) {
    return {
      ok: false,
      error: "Error: Scores cannot be negative.",
    };
  }

  if (homeTeamId === awayTeamId) {
    return {
      ok: false,
      error: "Error: Home and away teams cannot be the same.",
    };
  }

  if (koPosition < 1 || koPosition > 16) {
    return {
      ok: false,
      error: "Error: KO position must be between 1 and 16.",
    };
  }

  const existing = await prisma.knockoutMatch.findFirst({
    where: {
      tournamentId,
      koPosition,
      leg,
      id: { not: id },
    },
  });

  if (existing) {
    return {
      ok: false,
      error: "Error: Position already used for this tournament.",
    };
  }

  await prisma.knockoutMatch.update({
    where: {
      id,
    },
    data: {
      date,
      tournamentId,
      koPosition,
      leg,
      homeTeamId,
      awayTeamId,
      homeScore,
      awayScore,
      isFinished,
    },
  });

  revalidatePath("/admin");
  return { ok: true };
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
  return { ok: true };
}
