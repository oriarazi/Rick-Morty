import { mockUsers } from "../../mockData";
import { ILogonData, IUser } from "../../types/Auth.types";

export interface IAuthAPIIntegrator {
  login(logonData: ILogonData): Promise<IUser>;
  logout(): Promise<void>;
}

class MockAuthService implements IAuthAPIIntegrator {
  async login(logonData: ILogonData): Promise<IUser> {
    const user = mockUsers.find(
      (mockUser) =>
        mockUser.username === logonData.username &&
        mockUser.password === logonData.password
    );

    if (!user) throw new Error("Invalid Credentials");

    return { name: user.name, roles: user.roles };
  }

  async logout() {}
}

// Singleton
export const mockAuthService = new MockAuthService();
