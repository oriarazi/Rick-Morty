import { ILogonData, IUser, Roles } from "./types/Auth.types";

export const mockUsers: Array<ILogonData & IUser> = [
  {
    name: "Admin",
    password: "123",
    username: "admin",
    roles: [Roles.Admin],
  },
  {
    name: "Non-Admin",
    password: "123",
    username: "user",
    roles: [],
  },
];

export let loggedUser: IUser | undefined;
export function setLoggedUser(user: IUser | undefined) {
  loggedUser = user;
}
