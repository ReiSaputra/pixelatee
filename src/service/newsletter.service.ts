import SMTPTransport from "nodemailer/lib/smtp-transport";
import Mail from "nodemailer/lib/mailer";
import dotenv from "dotenv";
import fs from "fs/promises";

import { transporter } from "../helper/mailer.helper";

import { logger } from "../application/log";

import { prisma } from "../application/database";

import { Newsletter, NewsletterMember, Prisma, User, UserPermission } from "../generated/prisma";

import { NewsletterFilters, NewsletterJoinParams, NewsletterJoinRequest, NewsletterParams, NewsletterRequest, NewsletterResponse, toNewsletterJoinResponse, toNewsletterResponse, toNewslettersResponse } from "../model/newsletter.model";

import { NewsletterSchema } from "../schema/newsletter.schema";
import { Validation } from "../schema/validation";

import { ResponseError } from "../error/response.error";

dotenv.config();

export class NewsletterService {
  /**
   * Join newsletter
   * @param request request that contains email
   * @returns accepted email addresses
   * @throws ResponseError if email already exist
   */
  public static async join(request: NewsletterJoinRequest): Promise<(string | Mail.Address)[]> {
    // validating request
    const responseValidation: NewsletterJoinRequest = Validation.validate<NewsletterJoinRequest>(NewsletterSchema.JOIN, request);

    // checking email that already exist
    const findNewsletterMember: NewsletterMember | null = await prisma.newsletterMember.findUnique({ where: { email: responseValidation.email! } });

    // if email already exist then throw error
    if (findNewsletterMember) throw new ResponseError("Email is already exist", 400);

    // create newsletter member temporary
    const createNewsletterMember: NewsletterMember = await prisma.newsletterMember.create({ data: { email: responseValidation.email! } });

    // read html file
    const html: string = await fs.readFile("assets/html/newsletter-join.html", "utf8");

    // replace email
    const replaceHtml: string = html.replace("{{memberId}}", createNewsletterMember.id);

    // send email
    const info: SMTPTransport.SentMessageInfo = await transporter.sendMail({
      from: "'Pixelatee' <info@pixelatee.com>",
      to: responseValidation.email,
      subject: "Confirm Your Subscription to Pixelatee",
      html: replaceHtml,
    });

    // return accepted email as a response
    return info.accepted;
  }

  /**
   * Activate newsletter
   * @param request request that contains member ID
   * @returns member data
   * @throws ResponseError if member ID not found
   */
  public static async activate(params: NewsletterJoinParams): Promise<NewsletterResponse> {
    // validating params
    const paramsValidation: NewsletterJoinParams = Validation.validate<NewsletterJoinParams>(NewsletterSchema.MEMBER, params);

    // find newsletter member equals to params
    const findNewsletterMember: NewsletterMember | null = await prisma.newsletterMember.findUnique({
      where: { id: paramsValidation.memberId },
    });

    // if newsletter member not found then throw error
    if (!findNewsletterMember) throw new ResponseError("Member Id not found", 400);

    // update newsletter member to subscriber
    const updateNewsletterMember: NewsletterMember = await prisma.newsletterMember.update({ where: { id: paramsValidation.memberId }, data: { status: "SUBSCRIBE" } });

    // return response
    return toNewsletterJoinResponse(updateNewsletterMember);
  }

  /**
   * Unsubscribe newsletter
   * @param params request that contains member ID
   * @returns member data
   * @throws ResponseError if member ID not found
   */
  public static async unsubscribe(params: NewsletterJoinParams): Promise<NewsletterResponse> {
    // validating params
    const paramsValidation: NewsletterJoinParams = Validation.validate<NewsletterJoinParams>(NewsletterSchema.MEMBER, params);

    // find newsletter member equals to params
    const findNewsletterMember: NewsletterMember | null = await prisma.newsletterMember.findUnique({
      where: { id: paramsValidation.memberId },
    });

    // if newsletter member not found then throw error
    if (!findNewsletterMember) throw new ResponseError("Member Id not found", 400);

    // delete newsletter member
    const deleteNewsletterMember: NewsletterMember = await prisma.newsletterMember.delete({ where: { id: paramsValidation.memberId } });

    // specify return
    deleteNewsletterMember.id = undefined!;
    
    // return response
    return toNewsletterJoinResponse(deleteNewsletterMember);
  }

