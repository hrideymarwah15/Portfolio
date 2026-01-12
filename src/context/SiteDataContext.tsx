"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { SiteData, getSiteData, saveSiteData, defaultSiteData } from "@/lib/siteData";

interface SiteDataContextType {
  data: SiteData;
  updateData: (newData: Partial<SiteData>) => void;
  resetData: () => void;
  isLoaded: boolean;
}

const SiteDataContext = createContext<SiteDataContextType | undefined>(undefined);

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(defaultSiteData);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedData = getSiteData();
    setData(storedData);
    setIsLoaded(true);
  }, []);

  const updateData = (newData: Partial<SiteData>) => {
    const updated = { ...data, ...newData };
    setData(updated);
    saveSiteData(updated);
  };

  const resetData = () => {
    setData(defaultSiteData);
    saveSiteData(defaultSiteData);
  };

  return (
    <SiteDataContext.Provider value={{ data, updateData, resetData, isLoaded }}>
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  const context = useContext(SiteDataContext);
  if (context === undefined) {
    throw new Error("useSiteData must be used within a SiteDataProvider");
  }
  return context;
}
