import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = "admin3@pixelatee.com";
  const password = "dontknowyet";
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: "ADMIN",
      name: "Almight3",
      phoneNumber: "0812332",
      dateOfBirth: new Date("1990-01-01"),
      photo: "Logo.png",
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
