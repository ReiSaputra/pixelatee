import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@pixelatee.com";
  const password = "dontknow";
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: "ADMIN",
      name: "Super Admin",
      phoneNumber: "0000000000",
      dateOfBirth: new Date("1990-01-01"),
      photo: "default.png",
    },
  });

  console.log("✅ Admin created:", admin);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
