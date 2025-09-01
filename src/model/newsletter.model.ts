import { NewsletterMember } from "../generated/prisma";

export type NewsletterParams = {
  memberId: string;
};

export type NewsletterRequest = {
  email: string;
};

export type NewsletterResponse = {
  email: string;
};

export function toNewsletterResponse(data: NewsletterMember): NewsletterResponse {
  return {
    email: data.email,
  };
}
