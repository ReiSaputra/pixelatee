import { prisma } from "../application/database";

import { Contact, Prisma, User, UserPermission } from "../generated/prisma";

import { ContactFilters, ContactRequest, ContactResponse, toContactResponse } from "../model/contact.model";

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

  public static async adminGetAll(user: (User & { permissions: UserPermission | null }) | undefined, filters: ContactFilters): Promise<ContactResponse[]> {
    // query params validation
    const response: ContactFilters = Validation.validate<ContactFilters>(ContactSchema.GET_ALL, filters);

    // set offset for skipping data
    const offset = (response.page - 1) * 15;

    // dynamic where for filters
    const where: Prisma.ContactWhereInput = {};

    // if there is a name filter
    if (response.name) where.name = { contains: response.name };
    
  }
}
