import { NewsletterMember } from "../generated/prisma";

export type NewsletterParams = {
  memberId: string;
};

export type NewsletterRequest = {
  email: string;
};

export type NewsletterResponse = {
  id: string;
};

export function toNewsletterResponse(data: NewsletterMember): NewsletterResponse {
  return {
    id: data.id,
  };
}
