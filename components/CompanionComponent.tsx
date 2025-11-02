'use client';

import { useEffect, useRef, useState } from 'react'
import { cn, configureAssistant, getSubjectColor } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import Image from "next/image";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import soundwaves from '@/constants/soundwaves.json'
import { addToSessionHistory, saveMessage } from "@/lib/actions/companion.actions";
import { Mic, MicOff, Download, X, MessageCircle, Radio, Brain, Zap } from "lucide-react";

enum CallStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED',
}

interface CompanionComponentProps {
    companionId: string;
    subject: string;
    topic: string;
    name: string;
    userName: string;
    userImage: string;
    style: string;
    voice: string;
    previousMessages?: SavedMessage[];
}

const CompanionComponent = ({ 
    companionId, 
    subject, 
    topic, 
    name, 
    userName, 
    userImage, 
    style, 
    voice,
    previousMessages = []
}: CompanionComponentProps) => {
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [messages, setMessages] = useState<SavedMessage[]>([]);
    const [showFullConversation, setShowFullConversation] = useState(false);

    const lottieRef = useRef<LottieRefCurrentProps>(null);

    useEffect(() => {
        if (previousMessages && previousMessages.length > 0) {
            const sortedMessages = [...previousMessages].sort(
                (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
            setMessages(sortedMessages);
        }
    }, [previousMessages]);

    useEffect(() => {
        if (lottieRef) {
            if (isSpeaking) {
                lottieRef.current?.play()
            } else {
                lottieRef.current?.stop()
            }
        }
    }, [isSpeaking, lottieRef])

    useEffect(() => {
        const onCallStart = () => setCallStatus(CallStatus.ACTIVE);

        const onCallEnd = () => {
            setCallStatus(CallStatus.FINISHED);
            addToSessionHistory(companionId)
        }

        const onMessage = async (message: Message) => {
            if (message.type === "transcript" && message.transcriptType === "final") {
                const newMessage = {
                    role: message.role,
                    content: message.transcript,
                    timestamp: new Date(),
                };

                setMessages((prev) => [newMessage, ...prev]);

                try {
                    await saveMessage(companionId, message.role, message.transcript);
                    console.log('✅ Message saved successfully');
                } catch (error) {
                    console.error("Failed to save message:", error);
                }
            }
        };

        const onSpeechStart = () => setIsSpeaking(true);
        const onSpeechEnd = () => setIsSpeaking(false);

        const onError = (error: Error) => console.log('Error', error);

        vapi.on('call-start', onCallStart);
        vapi.on('call-end', onCallEnd);
        vapi.on('message', onMessage);
        vapi.on('error', onError);
        vapi.on('speech-start', onSpeechStart);
        vapi.on('speech-end', onSpeechEnd);

        return () => {
            vapi.off('call-start', onCallStart);
            vapi.off('call-end', onCallEnd);
            vapi.off('message', onMessage);
            vapi.off('error', onError);
            vapi.off('speech-start', onSpeechStart);
            vapi.off('speech-end', onSpeechEnd);
        }
    }, [companionId]);

    const toggleMicrophone = () => {
        const isMuted = vapi.isMuted();
        vapi.setMuted(!isMuted);
        setIsMuted(!isMuted)
    }

    const handleCall = async () => {
        setCallStatus(CallStatus.CONNECTING)

        const assistantOverrides = {
            variableValues: { subject, topic, style },
            clientMessages: ["transcript"],
            serverMessages: [],
        }

        vapi.start(configureAssistant(voice, style), assistantOverrides)
    }

    const handleDisconnect = () => {
        setCallStatus(CallStatus.FINISHED)
        vapi.stop()
    }

    const exportTranscript = () => {
        const transcript = messages
            .reverse()
            .map((msg) => {
                const speaker = msg.role === 'assistant' ? name : userName;
                const timestamp = new Date(msg.timestamp).toLocaleTimeString();
                return `[${timestamp}] ${speaker}: ${msg.content}`;
            })
            .join('\n\n');

        const blob = new Blob([transcript], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mindforge-${name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    const currentSessionMessages = messages.filter(msg => 
        new Date(msg.timestamp).getTime() > Date.now() - 3600000
    );
    const hasCurrentSession = currentSessionMessages.length > 0;

    return (
        <>
            <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-900 p-6 lg:p-8">
                {/* Header Badge */}
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50 px-5 py-2 text-sm font-semibold text-blue-700 dark:text-blue-300">
                    <Brain className="h-4 w-4" />
                    Active Learning Session
                </div>

                {/* Main Content Grid */}
                <section className="mb-8 grid gap-8 lg:grid-cols-2">
                    {/* AI Tutor Avatar Section */}
                    <div className="flex flex-col items-center gap-8 rounded-3xl border-2 border-blue-200 dark:border-blue-900/50 bg-white dark:bg-slate-900/50 p-10 shadow-xl shadow-blue-500/10">
                        <div className="text-center space-y-2">
                            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-900/50 px-4 py-1.5 text-xs font-bold text-blue-700 dark:text-blue-300">
                                <Zap className="h-3 w-3" />
                                AI Tutor
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white lg:text-4xl">{name}</h2>
                            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium uppercase tracking-wider">{subject}</p>
                        </div>

                        <div 
                            className="relative flex h-64 w-64 items-center justify-center rounded-3xl shadow-2xl transition-all duration-500 hover:scale-105 lg:h-72 lg:w-72" 
                            style={{ backgroundColor: getSubjectColor(subject) }}
                        >
                            {/* Enhanced glow effect */}
                            <div 
                                className={cn(
                                    "absolute inset-0 rounded-3xl blur-3xl transition-all duration-500",
                                    callStatus === CallStatus.ACTIVE ? "opacity-70 scale-110" : "opacity-40"
                                )}
                                style={{ backgroundColor: getSubjectColor(subject) }}
                            />

                            {/* Pulsing ring when active */}
                            {callStatus === CallStatus.ACTIVE && (
                                <div className="absolute inset-0 rounded-3xl">
                                    <div className="absolute inset-0 rounded-3xl border-4 border-white/30 animate-ping" />
                                    <div className="absolute inset-0 rounded-3xl border-2 border-white/50" />
                                </div>
                            )}

                            {/* Static Icon */}
                            <div
                                className={cn(
                                    'absolute transition-all duration-1000 z-10',
                                    callStatus === CallStatus.FINISHED || callStatus === CallStatus.INACTIVE ? 'opacity-100 scale-100' : 'opacity-0 scale-90',
                                    callStatus === CallStatus.CONNECTING && 'animate-pulse opacity-100 scale-100'
                                )}
                            >
                                <Image 
                                    src={`/icons/${subject}.svg`} 
                                    alt={subject} 
                                    width={160} 
                                    height={160} 
                                    className="max-sm:w-36" 
                                />
                            </div>

                            {/* Animated Soundwave */}
                            <div className={cn('absolute z-20 transition-all duration-1000', callStatus === CallStatus.ACTIVE ? 'opacity-100 scale-100' : 'opacity-0 scale-90')}>
                                <Lottie
                                    lottieRef={lottieRef}
                                    animationData={soundwaves}
                                    autoplay={false}
                                    className="h-72 w-72 max-sm:h-60 max-sm:w-60"
                                />
                            </div>
                        </div>

                        {/* Status Indicator */}
                        <div className="flex items-center gap-3 rounded-full border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50 px-6 py-3">
                            {callStatus === CallStatus.ACTIVE ? (
                                <>
                                    <span className="relative flex h-3 w-3">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                                        <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
                                    </span>
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">Active Session</span>
                                </>
                            ) : callStatus === CallStatus.CONNECTING ? (
                                <>
                                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-blue-600 dark:border-blue-400 border-t-transparent" />
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">Connecting...</span>
                                </>
                            ) : (
                                <>
                                    <span className="h-3 w-3 rounded-full bg-slate-400 dark:bg-slate-600"></span>
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">Ready to Start</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* User Control Panel */}
                    <div className="flex flex-col gap-6 rounded-3xl border-2 border-blue-200 dark:border-blue-900/50 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-slate-900/50 p-10 shadow-xl shadow-blue-500/10">
                        <div className="flex flex-col items-center gap-6">
                            <div className="text-center space-y-2">
                                <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 dark:bg-indigo-900/50 px-4 py-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                                    <Radio className="h-3 w-3" />
                                    Learner
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 blur-xl opacity-30" />
                                <div className="relative rounded-2xl ring-4 ring-blue-200 dark:ring-blue-800 overflow-hidden">
                                    <Image 
                                        src={userImage} 
                                        alt={userName} 
                                        width={140} 
                                        height={140} 
                                        className="relative" 
                                    />
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white lg:text-3xl">
                                {userName}
                            </h3>
                        </div>

                        {/* Enhanced Controls */}
                        <div className="flex flex-col gap-4 mt-4">
                            {/* Microphone Control */}
                            <button 
                                className={cn(
                                    "group flex items-center justify-center gap-3 rounded-xl border-2 px-6 py-4 font-bold transition-all hover:scale-[1.02] active:scale-[0.98]",
                                    isMuted 
                                        ? "border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-950/50"
                                        : "border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-950/50",
                                    callStatus !== CallStatus.ACTIVE && "opacity-50 cursor-not-allowed"
                                )} 
                                onClick={toggleMicrophone} 
                                disabled={callStatus !== CallStatus.ACTIVE}
                            >
                                {isMuted ? (
                                    <MicOff className="h-5 w-5 transition-transform group-hover:scale-110" />
                                ) : (
                                    <Mic className="h-5 w-5 transition-transform group-hover:scale-110" />
                                )}
                                <span className="max-sm:text-sm">
                                    {isMuted ? 'Microphone Muted' : 'Microphone Active'}
                                </span>
                            </button>

                            {/* Main Call Control */}
                            <button 
                                className={cn(
                                    'group relative overflow-hidden flex items-center justify-center gap-3 rounded-xl px-8 py-5 font-bold text-white shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]',
                                    callStatus === CallStatus.ACTIVE 
                                        ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-red-500/30' 
                                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/30',
                                    callStatus === CallStatus.CONNECTING && 'animate-pulse cursor-wait'
                                )} 
                                onClick={callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall}
                                disabled={callStatus === CallStatus.CONNECTING}
                            >
                                {callStatus === CallStatus.ACTIVE && (
                                    <div className="h-6 w-6 rounded bg-white/90 transition-transform group-hover:scale-110" />
                                )}
                                {callStatus === CallStatus.CONNECTING && (
                                    <div className="h-6 w-6 animate-spin rounded-full border-3 border-white border-t-transparent" />
                                )}
                                {callStatus === CallStatus.INACTIVE && (
                                    <Brain className="h-6 w-6 transition-transform group-hover:scale-110" />
                                )}
                                <span className="text-lg max-sm:text-base">
                                    {callStatus === CallStatus.ACTIVE
                                        ? "End Learning Session"
                                        : callStatus === CallStatus.CONNECTING
                                            ? 'Connecting to AI...'
                                            : 'Start Learning Session'
                                    }
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full transition-transform duration-700 group-hover:translate-x-full" />
                            </button>
                        </div>

                        {/* Session Info */}
                        {messages.length > 0 && (
                            <div className="mt-4 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <MessageCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                            {messages.length} messages exchanged
                                        </span>
                                    </div>
                                    <button
                                        onClick={exportTranscript}
                                        className="flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 px-3 py-1.5 text-xs font-bold text-white transition-all hover:scale-105"
                                    >
                                        <Download className="h-3 w-3" />
                                        Export
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Live Transcript Section */}
                <section className="relative overflow-hidden rounded-3xl border-2 border-blue-200 dark:border-blue-900/50 bg-white dark:bg-slate-900/50 shadow-xl shadow-blue-500/10">
                    <div className="flex items-center justify-between border-b-2 border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 px-8 py-5">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 dark:bg-blue-500 shadow-lg">
                                <MessageCircle className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                    {hasCurrentSession ? 'Live Conversation' : 'Conversation History'}
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {callStatus === CallStatus.ACTIVE ? 'Recording in progress' : `${messages.length} total messages`}
                                </p>
                            </div>
                            {callStatus === CallStatus.ACTIVE && (
                                <div className="ml-auto flex items-center gap-2 rounded-full border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/30 px-4 py-2">
                                    <span className="relative flex h-2.5 w-2.5">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
                                    </span>
                                    <span className="text-sm font-bold text-green-700 dark:text-green-300">LIVE</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="relative h-80 overflow-y-auto p-8 no-scrollbar">
                        {messages.length === 0 ? (
                            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                                <div className="rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 p-6">
                                    <Brain className="h-16 w-16 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xl font-bold text-slate-900 dark:text-white">
                                        {callStatus === CallStatus.ACTIVE ? "Ready to learn..." : "No conversation yet"}
                                    </p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">
                                        {callStatus === CallStatus.ACTIVE 
                                            ? "Start speaking to begin your learning session with your AI tutor"
                                            : "Click 'Start Learning Session' to begin your conversation"
                                        }
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                {messages.slice(0, 5).map((message, index) => (
                                    <div key={index} className="animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className={cn(
                                            "rounded-2xl p-5 text-sm leading-relaxed shadow-md",
                                            message.role === 'assistant' 
                                                ? "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 text-slate-900 dark:text-white border-2 border-blue-200 dark:border-blue-800" 
                                                : "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700"
                                        )}>
                                            <div className="flex items-center gap-2 mb-2">
                                                {message.role === 'assistant' ? (
                                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 dark:bg-blue-500">
                                                        <span className="text-xs font-bold text-white">{name.charAt(0)}</span>
                                                    </div>
                                                ) : (
                                                    <Image src={userImage} alt={userName} width={24} height={24} className="rounded-full" />
                                                )}
                                                <span className="font-bold text-sm">
                                                    {message.role === 'assistant'
                                                        ? name.split(' ')[0].replace('/[.,]/g', '')
                                                        : userName
                                                    }
                                                </span>
                                            </div>
                                            <p>{message.content}</p>
                                        </div>
                                        <p className="mt-2 ml-1 text-xs text-slate-500 dark:text-slate-500">
                                            {new Date(message.timestamp).toLocaleString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: 'numeric',
                                                minute: '2-digit',
                                                hour12: true
                                            })}
                                        </p>
                                    </div>
                                ))}
                                {messages.length > 5 && (
                                    <button
                                        onClick={() => setShowFullConversation(true)}
                                        className="w-full rounded-xl border-2 border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/30 px-6 py-4 text-sm font-bold text-blue-700 dark:text-blue-300 transition-all hover:bg-blue-100 dark:hover:bg-blue-950/50 hover:scale-[1.02]"
                                    >
                                        View Complete History ({messages.length} messages)
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-slate-900/50 to-transparent" />
                </section>
            </section>

            {/* Floating History Button */}
            {messages.length > 0 && (
                <button
                    onClick={() => setShowFullConversation(true)}
                    className="group fixed bottom-8 right-8 z-40 flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-6 py-4 font-bold text-white shadow-2xl shadow-blue-500/30 transition-all hover:scale-105 hover:shadow-blue-500/40 active:scale-95"
                >
                    <MessageCircle className="h-5 w-5 transition-transform group-hover:scale-110" />
                    <span className="hidden sm:inline">Full History</span>
                    <span className="sm:hidden">History</span>
                    <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-bold">
                        {messages.length}
                    </span>
                </button>
            )}

            {/* Enhanced Full Conversation Modal */}
            {showFullConversation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
                    <div className="relative flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border-2 border-blue-300 dark:border-blue-800 bg-white dark:bg-slate-900 shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b-2 border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 px-8 py-6 backdrop-blur-sm">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 dark:bg-blue-500 shadow-lg">
                                    <MessageCircle className="h-7 w-7 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Complete Conversation</h2>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {name} • {messages.length} messages • {new Date().toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowFullConversation(false)}
                                className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 transition-all hover:bg-red-200 dark:hover:bg-red-950/50 hover:scale-110 active:scale-95"
                                aria-label="Close conversation viewer"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Messages Container */}
                        <div className="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-950 dark:to-blue-950/20">
                            <div className="space-y-6 max-w-4xl mx-auto">
                                {[...messages].reverse().map((message, index) => (
                                    <div
                                        key={index}
                                        className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                                    >
                                        {/* Avatar */}
                                        <div className="flex-shrink-0">
                                            {message.role === 'user' ? (
                                                <div className="relative">
                                                    <div className="absolute inset-0 rounded-full bg-indigo-400 dark:bg-indigo-600 blur-md opacity-40" />
                                                    <Image
                                                        src={userImage}
                                                        alt={userName}
                                                        width={48}
                                                        height={48}
                                                        className="relative rounded-full ring-4 ring-indigo-200 dark:ring-indigo-800"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="relative">
                                                    <div className="absolute inset-0 rounded-full bg-blue-400 dark:bg-blue-600 blur-md opacity-40" />
                                                    <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 dark:bg-blue-500 ring-4 ring-blue-200 dark:ring-blue-800">
                                                        <span className="text-lg font-bold text-white">
                                                            {name.charAt(0)}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Message Bubble */}
                                        <div className={`flex max-w-[75%] flex-col gap-2 ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                    {message.role === 'user' ? userName : name.split(' ')[0]}
                                                </span>
                                                <span className="text-xs text-slate-500 dark:text-slate-500">
                                                    {new Date(message.timestamp).toLocaleTimeString('en-US', {
                                                        hour: 'numeric',
                                                        minute: '2-digit',
                                                        hour12: true,
                                                    })}
                                                </span>
                                            </div>
                                            <div className={cn(
                                                    "rounded-2xl px-5 py-4 text-sm leading-relaxed shadow-lg",
                                                    message.role === "assistant"
                                                        ? "bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white"
                                                        : "bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700"
                                                )}
                                            >
                                                {message.content}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-between border-t-2 border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 px-8 py-5">
                            <div className="flex gap-3">
                                <button
                                    onClick={exportTranscript}
                                    className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
                                >
                                    <Download className="h-4 w-4" />
                                    Export Transcript
                                </button>
                            </div>

                            <button
                                onClick={() => setShowFullConversation(false)}
                                className="flex items-center gap-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 px-6 py-3 text-sm font-bold text-slate-900 dark:text-white transition-all hover:scale-105 active:scale-95"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CompanionComponent;