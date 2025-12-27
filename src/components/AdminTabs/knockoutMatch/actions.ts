"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ============================================
// KNOCKOUT TIE ACTIONS
// ============================================

/**
 * Crear un nuevo Knockout Tie (enfrentamiento completo)
 */
export async function createKnockoutTie(
  formData: FormData,
): Promise<{ ok: boolean; error?: string; tieId?: number }> {
  const tournamentId = Number(formData.get("tournamentId"));
  const koPosition = Number(formData.get("koPosition"));
  const homeTeamId = Number(formData.get("homeTeamId"));
  const awayTeamId = Number(formData.get("awayTeamId"));
  const format = (formData.get("format") as string) || "two-leg"; // NUEVO

  // Validaciones
  if (homeTeamId === awayTeamId) {
    return {
      ok: false,
      error: "Error: Los equipos local y visitante no pueden ser iguales.",
    };
  }

  if (koPosition < 1 || koPosition > 16) {
    return {
      ok: false,
      error: "Error: La posición KO debe estar entre 1 y 16.",
    };
  }

  if (format !== "single-leg" && format !== "two-leg") {
    return {
      ok: false,
      error: "Error: El formato debe ser 'single-leg' o 'two-leg'.",
    };
  }

  // Verificar si ya existe un tie en esta posición
  const existingTie = await prisma.knockoutTie.findUnique({
    where: { tournamentId_koPosition: { tournamentId, koPosition } },
  });

  if (existingTie) {
    return {
      ok: false,
      error: "Error: Ya existe un tie en esta posición para este torneo.",
    };
  }

  // Crear el tie
  const tie = await prisma.knockoutTie.create({
    data: {
      tournamentId,
      koPosition,
      homeTeamId,
      awayTeamId,
      format, // NUEVO
    },
  });

  revalidatePath("/admin");
  return { ok: true, tieId: tie.id };
}

/**
 * Eliminar un Knockout Tie completo (y todos sus legs)
 */
export async function deleteKnockoutTie(formData: FormData) {
  const tieId = Number(formData.get("tieId"));

  await prisma.knockoutTie.delete({
    where: { id: tieId },
  });

  revalidatePath("/admin");
  return { ok: true };
}

// ============================================
// KNOCKOUT LEG ACTIONS
// ============================================

/**
 * Crear un nuevo Knockout Leg para un tie existente
 */
export async function createKnockoutLeg(
  formData: FormData,
): Promise<{ ok: boolean; error?: string }> {
  const tieId = Number(formData.get("tieId"));
  const legNumber = Number(formData.get("legNumber"));
  const dateRaw = formData.get("date");
  const date = new Date(dateRaw as string);
  const homeScore = Number(formData.get("homeScore") || 0);
  const awayScore = Number(formData.get("awayScore") || 0);
  const isFinished = formData.get("isFinished") === "on";

  // Validaciones
  if (homeScore < 0 || awayScore < 0) {
    return {
      ok: false,
      error: "Error: Los marcadores no pueden ser negativos.",
    };
  }

  if (legNumber !== 1 && legNumber !== 2) {
    return {
      ok: false,
      error: "Error: El número de leg debe ser 1 o 2.",
    };
  }

  // Obtener el tie
  const tie = await prisma.knockoutTie.findUnique({
    where: { id: tieId },
    include: { legs: true },
  });

  if (!tie) {
    return {
      ok: false,
      error: "Error: No se encontró el tie.",
    };
  }

  // NUEVO: Validar según el formato del tie
  if (tie.format === "single-leg" && legNumber !== 1) {
    return {
      ok: false,
      error: "Error: Los ties de single-leg solo pueden tener el leg 1.",
    };
  }

  // Verificar que el leg no exista
  const existingLeg = tie.legs.find((leg) => leg.legNumber === legNumber);
  if (existingLeg) {
    return {
      ok: false,
      error: `Error: El leg ${legNumber} ya existe para este tie.`,
    };
  }

  // Determinar los equipos según el leg
  // Leg 1: homeTeam del tie juega en casa
  // Leg 2: awayTeam del tie juega en casa (se invierten)
  const homeTeamId = legNumber === 1 ? tie.homeTeamId : tie.awayTeamId;
  const awayTeamId = legNumber === 1 ? tie.awayTeamId : tie.homeTeamId;

  // Crear el leg
  await prisma.knockoutLeg.create({
    data: {
      tieId,
      legNumber,
      date,
      homeTeamId,
      awayTeamId,
      homeScore,
      awayScore,
      isFinished,
    },
  });

  // Si el leg está terminado, calcular el ganador del tie
  if (isFinished) {
    await updateTieWinner(tieId);
  }

  revalidatePath("/admin");
  return { ok: true };
}

