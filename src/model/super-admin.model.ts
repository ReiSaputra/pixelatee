import { $Enums, User } from "../generated/prisma";

export type AdminRegisterRequest = {
  name: string;
  password: string;
  email: string;
  dateOfBirth: string;
  phoneNumber: string;
  userRole: $Enums.UserRole;
  address: {
    city: string;
    country: string;
    zipCode: string;
  };
};

export type AdminRegisterResponse = {
  name: string;
};

export function toAdminRegisterResponse(admin: User): AdminRegisterResponse {
  return {
    name: admin.name,
  };
}
