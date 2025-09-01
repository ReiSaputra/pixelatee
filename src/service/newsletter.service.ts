import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import Mail from "nodemailer/lib/mailer";
import dotenv from "dotenv";
import fs from "fs/promises";

import { prisma } from "../application/database";

import { NewsletterMember } from "../generated/prisma";

import { NewsletterParams, NewsletterRequest, toNewsletterResponse } from "../model/newsletter.model";

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
  public static async join(request: NewsletterRequest): Promise<(string | Mail.Address)[]> {
    // validating request
    const response: NewsletterRequest = Validation.validate<NewsletterRequest>(NewsletterSchema.JOIN, request);

    // checking email that already exist
    const findNewsletterMember: NewsletterMember | null = await prisma.newsletterMember.findUnique({ where: { email: response.email } });

    // if email already exist then throw error
    if (findNewsletterMember) throw new ResponseError("Email is already exist", 400);

    // create newsletter member temporary
    const createNewsletterMember: NewsletterMember = await prisma.newsletterMember.create({ data: { email: response.email } });

    // send email to newsletter member
    const transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options> = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS,
      },
    });

    // read html file
    const html: string = await fs.readFile("assets/html/newsletter-join.html", "utf8");

    // replace email
    const replaceHtml: string = html.replace("{{memberId}}", createNewsletterMember.id);

    // send email
    const info: SMTPTransport.SentMessageInfo = await transporter.sendMail({
      from: "'Pixelatee' <info@pixelatee.com>",
      to: response.email,
      subject: "Confirm Your Subscription to Pixelatee",
      html: replaceHtml,
    });

    // return accepted email as a response
    return info.accepted;
  }

  public static async confirm(request: NewsletterParams) {
    // validating request
    const response: NewsletterParams = Validation.validate<NewsletterParams>(NewsletterSchema.CONFIRM, request);

    // find newsletter member equals to params
    const findNewsletterMember: NewsletterMember | null = await prisma.newsletterMember.findUnique({
      where: { id: response.memberId },
    });

    // if newsletter member not found then throw error
    if (!findNewsletterMember) throw new ResponseError("Member ID not found", 400);

    // update newsletter member to subscriber
    const updateNewsletterMember: NewsletterMember = await prisma.newsletterMember.update({ where: { id: response.memberId }, data: { status: "SUBSCRIBE" } });

    // return response
    return toNewsletterResponse(updateNewsletterMember);
  }

  
}
