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

  // if isFinished update teams scores
  if (isFinished) {
    if (homeScore > awayScore) {
      await prisma.team.update({
        where: { id: homeTeamId },
        data: { teamScore: { increment: 3 } },
      });
    } else if (awayScore > homeScore) {
      await prisma.team.update({
        where: { id: awayTeamId },
        data: { teamScore: { increment: 3 } },
      });
    } else {
      // Tie game
      await prisma.team.update({
        where: { id: homeTeamId },
        data: { teamScore: { increment: 1 } },
      });
      await prisma.team.update({
        where: { id: awayTeamId },
        data: { teamScore: { increment: 1 } },
      });
    }
  }

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

// actions.ts
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

  // Fetch previous match to check if it was finished
  const oldMatch = await prisma.match.findUnique({
    where: { id },
    select: {
      isFinished: true,
      homeScore: true,
      awayScore: true,
      homeTeamId: true,
      awayTeamId: true,
    },
  });

  // if was finished, revert previous scores
  if (oldMatch?.isFinished) {
    if (oldMatch.homeScore > oldMatch.awayScore) {
      await prisma.team.update({
        where: { id: oldMatch.homeTeamId },
        data: { teamScore: { decrement: 3 } },
      });
    } else if (oldMatch.awayScore > oldMatch.homeScore) {
      await prisma.team.update({
        where: { id: oldMatch.awayTeamId },
        data: { teamScore: { decrement: 3 } },
      });
    } else {
      // Tie game, remove 1 point from each team
      await prisma.team.update({
        where: { id: oldMatch.homeTeamId },
        data: { teamScore: { decrement: 1 } },
      });
      await prisma.team.update({
        where: { id: oldMatch.awayTeamId },
        data: { teamScore: { decrement: 1 } },
      });
    }
  }

  // Update match
  await prisma.match.update({
    where: { id },
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

  // if isFinished update teams scores
  if (isFinished) {
    if (homeScore > awayScore) {
      await prisma.team.update({
        where: { id: homeTeamId },
        data: { teamScore: { increment: 3 } },
      });
    } else if (awayScore > homeScore) {
      await prisma.team.update({
        where: { id: awayTeamId },
        data: { teamScore: { increment: 3 } },
      });
    } else {
      // Tie game
      await prisma.team.update({
        where: { id: homeTeamId },
        data: { teamScore: { increment: 1 } },
      });
      await prisma.team.update({
        where: { id: awayTeamId },
        data: { teamScore: { increment: 1 } },
      });
    }
  }

  revalidatePath("/admin");
}

// export async function editMatch(formData: FormData) {
//   const rawId = formData.get("id") as string;
//   const id = Number(rawId);
//   const dateRaw = formData.get("date");
//   const tournamentId = Number(formData.get("tournamentId"));
//   const homeTeamId = Number(formData.get("homeTeamId"));
//   const awayTeamId = Number(formData.get("awayTeamId"));
//   const homeScore = Number(formData.get("homeScore") || 0);
//   const awayScore = Number(formData.get("awayScore") || 0);
//   const isFinished = formData.get("isFinished") === "on";
//
//   const date = new Date(dateRaw as string);
//
//   await prisma.match.update({
//     where: {
//       id,
//     },
//     data: {
//       date,
//       tournamentId,
//       homeTeamId,
//       awayTeamId,
//       homeScore,
//       awayScore,
//       isFinished,
//     },
//   });
//
//   revalidatePath("/admin");
// }

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
