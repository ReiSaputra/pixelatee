import { NewsletterMember } from "../generated/prisma";

export type NewsletterParams = {
  memberId: string;
};

export type NewsletterRequest = {
  email: string;
};

export type NewsletterResponse = {
  id?: string;
  email?: string;
};

/**
 * Converts a NewsletterMember to a NewsletterResponse
 * @param newsletter the NewsletterMember to convert
 * @returns a NewsletterResponse containing the id and email of the newsletter
 */
export function toNewsletterResponse(newsletter: NewsletterMember): NewsletterResponse {
  return {
    id: newsletter.id,
    email: newsletter.email,
  };
}
