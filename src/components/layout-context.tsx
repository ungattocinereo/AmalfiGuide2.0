"use client";

import React, { createContext, useContext, useState } from "react";

type LayoutContextType = {
    isAllExpanded: boolean;
    toggleAllExpanded: () => void;
    expandedSections: Record<string, boolean>; // For individual sections if needed
    toggleSection: (sectionValues: string) => void;
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
    const [isAllExpanded, setIsAllExpanded] = useState(true); // Default to expanded?
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

    const toggleAllExpanded = () => {
        setIsAllExpanded((prev) => !prev);
        // Also reset individual sections to match the new global state? 
        // Or just treat global as "show/hide all content"
        // "If user tap Collapse all then only #H1 Texts from content are visible"
        if (isAllExpanded) {
            // We are collapsing
            setExpandedSections({});
        }
    };

    const toggleSection = (sectionTitle: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionTitle]: !prev[sectionTitle]
        }))
    }

    return (
        <LayoutContext.Provider value={{ isAllExpanded, toggleAllExpanded, expandedSections, toggleSection }}>
            {children}
        </LayoutContext.Provider>
    );
}

export const useLayout = () => {
    const context = useContext(LayoutContext);
    if (!context) throw new Error("useLayout must be used within LayoutProvider");
    return context;
};
