import {getAllCompanions} from "@/lib/actions/companion.actions";
import CompanionCard from "@/components/CompanionCard";
import {getSubjectColorDark, getSubjectColor} from "@/lib/utils";
import Link from "next/link";
import SearchInput from "@/components/SearchInput";
import SubjectFilter from "@/components/SubjectFilter";
import { BookOpen, Sparkles } from "lucide-react";

const CompanionsLibrary = async ({ searchParams }: SearchParams) => {
    const filters = await searchParams;
    const subject = filters.subject ? filters.subject : '';
    const topic = filters.topic ? filters.topic : '';

    const companions = await getAllCompanions({ subject, topic });

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-900">
            <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
                {/* Page Header */}
                <div className="mb-12 space-y-6">
                    <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50 px-5 py-2 text-sm font-semibold text-blue-700 dark:text-blue-300 backdrop-blur-sm">
                        <BookOpen className="h-4 w-4" />
                        Browse AI Tutors
                    </div>
                    
                    <section className="flex justify-between gap-6 max-lg:flex-col">
                        <div className="space-y-3">
                            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
                                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                                    Companion Library
                                </span>
                            </h1>
                            <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-300">
                                Explore and discover AI tutors across all subjects
                            </p>
                        </div>
                        
                        <div className="flex gap-4 max-sm:flex-col sm:items-start">
                            <SearchInput />
                            <SubjectFilter />
                        </div>
                    </section>
                </div>

                {/* Results Section */}
                {companions.length > 0 ? (
                    <section>
                        <div className="mb-6 flex items-center justify-between">
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                Showing <span className="font-bold text-slate-900 dark:text-white">{companions.length}</span> AI tutor{companions.length !== 1 ? 's' : ''}
                                {subject && <span> in <span className="font-bold text-blue-600 dark:text-blue-400">{subject}</span></span>}
                                {topic && <span> for <span className="font-bold text-blue-600 dark:text-blue-400">"{topic}"</span></span>}
                            </p>
                        </div>
                        
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                    <section className="flex min-h-[400px] items-center justify-center">
                        <div className="rounded-2xl border-2 border-dashed border-blue-300 dark:border-blue-800 bg-white dark:bg-slate-900/50 p-12 text-center max-w-md">
                            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
                                <Sparkles className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">
                                No Companions Found
                            </h2>
                            <p className="text-slate-600 dark:text-slate-300 mb-6">
                                {subject || topic 
                                    ? "Try adjusting your filters or search terms"
                                    : "No AI tutors available yet"}
                            </p>
                            {(subject || topic) && (
                                <Link
                                    href="/companions" 
                                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors"
                                >
                                    Clear Filters
                                </Link>
                            )}
                        </div>
                    </section>
                )}
            </div>
        </main>
    )
}

export default CompanionsLibrary