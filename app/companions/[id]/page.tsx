import { getCompanion, getMessagesForCompanion } from "@/lib/actions/companion.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getSubjectColor } from "@/lib/utils";
import Image from "next/image";
import CompanionComponent from "@/components/CompanionComponent";
import { Clock, MessageCircle, Sparkles } from "lucide-react";

interface CompanionSessionPageProps {
  params: Promise<{ id: string }>;
}

const CompanionSession = async ({ params }: CompanionSessionPageProps) => {
  const { id } = await params;
  const companion = await getCompanion(id);
  const user = await currentUser();

  if (!user) redirect("/sign-in");
  if (!companion?.name) redirect("/companions");

  const { name, subject, title, topic, duration } = companion;

  // Fetch all previous messages for this companion
  const previousMessages = await getMessagesForCompanion(id);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-900 px-4 py-8 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50 px-5 py-2 text-sm font-semibold text-blue-700 dark:text-blue-300 backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            Learning Session
          </div>
        </div>

        {/* Header Card */}
        <article className="group relative mb-8 overflow-hidden rounded-3xl border-2 border-blue-200 dark:border-blue-900/50 bg-white dark:bg-slate-900/50 shadow-2xl shadow-blue-500/10 transition-all duration-300 hover:shadow-blue-500/20">
          {/* Background Gradient Accent */}
          <div
            className="absolute right-0 top-0 h-full w-1/2 opacity-5 blur-3xl transition-opacity duration-500 group-hover:opacity-15"
            style={{ backgroundColor: getSubjectColor(subject) }}
          />
          <div
            className="absolute left-0 bottom-0 h-1/2 w-1/2 opacity-5 blur-3xl transition-opacity duration-500 group-hover:opacity-10"
            style={{ backgroundColor: getSubjectColor(subject) }}
          />

          <div className="relative z-10 p-8 lg:p-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              {/* Left Section - Tutor Info */}
              <div className="flex items-start gap-6">
                {/* Subject Icon */}
                <div
                  className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl shadow-xl transition-all duration-500 group-hover:scale-110 lg:h-24 lg:w-24"
                  style={{ backgroundColor: getSubjectColor(subject) }}
                >
                  <div
                    className="absolute inset-0 rounded-2xl opacity-40 blur-2xl transition-all duration-500 group-hover:opacity-60 group-hover:scale-110"
                    style={{ backgroundColor: getSubjectColor(subject) }}
                  />
                  <Image
                    src={`/icons/${subject}.svg`}
                    alt={subject}
                    width={48}
                    height={48}
                    className="relative z-10 transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Tutor Details */}
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white lg:text-4xl">
                      {name}
                    </h1>
                    <span 
                      className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-lg"
                      style={{ backgroundColor: getSubjectColor(subject) }}
                    >
                      {subject}
                    </span>
                  </div>
                  <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300 max-w-2xl">
                    {topic}
                  </p>
                </div>
              </div>

              {/* Right Section - Duration Card */}
              <div className="self-start lg:self-center">
                <div className="flex items-center gap-4 rounded-2xl border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 px-6 py-4 shadow-lg backdrop-blur-sm transition-all hover:scale-105">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 dark:bg-blue-500 shadow-lg">
                    <Clock className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                      Session
                    </span>
                    <span className="text-2xl font-extrabold text-slate-900 dark:text-white lg:text-3xl">
                      {duration} min
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Message History Badge */}
            {previousMessages && previousMessages.length > 0 && (
              <div className="relative z-10 mt-6 inline-flex items-center gap-3 rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 px-5 py-3 shadow-lg backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 dark:bg-blue-500">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Conversation History
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {previousMessages.length} {previousMessages.length === 1 ? 'message' : 'messages'} available
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Accent Line */}
          <div 
            className="h-1 w-full opacity-30"
            style={{ backgroundColor: getSubjectColor(subject) }}
          />
        </article>

        {/* Companion Component */}
        <CompanionComponent
          {...companion}
          companionId={id}
          userName={user.firstName!}
          userImage={user.imageUrl!}
          previousMessages={previousMessages || []}
        />
      </div>
    </main>
  );
};

export default CompanionSession;