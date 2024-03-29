export enum Roles {
  Admin,
}

export interface IUser {
  name: string;
  roles: Roles[];
}

export interface ILogonData {
  username: string;
  password: string;
}
