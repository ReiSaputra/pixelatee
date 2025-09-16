import cron from "node-cron";

import { prisma } from "../application/database";

import { NewsletterMember } from "../generated/prisma";

export async function newsletterScheduledUploader(): Promise<void> {
  cron.schedule("*/5 * * * *", async () => {
    const findNewsletterMember: NewsletterMember[] = await prisma.newsletterMember.findMany({
      where: {
        status: "SUBSCRIBE",
      },
    });

    console.info(findNewsletterMember.map((item) => item.email).join(", "));
  });
}
