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

/**
 * Maps a Contact entity to a ContactResponse
 * @param contact - The Contact entity to be mapped
 * @returns A ContactResponse with the name of the contact
 */
export function toContactResponse(contact: Contact) {
  return {
    name: contact.name,
  };
}
