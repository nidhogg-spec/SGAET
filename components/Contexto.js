import { createContext, useContext, useState} from 'react';


const AppContext = createContext();

export function AppWrapper({ children }) {

  const [Logged, setLogged] = useState(false);
  
  
  return (
    <AppContext.Provider value={[
        [Logged, setLogged]
    ]}>
      {children}
    </AppContext.Provider>
  );
}


export function useAppContext() {
  return useContext(AppContext);
}