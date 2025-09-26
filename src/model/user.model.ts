import { $Enums, User, UserAddress, UserPermission } from "../generated/prisma";

export type UserRequest = {
  name?: string;
  email?: string;
  photo?: string;
  dateOfBirth?: string;
  password?: string;
  phoneNumber?: string;
  city?: string | null;
  country?: string | null;
  zipCode?: string | null;
};

export type UserResponse = {
  name?: string;
  password?: string;
  photo?: string;
  email?: string;
  phoneNumber?: string;
  userRole?: $Enums.UserRole;
  permissions?:
    | {
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
      }
    | undefined;
  addresses?:
    | {
        city: string | undefined;
        country: string | undefined;
        zipCode: string | undefined;
      }
    | undefined;
};

export type UserDashboardResponse = {
  portfolios: {
    title: string;
    mainPhoto: string;
    client: string;
    status: $Enums.PortfolioStatus;
  };
  contacts: {
    title: string;
    email: string;
    sender: string;
    handledBy: string | undefined;
    sentAt: string;
  };
};

export type UserDashboardFilters = {
  filter?: "7d" | "30d" | "1y" | undefined;
};

export type UserParams = {
  adminId: string;
};

export function toUserAddressResponse(user: User & { address: UserAddress | null }): UserResponse {
  return {
    addresses: {
      city: user?.address?.city!,
      country: user?.address?.country!,
      zipCode: user?.address?.zipCode!,
    },
  };
}

export function toUserResponse(user: User & { permissions: UserPermission | null; address: UserAddress | null }): UserResponse {
  return {
    name: user.name,
    password: user.password,
    email: user.email,
    photo: user.photo!,
    phoneNumber: user.phoneNumber,
    userRole: user.role,
    permissions: {
      canReadNewsletter: user.permissions?.canReadNewsletter!,
      canWriteNewsletter: user.permissions?.canWriteNewsletter!,
      canUpdateNewsletter: user.permissions?.canUpdateNewsletter!,
      canDeleteNewsletter: user.permissions?.canDeleteNewsletter!,

      canReadClient: user.permissions?.canReadClient!,
      canWriteClient: user.permissions?.canWriteClient!,
      canUpdateClient: user.permissions?.canUpdateClient!,
      canDeleteClient: user.permissions?.canDeleteClient!,

      canReadPortfolio: user.permissions?.canReadPortfolio!,
      canWritePortfolio: user.permissions?.canWritePortfolio!,
      canUpdatePortfolio: user.permissions?.canUpdatePortfolio!,
      canDeletePortfolio: user.permissions?.canDeletePortfolio!,

      canReadContact: user.permissions?.canReadContact!,
      canWriteContact: user.permissions?.canWriteContact!,
      canUpdateContact: user.permissions?.canUpdateContact!,
      canDeleteContact: user.permissions?.canDeleteContact!,

      canReadAdmin: user.permissions?.canReadAdmin!,
      canWriteAdmin: user.permissions?.canWriteAdmin!,
      canUpdateAdmin: user.permissions?.canUpdateAdmin!,
      canDeleteAdmin: user.permissions?.canDeleteAdmin!,
    },
    addresses: {
      city: user.address?.city!,
      country: user.address?.country!,
      zipCode: user.address?.zipCode!,
    },
  };
}
