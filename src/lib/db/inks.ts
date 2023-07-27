import { Session } from "next-auth";
import { generateSlug as wordSlug } from "random-word-slugs";

import { DBResult, generateSlug, getUserId, prisma, UpdateResult } from ".";

const defaultSource = "draw(circle(10));";

export async function getRecentlyEdited(session: Session) {
  const email = session.user?.email!;
  const user = await getUserId(email);
  if (!user) {
    return;
  }

  return prisma.ink.findMany({
    where: { creatorId: user.id },
    select: {
      name: true,
      rendered: true,
      slug: true,
    },
    orderBy: { updatedAt: "desc" },
    take: 4,
  });
}

let exploreCache: DBResult<typeof exploreInks> | undefined;
let lastExploreAt = Date.now();
const exploreBust = 5 * 60 * 1000; // 5 minutes

export async function exploreInks(): Promise<
  Array<{
    name: string;
    rendered: string | null;
    slug: string;
    creator: { name: string; avatar: string };
  }>
> {
  const now = Date.now();
  if (!exploreCache || now - lastExploreAt >= exploreBust) {
    lastExploreAt = now;
    exploreCache = (
      await prisma.$queryRaw<
        Array<{
          name: string;
          rendered: string | null;
          slug: string;
          user_name: string;
          user_avatar: string;
        }>
      >`SELECT "Ink".name as name, rendered, "Ink".slug as slug, U.avatar as "user_avatar", U.name as "user_name"
        FROM "Ink"
                 JOIN User U on U.id = Ink.creatorId
        ORDER BY random()
        LIMIT 12
      `
    ).map((d) => ({
      name: d.name,
      rendered: d.rendered,
      slug: d.slug,
      creator: {
        name: d.user_name,
        avatar: d.user_avatar,
      },
    }));
  }

  return exploreCache;
}

export async function getRandomInk() {
  return prisma.$queryRaw<[{ slug: string }]>`
      SELECT slug
      FROM "Ink"
      ORDER BY random()
      LIMIT 1
  `;
}

/// Generates a new ink for a provided session, and returns its slug if
/// successful.
export async function newInk(session: Session | null): Promise<string | void> {
  if (!session) {
    return;
  }

  const email = session.user?.email!;
  const user = await getUserId(email);
  if (!user) {
    return;
  }

  const name = wordSlug(3, { format: "title" });
  const slug = generateSlug(name);

  const { slug: s } = await prisma.ink.create({
    data: {
      source: defaultSource,
      creatorId: user.id,
      name,
      slug,
    },
    select: { slug: true },
  });

  return s;
}

export async function updateInk(
  session: Session,
  id: number,
  properties: {
    readonly source?: string;
    readonly rendered?: string;
    readonly name?: string;
  },
): Promise<UpdateResult> {
  try {
    const email = session.user?.email!;

    const ink = await prisma.ink.findFirst({
      where: { id },
      select: { creator: { select: { email: true } } },
    });
    if (!ink) {
      return UpdateResult.NotFound;
    }

    if (ink.creator.email !== email) {
      return UpdateResult.Unauthorized;
    }

    await prisma.ink.update({
      where: { id },
      data: properties,
    });

    return UpdateResult.Ok;
  } catch (e) {
    console.error(e);
    return UpdateResult.Error;
  }
}

export function loadInk(slug: string) {
  return prisma.ink.findFirst({
    where: { slug },
    select: {
      slug: true,
      name: true,
      source: true,
      rendered: true,
      id: true,
      creator: {
        select: {
          slug: true,
          avatar: true,
          name: true,
          email: true,
        },
      },
    },
  });
}
