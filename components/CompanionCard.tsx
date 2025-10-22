"use client";
import { removeBookmark } from "@/lib/actions/companion.actions";
import { addBookmark } from "@/lib/actions/companion.actions";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface CompanionCardProps {
  id: string;
  name: string;
  topic: string;
  subject: string;
  duration: number;
  color: string;
  bookmarked: boolean;
}

const CompanionCard = ({
  id,
  name,
  topic,
  subject,
  duration,
  color,
  bookmarked,
}: CompanionCardProps) => {
  const pathname = usePathname();
  const handleBookmark = async () => {
    if (bookmarked) {
      await removeBookmark(id, pathname);
    } else {
      await addBookmark(id, pathname);
    }
  };
  
  return (
    <article 
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl" 
      style={{ 
        backgroundColor: color,
        backgroundImage: `linear-gradient(135deg, ${color}f0 0%, ${color}cc 100%)`
      }}
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      {/* Glow effect */}
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />
      
      {/* Header with subject badge and bookmark */}
      <div className="relative z-10 mb-4 flex items-start justify-between">
        <span className="inline-flex items-center rounded-full bg-black/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-lg backdrop-blur-sm">
          {subject}
        </span>
        <button 
          className="group/bookmark flex h-9 w-9 items-center justify-center rounded-full bg-black/20 backdrop-blur-sm transition-all hover:scale-110 hover:bg-black/30 active:scale-95" 
          onClick={handleBookmark}
          aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
        >
          <Image
            src={bookmarked ? "/icons/bookmark-filled.svg" : "/icons/bookmark.svg"}
            alt="bookmark"
            width={14}
            height={16}
            className="transition-transform group-hover/bookmark:scale-110"
          />
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 mb-4 flex-1">
        <h2 className="mb-2 text-2xl font-bold leading-tight text-white drop-shadow-md">
          {name}
        </h2>
        <p className="text-sm leading-relaxed text-white/90 line-clamp-2 drop-shadow-sm">
          {topic}
        </p>
      </div>
      
      {/* Duration indicator */}
      <div className="relative z-10 mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/15 backdrop-blur-sm">
          <Image
            src="/icons/clock.svg"
            alt="duration"
            width={14}
            height={14}
            className="opacity-90"
          />
        </div>
        <p className="text-sm font-medium text-white drop-shadow-sm">
          {duration} minutes
        </p>
      </div>

      {/* CTA Button */}
      <Link href={`/companions/${id}`} className="relative z-10 w-full">
        <button className="group/btn relative w-full overflow-hidden rounded-xl bg-white/90 px-6 py-3 text-center font-semibold shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:shadow-xl active:scale-[0.98]" style={{ color }}>
          <span className="relative z-10 flex items-center justify-center gap-2">
            Launch Lesson
            <svg 
              className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-opacity group-hover/btn:opacity-100" />
        </button>
      </Link>
    </article>
  );
};

export default CompanionCard;