import express from "express";
import { v4 as uuid } from "uuid";

import { CookieGuest } from "../model/guest.model";

import { prisma } from "../application/database";

export class GuestMiddleware {
  public static async dailyVisit(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      // assert cookie
      const cookie: CookieGuest = req.signedCookies as CookieGuest;

      // if cookie is not exist, create new cookie
      if (!cookie.visitorId) {
        // cookie
        const visitorId: string = uuid();

        // create cookie
        res.cookie("visitorId", visitorId, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          signed: true,
          maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
        });

        // set date
        const date = new Date();

        date.setUTCHours(0, 0, 0, 0);
        const modifiedDate = date.toISOString();

        // create visitor
        await prisma.guestVisit.create({
          data: {
            visitorId: visitorId,
            ip: req.ip ?? "0.0.0.0",
            userAgent: req.headers["user-agent"]!,
            visitDate: modifiedDate,
          },
        });
      }

      // continue
      next();
    } catch (error: any) {
      next(error);
    }
  }
}
