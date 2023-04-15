import { generateSlug, prisma } from ".";

export async function signUp(user: {
  email: string;
  name: string;
  image: string;
}) {
  const u = await prisma.user.findFirst({
    where: { email: user.email },
    select: { id: true },
  });

  if (u === null) {
    // Create a new user
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        avatar: user.image,
        slug: generateSlug(user.name!),
      },
    });
  }
}

export function getUserId(email: string) {
  return prisma.user.findFirst({ where: { email }, select: { id: true } });
}

export function getUserSlug(email: string) {
  return prisma.user.findFirst({ where: { email }, select: { slug: true } });
}

export function getUser(slug: string) {
  return prisma.user.findFirst({
    where: { slug },
    select: {
      name: true,
      avatar: true,
      slug: true,
      inks: {
        select: {
          name: true,
          slug: true,
          rendered: true,
        },
      },
      collections: {
        select: {
          id: true,
          name: true,
          slug: true,
          inks: {
            select: {
              ink: {
                select: { rendered: true },
              },
            },
          },
        },
      },
    },
  });
}
