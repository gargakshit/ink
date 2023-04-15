import { Session } from "next-auth";

import { getUserId } from "@/lib/db/users";
import { generateSlug, prisma } from "@/lib/db/index";

export async function createCollection(session: Session, name: string) {
  const email = session.user?.email!;
  const user = await getUserId(email);
  if (!user) {
    return;
  }

  const slug = generateSlug(name);
  await prisma.collection.create({
    data: {
      name,
      slug,
      curatorId: user.id,
    },
  });
}

export async function getMyCollections(session: Session) {
  const email = session.user?.email!;
  const user = await getUserId(email);
  if (!user) {
    return;
  }

  return prisma.collection.findMany({
    where: { curatorId: user.id },
    select: {
      id: true,
      inks: true,
      name: true,
      slug: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function putInCollection(
  session: Session,
  id: number,
  inkId: number,
  selected: boolean
) {
  const email = session.user?.email!;
  const user = await getUserId(email);
  if (!user) {
    return;
  }

  const collection = await prisma.collection.findFirst({
    where: { id, curatorId: user.id },
    select: { id: true },
  });
  if (!collection) {
    return;
  }

  if (selected) {
    await prisma.inkInCollection.upsert({
      where: { inkId_collectionId: { inkId, collectionId: collection.id } },
      create: { inkId, collectionId: collection.id },
      update: {},
    });
  } else {
    try {
      await prisma.inkInCollection.delete({
        where: { inkId_collectionId: { inkId, collectionId: collection.id } },
      });
    } catch {}
  }
}
