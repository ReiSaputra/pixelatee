import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = "admin1@pixelatee.com";
  const password = "dontknow";
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: "SUPER_ADMIN",
      name: "Deku",
      phoneNumber: "08123112",
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
