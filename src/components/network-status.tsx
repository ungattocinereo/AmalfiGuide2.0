"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/language-context";

export function NetworkStatus() {
  const { t } = useLanguage();
  const [online, setOnline] = useState(() => typeof navigator === "undefined" || navigator.onLine);
  const [showRestored, setShowRestored] = useState(false);
  const wasOffline = useRef(false);

  useEffect(() => {
    const handleOffline = () => {
      wasOffline.current = true;
      setShowRestored(false);
      setOnline(false);
    };
    const handleOnline = () => {
      setOnline(true);
      if (wasOffline.current) {
        setShowRestored(true);
        window.setTimeout(() => setShowRestored(false), 3200);
      }
    };
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (online && !showRestored) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed left-1/2 top-[max(5rem,calc(env(safe-area-inset-top)+4rem))] z-[10000] -translate-x-1/2 rounded-full px-4 py-2.5 font-sans text-xs font-semibold shadow-xl backdrop-blur-xl sm:bottom-[max(1rem,env(safe-area-inset-bottom))] sm:top-auto ${
        online
          ? "bg-emerald-700/92 text-white"
          : "border border-orange-400/25 bg-[#1A0A00]/94 text-[#FDF6F0]"
      }`}
    >
      <span className="mr-2" aria-hidden="true">{online ? "●" : "○"}</span>
      {online ? t("network.online") : t("network.offline")}
    </div>
  );
}
