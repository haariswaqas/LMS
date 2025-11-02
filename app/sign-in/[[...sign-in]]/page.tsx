import { SignIn } from '@clerk/nextjs'
import { Brain, Sparkles, Zap, BookOpen } from 'lucide-react'
import Link from 'next/link'

export default function Page() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-900">
            <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center">
                    <div className="w-full max-w-6xl">
                        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                            {/* Left Side - Branding */}
                            <div className="space-y-8 max-lg:text-center">
                                <div className="space-y-4">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50 px-5 py-2 text-sm font-semibold text-blue-700 dark:text-blue-300 backdrop-blur-sm">
                                        <Sparkles className="h-4 w-4" />
                                        Welcome Back
                                    </div>
                                    
                                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
                                        <span className="block">Sign in to</span>
                                        <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                                            MindForge AI
                                        </span>
                                    </h1>
                                    
                                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl max-lg:mx-auto">
                                        Continue your learning journey with personalized AI tutors available 24/7
                                    </p>
                                </div>

                                {/* Features List */}
                                <div className="space-y-4 max-lg:hidden">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 shadow-lg shadow-blue-500/30">
                                            <Brain className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Smart AI Tutors</h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                Adaptive learning companions that understand your pace
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 shadow-lg shadow-blue-500/30">
                                            <Zap className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Instant Feedback</h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                Get immediate answers and explanations anytime
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 shadow-lg shadow-blue-500/30">
                                            <BookOpen className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Track Progress</h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                Monitor your learning journey and achievements
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Sign Up Link */}
                                <div className="pt-6 border-t border-slate-200 dark:border-slate-800 max-lg:hidden">
                                    <p className="text-slate-600 dark:text-slate-400">
                                        Don't have an account?{' '}
                                        <Link 
                                            href="/sign-up" 
                                            className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                        >
                                            Create one now
                                        </Link>
                                    </p>
                                </div>
                            </div>

                            {/* Right Side - Sign In Form */}
                            <div className="flex justify-center lg:justify-end">
                                <div className="w-full max-w-md">
                                    <div className="rounded-3xl border-2 border-blue-200 dark:border-blue-900/50 bg-white dark:bg-slate-900/50 p-8 shadow-2xl shadow-blue-500/10 backdrop-blur-sm">
                                        <SignIn 
                                            appearance={{
                                                elements: {
                                                    rootBox: "w-full",
                                                    card: "bg-transparent shadow-none",
                                                }
                                            }}
                                        />
                                    </div>

                                    {/* Mobile Sign Up Link */}
                                    <div className="mt-6 text-center lg:hidden">
                                        <p className="text-slate-600 dark:text-slate-400">
                                            Don't have an account?{' '}
                                            <Link 
                                                href="/sign-up" 
                                                className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                            >
                                                Create one now
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}