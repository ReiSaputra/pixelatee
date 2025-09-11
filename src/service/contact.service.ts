import { prisma } from "../application/database";

import { Contact, Prisma, User, UserPermission } from "../generated/prisma";

import { ContactFilters, ContactRequest, ContactResponse, toContactResponse, toContactPaginationResponse, ContactPaginationResponse, ContactParams } from "../model/contact.model";

import { ContactSchema } from "../schema/contact.schema";
import { Validation } from "../schema/validation";

import { ResponseError } from "../error/response.error";

export class ContactService {
  /**
   * Create a contact inquiry.
   * @param request the contact inquiry data
   * @returns the created contact inquiry
   * @throws ResponseError if error occur
   */
  public static async create(request: ContactRequest): Promise<ContactResponse> {
    // validating request
    const response: ContactRequest = Validation.validate<ContactRequest>(ContactSchema.CREATE, request);

    // create contact data
    const createContact: Contact & { handler: User | null } = await prisma.contact.create({ data: response, include: { handler: true } });

    // specify return
    createContact.email = undefined!;
    createContact.message = undefined!;
    createContact.subject = undefined!;
    createContact.type = undefined!;
    createContact.handler = undefined!;

    // return response
    return toContactResponse(createContact);
  }

  /**
   * Get all contact based on the user permission and filters
   * @param user the user that make the request
   * @param filters the filters to filter the data
   * @returns array of ContactResponse that contains the filtered data
   * @throws ResponseError if error occur
   */
  public static async adminGetAll(user: (User & { permissions: UserPermission | null }) | undefined, filters: ContactFilters): Promise<ContactPaginationResponse> {
    // query params validation
    const response: ContactFilters = Validation.validate<ContactFilters>(ContactSchema.GET_ALL, filters);

    // set offset for skipping data
    const offset = (response.page - 1) * 15;

    // dynamic where for filters
    const where: Prisma.ContactWhereInput = {};

    // if there is a email fiter or name filter
    if (response.search) where.OR = [{ email: { contains: response.search } }, { name: { contains: response.search } }];

    // if there is a type filter
    if (response.type) where.type = response.type;

    // find all contact
    const findContact: (Contact & { handler: User | null })[] = await prisma.contact.findMany({
      where: where,
      orderBy: { createdAt: "desc" },
      take: 15,
      skip: offset,
      include: { handler: true },
    });

    // count data
    const count: number = await prisma.contact.count({ where: where });

    // return response
    return toContactPaginationResponse(findContact, response.page, 15, count, Math.ceil(count / 15));
  }

  /**
   * Get a contact by ID
   * @param contactId the ID of the contact to get
   * @returns the contact that match the ID
   * @throws ResponseError if contact not found
   */
  public static async adminGetDetail(contactId: ContactParams): Promise<ContactResponse> {
    // validate params
    const response: ContactParams = Validation.validate<ContactParams>(ContactSchema.PARAMS, contactId);

    // find contact
    const findContact: (Contact & { handler: User | null }) | null = await prisma.contact.findUnique({ where: { id: response.contactId }, include: { handler: true } });

    // if contact not found
    if (!findContact) throw new ResponseError("Contact not found");

    // return response
    return toContactResponse(findContact);
  }

  public static async adminDelete(contactId: ContactParams): Promise<ContactResponse> {
    // validate params
    const response: ContactParams = Validation.validate<ContactParams>(ContactSchema.PARAMS, contactId);

    // find contact
    const findContact: (Contact & { handler: User | null }) | null = await prisma.contact.findUnique({ where: { id: response.contactId }, include: { handler: true } });

    // if contact not found
    if (!findContact) throw new ResponseError("Contact not found");

    // delete contact
    const deleteContact: Contact & { handler: User | null } = await prisma.contact.delete({ where: { id: response.contactId }, include: { handler: true } });

    deleteContact.email = undefined!;
    deleteContact.subject = undefined!;
    deleteContact.message = undefined!;
    deleteContact.type = undefined!;
    if (deleteContact.handler) {
      deleteContact.handler.name = undefined!;
    }

    // return response
    return toContactResponse(deleteContact);
  }
}
