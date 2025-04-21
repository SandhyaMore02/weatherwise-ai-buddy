
import React, { useState, useContext, createContext, ReactNode } from "react";

type CityContextType = {
  city: string;
  setCity: (city: string) => void;
};

const CityContext = createContext<CityContextType | undefined>(undefined);

export const CityProvider = ({ children }: { children: ReactNode }) => {
  // Default city: Delhi
  const [city, setCity] = useState("Delhi");
  return (
    <CityContext.Provider value={{ city, setCity }}>
      {children}
    </CityContext.Provider>
  );
};

export const useCity = (): CityContextType => {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error("useCity must be used within a CityProvider");
  }
  return context;
};
