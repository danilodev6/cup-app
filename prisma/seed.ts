import { hash } from "bcryptjs";
import prisma from "../src/lib/prisma";

async function main() {
  const hashedPassword = await hash(process.env.ADMIN_PW!, 10);

  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: hashedPassword,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
