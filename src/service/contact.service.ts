import { prisma } from "../application/database";

import { Contact } from "../generated/prisma";

import { ContactRequest, ContactResponse, toContactResponse } from "../model/contact.model";

import { ContactSchema } from "../schema/contact.schema";
import { Validation } from "../schema/validation";

export class ContactService {
  public static async create(request: ContactRequest): Promise<ContactResponse> {
    // validating request
    const response: ContactRequest = Validation.validate<ContactRequest>(ContactSchema.CREATE, request);

    // create contact data
    const createContact: Contact = await prisma.contact.create({ data: response });

    // return response
    return toContactResponse(createContact);
  }

  
}
