import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import NavItems from "@/components/NavItems";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Brain } from "lucide-react";

const Navbar = () => {
    return (
        <nav className="sticky top-0 z-50 border-b-2 border-blue-200 dark:border-blue-900/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-slate-900/80 shadow-sm">
            <div className="navbar">
                <Link href="/">
                    <div className="group flex items-center gap-3 cursor-pointer transition-transform hover:scale-105">
                        <div className="relative">
                            {/* Glow effect on logo */}
                            <div className="absolute inset-0 rounded-xl bg-blue-500 blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                            <div className="relative flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 shadow-lg shadow-blue-500/30">
                                <Brain className="h-7 w-7 text-white" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                                MindForge
                            </span>
                            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 -mt-1">
                                AI Learning
                            </span>
                        </div>
                    </div>
                </Link>
                <div className="flex items-center gap-5">
                    <NavItems />
                    <div className="h-8 w-px bg-blue-200 dark:bg-blue-800" />
                    <ThemeToggle />
                    <SignedOut>
                        <SignInButton>
                            <button className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40 active:scale-95">
                                Sign In
                            </button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-blue-500 blur-md opacity-20" />
                            <UserButton 
                                appearance={{
                                    elements: {
                                        avatarBox: "h-10 w-10 ring-2 ring-blue-200 dark:ring-blue-800 hover:ring-blue-400 dark:hover:ring-blue-600 transition-all",
                                        userButtonPopoverCard: "rounded-2xl border-2 border-blue-200 dark:border-blue-800 shadow-xl",
                                        userButtonPopoverActionButton: "hover:bg-blue-50 dark:hover:bg-blue-950/50",
                                    }
                                }}
                            />
                        </div>
                    </SignedIn>
                </div>
            </div>
        </nav>
    )
}

export default Navbar