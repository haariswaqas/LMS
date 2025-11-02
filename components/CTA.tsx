import Image from "next/image";
import Link from "next/link";
import { Sparkles, Brain } from "lucide-react";

const Cta = () => {
    return (
        <section className="group relative flex flex-col items-center overflow-hidden rounded-3xl border-2 border-blue-200 dark:border-blue-900/50 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 dark:from-blue-700 dark:via-indigo-800 dark:to-blue-900 p-8 shadow-2xl shadow-blue-500/20 transition-all duration-300 hover:shadow-3xl hover:shadow-blue-500/30 lg:p-10">
            {/* Animated background elements */}
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-white/10 blur-3xl transition-all duration-500 group-hover:scale-110 group-hover:bg-white/15" />
            <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-indigo-300/10 blur-3xl transition-all duration-500 group-hover:scale-110 group-hover:bg-indigo-300/15" />
            <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-300/10 blur-2xl" />
            
            {/* Badge */}
            <div className="relative z-10 mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 backdrop-blur-sm px-5 py-2.5 text-sm font-bold text-white transition-all duration-300 group-hover:scale-105 group-hover:bg-white/25">
                <Sparkles className="h-4 w-4 animate-pulse" />
                AI-Powered Learning
            </div>
            
            {/* Heading */}
            <h2 className="relative z-10 mb-4 text-center text-3xl font-extrabold leading-tight tracking-tight text-white lg:text-4xl">
                Forge Your Perfect AI Tutor
            </h2>
            
            {/* Description */}
            <p className="relative z-10 mb-8 text-center text-base leading-relaxed text-blue-100 lg:text-lg max-w-md">
                Customize every detail—name, subject, teaching style, and personality. Create a learning experience that is uniquely yours.
            </p>
            
            {/* Image with enhanced styling */}
            <div className="relative z-10 mb-8 transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-1">
                <div className="absolute inset-0 rounded-3xl bg-white/20 blur-2xl" />
                <div className="relative rounded-2xl bg-white/10 backdrop-blur-sm p-4 border border-white/20">
                    <Image 
                        src="/images/cta.svg" 
                        alt="Build your AI tutor with MindForge" 
                        width={362} 
                        height={232}
                        className="relative z-10 rounded-xl" 
                    />
                </div>
            </div>
            
            {/* CTA Button */}
            <Link href="/companions/new" className="relative z-10 w-full">
                <button className="group/btn relative w-full overflow-hidden rounded-xl bg-white hover:bg-blue-50 px-8 py-4 font-bold text-blue-600 shadow-2xl shadow-black/20 transition-all duration-300 hover:shadow-3xl hover:-translate-y-0.5 active:scale-[0.98]">
                    <span className="relative z-10 flex items-center justify-center gap-3 text-base">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white transition-all duration-300 group-hover/btn:rotate-90 group-hover/btn:scale-110">
                            <Brain className="h-4 w-4" />
                        </div>
                        Create Your AI Tutor
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/50 to-transparent -translate-x-full transition-transform duration-500 group-hover/btn:translate-x-full" />
                </button>
            </Link>

            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </section>
    )
}

export default Cta