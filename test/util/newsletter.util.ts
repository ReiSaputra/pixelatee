import Mail from "nodemailer/lib/mailer";
import { faker } from "@faker-js/faker";

import { prisma } from "../../src/application/database";

import { $Enums } from "../../src/generated/prisma";

import { NewsletterResponse } from "../../src/model/newsletter.model";

export type NewsletterResponseSuccess = {
  status: string;
  code: number;
  data: (string | Mail.Address)[] | NewsletterResponse;
  message: string;
};

export type NewsletterResponseError = {
  status: string;
  code: number;
  error: string;
  message: string;
};

export class NewsletterUtil {
  public static async deleteAllNewsletter() {
    await prisma.newsletter.deleteMany();
  }
  /**
   * Create a new member in the database
   * @param email email address of the member
   * @param status status of the member (default is SUBSCRIBE)
   * @returns the id of the created member
   */
  public static async createMember(email: string, status: $Enums.NewsletterMemberStatus = "SUBSCRIBE") {
    const admin = await prisma.newsletterMember.create({ data: { email: email, status: status } });
    return admin.id;
  }

  /**
   * Create a new newsletter in the database
   * @param title title of the newsletter
   * @param content content of the newsletter
   * @param photo photo of the newsletter
   * @param type type of the newsletter (TECH, BUSINESS, INTERNAL, OTHER)
   * @param status status of the newsletter (PUBLISHED, SCHEDULED, ARCHIVED)
   * @param authorId author id of the newsletter
   * @returns a promise that resolves when the newsletter is created
   */
  public static async createNewsletter(title: string, content: string, photo: string, type: $Enums.NewsletterType, status: $Enums.NewsletterStatus, authorId: string): Promise<string> {
    const newsletter = await prisma.newsletter.create({ data: { title: title, content: content, photo: photo, type: type, status: status, authorId: authorId } });
    return newsletter.id;
  }

  /**
   * Creates a specified amount of newsletters in the database
   * @param limiter the amount of newsletters to be created
   * @param authorId the author ID of the Newsletter
   */
  public static async createAllNewsletter(limiter: number, authorId: string): Promise<void> {
    for (let i = 0; i < limiter; i++) {
      await prisma.newsletter.create({
        data: {
          title: faker.lorem.sentence(),
          content: faker.lorem.paragraphs(2),
          photo: faker.image.url(),
          type: faker.helpers.arrayElement(["TECH", "BUSINESS", "INTERNAL", "OTHER"]),
          status: faker.helpers.arrayElement(["PUBLISHED", "SCHEDULED", "ARCHIVED"]),
          authorId: authorId,
        },
      });
    }
  }

  /**
   * Delete a member from the database
   * @param email email to be deleted
   */
  public static async deleteMember(email: string) {
    await prisma.newsletterMember.delete({ where: { email: email } });
  }

  /**
   * Delete all members from the database
   */
  public static async deleteAllMember() {
    await prisma.newsletterMember.deleteMany();
  }
}
