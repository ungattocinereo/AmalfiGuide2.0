"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

const CONSENT_KEY = "cookie-consent";

export function ConsentAnalytics() {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const syncConsent = () => setAccepted(localStorage.getItem(CONSENT_KEY) === "accepted");
    syncConsent();
    window.addEventListener("storage", syncConsent);
    return () => window.removeEventListener("storage", syncConsent);
  }, []);

  if (!accepted) return null;

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-RTY4017R05"
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            analytics_storage: 'granted',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied'
          });
          gtag('js', new Date());
          gtag('config', 'G-RTY4017R05');
        `}
      </Script>
    </>
  );
}
