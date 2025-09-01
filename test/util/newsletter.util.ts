import Mail from "nodemailer/lib/mailer";

import { prisma } from "../../src/application/database";

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
  /**
   * Create a new member in the database
   * @param email email to be created
   */
  public static async createMember(email: string) {
    const admin = await prisma.newsletterMember.create({ data: { email: email } });
    return admin.id;
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
