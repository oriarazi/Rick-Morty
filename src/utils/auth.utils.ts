import { IUser, Roles } from "../types/Auth.types";

export function hasFitRole(user: IUser | null, expectedRole: Roles) {
  return user?.roles.includes(expectedRole) ?? false;
}

export function isAdmin(user: IUser) {
  return hasFitRole(user, Roles.Admin);
}
