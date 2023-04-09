import { Session } from "next-auth";
import { generateSlug as wordSlug } from "random-word-slugs";

import { generateSlug, getUserId, prisma, UpdateResult } from ".";

const defaultSource = `draw(circle(10));`;

/// Generates a new ink for a provided session, and returns its slug if
// successful.
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
  properties: { readonly source?: string; readonly rendered?: string }
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
    include: { creator: true },
  });
}
