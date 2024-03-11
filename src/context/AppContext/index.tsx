import { Context, createContext, JSX } from "react";

interface AppContextValue {}

export const AppContext: Context<AppContextValue> = createContext({} as AppContextValue);

interface AppProviderProps {
  children: JSX.Element|JSX.Element[]
}

export default function AppProvider({ children }: AppProviderProps) {
  return (
    <AppContext.Provider value={{}}>
      {children}
    </AppContext.Provider>
  )
}
