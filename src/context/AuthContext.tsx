import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { ILogonData, IUser } from "../types/Auth.types";
import {
  IAuthAPIIntegrator,
  mockAuthService,
} from "../api/services/Auth.service";
import { setLoggedUser } from "../mockData";

// Easy to replace with any other auth api service, i.e not mock one
const authService: IAuthAPIIntegrator = mockAuthService;

interface IUserContext {
  user?: IUser;
}

interface IAuthContext {
  logon: (logonData: ILogonData) => Promise<void>;
  logout: () => Promise<void>;
}

const INITIAL_USER_CTX: IUserContext = {};
const INITIAL_AUTH_CTX: IAuthContext = {
  logon: async () => {},
  logout: async () => {},
};

const userContext = createContext<IUserContext>(INITIAL_USER_CTX);
const authContext = createContext<IAuthContext>(INITIAL_AUTH_CTX);

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<IUser>();

  const logon = useCallback(
    async (logonData: ILogonData) => {
      const usr = await authService.login(logonData);

      setUser(usr);
      setLoggedUser(usr);
    },
    [setUser]
  );

  const logout = useCallback(async () => {
    setUser(undefined);
    setLoggedUser(undefined);
  }, [setUser]);

  const userValue = useMemo(() => ({ user }), [user]);
  const authValue = useMemo<IAuthContext>(
    () => ({ logon, logout }),
    [logon, logout]
  );

  return (
    <authContext.Provider value={authValue}>
      <userContext.Provider value={userValue}>{children}</userContext.Provider>
    </authContext.Provider>
  );
};

export const useUser = () => useContext(userContext);
export const useAuth = () => useContext(authContext);
