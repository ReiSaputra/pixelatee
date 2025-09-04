import { User } from "../generated/prisma";

export type AuthRegisterRequest = {
  email: string;
  password: string;
};

export type AuthLoginRequest = {
  email: string;
  password: string;
};

export type AuthResponse = {
  email: string;
  token?: string;
};

/**
 * Converts a User to an AuthResponse, with an optional token.
 * @param user User to convert
 * @param token Optional token to include in the response
 * @returns AuthResponse object
 */
export function toAuthResponse(user: User, token?: string): AuthResponse {
  return { email: user.email, token: token! };
}
