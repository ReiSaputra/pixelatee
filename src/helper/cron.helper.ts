import cron from "node-cron";
import fs from "fs/promises";

import { logger } from "../application/log";

import { transporter } from "./mailer.helper";

import { prisma } from "../application/database";

import { Newsletter, NewsletterMember } from "../generated/prisma";

export async function newsletterScheduledUploader(): Promise<void> {
  await prisma.newsletterMember.deleteMany();
  await prisma.newsletter.deleteMany();
  await prisma.user.deleteMany();
  const admin = await prisma.user.create({
    data: {
      name: "Han Solo",
      email: "fthrn.s14@gmail.com",
      password: "12345678",
      phoneNumber: "08123456789",
      photo: "default.png",
      role: "ADMIN",
      dateOfBirth: new Date(),
    },
    select: {
      id: true,
    },
  });

  await prisma.newsletterMember.createMany({
    data: [
      {
        email: "fthrn.s14@gmail.com",
        status: "SUBSCRIBE",
      },
      {
        email: "fathurraihan.edu@gmail.com",
        status: "SUBSCRIBE",
      },
    ],
  });

  await prisma.newsletter.createMany({
    data: [
      {
        title: "Test",
        content: "Test",
        photo: "Test",
        type: "TECH",
        status: "SCHEDULED",
        authorId: admin.id,
      },
      {
        title: "Test 2",
        content: "Test 2",
        photo: "Test 2",
        type: "TECH",
        status: "SCHEDULED",
        authorId: admin.id,
      },
    ],
  });

  // every 3 minutes, send email
  cron.schedule("*/3 * * * *", async () => {
    try {
      const findNewsletterMember: NewsletterMember[] = await prisma.newsletterMember.findMany({
        where: {
          status: "SUBSCRIBE",
        },
      });

      console.info(findNewsletterMember.map((item) => item.email).join(", "));

      // find scheduled newsletter
      const findScheduledNewsletter: Newsletter[] = await prisma.newsletter.findMany({
        where: {
          status: "SCHEDULED",
        },
      });

      // read html file
      const html: string = await fs.readFile("assets/html/newsletter.html", "utf8");

      // for every scheduled newsletter, send email
      for (const item of findScheduledNewsletter) {
        // replace email
        let replaceHtml: string = html.replace("{{title}}", item.title);

        // replace content
        replaceHtml = replaceHtml.replace("{{content}}", item.content);

        // replace photo
        replaceHtml = replaceHtml.replace("{{photo}}", item.photo);

        // send email to all subscribers
        transporter.sendMail({
          from: "'Pixelatee' <info@pixelatee.com>",
          to: findNewsletterMember.map((item) => item.email).join(", "),
          subject: item.title,
          html: item.content,
        });

        // update newsletter status to PUBLISHED
        await prisma.newsletter.update({
          where: {
            id: item.id,
          },
          data: {
            status: "PUBLISHED",
          },
        });
      }
    } catch (error) {
      logger.error(error);
    }
  });
}
