import Link from "next/link";
import Image from "next/image";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import NavItems from "@/components/NavItems";
import { ThemeToggle } from "@/components/ThemeToggle";

const Navbar = () => {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo Section */}
                    <Link href="/" className="group flex items-center gap-3 transition-transform hover:scale-[1.02]">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-primary/20 blur-md transition-all group-hover:bg-primary/30" />
                            <Image
                                src="/images/logo.svg"
                                alt="logo"
                                width={46}
                                height={44}
                                className="relative z-10"
                            />
                        </div>
                        <span className="hidden text-lg font-semibold tracking-tight sm:inline-block">
                            LearnCompanion
                        </span>
                    </Link>

                    {/* Navigation & Actions */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        <NavItems />
                        <div className="h-6 w-px bg-border/60" />
                        <ThemeToggle />
                        <SignedOut>
                            <SignInButton>
                                <button className="group relative overflow-hidden rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-md transition-all hover:shadow-lg active:scale-95">
                                    <span className="relative z-10">Sign In</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 opacity-0 transition-opacity group-hover:opacity-100" />
                                </button>
                            </SignInButton>
                        </SignedOut>
                        <SignedIn>
                            <div className="rounded-full ring-2 ring-primary/20 ring-offset-2 ring-offset-background transition-all hover:ring-primary/40">
                                <UserButton />
                            </div>
                        </SignedIn>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar