"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import type { GuideFilter } from "@/lib/guide-filter";
import { useLanguage } from "@/components/language-context";

type GuideDiscoveryProps = {
  sections: Array<{ value: string; title: string }>;
  filter: GuideFilter;
  resultCount: number;
  onChange: (filter: GuideFilter) => void;
  onReset: () => void;
};

export function GuideDiscovery({
  sections,
  filter,
  resultCount,
  onChange,
  onReset,
}: GuideDiscoveryProps) {
  const { t } = useLanguage();
  const isActive = Boolean(filter.query?.trim() || filter.section || filter.openNow);

  return (
    <section
      aria-label={t("discovery.label")}
      className="sticky top-[4.25rem] z-40 border-y border-[#1A0A00]/8 bg-[#F8F2EC]/92 px-3 py-3 shadow-[0_12px_30px_-24px_rgba(26,10,0,0.45)] backdrop-blur-xl dark:border-white/8 dark:bg-[#140803]/92 md:top-[4.75rem] md:px-6"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-2.5 md:flex-row md:items-center">
        <label className="group flex min-w-0 flex-1 items-center gap-3 rounded-full border border-[#1A0A00]/12 bg-white/88 px-4 py-2.5 shadow-sm transition-[border-color,box-shadow,background-color] focus-within:border-[#F43600]/55 focus-within:shadow-[0_0_0_3px_rgba(244,54,0,0.10)] dark:border-white/10 dark:bg-white/[0.07] dark:focus-within:border-orange-400/55">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-[#F43600]"
          />
          <span className="sr-only">{t("discovery.searchLabel")}</span>
          <input
            type="search"
            name="guide-search"
            value={filter.query ?? ""}
            onChange={(event) => onChange({ ...filter, query: event.target.value })}
            placeholder={t("discovery.searchPlaceholder")}
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent font-sans text-sm text-[#1A0A00] outline-none placeholder:text-[#1A0A00]/42 dark:text-[#FDF6F0] dark:placeholder:text-[#FDF6F0]/38"
          />
        </label>

        <label className="flex min-w-0 items-center rounded-full border border-[#1A0A00]/12 bg-white/88 px-3 shadow-sm dark:border-white/10 dark:bg-white/[0.07] md:max-w-[260px]">
          <span className="sr-only">{t("discovery.sectionLabel")}</span>
          <select
            name="guide-section"
            value={filter.section ?? ""}
            onChange={(event) => onChange({ ...filter, section: event.target.value || undefined })}
            className="h-11 min-w-0 flex-1 appearance-none bg-transparent px-1 font-sans text-sm font-semibold text-[#3D2415] outline-none dark:text-[#FDF6F0] dark:[color-scheme:dark]"
          >
            <option value="">{t("discovery.allSections")}</option>
            {sections.map((section) => (
              <option key={section.value} value={section.value}>
                {section.title}
              </option>
            ))}
          </select>
          <span aria-hidden="true" className="pl-2 text-xs text-[#F43600]">⌄</span>
        </label>

        <label className="flex h-11 cursor-pointer items-center justify-between gap-3 rounded-full border border-[#1A0A00]/12 bg-white/88 px-4 font-sans text-sm font-semibold text-[#3D2415] shadow-sm dark:border-white/10 dark:bg-white/[0.07] dark:text-[#FDF6F0]">
          <span>{t("discovery.openNow")}</span>
          <input
            type="checkbox"
            name="guide-open-now"
            checked={Boolean(filter.openNow)}
            onChange={(event) => onChange({ ...filter, openNow: event.target.checked || undefined })}
            className="h-4 w-4 accent-[#F43600]"
          />
        </label>

        <div className="flex items-center justify-between gap-3 px-1 md:min-w-[145px] md:justify-end">
          <span aria-live="polite" className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-[#6F584B] dark:text-[#FDF6F0]/58">
            {t("discovery.results").replace("{count}", String(resultCount))}
          </span>
          {isActive && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#F43600] transition-[background-color,transform] hover:bg-[#F43600]/10 active:scale-95"
              aria-label={t("discovery.reset")}
              title={t("discovery.reset")}
            >
              <FontAwesomeIcon icon={faRotateLeft} aria-hidden="true" className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
