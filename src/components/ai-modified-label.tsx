"use client";

import Image from "next/image";
import { useLanguage } from "@/components/language-context";
import { cn } from "@/lib/utils";

type AiModifiedLabelProps = {
    className?: string;
    size?: "small" | "medium" | "large";
};

const sizeClasses: Record<NonNullable<AiModifiedLabelProps["size"]>, string> = {
    small: "w-20",
    medium: "w-28 md:w-32",
    large: "w-36 md:w-40",
};

/**
 * Official EU "Partially AI-Modified" disclosure icon.
 *
 * The 50%-transparent black variant stays unobtrusive while remaining
 * distinguishable on both light and dark photographs. The localized label is
 * exposed to assistive technology in addition to the text built into the SVG.
 */
export function AiModifiedLabel({ className, size = "medium" }: AiModifiedLabelProps) {
    const { t } = useLanguage();
    const accessibleLabel = t("aiDisclosure.modified");

    return (
        <span
            role="img"
            aria-label={accessibleLabel}
            title={accessibleLabel}
            data-ai-disclosure="modified"
            className={cn("pointer-events-none inline-flex select-none", className)}
        >
            <Image
                src="/ai-labels/ai-modified-black-transparent.svg"
                alt=""
                aria-hidden="true"
                width={1701}
                height={567}
                unoptimized
                className={cn("block h-auto max-w-full", sizeClasses[size])}
            />
        </span>
    );
}
