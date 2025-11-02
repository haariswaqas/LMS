import CompanionCard from "@/components/CompanionCard";
import CompanionsList from "@/components/CompanionsList";
import CTA from "@/components/CTA";
import { getAllCompanions, getRecentSessions } from "@/lib/actions/companion.actions";
import { getSubjectColor } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Brain, Zap, Clock, Users, TrendingUp } from "lucide-react";

const Page = async () => {
  const { userId } = await auth();

  // Landing page for logged-out users
  if (!userId) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-900">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
          {/* Hero Section */}
          <div className="mb-24 text-center space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50 px-5 py-2 text-sm font-semibold text-blue-700 dark:text-blue-300 backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              Powered by Advanced AI Technology
            </div>
            
            <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl">
              <span className="block">Master Any Subject with</span>
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                MindForge AI
              </span>
            </h1>
            
            <p className="max-w-3xl mx-auto text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Transform your learning experience with intelligent AI tutors that adapt to your pace, 
              answer your questions instantly, and guide you toward mastery—24/7.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Button asChild size="lg" className="text-lg px-10 py-6 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20">
                <Link href="/sign-up">
                  <Brain className="mr-2 h-5 w-5" />
                  Start Learning Free
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-10 py-6 border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50">
                <Link href="/sign-in">Sign In</Link>
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-8 pt-8 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span>10,000+ Active Learners</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span>95% Success Rate</span>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <section className="mb-24">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Why Choose MindForge AI?
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Experience a revolutionary approach to learning with features designed for your success
              </p>
            </div>
            
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="group rounded-2xl border-2 border-blue-100 dark:border-blue-900/50 bg-white dark:bg-slate-900/50 p-8 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-1">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 shadow-lg shadow-blue-500/30">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Smart Adaptation</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  AI tutors that understand your learning style and adjust their teaching approach to maximize your comprehension and retention.
                </p>
              </div>

              <div className="group rounded-2xl border-2 border-blue-100 dark:border-blue-900/50 bg-white dark:bg-slate-900/50 p-8 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-1">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 shadow-lg shadow-blue-500/30">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Instant Answers</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Get immediate, detailed responses to your questions. No more waiting—your AI tutor is always ready to help you breakthrough.
                </p>
              </div>

              <div className="group rounded-2xl border-2 border-blue-100 dark:border-blue-900/50 bg-white dark:bg-slate-900/50 p-8 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-1">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 shadow-lg shadow-blue-500/30">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Learn Anytime</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Available 24/7 across all devices. Learn at your own pace, on your schedule, without compromise or limitations.
                </p>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="mb-24">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Get Started in Three Simple Steps
              </h2>
            </div>
            
            <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 dark:bg-blue-500 text-white text-xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Create Your Tutor</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Choose a subject and customize your AI tutor teaching style
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 dark:bg-blue-500 text-white text-xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Start Conversations</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Ask questions, practice problems, and get instant feedback
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 dark:bg-blue-500 text-white text-xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Track Progress</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Monitor your learning journey and achieve your goals
                </p>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-900 p-12 text-center shadow-2xl shadow-blue-500/20 sm:p-16">
            <h2 className="text-4xl font-bold mb-6 text-white">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of learners who are mastering new skills faster with MindForge AI
            </p>
            <Button asChild size="lg" className="text-lg px-12 py-6 bg-white hover:bg-blue-50 text-blue-600 shadow-xl">
              <Link href="/sign-up">
                Create Your First AI Tutor
                <Sparkles className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </section>
        </div>
      </main>
    );
  }

  // Logged-in user dashboard
  const companions = await getAllCompanions({ limit: 3 });
  const recentSessionsCompanions = await getRecentSessions(10);
  
  console.log("All companions:", companions);
  console.log("Recent sessions companions:", recentSessionsCompanions);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Dashboard Header */}
        <div className="mb-12 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50 px-5 py-2 text-sm font-semibold text-blue-700 dark:text-blue-300">
            <div className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-600 dark:bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400"></span>
            </div>
            Your AI Learning Hub
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
            Welcome Back to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              MindForge
            </span>
          </h1>
          
          <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            Continue your learning journey or create new AI tutors to expand your knowledge
          </p>
        </div>

        {/* Companions Section */}
        {companions.length > 0 ? (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Your AI Tutors</h2>
              <Button asChild variant="outline" className="border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50">
                <Link href="/companions/new">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Create New Tutor
                </Link>
              </Button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {companions.map((companion) => (
                <CompanionCard
                  key={companion.id}
                  {...companion}
                  color={getSubjectColor(companion.subject)}
                />
              ))}
            </div>
          </section>
        ) : (
          <section className="mb-16">
            <div className="rounded-2xl border-2 border-dashed border-blue-300 dark:border-blue-800 bg-white dark:bg-slate-900/50 p-16 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
                <Brain className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Create Your First AI Tutor</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-md mx-auto">
                Start your learning journey by creating a personalized AI tutor for any subject you want to master
              </p>
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                <Link href="/companions/new">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Create AI Tutor
                </Link>
              </Button>
            </div>
          </section>
        )}

        {/* Recent Activity & CTA */}
        <section className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {recentSessionsCompanions.length > 0 ? (
              <div className="rounded-2xl border-2 border-blue-100 dark:border-blue-900/50 bg-white dark:bg-slate-900/50 p-8">
                <CompanionsList
                  title="Recent Learning Sessions"
                  companions={recentSessionsCompanions}
                  classNames="w-full"
                />
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-blue-100 dark:border-blue-900/50 bg-white dark:bg-slate-900/50 p-12 text-center">
                <Clock className="mx-auto h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
                <p className="text-slate-600 dark:text-slate-300 text-lg">
                  Your recent learning sessions will appear here
                </p>
              </div>
            )}
          </div>
          
          <div className="lg:col-span-1">
            <CTA />
          </div>
        </section>
      </div>
    </main>
  );
}

export default Page;