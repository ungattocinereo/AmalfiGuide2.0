import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Amalfi.Day Guide",
  description: "Privacy Policy for guide.amalfi.day — how we collect, use, and protect your data.",
  alternates: {
    canonical: "https://guide.amalfi.day/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100">
      <div className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-orange-600 dark:text-orange-400 hover:underline mb-8"
        >
          &larr; Back to Guide
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-10">
          Last updated: February 2026
        </p>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-8 text-[0.95rem] leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Data Controller</h2>
            <p>
              The data controller for this website is:<br />
              <strong>CristallPont S.R.L.</strong><br />
              Traversa Dragone 2, 84010 Atrani (SA), Italy<br />
              P.IVA: 06863730650<br />
              Email: <a href="mailto:hello@amalfi.day" className="text-orange-600 dark:text-orange-400 hover:underline">hello@amalfi.day</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Data We Collect</h2>
            <p>This website collects minimal personal data:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Newsletter subscription:</strong> If you voluntarily subscribe to our newsletter, we collect your email address. This data is stored in our Ghost CMS platform and used solely to send you updates about the Amalfi Coast.</li>
              <li><strong>Cookies and analytics:</strong> We use Google Analytics (via Google Tag Manager) to understand how visitors use this site. This may involve cookies that collect anonymized usage data such as pages visited, time spent, device type, and approximate geographic location.</li>
              <li><strong>Language preference:</strong> We store your language selection in your browser&apos;s local storage to remember your preference between visits. This data never leaves your device.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Legal Basis for Processing</h2>
            <p>
              Under the EU General Data Protection Regulation (GDPR) and Italian Legislative Decree 196/2003 (as amended by D.Lgs. 101/2018), we process your data based on:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Consent</strong> (Art. 6(1)(a) GDPR) — for newsletter subscriptions and non-essential cookies.</li>
              <li><strong>Legitimate interest</strong> (Art. 6(1)(f) GDPR) — for essential cookies necessary for the website to function.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Cookies</h2>
            <p>This website uses the following types of cookies:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Essential cookies:</strong> Required for the site to function (e.g., theme preference, PWA service worker). These do not require consent.</li>
              <li><strong>Analytics cookies:</strong> Google Analytics cookies that help us understand site usage. These are only set after you provide consent via our cookie banner.</li>
            </ul>
            <p>
              You can withdraw your cookie consent at any time by clearing your browser cookies or using your browser&apos;s privacy settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Data Sharing</h2>
            <p>
              We do not sell your personal data. We may share data with the following third-party services that act as data processors:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Google LLC</strong> — Google Analytics for website usage statistics.</li>
              <li><strong>Ghost Foundation</strong> — Ghost CMS for newsletter management.</li>
              <li><strong>Vercel Inc.</strong> — Website hosting and content delivery.</li>
            </ul>
            <p>
              These providers may transfer data outside the EU/EEA. Such transfers are governed by appropriate safeguards (Standard Contractual Clauses or adequacy decisions).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Data Retention</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Newsletter emails:</strong> Stored until you unsubscribe.</li>
              <li><strong>Analytics data:</strong> Retained for 14 months (Google Analytics default for GA4).</li>
              <li><strong>Local storage data:</strong> Stored on your device until you clear it.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Your Rights</h2>
            <p>Under GDPR, you have the right to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Access</strong> your personal data (Art. 15)</li>
              <li><strong>Rectify</strong> inaccurate data (Art. 16)</li>
              <li><strong>Erase</strong> your data (&quot;right to be forgotten&quot;, Art. 17)</li>
              <li><strong>Restrict</strong> processing (Art. 18)</li>
              <li><strong>Data portability</strong> (Art. 20)</li>
              <li><strong>Object</strong> to processing (Art. 21)</li>
              <li><strong>Withdraw consent</strong> at any time without affecting the lawfulness of prior processing (Art. 7(3))</li>
            </ul>
            <p>
              To exercise these rights, contact us at{" "}
              <a href="mailto:hello@amalfi.day" className="text-orange-600 dark:text-orange-400 hover:underline">hello@amalfi.day</a>.
            </p>
            <p>
              You also have the right to lodge a complaint with the Italian Data Protection Authority (Garante per la protezione dei dati personali) at{" "}
              <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" className="text-orange-600 dark:text-orange-400 hover:underline">www.garanteprivacy.it</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated &quot;Last updated&quot; date. We encourage you to review this page periodically.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Contact</h2>
            <p>
              For any questions regarding this Privacy Policy or our data practices, contact us at:<br />
              <a href="mailto:hello@amalfi.day" className="text-orange-600 dark:text-orange-400 hover:underline">hello@amalfi.day</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
