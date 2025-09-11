import { faker } from "@faker-js/faker";

import { prisma } from "../../src/application/database";

import { $Enums } from "../../src/generated/prisma";

import { ContactPaginationResponse, ContactResponse } from "../../src/model/contact.model";

export type ContactResponseSuccess = {
  status: string;
  code: number;
  data: ContactResponse;
  message: string;
};

export type ContactPaginationResponseSuccess = {
  status: string;
  code: number;
  data: ContactPaginationResponse;
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
   * Creates a contact in the database
   *
   * @param name - Name of the contact
   * @param email - Email of the contact
   * @param subject - Subject of the contact
   * @param message - Message of the contact
   * @param type - Type of the contact
   * @param handlerId - The ID of the user that is assigned to handle the contact. If not specified, the contact will not be assigned to anyone.
   */
  public static async createContact(name: string, email: string, subject: string, message: string, type: $Enums.ContactType, handlerId?: string): Promise<string> {
    const contact = await prisma.contact.create({
      data: {
        name: name,
        email: email,
        subject: subject,
        message: message,
        type: type,
        handlerId: handlerId,
      },
    });

    return contact.id;
  }

  /**
   * Delete a contact by their email
   * @param email the email of the contact to be deleted
   */
  public static async deleteContact(email: string): Promise<void> {
    await prisma.contact.deleteMany({ where: { email: email } });
  }

  /**
   * Creates a specified amount of contacts in the database
   *
   * @param limiter - The amount of contacts to create
   * @param handlerId - The ID of the user that is assigned to handle all the contacts. If not specified, the contact will not be assigned to anyone.
   */
  public static async createAllContact(limiter: number, handlerId?: string): Promise<void> {
    for (let i = 0; i < limiter; i++) {
      await prisma.contact.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          subject: faker.lorem.sentence(),
          message: faker.lorem.paragraphs(2),
          type: faker.helpers.arrayElement(["CUSTOMER_SERVICE", "IT_CONSULTATION", "UIUX_DEVELOPMENT", "WEB_DEVELOPMENT", "MOBILE_DEVELOPMENT"]),
          handlerId: handlerId,
        },
      });
    }
  }

  /**
   * Delete all contacts from the database
   */
  public static async deleteAllContact(): Promise<void> {
    await prisma.contact.deleteMany();
  }
}
