import { PrismaClient } from "@prisma/client";
import slug from "slug";
import uniqueString from "unique-string";

export const prisma = new PrismaClient();

export function generateSlug(text: string): string {
  const s = slug(text);
  const u = uniqueString().slice(0, 8);

  return s + "-" + u;
}

export * from "./inks";
export * from "./types";
export * from "./users";
