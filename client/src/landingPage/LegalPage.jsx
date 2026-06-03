import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import './LegalPage.css';

export default function LegalPage({ type }) {
  const navigate = useNavigate();
  const isPrivacy = type === 'privacy';

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTo(0, 0);
      document.body.scrollTo(0, 0);
    };

    // Scroll immediately
    scrollToTop();

    // Use requestAnimationFrame and timeouts as fallbacks to override browser scroll restoration
    const rafId = requestAnimationFrame(scrollToTop);
    const timeoutId = setTimeout(scrollToTop, 0);
    const timeoutId2 = setTimeout(scrollToTop, 100);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
      clearTimeout(timeoutId2);
      sessionStorage.setItem('shouldScrollToFooter', 'true');
    };
  }, [type]);

  const handleBack = (e) => {
    e.preventDefault();
    sessionStorage.setItem('shouldScrollToFooter', 'true');
    navigate('/');
  };

  return (
    <div className="legal-container">
      <div className="legal-nav">
        <a href="/" onClick={handleBack} className="back-link">
          <ArrowLeft size={16} /> Back to Home
        </a>
        <span className="legal-brand">SaaS Pro</span>
      </div>

      <div className="legal-content">
        {isPrivacy ? (
          <>
            <h1>Privacy Policy</h1>
            <p className="last-updated">Last Updated: June 4, 2026</p>
            
            <section>
              <h2>1. Information We Collect</h2>
              <p>We collect information you provide directly to us when creating an account, including your email address, name, and profile details. We also collect usage data, project activity logs, and metadata related to your workspace settings.</p>
            </section>

            <section>
              <h2>2. How We Use Your Information</h2>
              <p>We use the collected information to provide, maintain, and improve the SaaS Pro platform, facilitate team collaboration, process authentication, and send important service notifications.</p>
            </section>

            <section>
              <h2>3. Data Security and Storage</h2>
              <p>We implement industry-standard security measures to protect your personal data and project files from unauthorized access, modification, or disclosure. Your data is stored securely in encrypted cloud databases.</p>
            </section>

            <section>
              <h2>4. Cookies and Tracking</h2>
              <p>We use essential cookies and session tokens to keep you logged in and remember your workspace preferences. You can disable cookies in your browser settings, but some features may not function properly.</p>
            </section>

            <section>
              <h2>5. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at support@saaspro.com.</p>
            </section>
          </>
        ) : (
          <>
            <h1>Terms of Service</h1>
            <p className="last-updated">Last Updated: June 4, 2026</p>

            <section>
              <h2>1. Acceptance of Terms</h2>
              <p>By creating an account or using SaaS Pro, you agree to comply with and be bound by these Terms of Service. If you do not agree, you must not access or use the platform.</p>
            </section>

            <section>
              <h2>2. Workspace and Account Security</h2>
              <p>You are responsible for safeguarding your login credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use or breach of security.</p>
            </section>

            <section>
              <h2>3. Acceptable Use Policy</h2>
              <p>You agree not to use SaaS Pro for any unlawful purposes, to distribute malware, or to interfere with the performance and integrity of the hosting infrastructure. We reserve the right to suspend accounts violating these terms.</p>
            </section>

            <section>
              <h2>4. Intellectual Property</h2>
              <p>SaaS Pro and its original content, features, and functionality are owned by SaaS Pro Inc. and are protected by international copyright and trademark laws. Your content remains yours.</p>
            </section>

            <section>
              <h2>5. Limitation of Liability</h2>
              <p>SaaS Pro is provided "as is" without warranty of any kind. In no event shall we be liable for any indirect, incidental, or consequential damages arising out of your use of the platform.</p>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