  /**
   * Thanks for subscribing to newsletter
   * @param params params that contains member ID
   * @returns member data
   * @throws ResponseError if member ID not found
   */
  public static async thanks(request: NewsletterJoinParams): Promise<NewsletterResponse> {
    // validating request
    const response: NewsletterJoinParams = Validation.validate<NewsletterJoinParams>(NewsletterSchema.MEMBER, request);

    // find newsletter member equals to params
    const findNewsletterMember: NewsletterMember | null = await prisma.newsletterMember.findUnique({
      where: { id: response.memberId },
    });

    // if newsletter member not found then throw error
    if (!findNewsletterMember) throw new ResponseError("Member Id not found", 400);

    // specify return
    findNewsletterMember.id = undefined!;

    // return response
    return toNewsletterJoinResponse(findNewsletterMember);
  }

  public static async adminGetAll(user: (User & { permissions: UserPermission | null }) | undefined, filters: NewsletterFilters): Promise<NewsletterResponse[]> {
    // validating filters
    const queryValidation = Validation.validate<NewsletterFilters>(NewsletterSchema.FILTER, filters);

    // dynamic where
    const where: Prisma.NewsletterWhereInput = {
      authorId: user?.id!,
    };

    // if there is a status filter
    if (queryValidation.status) where.status = queryValidation.status;

    // if there is a search filter
    if (queryValidation.search) where.title = { contains: queryValidation.search };

    // if there is a type filter
    if (queryValidation.type) where.type = queryValidation.type;

    // find all newsletters
    const findNewsletters: (Newsletter & { author: User })[] = await prisma.newsletter.findMany({
      where: where,
      orderBy: { createdAt: "desc" },
      include: {
        author: true,
      },
    });

    // return response
    return toNewslettersResponse(findNewsletters);
  }

  public static async adminGetDetail(params: NewsletterParams): Promise<NewsletterResponse> {
    // validating params
    const paramsValidation: NewsletterParams = Validation.validate<NewsletterParams>(NewsletterSchema.DETAIL, params);

    // find newsletter
    const findNewsletter: (Newsletter & { author: User }) | null = await prisma.newsletter.findUnique({
      where: { id: paramsValidation.newsletterId },
      include: {
        author: true,
      },
    });

    // if newsletter not found then throw error
    if (!findNewsletter) throw new ResponseError("Newsletter Id not found", 400);

    // return response
    return toNewsletterResponse(findNewsletter);
  }

  /**
   * Create a newsletter
   * @param user user data that contains permissions
   * @param request request that contains title, content, photo, status, and isScheduled
   * @param file file that needs to be deleted if the newsletter status is draft
   * @returns newsletter response data
   * @throws ResponseError if failed to create newsletter
   */
  public static async adminCreate(user: (User & { permissions: UserPermission | null }) | undefined, request: NewsletterRequest, file: Express.Multer.File): Promise<NewsletterResponse> {
    // validating request
    const response: NewsletterRequest = Validation.validate<NewsletterRequest>(NewsletterSchema.CREATE, request);

    // if it is scheduled, set to SCHEDULED
    if (response.isScheduled === "true") response.status = "SCHEDULED";

    // create newsletter member
    const createNewsletter: Newsletter & { author: User } = await prisma.newsletter.create({
      data: {
        title: response.title,
        content: response.content,
        photo: file?.filename,
        type: response.type,
        status: response.status,
        authorId: user!.id,
      },
      include: {
        author: true,
      },
    });

    // if it is PUBLISHED, send newsletter now
    if (response.status === "PUBLISHED") {
      // get all newsletter members
      const findNewsletterMembers: { id: string; email: string }[] = await prisma.newsletterMember.findMany({ where: { status: "SUBSCRIBE" }, select: { id: true, email: true } });

      // read html file
      const html: string = await fs.readFile("assets/html/newsletter.html", "utf8");

      // replace email
      let replaceHtml: string = html.replace("{{title}}", createNewsletter.title);

      // replace content
      replaceHtml = replaceHtml.replace("{{content}}", createNewsletter.content);

      // replace photo
      replaceHtml = replaceHtml.replace("{{photo}}", createNewsletter.photo);

      // send email
      for (const member of findNewsletterMembers) {
        // replace memberId
        replaceHtml = replaceHtml.replace("{{memberId}}", member.id);

        // info
        const info: SMTPTransport.SentMessageInfo = await transporter.sendMail({
          from: "'Pixelatee' <info@pixelatee.com>",
          to: member.email,
          subject: createNewsletter.title,
          html: replaceHtml,
        });
      }
    }

    // specify return
    createNewsletter.id = undefined!;
    createNewsletter.content = undefined!;
    createNewsletter.author.name = undefined!;
    createNewsletter.type = undefined!;
    createNewsletter.photo = undefined!;
    createNewsletter.createdAt = undefined!;

    // return response
    return toNewsletterResponse(createNewsletter);
  }

