interface PrivacyProps {
  onNavigateHome: () => void;
}

export function Privacy({ onNavigateHome }: PrivacyProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 max-w-4xl mx-auto">
      <button 
        onClick={onNavigateHome}
        className="mb-8 text-amber-300 hover:underline flex items-center gap-2"
      >
        &larr; Back to Home
      </button>
      
      <h1 className="text-3xl md:text-4xl font-bold text-amber-300 mb-2">Privacy Policy</h1>
      <p className="text-slate-400 mb-8">Last updated: October 13, 2026</p>

      <div className="space-y-6 leading-relaxed">
        <p>Welcome to <strong>Astrologlimpse</strong> ("we", "our", or "us"). We respect your privacy and are committed to protecting your personal data.</p>

        <h2 className="text-xl font-semibold text-amber-300 mt-6">1. Information We Collect</h2>
        <p>When you use our website, sign in via Google, or request astrological readings, we may collect:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Account Data:</strong> Email address and authentication details provided via Google OAuth.</li>
          <li><strong>Reading Preferences:</strong> Zodiac signs and personal focus prompts you submit for your readings.</li>
          <li><strong>Analytics & Advertising Data:</strong> Cookies, device information, and interaction data via Google Ads and analytics tools.</li>
        </ul>

        <h2 className="text-xl font-semibold text-amber-300 mt-6">2. How We Use Your Information</h2>
        <p>We use the collected information to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Generate and deliver your personalized astrological readings via Supabase.</li>
          <li>Manage user accounts, subscriptions, and authentication states.</li>
          <li>Measure and optimize advertising campaigns and conversion tracking.</li>
        </ul>

        <h2 className="text-xl font-semibold text-amber-300 mt-6">3. Data Security</h2>
        <p>We implement appropriate technical and organizational measures to secure your data using industry-standard protocols, including encryption via Supabase and Vercel.</p>

        <h2 className="text-xl font-semibold text-amber-300 mt-6">4. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at support@astrologlimpse.com.</p>
      </div>
    </div>
  );
}
