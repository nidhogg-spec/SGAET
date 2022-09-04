import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState
} from "react";
import { TipoUsuario } from "@/utils/interfaces/db";

interface User {
  Nombre: string;
  Apellido: string;
  Email: string;
  TipoUsuario: TipoUsuario | "";
  Estado: 1 | 0;
  IdUser: string;
}

const AppContext = createContext({
  Logged: false,
  SetLogged: null as unknown as Dispatch<SetStateAction<boolean>>,
  User: {} as User,
  SetUser: null as unknown as Dispatch<SetStateAction<User>>
});

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const [Logged, setLogged] = useState(false);
  const [User, setUser] = useState({} as User);

  return (
    <AppContext.Provider
      value={{
        Logged,
        SetLogged: setLogged,
        User,
        SetUser: setUser
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