/**
 * Editar un Knockout Leg existente
 */
export async function editKnockoutLeg(
  formData: FormData,
): Promise<{ ok: boolean; error?: string }> {
  const id = Number(formData.get("id"));
  const dateRaw = formData.get("date");
  const date = new Date(dateRaw as string);
  const homeScore = Number(formData.get("homeScore") || 0);
  const awayScore = Number(formData.get("awayScore") || 0);
  const isFinished = formData.get("isFinished") === "on";

  // Validaciones
  if (homeScore < 0 || awayScore < 0) {
    return {
      ok: false,
      error: "Error: Los marcadores no pueden ser negativos.",
    };
  }

  const leg = await prisma.knockoutLeg.findUnique({
    where: { id },
  });

  if (!leg) {
    return {
      ok: false,
      error: "Error: No se encontró el leg.",
    };
  }

  // Actualizar el leg
  await prisma.knockoutLeg.update({
    where: { id },
    data: {
      date,
      homeScore,
      awayScore,
      isFinished,
    },
  });

  // Recalcular el ganador si es necesario
  if (isFinished) {
    await updateTieWinner(leg.tieId);
  }

  revalidatePath("/admin");
  return { ok: true };
}

/**
 * Eliminar un Knockout Leg específico
 */
export async function deleteKnockoutLeg(formData: FormData) {
  const legId = Number(formData.get("legId"));

  const leg = await prisma.knockoutLeg.findUnique({
    where: { id: legId },
  });

  if (!leg) {
    return { ok: false, error: "Leg no encontrado" };
  }

  await prisma.knockoutLeg.delete({
    where: { id: legId },
  });

  // Resetear el estado del tie si se elimina un leg
  await prisma.knockoutTie.update({
    where: { id: leg.tieId },
    data: {
      isFinished: false,
      winnerId: null,
    },
  });

  revalidatePath("/admin");
  return { ok: true };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Calcular y actualizar el ganador del tie
 * Considera: single-leg vs two-leg, marcador agregado y regla de gol de visitante
 */
async function updateTieWinner(tieId: number) {
  const tie = await prisma.knockoutTie.findUnique({
    where: { id: tieId },
    include: {
      legs: true,
      homeTeam: true,
      awayTeam: true,
    },
  });

  if (!tie) return;

  // NUEVO: Lógica diferente según el formato
  if (tie.format === "single-leg") {
    // Para single-leg, solo necesitamos el leg 1
    const leg1 = tie.legs.find((l) => l.legNumber === 1);

    if (!leg1?.isFinished) return;

    let winnerId: number | null = null;

    if (leg1.homeScore > leg1.awayScore) {
      winnerId = tie.homeTeamId;
    } else if (leg1.awayScore > leg1.homeScore) {
      winnerId = tie.awayTeamId;
    }
    // Si empatan, winnerId queda null (penales o prórroga)

    await prisma.knockoutTie.update({
      where: { id: tieId },
      data: {
        isFinished: true,
        winnerId,
      },
    });
  } else {
    // Para two-leg, necesitamos ambos legs
    if (tie.legs.length !== 2) return;

    const leg1 = tie.legs.find((l) => l.legNumber === 1);
    const leg2 = tie.legs.find((l) => l.legNumber === 2);

    if (!leg1?.isFinished || !leg2?.isFinished) return;

    // Calcular marcador agregado
    // En leg1: homeTeam del tie juega en casa
    // En leg2: awayTeam del tie juega en casa (invertido)
    const homeTeamAggregate = leg1.homeScore + leg2.awayScore;
    const awayTeamAggregate = leg1.awayScore + leg2.homeScore;

    let winnerId: number | null = null;

    if (homeTeamAggregate > awayTeamAggregate) {
      winnerId = tie.homeTeamId;
    } else if (awayTeamAggregate > homeTeamAggregate) {
      winnerId = tie.awayTeamId;
    } else {
      // Empate en agregado - aplicar regla de gol de visitante
      // Goles de visitante del homeTeam: leg2.awayScore
      // Goles de visitante del awayTeam: leg1.awayScore
      if (leg2.awayScore > leg1.awayScore) {
        winnerId = tie.homeTeamId;
      } else if (leg1.awayScore > leg2.awayScore) {
        winnerId = tie.awayTeamId;
      }
      // Si empatan en gol de visitante, quedaría en null (penales)
    }

    await prisma.knockoutTie.update({
      where: { id: tieId },
      data: {
        isFinished: true,
        winnerId,
      },
    });
  }
}
