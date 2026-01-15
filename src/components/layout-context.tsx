"use client";

import React, { createContext, useContext, useState } from "react";

type LayoutContextType = {
    isAllExpanded: boolean;
    toggleAllExpanded: () => void;
    isSectionExpanded: (title: string) => boolean;
    toggleSection: (title: string) => void;
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
    const [isAllExpanded, setIsAllExpanded] = useState(true);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

    const isSectionExpanded = (title: string): boolean => {
        // If section has explicit override state, use it
        if (title in expandedSections) {
            return expandedSections[title];
        }
        // Otherwise follow global state
        return isAllExpanded;
    };

    const toggleAllExpanded = () => {
        const newGlobalState = !isAllExpanded;
        setIsAllExpanded(newGlobalState);
        // Reset all individual overrides to match new global state
        setExpandedSections({});
    };

    const toggleSection = (sectionTitle: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionTitle]: !isSectionExpanded(sectionTitle)
        }));
    };

    return (
        <LayoutContext.Provider value={{ isAllExpanded, toggleAllExpanded, isSectionExpanded, toggleSection }}>
            {children}
        </LayoutContext.Provider>
    );
}

export const useLayout = () => {
    const context = useContext(LayoutContext);
    if (!context) throw new Error("useLayout must be used within LayoutProvider");
    return context;
};
