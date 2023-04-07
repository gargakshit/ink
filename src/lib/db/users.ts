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
