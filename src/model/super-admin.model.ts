import { $Enums, User } from "../generated/prisma";

export type AdminParams = {
  adminId: string;
};

export type AdminFilters = {
  page: number;
  search?: string | undefined;
  role?: $Enums.UserRole | undefined;
};

export type AdminRegisterRequest = {
  name: string;
  password: string;
  email: string;
  dateOfBirth: string;
  phoneNumber: string;
  userRole: $Enums.UserRole;
  address:
    | {
        city: string | null;
        country: string | null;
        zipCode: string | null;
      }
    | undefined;
};

export type AdminResponse = {
  id?: string;
  name: string;
  email?: string;
  role?: $Enums.UserRole;
  phoneNumber?: string;
};

export type AdminPaginationResponse = {
  admins: AdminResponse[];
  pagination: {
    page: number;
    limit: number;
    totalData: number;
    totalPage: number;
  };
};

export type AdminPermissionRequest = {
  canReadNewsletter: boolean;
  canWriteNewsletter: boolean;
  canUpdateNewsletter: boolean;
  canDeleteNewsletter: boolean;

  canReadClient: boolean;
  canWriteClient: boolean;
  canUpdateClient: boolean;
  canDeleteClient: boolean;

  canReadPortfolio: boolean;
  canWritePortfolio: boolean;
  canUpdatePortfolio: boolean;
  canDeletePortfolio: boolean;

  canReadContact: boolean;
  canWriteContact: boolean;
  canUpdateContact: boolean;
  canDeleteContact: boolean;

  canReadAdmin: boolean;
  canWriteAdmin: boolean;
  canUpdateAdmin: boolean;
  canDeleteAdmin: boolean;
};

export function toAdminResponse(admin: User): AdminResponse {
  return {
    name: admin.name,
  };
}

export function toAdminsResponse(admin: User[]): AdminResponse[] {
  return admin.map((item) => {
    return {
      id: item.id,
      name: item.name,
      email: item.email,
      role: item.role,
      phoneNumber: item.phoneNumber,
    };
  });
}

export function toAdminPaginationResponse(admin: User[], page: number, limit: number, totalData: number, totalPage: number): AdminPaginationResponse {
  return {
    admins: toAdminsResponse(admin),
    pagination: {
      page: page,
      limit: limit,
      totalData: totalData,
      totalPage: totalPage,
    },
  };
}
