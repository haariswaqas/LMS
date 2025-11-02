"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {subjects} from "@/constants";
import {Textarea} from "@/components/ui/textarea";
import {createCompanion} from "@/lib/actions/companion.actions";
import {redirect} from "next/navigation";
import { Brain, BookOpen, MessageSquare, Mic, Clock, Sparkles } from "lucide-react";

const formSchema = z.object({
    name: z.string().min(1, { message: 'AI tutor name is required.'}),
    subject: z.string().min(1, { message: 'Subject is required.'}),
    topic: z.string().min(1, { message: 'Topic is required.'}),
    voice: z.string().min(1, { message: 'Voice is required.'}),
    style: z.string().min(1, { message: 'Teaching style is required.'}),
    duration: z.coerce.number().min(1, { message: 'Session duration is required.'}),
})

const CompanionForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            subject: '',
            topic: '',
            voice: '',
            style: '',
            duration: 15,
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const companion = await createCompanion(values);

        if(companion) {
            redirect(`/companions/${companion.id}`);
        } else {
            console.log('Failed to create an AI tutor');
            redirect('/');
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-900 py-12 px-4">
            <div className="container mx-auto max-w-3xl">
                {/* Header Section */}
                <div className="mb-12 text-center space-y-4">
                    <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50 px-5 py-2 text-sm font-semibold text-blue-700 dark:text-blue-300 backdrop-blur-sm">
                        <Sparkles className="h-4 w-4" />
                        AI Tutor Creation
                    </div>
                    
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                        <span className="block">Forge Your Perfect</span>
                        <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                            AI Tutor
                        </span>
                    </h1>
                    
                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                        Customize every aspect of your learning experience. Create an AI tutor that matches your learning style and goals.
                    </p>
                </div>

                {/* Form Container */}
                <div className="rounded-3xl border-2 border-blue-200 dark:border-blue-900/50 bg-white dark:bg-slate-900/50 p-8 lg:p-12 shadow-2xl shadow-blue-500/10">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            {/* Tutor Name */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                                            <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                            AI Tutor Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., Professor Newton, Math Master, etc."
                                                {...field}
                                                className="h-12 rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20 px-4 text-base font-medium focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                            />
                                        </FormControl>
                                        <FormDescription className="text-sm text-slate-600 dark:text-slate-400">
                                            Give your AI tutor a memorable name
                                        </FormDescription>
                                        <FormMessage className="text-red-600 dark:text-red-400 font-medium" />
                                    </FormItem>
                                )}
                            />

                            {/* Subject */}
                            <FormField
                                control={form.control}
                                name="subject"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                                            <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                            Subject Area
                                        </FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                defaultValue={field.value}
                                            >
                                                <SelectTrigger className="h-12 rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20 px-4 text-base font-medium capitalize focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                                                    <SelectValue placeholder="Select your subject" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900">
                                                    {subjects.map((subject) => (
                                                        <SelectItem
                                                            value={subject}
                                                            key={subject}
                                                            className="capitalize rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 focus:bg-blue-100 dark:focus:bg-blue-950/50 cursor-pointer"
                                                        >
                                                            {subject}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormDescription className="text-sm text-slate-600 dark:text-slate-400">
                                            Choose the primary subject for learning
                                        </FormDescription>
                                        <FormMessage className="text-red-600 dark:text-red-400 font-medium" />
                                    </FormItem>
                                )}
                            />

                            {/* Topic */}
                            <FormField
                                control={form.control}
                                name="topic"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                                            <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                            Specific Topics
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="e.g., Derivatives & Integrals, Quantum Mechanics, Spanish Conjugations..."
                                                {...field}
                                                className="min-h-24 rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20 px-4 py-3 text-base font-medium focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
                                            />
                                        </FormControl>
                                        <FormDescription className="text-sm text-slate-600 dark:text-slate-400">
                                            What specific areas should your tutor focus on?
                                        </FormDescription>
                                        <FormMessage className="text-red-600 dark:text-red-400 font-medium" />
                                    </FormItem>
                                )}
                            />

                            {/* Voice & Style Grid */}
                            <div className="grid gap-8 sm:grid-cols-2">
                                {/* Voice */}
                                <FormField
                                    control={form.control}
                                    name="voice"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                                                <Mic className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                Voice Type
                                            </FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                    defaultValue={field.value}
                                                >
                                                    <SelectTrigger className="h-12 rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20 px-4 text-base font-medium focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                                                        <SelectValue placeholder="Select voice" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900">
                                                        <SelectItem value="male" className="rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 cursor-pointer">
                                                            Male Voice
                                                        </SelectItem>
                                                        <SelectItem value="female" className="rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 cursor-pointer">
                                                            Female Voice
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage className="text-red-600 dark:text-red-400 font-medium" />
                                        </FormItem>
                                    )}
                                />

                                {/* Style */}
                                <FormField
                                    control={form.control}
                                    name="style"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                                                <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                Teaching Style
                                            </FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                    defaultValue={field.value}
                                                >
                                                    <SelectTrigger className="h-12 rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20 px-4 text-base font-medium focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                                                        <SelectValue placeholder="Select style" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900">
                                                        <SelectItem value="formal" className="rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 cursor-pointer">
                                                            Formal & Professional
                                                        </SelectItem>
                                                        <SelectItem value="casual" className="rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 cursor-pointer">
                                                            Casual & Friendly
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage className="text-red-600 dark:text-red-400 font-medium" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Duration */}
                            <FormField
                                control={form.control}
                                name="duration"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                                            <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                            Session Duration (minutes)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="15"
                                                {...field}
                                                className="h-12 rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20 px-4 text-base font-medium focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                            />
                                        </FormControl>
                                        <FormDescription className="text-sm text-slate-600 dark:text-slate-400">
                                            How long do you plan to study? (recommended: 15-45 minutes)
                                        </FormDescription>
                                        <FormMessage className="text-red-600 dark:text-red-400 font-medium" />
                                    </FormItem>
                                )}
                            />

                            {/* Submit Button */}
                            <Button 
                                type="submit" 
                                className="group relative w-full h-14 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white text-lg font-bold shadow-2xl shadow-blue-500/30 transition-all hover:scale-[1.02] hover:shadow-blue-500/40 active:scale-[0.98] cursor-pointer"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    <Brain className="h-6 w-6" />
                                    Create Your AI Tutor
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full transition-transform duration-700 group-hover:translate-x-full" />
                            </Button>
                        </form>
                    </Form>
                </div>

                {/* Info Cards */}
                <div className="mt-12 grid gap-6 sm:grid-cols-3">
                    <div className="rounded-2xl border-2 border-blue-100 dark:border-blue-900/50 bg-white dark:bg-slate-900/50 p-6 text-center shadow-lg">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/50">
                            <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Personalized</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Tailored to your learning style</p>
                    </div>

                    <div className="rounded-2xl border-2 border-blue-100 dark:border-blue-900/50 bg-white dark:bg-slate-900/50 p-6 text-center shadow-lg">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/50">
                            <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">AI-Powered</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Advanced learning technology</p>
                    </div>

                    <div className="rounded-2xl border-2 border-blue-100 dark:border-blue-900/50 bg-white dark:bg-slate-900/50 p-6 text-center shadow-lg">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/50">
                            <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Flexible</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Learn at your own pace</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompanionForm