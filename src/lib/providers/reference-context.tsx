'use client';

import React, { createContext, useContext } from "react";

interface ReferenceContextType {
  myRef: React.RefObject<HTMLElement>;
}

const ReferenceContext = createContext<ReferenceContextType | undefined>(undefined);

interface RefProviderProps {
  children: React.ReactNode;
  myRef: React.RefObject<HTMLElement>;
}

export function RefProvider({ children, myRef }: RefProviderProps) {
  return (
    <ReferenceContext.Provider value={{ myRef }}>
      {children}
    </ReferenceContext.Provider>
  );
}

export function useReference() {
  const context = useContext(ReferenceContext);
  if (context === undefined) {
    throw new Error("useReference must be used within a RefProvider");
  }
  return context;
}
