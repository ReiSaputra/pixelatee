import { prisma } from "../../src/application/database";

import { ContactResponse } from "../../src/model/contact.model";

export type ContactResponseSuccess = {
    status: string;
    code: number;
    data: ContactResponse;
    message: string;
};

export type ContactResponseError = {
    status: string;
    code: number;
    error: string;
    message: string;
};

export class ContactUtil {
  /**
   * Delete a contact by their email
   * @param email the email of the contact to be deleted
   */
  public static async deleteContact(email: string): Promise<void> {
    await prisma.contact.deleteMany({ where: { email: email } });
  }

  /**
   * Delete all contacts from the database
   */
  public static async deleteAllContact(): Promise<void> {
    await prisma.contact.deleteMany();
  }
}
