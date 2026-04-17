import React from "react";
import Header1 from "../../components/Layout/Header1";
import Footer from "../../components/Layout/Footer";
import "./PrivacyAndPolicy.css";

const Section = ({ number, title, children }) => (
  <section className="pp-section">
    <div className="pp-section-header">
      <span className="pp-section-number">{number}</span>
      <h2 className="pp-section-title">{title}</h2>
    </div>
    <div className="pp-section-body">{children}</div>
  </section>
);

const PrivacyAndPolicy = () => {
  const lastUpdated = "April 17, 2025";

  return (
    <>
      <Header1 />

      <main className="pp-page">
        {/* ── Hero banner ── */}
        <div className="pp-hero">
          <div className="pp-hero-inner">
            <div className="pp-badge">Legal</div>
            <h1 className="pp-hero-title">Privacy Policy</h1>
            <p className="pp-hero-subtitle">
              Your privacy matters to us. This policy explains exactly what
              data WalletWatch collects, why we collect it, and how we
              protect it.
            </p>
            <p className="pp-updated">Last updated: {lastUpdated}</p>
          </div>
        </div>

        {/* ── Quick-nav chips ── */}
        <nav className="pp-nav" aria-label="Section navigation">
          {[
            "Information We Collect",
            "How We Use Your Data",
            "Cookies & Tracking",
            "Data Sharing",
            "Data Security",
            "Your Rights",
            "Data Retention",
            "Third-Party Links",
            "Children's Privacy",
            "Changes to This Policy",
            "Contact Us",
          ].map((label, i) => (
            <a key={i} href={`#section-${i + 1}`} className="pp-nav-chip">
              {label}
            </a>
          ))}
        </nav>

        {/* ── Content ── */}
        <div className="pp-content">
          {/* Intro */}
          <div className="pp-intro-card">
            <p>
              Welcome to <strong>WalletWatch</strong> ("we", "our", or "us").
              We are committed to protecting your personal information and your
              right to privacy. This Privacy Policy applies to all information
              collected through our website{" "}
              <strong>walletwatch.app</strong> and any related services, sales,
              marketing, or events.
            </p>
            <p>
              Please read this policy carefully. If you disagree with its
              terms, please discontinue use of our services immediately.
            </p>
          </div>

          {/* Section 1 */}
          <Section id="section-1" number="01" title="Information We Collect">
            <p>
              We collect information that you provide directly, information
              collected automatically, and information from third-party
              sources.
            </p>

            <h3 className="pp-sub">1.1 Information You Provide</h3>
            <ul className="pp-list">
              <li>
                <strong>Account Data</strong> — full name, email address,
                phone number (optional), and password when you register.
              </li>
              <li>
                <strong>Transaction Data</strong> — amounts, categories,
                dates, references, and descriptions you enter when recording
                expenses or income.
              </li>
              <li>
                <strong>Profile Data</strong> — any updates you make to your
                profile such as display name or contact preferences.
              </li>
              <li>
                <strong>Communications</strong> — messages you send us via
                the Contact Us form or email.
              </li>
            </ul>

            <h3 className="pp-sub">1.2 Automatically Collected Information</h3>
            <ul className="pp-list">
              <li>
                <strong>Device &amp; Browser</strong> — browser type, operating
                system, device identifiers, and screen resolution.
              </li>
              <li>
                <strong>Usage Data</strong> — pages visited, features used,
                time spent, click paths, and referring URLs.
              </li>
              <li>
                <strong>IP Address &amp; Location</strong> — approximate
                geographic location derived from your IP address.
              </li>
              <li>
                <strong>Log Data</strong> — server logs including request
                timestamps, error codes, and response times.
              </li>
            </ul>

            <h3 className="pp-sub">1.3 Third-Party Sources</h3>
            <p>
              If you choose to sign in with <strong>Google OAuth</strong>, we
              receive your name, email address, and profile picture from
              Google, subject to the permissions you grant.
            </p>
          </Section>

          {/* Section 2 */}
          <Section id="section-2" number="02" title="How We Use Your Data">
            <p>We use the information we collect to:</p>
            <ul className="pp-list">
              <li>Create and manage your WalletWatch account.</li>
              <li>
                Provide, operate, and improve our expense-tracking features.
              </li>
              <li>
                Send transactional emails — account verification, password
                reset, and OTP codes.
              </li>
              <li>
                Respond to your inquiries and provide customer support.
              </li>
              <li>
                Detect, prevent, and address fraud, abuse, security issues,
                or technical problems.
              </li>
              <li>
                Comply with legal obligations and enforce our Terms &amp;
                Conditions.
              </li>
              <li>
                Generate anonymised, aggregated analytics to understand usage
                trends (no personally identifiable information is included).
              </li>
            </ul>
            <div className="pp-highlight-box">
              <span className="pp-highlight-icon">ℹ️</span>
              <p>
                We do <strong>not</strong> use your financial transaction data
                for advertising purposes, and we do <strong>not</strong> sell
                your personal information to any third party.
              </p>
            </div>
          </Section>

          {/* Section 3 */}
          <Section id="section-3" number="03" title="Cookies &amp; Tracking">
            <p>
              WalletWatch uses cookies and similar tracking technologies to
              enhance your experience.
            </p>
            <div className="pp-table-wrapper">
              <table className="pp-table">
                <thead>
                  <tr>
                    <th>Cookie Type</th>
                    <th>Purpose</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Essential</td>
                    <td>Session management, authentication tokens</td>
                    <td>Session</td>
                  </tr>
                  <tr>
                    <td>Functional</td>
                    <td>Remember your preferences (language, filters)</td>
                    <td>1 year</td>
                  </tr>
                  <tr>
                    <td>Analytics</td>
                    <td>
                      Understand usage patterns (anonymised, via local
                      analytics)
                    </td>
                    <td>90 days</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              You can control cookies through your browser settings. Disabling
              essential cookies will prevent you from using the application.
            </p>
          </Section>

          {/* Section 4 */}
          <Section id="section-4" number="04" title="Data Sharing">
            <p>
              We do not sell, trade, or rent your personal information. We may
              share your data only in the following limited circumstances:
            </p>
            <ul className="pp-list">
              <li>
                <strong>Service Providers</strong> — trusted third parties
                that help us operate our service (cloud hosting, email
                delivery). They are contractually bound to protect your data
                and may not use it for their own purposes.
              </li>
              <li>
                <strong>Legal Requirements</strong> — when required by
                applicable law, court order, or governmental authority.
              </li>
              <li>
                <strong>Business Transfers</strong> — in the event of a
                merger, acquisition, or sale of assets, your data may be
                transferred. We will notify you before your data is subject
                to a different privacy policy.
              </li>
              <li>
                <strong>With Your Consent</strong> — in any other case where
                you have explicitly agreed to the sharing.
              </li>
            </ul>
          </Section>

          {/* Section 5 */}
          <Section id="section-5" number="05" title="Data Security">
            <p>
              We implement industry-standard security measures to protect your
              personal data:
            </p>
            <div className="pp-security-grid">
              {[
                {
                  icon: "🔐",
                  title: "Password Hashing",
                  desc: "Passwords are hashed with bcrypt before storage. We never store plain-text passwords.",
                },
                {
                  icon: "🔒",
                  title: "HTTPS Encryption",
                  desc: "All data in transit is encrypted via TLS 1.2+ (HTTPS). Unencrypted HTTP is rejected.",
                },
                {
                  icon: "🛡️",
                  title: "JWT Authentication",
                  desc: "Session tokens are signed JSON Web Tokens with expiry. Tokens are not persisted on the server.",
                },
                {
                  icon: "🗂️",
                  title: "Minimal Data Storage",
                  desc: "We only store data that is necessary for the service. Unused data is deleted on schedule.",
                },
              ].map((item, i) => (
                <div key={i} className="pp-security-card">
                  <span className="pp-security-icon">{item.icon}</span>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="pp-disclaimer">
              No method of transmission over the Internet is 100% secure.
              While we strive to protect your data, we cannot guarantee
              absolute security.
            </p>
          </Section>

          {/* Section 6 */}
          <Section id="section-6" number="06" title="Your Rights">
            <p>
              Depending on your location, you may have the following rights
              regarding your personal data:
            </p>
            <ul className="pp-list">
              <li>
                <strong>Access</strong> — Request a copy of the personal data
                we hold about you.
              </li>
              <li>
                <strong>Correction</strong> — Request that we correct
                inaccurate or incomplete information.
              </li>
              <li>
                <strong>Deletion</strong> — Request that we delete your
                account and associated data ("right to be forgotten").
              </li>
              <li>
                <strong>Portability</strong> — Request your transaction data
                in a machine-readable format (e.g., Excel export).
              </li>
              <li>
                <strong>Objection</strong> — Object to our processing of your
                data for analytics purposes.
              </li>
              <li>
                <strong>Withdraw Consent</strong> — Where processing is based
                on consent, you may withdraw it at any time.
              </li>
            </ul>
            <p>
              To exercise any of these rights, please contact us at{" "}
              <a href="mailto:privacy@walletwatch.app" className="pp-link">
                privacy@walletwatch.app
              </a>
              . We will respond within <strong>30 days</strong>.
            </p>
          </Section>

          {/* Section 7 */}
          <Section id="section-7" number="07" title="Data Retention">
            <p>
              We retain your personal data for as long as your account is
              active or as needed to provide services:
            </p>
            <ul className="pp-list">
              <li>
                <strong>Account Data</strong> — retained until you delete your
                account. After deletion, data is purged within 30 days.
              </li>
              <li>
                <strong>Transaction Records</strong> — retained for the
                lifetime of your account. You may delete individual
                transactions at any time from the dashboard.
              </li>
              <li>
                <strong>Log Data</strong> — retained for up to 90 days for
                security and debugging purposes.
              </li>
              <li>
                <strong>Backup Copies</strong> — may persist for up to an
                additional 30 days in encrypted backups after deletion.
              </li>
            </ul>
          </Section>

          {/* Section 8 */}
          <Section id="section-8" number="08" title="Third-Party Links">
            <p>
              Our service may contain links to third-party websites (e.g.,
              "About" or external resources). We are not responsible for the
              privacy practices of those sites. We encourage you to read the
              privacy policy of each website you visit.
            </p>
          </Section>

          {/* Section 9 */}
          <Section id="section-9" number="09" title="Children's Privacy">
            <p>
              WalletWatch is not directed at children under the age of{" "}
              <strong>13</strong>. We do not knowingly collect personal
              information from children under 13. If you believe a child has
              provided us with personal data, please contact us immediately
              and we will take steps to remove that information.
            </p>
          </Section>

          {/* Section 10 */}
          <Section id="section-10" number="10" title="Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. When we do,
              we will:
            </p>
            <ul className="pp-list">
              <li>Update the "Last updated" date at the top of this page.</li>
              <li>
                Notify registered users by email for material changes at least
                14 days before they take effect.
              </li>
              <li>
                Display a notice on the application dashboard after login.
              </li>
            </ul>
            <p>
              Continued use of WalletWatch after the effective date constitutes
              acceptance of the updated policy.
            </p>
          </Section>

          {/* Section 11 */}
          <Section id="section-11" number="11" title="Contact Us">
            <p>
              If you have questions, concerns, or requests regarding this
              Privacy Policy, please reach out:
            </p>
            <div className="pp-contact-grid">
              <div className="pp-contact-card">
                <span className="pp-contact-icon">✉️</span>
                <h4>Email</h4>
                <a href="mailto:privacy@walletwatch.app" className="pp-link">
                  privacy@walletwatch.app
                </a>
              </div>
              <div className="pp-contact-card">
                <span className="pp-contact-icon">🌐</span>
                <h4>Contact Form</h4>
                <a href="/contact-us" className="pp-link">
                  walletwatch.app/contact-us
                </a>
              </div>
              <div className="pp-contact-card">
                <span className="pp-contact-icon">📋</span>
                <h4>Response Time</h4>
                <p>Within 30 business days</p>
              </div>
            </div>
          </Section>

          {/* Bottom notice */}
          <div className="pp-bottom-note">
            <p>
              By using WalletWatch you acknowledge that you have read and
              understood this Privacy Policy.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default PrivacyAndPolicy;
