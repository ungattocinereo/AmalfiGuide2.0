"use client";

import React from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
    faBed,
    faDownload,
    faEnvelope,
    faHouse,
    faMap,
    faNewspaper,
    faRoute,
    faSignHanging,
    faSquareParking,
    faStar,
    faTicket,
    faUmbrella,
    faWater,
} from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faInstagram, faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { useLanguage } from "@/components/language-context";
import { OPEN_COOKIE_BANNER_EVENT } from "@/components/cookie-banner";

type FooterIcon =
    | "waves"
    | "download"
    | "ticket"
    | "route"
    | "map"
    | "signpost"
    | "bed"
    | "house"
    | "star"
    | "parking"
    | "umbrella"
    | "newspaper"
    | "envelope";

type FooterLink = {
    label: string;
    href: string;
    external?: boolean;
    icon?: FooterIcon;
    nowrapOnMobile?: boolean;
};

const MAIN_SITE = "https://amalfi.day";
const GUIDE_SITE = "https://guide.amalfi.day";

const footerLinks: Record<"transport" | "apartments" | "info" | "blog", FooterLink[]> = {
    transport: [
        { label: "footer.ferryTimetables", href: `${MAIN_SITE}/ferry-timetables`, icon: "waves" },
        { label: "footer.busTimetables", href: "https://cnr.pw/bus", external: true, icon: "download" },
        { label: "footer.bookAirportShuttle", href: "https://shuttlebus.pintourbus.com", external: true, icon: "ticket" },
        { label: "footer.naplesToAmalfi", href: `${MAIN_SITE}/how-to-get`, icon: "route" },
        { label: "footer.allPublicTransport", href: `${MAIN_SITE}/timetables`, icon: "map" },
    ],
    apartments: [
        { label: "footer.gregsGuide", href: GUIDE_SITE, external: true, icon: "signpost", nowrapOnMobile: true },
        { label: "footer.apartmentOverview", href: `${MAIN_SITE}/apartments`, icon: "house" },
        {
            label: "footer.booking",
            href: "https://www.booking.com/hotel/it/cristallpont-amalfi-day.html",
            external: true,
            icon: "bed",
        },
        { label: "footer.airbnb", href: "https://airbnb.com/p/atrani", external: true, icon: "house" },
    ],
    info: [
        { label: "footer.whatToDo", href: `${MAIN_SITE}/experience`, icon: "star" },
        { label: "footer.photoSpots", href: `${MAIN_SITE}/photolocations` },
        { label: "footer.parkingTips", href: `${MAIN_SITE}/parking`, icon: "parking" },
        { label: "footer.beachReviews", href: `${MAIN_SITE}/beaches`, icon: "umbrella" },
        { label: "footer.motoRoads", href: `${MAIN_SITE}/moto`, icon: "map" },
    ],
    blog: [
        { label: "footer.amalfiNews", href: `${MAIN_SITE}/blog`, icon: "newspaper" },
        { label: "footer.contactUs", href: `${MAIN_SITE}/contact`, icon: "envelope" },
    ],
};

const footerIcons: Record<FooterIcon, IconDefinition> = {
    waves: faWater,
    download: faDownload,
    ticket: faTicket,
    route: faRoute,
    map: faMap,
    signpost: faSignHanging,
    bed: faBed,
    house: faHouse,
    star: faStar,
    parking: faSquareParking,
    umbrella: faUmbrella,
    newspaper: faNewspaper,
    envelope: faEnvelope,
};

const socialLinks = [
    {
        label: "Instagram",
        href: "https://instagram.com/amalfi.day",
        icon: faInstagram,
        hoverClass: "hover:bg-[#e1306c] focus-visible:bg-[#e1306c]",
    },
    {
        label: "Facebook",
        href: "https://facebook.com/amalfi.day",
        icon: faFacebook,
        hoverClass: "hover:bg-[#1877f2] focus-visible:bg-[#1877f2]",
    },
    {
        label: "Twitter",
        href: "https://twitter.com/amalfiday",
        icon: faXTwitter,
        hoverClass: "hover:bg-[#1d9bf0] focus-visible:bg-[#1d9bf0]",
    },
];

function LinkIcon({ icon }: { icon: FooterIcon }) {
    return (
        <FontAwesomeIcon
            icon={footerIcons[icon]}
            className="h-[0.85rem] w-[0.85rem] shrink-0 text-[#666666] dark:text-[#b3b7c0] max-[720px]:h-[1.275rem] max-[720px]:w-[1.275rem]"
        />
    );
}

function FooterColumn({ links }: { links: FooterLink[] }) {
    const { t } = useLanguage();

    return (
        <div className="flex flex-col gap-[0.8rem]">
            {links.map((item) => (
                <a
                    key={item.label}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noreferrer" : undefined}
                    className={`flex items-center gap-[0.6rem] border-b border-[rgba(26,26,26,0.12)] pb-[0.4rem] text-[0.95rem] font-medium text-[#1a1a1a] transition-colors duration-200 hover:text-[#ff5900] hover:no-underline dark:border-[rgba(255,255,255,0.08)] dark:text-[#f5f5f5] dark:hover:text-[#ffc300] max-[720px]:text-[1.425rem] ${
                        item.nowrapOnMobile ? "max-[720px]:whitespace-nowrap" : ""
                    }`}
                >
                    {item.icon && <LinkIcon icon={item.icon} />}
                    {t(item.label)}
                </a>
            ))}
        </div>
    );
}

