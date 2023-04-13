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

  const collections = prisma.collection.findMany({
    where: { curatorId: user.id },
    include: { inks: true },
  });

  return collections;
}
