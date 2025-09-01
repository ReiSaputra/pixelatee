import { Contact } from "../generated/prisma";

export type ContactRequest = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type ContactResponse = {
  name: string;
  email?: string;
  subject?: string;
  message?: string;
};

export function toContactResponse(contact: Contact) {
  return {
    name: contact.name,
  };
}
