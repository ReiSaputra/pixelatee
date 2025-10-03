import { $Enums, Newsletter, NewsletterMember, User } from "../generated/prisma";

export type NewsletterJoinParams = {
  memberId: string;
};

export type NewsletterParams = {
  newsletterId: string;
};

export type NewsletterFilters = {
  search?: string | undefined;
  status?: $Enums.NewsletterStatus | undefined;
  type?: $Enums.NewsletterType | undefined;
};

export type NewsletterJoinRequest = {
  email: string;
};

export type NewsletterRequest = {
  title: string;
  content: string;
  photo?: string | undefined;
  type: $Enums.NewsletterType;
  isScheduled: "true" | "false";
  status: $Enums.NewsletterStatus;
};

export type NewsletterResponse = {
  id?: string;
  email?: string;
  title?: string;
  content?: string;
  photo?: string;
  author?: string;
  type?: $Enums.NewsletterType;
  status?: $Enums.NewsletterStatus;
  createdAt?: Date;
};

/**
 * Convert newsletter member to newsletter response
 * @param newsletter newsletter member data
 * @returns newsletter response data
 */
export function toNewsletterJoinResponse(newsletter: NewsletterMember): NewsletterResponse {
  return {
    id: newsletter.id,
    email: newsletter.email,
  };
}

export function toNewsletterResponse(newsletter: Newsletter & { author: User }): NewsletterResponse {
  return {
    title: newsletter.title,
    content: newsletter.content,
    photo: newsletter.photo,
    author: newsletter.author.name!,
    type: newsletter.type,
    createdAt: newsletter.createdAt,
  };
}

export function toScheduledNewslettersResponse(newsletters: (Newsletter & { author: User })[]): NewsletterResponse[] {
  return newsletters.map((newsletter) => {
    return {
      id: newsletter.id,
      title: newsletter.title,
      content: newsletter.content,
      createdAt: newsletter.createdAt,
    };
  });
}

export function toNewslettersResponse(newsletters: (Newsletter & { author: User })[]): NewsletterResponse[] {
  return newsletters.map((newsletter) => {
    return {
      id: newsletter.id,
      title: newsletter.title,
      content: newsletter.content,
      photo: newsletter.photo,
      type: newsletter.type,
      createdAt: newsletter.createdAt,
    };
  });
}
