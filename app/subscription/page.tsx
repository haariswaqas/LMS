import { PricingTable } from "@clerk/nextjs";
import { Sparkles, Zap, Shield } from "lucide-react";

const Subscription = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-900 px-4 py-12 lg:py-20">
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-16 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50 px-5 py-2 text-sm font-semibold text-blue-700 dark:text-blue-300 backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            Flexible Pricing Plans
          </div>
          
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
            <span className="block">Unlock the Full Power of</span>
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              MindForge AI
            </span>
          </h1>
          
          <p className="max-w-3xl mx-auto text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
            Choose the perfect plan for your learning journey. Upgrade anytime to unlock unlimited AI tutors and advanced features.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mb-16 grid gap-6 sm:grid-cols-3 max-w-4xl mx-auto">
          <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-blue-100 dark:border-blue-900/50 bg-white dark:bg-slate-900/50 p-6 text-center shadow-lg">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 shadow-lg shadow-blue-500/30">
              <Zap className="h-7 w-7 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white">Unlimited Access</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Create unlimited AI tutors for any subject</p>
          </div>

          <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-blue-100 dark:border-blue-900/50 bg-white dark:bg-slate-900/50 p-6 text-center shadow-lg">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 shadow-lg shadow-blue-500/30">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white">Premium Features</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Advanced AI models and priority support</p>
          </div>

          <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-blue-100 dark:border-blue-900/50 bg-white dark:bg-slate-900/50 p-6 text-center shadow-lg">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 shadow-lg shadow-blue-500/30">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white">Cancel Anytime</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">No long-term commitment required</p>
          </div>
        </div>

        {/* Pricing Table */}
        <div className="flex justify-center items-center">
          <div className="w-full max-w-6xl rounded-3xl border-2 border-blue-200 dark:border-blue-900/50 bg-white dark:bg-slate-900/50 p-4 shadow-2xl shadow-blue-500/10">
            <PricingTable
              publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
              pricingTableId="prctbl_1234567890abcdef"
              appearance={{
                variables: {
                  colorPrimary: "#2563EB",
                  colorBackground: "transparent",
                  colorText: "#0F172A",
                  colorTextOnPrimaryBackground: "#FFFFFF",
                  fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  fontSize: "1rem",
                  borderRadius: "1rem",
                  spacingUnit: "1rem",
                },
                elements: {
                  rootBox: {
                    backgroundColor: "transparent",
                    border: "none",
                  },
                  card: {
                    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.1)",
                    borderRadius: "1.5rem",
                    border: "2px solid rgb(191, 219, 254)",
                    backgroundColor: "#ffffff",
                    transition: "all 0.3s ease",
                    padding: "2rem",
                  },
                  cardHover: {
                    transform: "scale(1.02)",
                    boxShadow: "0 8px 24px rgba(37, 99, 235, 0.2)",
                    borderColor: "rgb(147, 197, 253)",
                  },
                  cardSelected: {
                    borderColor: "#2563EB",
                    boxShadow: "0 8px 24px rgba(37, 99, 235, 0.3)",
                  },
                  headerTitle: {
                    fontSize: "2rem",
                    fontWeight: "800",
                    color: "#0F172A",
                    marginBottom: "0.5rem",
                  },
                  headerSubtitle: {
                    fontSize: "1rem",
                    color: "#64748B",
                    fontWeight: "500",
                  },
                  priceText: {
                    fontSize: "3rem",
                    fontWeight: "900",
                    background: "linear-gradient(to right, #2563EB, #4F46E5)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  },
                  priceContainer: {
                    marginTop: "1.5rem",
                    marginBottom: "1.5rem",
                  },
                  featureList: {
                    gap: "0.75rem",
                    marginTop: "2rem",
                  },
                  featureListItem: {
                    fontSize: "0.95rem",
                    color: "#475569",
                    paddingLeft: "0.5rem",
                  },
                  button: {
                    backgroundColor: "#2563EB",
                    color: "#FFFFFF",
                    fontWeight: "700",
                    fontSize: "1rem",
                    padding: "1rem 2rem",
                    borderRadius: "0.75rem",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                    transition: "all 0.3s ease",
                    marginTop: "1.5rem",
                  },
                  buttonHover: {
                    backgroundColor: "#1D4ED8",
                    transform: "scale(1.05)",
                    boxShadow: "0 8px 16px rgba(37, 99, 235, 0.4)",
                  },
                  buttonPressed: {
                    transform: "scale(0.98)",
                  },
                  badge: {
                    backgroundColor: "#DBEAFE",
                    color: "#1E40AF",
                    fontWeight: "700",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "9999px",
                    fontSize: "0.75rem",
                  },
                },
                layout: {
                  animations: true,
                  termsPageUrl: "/terms",
                  privacyPageUrl: "/privacy",
                },
              }}
            />
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            Trusted by over 10,000 learners worldwide
          </p>
          <div className="flex items-center justify-center gap-6 text-slate-400 dark:text-slate-600">
            <Shield className="h-5 w-5" />
            <span className="text-sm">Secure Payment</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-sm">Money-back Guarantee</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-sm">24/7 Support</span>
          </div>
        </div>

        {/* FAQ or CTA Section */}
        <div className="mt-20 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-900 p-12 text-center shadow-2xl shadow-blue-500/20">
          <h2 className="text-3xl font-bold mb-4 text-white">
            Have Questions?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Our team is here to help you choose the perfect plan for your learning goals.
          </p>
          <button className="rounded-xl bg-white hover:bg-blue-50 px-8 py-4 text-lg font-bold text-blue-600 shadow-xl transition-all hover:scale-105 active:scale-95">
            Contact Support
          </button>
        </div>
      </div>
    </main>
  );
};

export default Subscription;