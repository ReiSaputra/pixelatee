import bcrypt from "bcrypt";

import { prisma } from "../application/database";

import { Portfolio, Prisma, User, UserPermission } from "../generated/prisma";

import { AdminFilters, AdminPaginationResponse, AdminParams, AdminRegisterRequest, AdminResponse, toAdminPaginationResponse, toAdminResponse, toAdminsResponse } from "../model/super-admin.model";

import { SuperAdminSchema } from "../schema/super-admin.schema";
import { Validation } from "../schema/validation";

import { ResponseError } from "../error/response.error";

export class SuperAdminService {
  public static async registerAdmin(request: AdminRegisterRequest): Promise<AdminResponse> {
    // request validation
    const response: AdminRegisterRequest = Validation.validate(SuperAdminSchema.REGISTER_ADMIN, request);

    // check if admin already exists
    const findAdmin = await prisma.user.findUnique({ where: { email: response.email } });

    // if admin already exists then throw error
    if (findAdmin) throw new ResponseError("Admin already exists");

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
            city: response.address?.city || null,
            country: response.address?.country || null,
            zipCode: response.address?.zipCode || null,
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
    return toAdminResponse(createUser);
  }

  public static async adminList(user: (User & { permissions: UserPermission | null }) | undefined, filters: AdminFilters): Promise<AdminPaginationResponse> {
    // filter validation
    const filterValidation = Validation.validate(SuperAdminSchema.FILTER, filters);

    // set offset for skipping data
    const offset = (filterValidation.page - 1) * 15;

    // dynamic where
    const where: Prisma.UserWhereInput = {
      NOT: { id: user?.id! },
    };

    // if there is a search filter
    if (filterValidation.search) {
      where.OR = [{ name: { contains: filterValidation.search } }, { email: { contains: filterValidation.search } }];
    }

    // if there is a role filter
    if (filterValidation.role) {
      where.role = filterValidation.role;
    }

    // find all admins
    const findAdmin: User[] = await prisma.user.findMany({
      where: where,
      skip: offset,
      take: 15,
      orderBy: { name: "asc" },
    });

    // count all admins
    const countAdmin = await prisma.user.count({ where: where });

    return toAdminPaginationResponse(findAdmin, filterValidation.page, 15, countAdmin, Math.ceil(countAdmin / 15));
  }

  public static async deleteAdmin(params: AdminParams): Promise<AdminResponse> {
    // params validation
    const paramsValidation = Validation.validate<AdminParams>(SuperAdminSchema.DETAIL, params);

    // find admin by id
    const findAdmin: User | null = await prisma.user.findUnique({
      where: {
        id: paramsValidation.adminId,
      },
    });

    // if admin not found then throw error
    if (!findAdmin) throw new ResponseError("Admin not found");

    // delete and update containing depend data
    const deleteNewsletter: Prisma.BatchPayload = await prisma.newsletter.deleteMany({ where: { authorId: findAdmin.id } });
    const deletePortfolios: Prisma.BatchPayload = await prisma.portfolio.deleteMany({ where: { authorId: findAdmin.id } });
    const deleteContacts: Prisma.BatchPayload = await prisma.contact.updateMany({ where: { handlerId: findAdmin.id }, data: { handlerId: null } });

    // delete address
    await prisma.userAddress.delete({ where: { userId: findAdmin.id } });

    // delete permission
    await prisma.userPermission.delete({ where: { userId: findAdmin.id } });


    // delete admin
    const deleteAdmin: User = await prisma.user.delete({ where: { id: findAdmin.id } });

    // return admin
    return toAdminResponse(deleteAdmin);
  }

  public static async updateAdminPermission(params: AdminParams) {
    // params validation
    const paramsValidation = Validation.validate<AdminParams>(SuperAdminSchema.DETAIL, params);

    // find admin by id
    const findAdmin: User | null = await prisma.user.findUnique({
      where: {
        id: paramsValidation.adminId,
      },
    });

    // if admin not found then throw error
  }
}
