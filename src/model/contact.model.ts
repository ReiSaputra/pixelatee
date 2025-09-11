import { $Enums, Contact, User } from "../generated/prisma";

export type ContactParams = {
  contactId: string;
};

export type ContactRequest = {
  name: string;
  email: string;
  subject: string;
  type: $Enums.ContactType;
  message: string;
};

export type ContactResponse = {
  id?: string;
  name: string;
  email?: string;
  type?: $Enums.ContactType;
  handler?: string | null | undefined;
  subject?: string;
  message?: string;
};

export type ContactPaginationResponse = {
  contacts: ContactResponse[];
  pagination: {
    page: number;
    limit: number;
    totalData: number;
    totalPage: number;
  };
};

export type ContactFilters = {
  page: number;
  search?: string | undefined;
  type?: $Enums.ContactType | undefined;
};

/**
 * Maps a Contact entity to a ContactResponse
 * @param contact - The Contact entity to be mapped
 * @returns A ContactResponse with the name of the contact
 */
export function toContactResponse(contact: Contact & { handler: User | null }): ContactResponse {
  return {
    name: contact.name,
    email: contact.email,
    subject: contact.subject,
    message: contact.message,
    type: contact.type,
    handler: contact.handler?.name,
  };
}

export function toContactsResponse(contact: (Contact & { handler: User | null })[]): ContactResponse[] {
  return contact.map((item) => {
    return {
      id: item.id,
      name: item.name,
      email: item.email,
      subject: item.subject,
      message: item.message,
      type: item.type,
      handler: item.handler?.name,
    };
  });
}

export function toContactPaginationResponse(contact: (Contact & { handler: User | null })[], page: number, limit: number, totalData: number, totalPage: number): ContactPaginationResponse {
  return {
    contacts: toContactsResponse(contact),
    pagination: {
      page: page,
      limit: limit,
      totalData: totalData,
      totalPage: totalPage,
    },
  };
}