export function Footer() {
    const { t } = useLanguage();

    function handleCookieSettings() {
        window.dispatchEvent(new Event(OPEN_COOKIE_BANNER_EVENT));
    }

    return (
        <footer className="border-t border-[rgba(26,26,26,0.12)] bg-white pt-16 dark:border-[rgba(255,255,255,0.08)] dark:bg-[#0f1115]">
            <div className="mx-auto max-w-[1200px] px-6">
                <div className="grid grid-cols-1 items-start gap-10 min-[641px]:grid-cols-2 min-[1101px]:grid-cols-[1.2fr_repeat(4,1fr)]">
                    <div>
                        <div className="mb-6 inline-flex max-w-full items-center" role="img" aria-label="Amalfi Day logo">
                            <Image
                                className="block h-14 w-auto max-w-[min(240px,70vw)] object-contain dark:hidden max-[720px]:h-[75px] max-[720px]:max-w-[min(360px,96vw)]"
                                src="/brand/logo-color-black.svg"
                                alt=""
                                aria-hidden="true"
                                loading="lazy"
                                width={300}
                                height={88}
                                unoptimized
                            />
                            <Image
                                className="hidden h-14 w-auto max-w-[min(240px,70vw)] object-contain dark:block max-[720px]:h-[75px] max-[720px]:max-w-[min(360px,96vw)]"
                                src="/brand/logo-color-white.svg"
                                alt=""
                                aria-hidden="true"
                                loading="lazy"
                                width={300}
                                height={88}
                                unoptimized
                            />
                        </div>

                        <div className="flex gap-[0.8rem]">
                            {socialLinks.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={item.label}
                                    className={`inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(26,26,26,0.12)] text-[#1a1a1a] transition-[background,border-color,color,transform] duration-200 hover:-translate-y-px hover:border-transparent hover:text-white focus-visible:-translate-y-px focus-visible:border-transparent focus-visible:text-white dark:border-[rgba(255,255,255,0.08)] dark:text-[#f5f5f5] ${item.hoverClass}`}
                                >
                                    <FontAwesomeIcon icon={item.icon} className="h-[18px] w-[18px]" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <FooterColumn links={footerLinks.transport} />
                    <FooterColumn links={footerLinks.apartments} />
                    <FooterColumn links={footerLinks.info} />
                    <FooterColumn links={footerLinks.blog} />
                </div>
            </div>

            <div className="mt-12 border-t border-[rgba(26,26,26,0.12)] py-[1.2rem] text-[0.85rem] text-[#666666] dark:border-[rgba(255,255,255,0.08)] dark:text-[#b3b7c0] max-[720px]:text-[0.82rem]">
                <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-[0.8rem] px-6 min-[1101px]:flex-row min-[1101px]:items-baseline min-[1101px]:justify-between min-[1101px]:gap-6">
                    <p className="m-0 leading-[1.6] text-[#666666] dark:text-[#b3b7c0]">
                        © 2014-{new Date().getFullYear()} CristallPont S.R.L. · P.IVA / C.F.: 05863730650
                        <br />
                        <span className="text-[0.8rem] opacity-70">
                            Sede legale: Traversa Dragone, 2 · Cap. Soc. €10.000
                        </span>
                    </p>
                    <nav
                        className="flex shrink-0 flex-col items-start gap-[0.3rem] min-[721px]:flex-row min-[721px]:items-center min-[721px]:gap-[0.7rem] min-[721px]:flex-wrap"
                        aria-label="Legal links"
                    >
                        <a className="underline underline-offset-[3px] hover:text-[#ff5900]" href={`${MAIN_SITE}/privacy`}>
                            {t("footer.privacyPolicy")}
                        </a>
                        <span className="text-[#666666]/50 dark:text-[#b3b7c0]/50 max-[720px]:hidden" aria-hidden="true">
                            ·
                        </span>
                        <a className="underline underline-offset-[3px] hover:text-[#ff5900]" href={`${MAIN_SITE}/cookie-policy`}>
                            {t("footer.cookiePolicy")}
                        </a>
                        <span className="text-[#666666]/50 dark:text-[#b3b7c0]/50 max-[720px]:hidden" aria-hidden="true">
                            ·
                        </span>
                        <a className="underline underline-offset-[3px] hover:text-[#ff5900]" href={`${MAIN_SITE}/terms`}>
                            {t("footer.terms")}
                        </a>
                        <span className="text-[#666666]/50 dark:text-[#b3b7c0]/50 max-[720px]:hidden" aria-hidden="true">
                            ·
                        </span>
                        <button
                            className="cursor-pointer border-0 bg-transparent p-0 font-inherit text-inherit underline underline-offset-[3px] hover:text-[#ff5900]"
                            type="button"
                            onClick={handleCookieSettings}
                        >
                            {t("footer.cookieSettings")}
                        </button>
                    </nav>
                </div>
            </div>

            <div className="bg-[#f0f2f6] py-3 text-center dark:bg-[#171a20]">
                <div className="mx-auto max-w-[1200px] px-6">
                    <span className="font-mono text-[0.75rem] tracking-[0.02em] text-[#666666] opacity-70 dark:text-[#b3b7c0] max-[720px]:text-[0.72rem]">
                        Design & Development Gregory &apos;
                        <a
                            className="underline underline-offset-[3px] hover:text-[#ff5900]"
                            href="https://cinereo.it"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Cinereo
                        </a>
                        &apos; Day
                    </span>
                </div>
            </div>
        </footer>
    );
}
