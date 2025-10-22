'use client';

import { useEffect, useRef, useState } from 'react'
import { cn, configureAssistant, getSubjectColor } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import Image from "next/image";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import soundwaves from '@/constants/soundwaves.json'
import { addToSessionHistory } from "@/lib/actions/companion.actions";

enum CallStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED',
}

const CompanionComponent = ({ companionId, subject, topic, name, userName, userImage, style, voice }: CompanionComponentProps) => {
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [messages, setMessages] = useState<SavedMessage[]>([]);
    const [showFullConversation, setShowFullConversation] = useState(false);

    const lottieRef = useRef<LottieRefCurrentProps>(null);

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

        const onMessage = (message: Message) => {
            if (message.type === 'transcript' && message.transcriptType === 'final') {
                const newMessage = { 
                    role: message.role, 
                    content: message.transcript,
                    timestamp: new Date()
                }
                setMessages((prev) => [newMessage, ...prev])
            }
        }

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
    }, []);

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
        a.download = `${name}-conversation-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    return (
        <>
            <section className="flex flex-col p-6 lg:p-8">
                {/* Main Content Area */}
                <section className="mb-8 flex gap-8 max-lg:flex-col">
                    {/* Companion Avatar Section */}
                    <div className="flex flex-1 flex-col items-center gap-6 rounded-2xl border border-border/50 bg-gradient-to-br from-muted/30 to-background p-8 shadow-lg">
                        <div 
                            className="relative flex h-48 w-48 items-center justify-center rounded-2xl shadow-2xl transition-all duration-500 hover:scale-105 lg:h-56 lg:w-56" 
                            style={{ backgroundColor: getSubjectColor(subject) }}
                        >
                            {/* Glow effect */}
                            <div 
                                className={cn(
                                    "absolute inset-0 rounded-2xl blur-2xl transition-opacity duration-500",
                                    callStatus === CallStatus.ACTIVE ? "opacity-60" : "opacity-30"
                                )}
                                style={{ backgroundColor: getSubjectColor(subject) }}
                            />

                            {/* Static Icon */}
                            <div
                                className={cn(
                                    'absolute transition-opacity duration-1000',
                                    callStatus === CallStatus.FINISHED || callStatus === CallStatus.INACTIVE ? 'opacity-100' : 'opacity-0',
                                    callStatus === CallStatus.CONNECTING && 'animate-pulse opacity-100'
                                )}
                            >
                                <Image 
                                    src={`/icons/${subject}.svg`} 
                                    alt={subject} 
                                    width={150} 
                                    height={150} 
                                    className="max-sm:w-32" 
                                />
                            </div>

                            {/* Animated Soundwave */}
                            <div className={cn('absolute transition-opacity duration-1000', callStatus === CallStatus.ACTIVE ? 'opacity-100' : 'opacity-0')}>
                                <Lottie
                                    lottieRef={lottieRef}
                                    animationData={soundwaves}
                                    autoplay={false}
                                    className="h-56 w-56 max-sm:h-48 max-sm:w-48"
                                />
                            </div>
                        </div>
                        <p className="text-center text-2xl font-bold text-foreground lg:text-3xl">{name}</p>
                    </div>

                    {/* User Control Section */}
                    <div className="flex flex-1 flex-col gap-4 rounded-2xl border border-border/50 bg-gradient-to-br from-primary/5 to-background p-8 shadow-lg">
                        <div className="mb-4 flex flex-col items-center gap-4">
                            <div className="relative">
                                <div className="absolute inset-0 rounded-xl bg-primary/20 blur-lg" />
                                <Image 
                                    src={userImage} 
                                    alt={userName} 
                                    width={120} 
                                    height={120} 
                                    className="relative rounded-xl ring-4 ring-primary/20" 
                                />
                            </div>
                            <p className="text-2xl font-bold text-foreground lg:text-3xl">
                                {userName}
                            </p>
                        </div>

                        {/* Controls */}
                        <div className="flex flex-col gap-3">
                            <button 
                                className="group flex items-center justify-center gap-3 rounded-xl border border-border/50 bg-muted/50 px-6 py-4 font-semibold transition-all hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50" 
                                onClick={toggleMicrophone} 
                                disabled={callStatus !== CallStatus.ACTIVE}
                            >
                                <Image 
                                    src={isMuted ? '/icons/mic-off.svg' : '/icons/mic-on.svg'} 
                                    alt="mic" 
                                    width={24} 
                                    height={24}
                                    className="transition-transform group-hover:scale-110" 
                                />
                                <p className="max-sm:text-sm">
                                    {isMuted ? 'Turn on microphone' : 'Turn off microphone'}
                                </p>
                            </button>

                            <button 
                                className={cn(
                                    'flex items-center justify-center gap-2 rounded-xl px-6 py-4 font-bold text-white shadow-lg transition-all hover:shadow-xl active:scale-95',
                                    callStatus === CallStatus.ACTIVE ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:bg-primary/90',
                                    callStatus === CallStatus.CONNECTING && 'animate-pulse cursor-wait'
                                )} 
                                onClick={callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall}
                                disabled={callStatus === CallStatus.CONNECTING}
                            >
                                {callStatus === CallStatus.ACTIVE && (
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                                    </svg>
                                )}
                                {callStatus === CallStatus.CONNECTING && (
                                    <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                )}
                                <span className="max-sm:text-sm">
                                    {callStatus === CallStatus.ACTIVE
                                        ? "End Session"
                                        : callStatus === CallStatus.CONNECTING
                                            ? 'Connecting...'
                                            : 'Start Session'
                                    }
                                </span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Live Transcript Section */}
                <section className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-muted/20 to-background shadow-lg">
                    <div className="flex items-center justify-between border-b border-border/50 bg-muted/30 px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-foreground">Live Transcript</h3>
                            {callStatus === CallStatus.ACTIVE && (
                                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span className="relative flex h-2 w-2">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                                        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                                    </span>
                                    Recording
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="relative h-64 overflow-y-auto p-6 no-scrollbar">
                        {messages.length === 0 ? (
                            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                                <div className="rounded-full bg-muted p-4">
                                    <svg className="h-8 w-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                    </svg>
                                </div>
                                <p className="text-lg font-medium text-muted-foreground">
                                    {callStatus === CallStatus.ACTIVE ? "Listening..." : "Start a session to begin"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Your conversation will appear here in real-time
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {messages.map((message, index) => (
                                    <div key={index} className="animate-in fade-in slide-in-from-top-2 duration-300">
                                        <p className={cn(
                                            "rounded-lg p-3 text-sm leading-relaxed",
                                            message.role === 'assistant' 
                                                ? "bg-muted text-foreground" 
                                                : "bg-primary/10 text-foreground"
                                        )}>
                                            <span className="font-semibold">
                                                {message.role === 'assistant'
                                                    ? name.split(' ')[0].replace('/[.,]/g', '')
                                                    : userName
                                                }:
                                            </span>{' '}
                                            {message.content}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
                </section>
            </section>

            {/* Floating Full Conversation Button */}
            {messages.length > 0 && (
                <button
                    onClick={() => setShowFullConversation(true)}
                    className="group fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground shadow-2xl transition-all hover:scale-105 hover:shadow-xl active:scale-95"
                >
                    <svg
                        className="h-5 w-5 transition-transform group-hover:scale-110"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                    </svg>
                    <span className="hidden sm:inline">View Full Conversation</span>
                    <span className="sm:hidden">Transcript</span>
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold">
                        {messages.length}
                    </span>
                </button>
            )}

            {/* Full Conversation Modal */}
            {showFullConversation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="relative flex h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border/50 bg-background shadow-2xl">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-border/50 bg-muted/30 px-6 py-4 backdrop-blur-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                    <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-foreground">Full Conversation</h2>
                                    <p className="text-sm text-muted-foreground">{name} • {messages.length} messages</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowFullConversation(false)}
                                className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-muted active:scale-95"
                                aria-label="Close conversation viewer"
                            >
                                <svg className="h-6 w-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="space-y-6">
                                {[...messages].reverse().map((message, index) => (
                                    <div
                                        key={index}
                                        className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                                    >
                                        {/* Avatar */}
                                        <div className="flex-shrink-0">
                                            {message.role === 'user' ? (
                                                <Image
                                                    src={userImage}
                                                    alt={userName}
                                                    width={40}
                                                    height={40}
                                                    className="rounded-full ring-2 ring-primary/20"
                                                />
                                            ) : (
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 ring-2 ring-primary/20">
                                                    <span className="text-sm font-bold text-primary">
                                                        {name.charAt(0)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Message Bubble */}
                                        <div className={`flex max-w-[75%] flex-col gap-1 ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-semibold text-foreground">
                                                    {message.role === 'user' ? userName : name.split(' ')[0]}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(message.timestamp).toLocaleTimeString('en-US', {
                                                        hour: 'numeric',
                                                        minute: '2-digit',
                                                        hour12: true,
                                                    })}
                                                </span>
                                            </div>
                                            <div
                                                className={`rounded-2xl px-4 py-3 shadow-sm ${
                                                    message.role === 'user'
                                                        ? 'rounded-tr-sm bg-primary text-primary-foreground'
                                                        : 'rounded-tl-sm bg-muted'
                                                }`}
                                            >
                                                <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                                                    {message.content}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t border-border/50 bg-muted/30 px-6 py-4">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <p className="text-sm text-muted-foreground">
                                    Save this conversation for future reference
                                </p>
                                <button 
                                    onClick={exportTranscript}
                                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 active:scale-95"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Export Transcript
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default CompanionComponent