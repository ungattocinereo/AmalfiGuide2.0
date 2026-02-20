import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions — Amalfi.Day Guide",
  description: "Terms and conditions for using guide.amalfi.day — disclaimer about information accuracy and transport schedules.",
  alternates: {
    canonical: "https://guide.amalfi.day/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100">
      <div className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-orange-600 dark:text-orange-400 hover:underline mb-8"
        >
          &larr; Back to Guide
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Terms & Conditions</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-10">
          Last updated: February 2026
        </p>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-8 text-[0.95rem] leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. General Information</h2>
            <p>
              This website (<a href="https://guide.amalfi.day" className="text-orange-600 dark:text-orange-400 hover:underline">guide.amalfi.day</a>) is operated by:
            </p>
            <p>
              <strong>CristallPont S.R.L.</strong><br />
              Traversa Dragone 2, 84010 Atrani (SA), Italy<br />
              P.IVA: 06863730650<br />
              Email: <a href="mailto:hello@amalfi.day" className="text-orange-600 dark:text-orange-400 hover:underline">hello@amalfi.day</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Nature of the Service</h2>
            <p>
              This website is a free, informational travel guide for the Amalfi Coast. It provides curated recommendations for restaurants, beaches, hiking trails, viewpoints, and other points of interest. The information is based on personal experience and local knowledge.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Disclaimer</h2>
            <p>
              The information provided on this website is for general informational purposes only. While we make every effort to keep the information accurate and up to date, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, or availability of the information.
            </p>
            <p>In particular:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Transport schedules:</strong> Bus, ferry, and airport shuttle timetables are provided for reference only. Actual schedules may change due to seasonal variations, weather conditions, strikes, or operator decisions. Always verify current schedules directly with the transport providers.</li>
              <li><strong>Restaurant and business information:</strong> Opening hours, prices, menus, and availability may change without notice. We recommend contacting establishments directly before your visit.</li>
              <li><strong>Hiking trails:</strong> Trail conditions, accessibility, and difficulty levels may change due to weather, maintenance, or natural events. Always assess conditions on-site and take appropriate safety precautions.</li>
              <li><strong>Maps and directions:</strong> While we provide Google Maps links for convenience, we are not responsible for the accuracy of directions or map data provided by third parties.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by Italian law, CristallPont S.R.L. shall not be liable for any loss or damage arising from the use of this website or reliance on any information provided herein. This includes, but is not limited to, indirect or consequential loss, loss of data, or loss of profits.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. External Links</h2>
            <p>
              This website contains links to external websites (Google Maps, Booking.com, Airbnb, TripAdvisor, and others). We have no control over the content, privacy policies, or practices of these third-party sites and accept no responsibility for them. The inclusion of any link does not imply endorsement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Intellectual Property</h2>
            <p>
              All content on this website — including text, photographs, graphics, logos, and software — is the property of CristallPont S.R.L. or its content providers and is protected by Italian and international copyright laws. Unauthorized reproduction or distribution is prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Governing Law</h2>
            <p>
              These terms are governed by and construed in accordance with the laws of Italy. Any disputes arising from the use of this website shall be subject to the exclusive jurisdiction of the courts of Salerno, Italy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Changes</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on this page. Continued use of the website after changes constitutes acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Contact</h2>
            <p>
              For questions about these terms, please contact:<br />
              <a href="mailto:hello@amalfi.day" className="text-orange-600 dark:text-orange-400 hover:underline">hello@amalfi.day</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
