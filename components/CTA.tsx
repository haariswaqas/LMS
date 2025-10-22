import Image from "next/image";
import Link from "next/link";

const Cta = () => {
    return (
        <section className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-primary/5 via-background to-background p-8 shadow-lg transition-all duration-300 hover:shadow-xl lg:p-10">
            {/* Background decorative elements */}
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/5 blur-3xl transition-all group-hover:bg-primary/10" />
            <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-primary/5 blur-3xl transition-all group-hover:bg-primary/10" />
            
            {/* Badge */}
            <div className="relative z-10 mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-5 py-2 text-sm font-semibold text-primary transition-transform group-hover:scale-105">
                <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                </span>
                Start learning your way.
            </div>
            
            {/* Heading */}
            <h2 className="relative z-10 mb-4 text-center text-3xl font-bold leading-tight tracking-tight text-foreground lg:text-4xl">
                Build and Personalize Learning Companion
            </h2>
            
            {/* Description */}
            <p className="relative z-10 mb-8 text-center text-base leading-relaxed text-muted-foreground dark:text-foreground/80 lg:text-lg">
                Pick a name, subject, voice, & personality — and start learning through voice conversations that feel natural and fun.
            </p>
            
            {/* Image */}
            <div className="relative z-10 mb-8 transition-transform duration-300 group-hover:scale-105">
                <div className="absolute inset-0 rounded-2xl bg-primary/10 blur-2xl" />
                <Image 
                    src="/images/cta.svg" 
                    alt="Build your learning companion" 
                    width={362} 
                    height={232}
                    className="relative z-10" 
                />
            </div>
            
            {/* CTA Button */}
            <Link href="/companions/new" className="relative z-10 w-full">
                <button className="group/btn relative w-full overflow-hidden rounded-xl bg-primary px-8 py-4 font-semibold text-primary-foreground shadow-lg transition-all hover:shadow-xl active:scale-[0.98]">
                    <span className="relative z-10 flex items-center justify-center gap-3 text-base">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 transition-transform group-hover/btn:rotate-90">
                            <Image src="/icons/plus.svg" alt="plus" width={14} height={14}/>
                        </div>
                        Build a New Companion
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity group-hover/btn:opacity-100" />
                </button>
            </Link>
        </section>
    )
}

export default Cta