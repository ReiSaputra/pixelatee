import express from "express";

import { User, UserPermission } from "../generated/prisma";

export interface UserRequest extends express.Request {
  user?: User & { permissions: UserPermission | null };
}
