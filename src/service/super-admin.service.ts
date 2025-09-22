import bcrypt from "bcrypt";

import { prisma } from "../application/database";

import { User } from "../generated/prisma";

import { AdminRegisterRequest, AdminRegisterResponse, toAdminRegisterResponse } from "../model/super-admin.model";

import { SuperAdminSchema } from "../schema/super-admin.schema";
import { Validation } from "../schema/validation";

export class SuperAdminService {
  public static async registerAdmin(request: AdminRegisterRequest): Promise<AdminRegisterResponse> {
    // request validation
    const response: AdminRegisterRequest = Validation.validate(SuperAdminSchema.REGISTER_ADMIN, request);

    // check if admin already exists
    const findAdmin = await prisma.user.findUnique({ where: { email: response.email } });

    // if admin already exists then throw error
    if (findAdmin) throw new Error("Admin already exists");

    // create admin
    const createUser: User = await prisma.user.create({
      data: {
        name: response.name,
        password: await bcrypt.hash(response.password, 10),
        email: response.email,
        photo: "default.png",
        dateOfBirth: response.dateOfBirth,
        phoneNumber: response.phoneNumber,
        role: response.userRole,
        address: {
          create: {
            city: null,
            country: null,
            zipCode: null,
          },
        },
        permissions: {
          create: {
            canReadAdmin: false,
            canWriteAdmin: false,
            canUpdateAdmin: false,
            canDeleteAdmin: false,

            canReadClient: false,
            canWriteClient: false,
            canUpdateClient: false,
            canDeleteClient: false,

            canReadContact: false,
            canWriteContact: false,
            canUpdateContact: false,
            canDeleteContact: false,

            canReadNewsletter: false,
            canWriteNewsletter: false,
            canUpdateNewsletter: false,
            canDeleteNewsletter: false,

            canReadPortfolio: false,
            canWritePortfolio: false,
            canUpdatePortfolio: false,
            canDeletePortfolio: false,
          },
        },
      },
    });

    // return admin
    return toAdminRegisterResponse(createUser);
  }

  // public static async adminList(request: AdminList): Promise<AdminResponse> {
  //   // find all admins
  //   const findAdmin: User[] = await prisma.user.findMany({
  //     where: {
  //       role: "ADMIN",
  //     },
  //   });

  //   return toAdminResponse(findAdmin);
  // }

  // public static async deleteAdmin(id: Admin): Promise<void> {}
}
