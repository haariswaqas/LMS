import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  getUserCompanions,
  getUserSessions,
  getBookmarkedCompanions,
} from "@/lib/actions/companion.actions";
import Image from "next/image";
import CompanionsList from "@/components/CompanionsList";
import {
  CheckCircle2,
  GraduationCap,
  Bookmark,
  Clock,
  Users,
  Sparkles,
  Mail,
} from "lucide-react";

const Profile = async () => {
  const user = await currentUser();

  if (!user) redirect("/sign-in");

  // ✅ Fetch user data
  const [companions, sessionHistory, bookmarkedCompanions] = await Promise.all([
    getUserCompanions(user.id),
    getUserSessions(user.id),
    getBookmarkedCompanions(user.id),
  ]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-900 px-4 py-8 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        {/* Page Header */}
        <div className="mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50 px-5 py-2 text-sm font-semibold text-blue-700 dark:text-blue-300 backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            Learning Dashboard
          </div>
        </div>

        {/* Profile Header Section */}
        <section className="mb-12 rounded-3xl border-2 border-blue-200 dark:border-blue-900/50 bg-white dark:bg-slate-900/50 p-8 shadow-2xl shadow-blue-500/10 lg:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            {/* User Info */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 blur-xl opacity-30" />
                <div className="relative overflow-hidden rounded-2xl ring-4 ring-blue-200 dark:ring-blue-800">
                  <Image
                    src={user.imageUrl}
                    alt={user.firstName!}
                    width={120}
                    height={120}
                    className="relative"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white lg:text-4xl">
                  {user.firstName} {user.lastName}
                </h1>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Mail className="h-4 w-4" />
                  <p className="text-sm font-medium">
                    {user.emailAddresses[0].emailAddress}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="flex flex-wrap gap-4 lg:flex-nowrap">
              {/* Sessions Completed */}
              <div className="group relative overflow-hidden rounded-2xl border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-6 shadow-lg transition-all hover:scale-105 hover:shadow-xl min-w-[160px]">
                <div className="absolute top-0 right-0 h-20 w-20 rounded-full bg-blue-300 dark:bg-blue-700 opacity-10 blur-2xl" />
                <div className="relative z-10 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 dark:bg-blue-500 shadow-lg">
                      <CheckCircle2 className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-4xl font-extrabold text-slate-900 dark:text-white">
                      {sessionHistory.length}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
                    Sessions Completed
                  </p>
                </div>
              </div>

              {/* AI Tutors Created */}
              <div className="group relative overflow-hidden rounded-2xl border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 p-6 shadow-lg transition-all hover:scale-105 hover:shadow-xl min-w-[160px]">
                <div className="absolute top-0 right-0 h-20 w-20 rounded-full bg-indigo-300 dark:bg-indigo-700 opacity-10 blur-2xl" />
                <div className="relative z-10 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 dark:bg-indigo-500 shadow-lg">
                      <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-4xl font-extrabold text-slate-900 dark:text-white">
                      {companions.length}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
                    AI Tutors Created
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Accordion Section */}
        <section className="rounded-3xl border-2 border-blue-200 dark:border-blue-900/50 bg-white dark:bg-slate-900/50 p-6 shadow-2xl shadow-blue-500/10 lg:p-8">
          <Accordion type="multiple" className="space-y-4">
            {/* Bookmarked Companions */}
            <AccordionItem value="bookmarks" className="rounded-2xl border-2 border-blue-100 dark:border-blue-900/50 bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-950/20 dark:to-slate-900/50 px-6 shadow-lg data-[state=open]:shadow-xl transition-all">
              <AccordionTrigger className="py-6 text-xl font-extrabold text-slate-900 dark:text-white hover:no-underline group">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 shadow-lg group-hover:scale-110 transition-transform">
                    <Bookmark className="h-6 w-6 text-white" />
                  </div>
                  <span>Bookmarked Tutors</span>
                  <span className="ml-2 inline-flex items-center justify-center rounded-full bg-blue-600 dark:bg-blue-500 px-3 py-1 text-sm font-bold text-white">
                    {bookmarkedCompanions.length}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-6 pt-2">
                {bookmarkedCompanions.length > 0 ? (
                  <CompanionsList
                    companions={bookmarkedCompanions}
                    title="Bookmarked AI Tutors"
                  />
                ) : (
                  <div className="rounded-xl border-2 border-dashed border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20 p-8 text-center">
                    <Bookmark className="mx-auto h-12 w-12 text-blue-400 dark:text-blue-600 mb-3" />
                    <p className="text-slate-600 dark:text-slate-400 font-medium">
                      No bookmarked tutors yet
                    </p>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Recent Sessions */}
            <AccordionItem value="recent" className="rounded-2xl border-2 border-blue-100 dark:border-blue-900/50 bg-gradient-to-br from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-slate-900/50 px-6 shadow-lg data-[state=open]:shadow-xl transition-all">
              <AccordionTrigger className="py-6 text-xl font-extrabold text-slate-900 dark:text-white hover:no-underline group">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 dark:from-indigo-500 dark:to-blue-500 shadow-lg group-hover:scale-110 transition-transform">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <span>Recent Sessions</span>
                  <span className="ml-2 inline-flex items-center justify-center rounded-full bg-indigo-600 dark:bg-indigo-500 px-3 py-1 text-sm font-bold text-white">
                    {sessionHistory.length}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-6 pt-2">
                {sessionHistory.length > 0 ? (
                  <CompanionsList
                    title="Your Recent Learning Sessions"
                    companions={sessionHistory}
                  />
                ) : (
                  <div className="rounded-xl border-2 border-dashed border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/20 p-8 text-center">
                    <Clock className="mx-auto h-12 w-12 text-indigo-400 dark:text-indigo-600 mb-3" />
                    <p className="text-slate-600 dark:text-slate-400 font-medium">
                      No sessions yet. Start learning today!
                    </p>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* My Companions */}
            <AccordionItem value="companions" className="rounded-2xl border-2 border-blue-100 dark:border-blue-900/50 bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-950/20 dark:to-slate-900/50 px-6 shadow-lg data-[state=open]:shadow-xl transition-all">
              <AccordionTrigger className="py-6 text-xl font-extrabold text-slate-900 dark:text-white hover:no-underline group">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 shadow-lg group-hover:scale-110 transition-transform">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <span>My AI Tutors</span>
                  <span className="ml-2 inline-flex items-center justify-center rounded-full bg-blue-600 dark:bg-blue-500 px-3 py-1 text-sm font-bold text-white">
                    {companions.length}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-6 pt-2">
                {companions.length > 0 ? (
                  <CompanionsList
                    title="Your Created AI Tutors"
                    companions={companions}
                  />
                ) : (
                  <div className="rounded-xl border-2 border-dashed border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20 p-8 text-center">
                    <Users className="mx-auto h-12 w-12 text-blue-400 dark:text-blue-600 mb-3" />
                    <p className="text-slate-600 dark:text-slate-400 font-medium">
                      No AI tutors created yet
                    </p>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </div>
    </main>
  );
};

export default Profile;
