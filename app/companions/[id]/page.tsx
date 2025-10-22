import { getCompanion } from "@/lib/actions/companion.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getSubjectColor } from "@/lib/utils";
import Image from "next/image";
import CompanionComponent from "@/components/CompanionComponent";
import ConversationViewer from "@/components/ConversationViewer";

interface CompanionSessionPageProps {
    params: Promise<{ id: string }>;
}

const CompanionSession = async ({ params }: CompanionSessionPageProps) => {
    const { id } = await params;
    const companion = await getCompanion(id);
    const user = await currentUser();

    const { name, subject, title, topic, duration } = companion;

    if (!user) redirect('/sign-in');
    if (!name) redirect('/companions');

    // Note: You'll need to fetch actual messages from your database
    // This is a placeholder - replace with your actual message fetching logic
    const messages = []; // await getConversationMessages(id, user.id);

    return (
        <main className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {/* Header Card */}
            <article className="group relative mb-6 overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-background via-background to-muted/20 p-6 shadow-lg transition-all duration-300 hover:shadow-xl lg:p-8">
                {/* Background decoration */}
                <div 
                    className="absolute right-0 top-0 h-full w-1/3 opacity-5 blur-3xl transition-opacity group-hover:opacity-10"
                    style={{ backgroundColor: getSubjectColor(subject) }}
                />
                
                <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    {/* Left section - Icon & Info */}
                    <div className="flex items-start gap-4 sm:items-center">
                        {/* Subject Icon */}
                        <div 
                            className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105 sm:h-20 sm:w-20" 
                            style={{ backgroundColor: getSubjectColor(subject) }}
                        >
                            <div 
                                className="absolute inset-0 rounded-xl opacity-0 blur-xl transition-opacity group-hover:opacity-50"
                                style={{ backgroundColor: getSubjectColor(subject) }}
                            />
                            <Image 
                                src={`/icons/${subject}.svg`} 
                                alt={subject} 
                                width={40} 
                                height={40}
                                className="relative z-10 transition-transform group-hover:scale-110" 
                            />
                        </div>

                        {/* Text Content */}
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                <h1 className="text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                                    {name}
                                </h1>
                                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary sm:text-sm">
                                    {subject}
                                </span>
                            </div>
                            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                                {topic}
                            </p>
                        </div>
                    </div>

                    {/* Right section - Duration */}
                    <div className="flex items-center gap-3 self-start rounded-xl border border-border/50 bg-muted/30 px-4 py-3 backdrop-blur-sm transition-colors hover:bg-muted/50 md:self-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Image
                                src="/icons/clock.svg"
                                alt="duration"
                                width={20}
                                height={20}
                                className="opacity-70"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Duration
                            </span>
                            <span className="text-xl font-bold text-foreground sm:text-2xl">
                                {duration} min
                            </span>
                        </div>
                    </div>
                </div>
            </article>

            {/* Companion Component */}
            <div className="rounded-2xl border border-border/50 bg-background shadow-lg">
                <CompanionComponent
                    {...companion}
                    companionId={id}
                    userName={user.firstName!}
                    userImage={user.imageUrl!}
                />
            </div>

            {/* Conversation Viewer - Floating Button */}
            <ConversationViewer
                messages={messages}
                companionName={name}
                userName={user.firstName!}
                userImage={user.imageUrl!}
                subject={subject}
            />
        </main>
    )
}

export default CompanionSession