'use client'
import { createContext, useState, ReactNode } from "react";
import { Conversion } from "../../type";

export interface IConversionContext {
  conversion: Conversion | null;
  setConversion: (conversion: Conversion | null) => void;
}

const ConversionContext = createContext<IConversionContext | undefined>(undefined);

interface ProviderProps {
  children: ReactNode;
}

export const ConversionProvider = ({ children }: ProviderProps) => {
  const [conversion, setConversion] = useState<Conversion | null>(null);

  return (
    <ConversionContext.Provider value={{ conversion, setConversion }}>
      {children}
    </ConversionContext.Provider>
  );
};

export default ConversionContext;
