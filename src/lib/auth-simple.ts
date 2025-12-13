"use server";

import { cookies } from "next/headers";
import { compare } from "bcryptjs";
import prisma from "./prisma";
import { SignJWT, jwtVerify } from "jose";
import { redirect } from "next/navigation";

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET!);

export async function login(username: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) return { success: false, error: "Invalid credentials" };

  const valid = await compare(password, user.password);
  if (!valid) return { success: false, error: "Invalid credentials" };

  // Crear JWT
  const token = await new SignJWT({ userId: user.id, username: user.username })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(SECRET);

  // Guardar en cookie
  (await cookies()).set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });

  return { success: true };
}

export async function logout() {
  (await cookies()).delete("auth-token");
  redirect("/login");
}

export async function getSession() {
  const token = (await cookies()).get("auth-token")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as { userId: number; username: string };
  } catch {
    return null;
  }
}