  /**
   * Get newsletter preview by id
   * @param params newsletter id
   * @returns newsletter response data
   * @throws ResponseError if newsletter not found
   */
  public static async adminEditPreview(params: NewsletterParams): Promise<NewsletterResponse> {
    // validating params
    const paramsValidation: NewsletterParams = Validation.validate<NewsletterParams>(NewsletterSchema.DETAIL, params);

    // find newsletter
    const findNewsletter: (Newsletter & { author: User }) | null = await prisma.newsletter.findUnique({ where: { id: paramsValidation.newsletterId }, include: { author: true } });

    // if newsletter not found
    if (!findNewsletter) throw new ResponseError("Newsletter not found", 400);

    // specify return
    findNewsletter.author.name = undefined!;
    findNewsletter.createdAt = undefined!;

    // return response
    return toNewsletterResponse(findNewsletter);
  }

  /**
   * Update a newsletter
   * @param user user data that contains permissions
   * @param params newsletter id
   * @param request request that contains title, content, photo, type, status, and isScheduled
   * @returns newsletter response data
   * @throws ResponseError if newsletter not found
   */
  public static async adminUpdate(user: (User & { permissions: UserPermission | null }) | undefined, file: Express.Multer.File | undefined, params: NewsletterParams, request: NewsletterRequest): Promise<NewsletterResponse> {
    // validating request
    const paramsValidation: NewsletterParams = Validation.validate<NewsletterParams>(NewsletterSchema.DETAIL, params);

    // validating request
    const requestValidation: NewsletterRequest = Validation.validate<NewsletterRequest>(NewsletterSchema.UPDATE, request);

    // find newsletter
    const findNewsletter: Newsletter | null = await prisma.newsletter.findUnique({ where: { id: paramsValidation.newsletterId } });

    // if newsletter not found
    if (!findNewsletter) throw new ResponseError("Newsletter not found", 400);

    // delete old file
    if (file && file.filename !== findNewsletter.photo) {
      try {
        await fs.access(`public/newsletter/${findNewsletter.photo}`);
        await fs.unlink(`public/newsletter/${findNewsletter.photo}`);
      } catch (error) {
        logger.error(error);
      }
    }

    // update newsletter
    const updateNewsletter: Newsletter & { author: User } = await prisma.newsletter.update({
      where: { id: findNewsletter.id },
      data: {
        title: requestValidation.title,
        content: requestValidation.content,
        photo: file?.filename ?? findNewsletter.photo,
        type: requestValidation.type,
        status: requestValidation.status,
        authorId: user!.id,
      },
      include: {
        author: true,
      },
    });

    // specify return
    updateNewsletter.content = undefined!;
    updateNewsletter.author.name = undefined!;
    updateNewsletter.type = undefined!;
    updateNewsletter.photo = undefined!;
    updateNewsletter.createdAt = undefined!;

    // return response
    return toNewsletterResponse(updateNewsletter);
  }

  /**
   * Delete a newsletter
   * @param params newsletter id
   * @returns deleted newsletter response data
   * @throws ResponseError if newsletter not found
   */
  public static async adminDelete(params: NewsletterParams): Promise<NewsletterResponse> {
    // validating params
    const paramsValidation: NewsletterParams = Validation.validate<NewsletterParams>(NewsletterSchema.DETAIL, params);

    // find newsletter
    const findNewsletter: Newsletter | null = await prisma.newsletter.findUnique({ where: { id: paramsValidation.newsletterId } });

    // if newsletter not found
    if (!findNewsletter) throw new ResponseError("Newsletter not found", 400);

    // delete file
    try {
      await fs.access(`public/newsletter/${findNewsletter.photo}`);
      await fs.unlink(`public/newsletter/${findNewsletter.photo}`);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        logger.error(error);
      } else {
        throw error;
      }
    }

    // delete newsletter
    const deleteNewsletter: Newsletter & { author: User } = await prisma.newsletter.delete({ where: { id: findNewsletter.id }, include: { author: true } });

    // specify return
    deleteNewsletter.content = undefined!;
    deleteNewsletter.author.name = undefined!;
    deleteNewsletter.type = undefined!;
    deleteNewsletter.photo = undefined!;
    deleteNewsletter.createdAt = undefined!;

    // return response
    return toNewsletterResponse(deleteNewsletter);
  }
}
