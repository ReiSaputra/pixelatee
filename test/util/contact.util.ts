import { prisma } from "../../src/application/database";

import { $Enums } from "../../src/generated/prisma";

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
  public static async createContact(name: string, email: string, subject: string, message: string, type: $Enums.ContactType): Promise<void> {
    await prisma.contact.create({ data: { name: name, email: email, subject: subject, message: message, type: type } });
  }

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
