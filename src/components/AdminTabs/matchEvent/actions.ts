"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createMatchEvent(formData: FormData) {
  const tournamentId = Number(formData.get("tournamentId"));
  const groupMatchIdRaw = formData.get("groupMatchId");
  const groupMatchId = groupMatchIdRaw ? Number(groupMatchIdRaw) : null;
  const knockoutLegIdRaw = formData.get("knockoutLegId");
  const knockoutLegId = knockoutLegIdRaw ? Number(knockoutLegIdRaw) : null;
  const playerId = Number(formData.get("playerId"));
  const eventType = formData.get("eventType") as string;

  await prisma.matchEvent.create({
    data: {
      tournamentId,
      groupMatchId,
      knockoutLegId,
      playerId,
      eventType,
    },
  });

  revalidatePath("/admin");
}

export async function editMatchEvent(formData: FormData) {
  const rawId = formData.get("id") as string;
  const id = Number(rawId);
  const tournamentId = Number(formData.get("tournamentId"));
  const groupMatchIdRaw = formData.get("groupMatchId");
  const groupMatchId = groupMatchIdRaw ? Number(groupMatchIdRaw) : null;
  const knockoutLegIdRaw = formData.get("knockoutLegId");
  const knockoutLegId = knockoutLegIdRaw ? Number(knockoutLegIdRaw) : null;
  const playerId = Number(formData.get("playerId"));
  const eventType = formData.get("eventType") as string;

  await prisma.matchEvent.update({
    where: {
      id,
    },
    data: {
      tournamentId,
      groupMatchId,
      knockoutLegId,
      playerId,
      eventType,
    },
  });

  revalidatePath("/admin");
}

export async function deleteMatchEvent(formData: FormData) {
  const rawId = formData.get("MatchEventId") as string;
  const id = Number(rawId);

  await prisma.matchEvent.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin");
}
