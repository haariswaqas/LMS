'use server';

import {auth} from "@clerk/nextjs/server";
import { createSupabaseServerClient } from "../supabase";
import { revalidatePath } from "next/cache";

export const createCompanion = async (formData: CreateCompanion) => {
    const { userId: author } = await auth();
    
    // ✅ Require authentication
    if (!author) throw new Error('You must be logged in to create a companion');
    
    const supabase = createSupabaseServerClient();

    const { data, error } = await supabase
        .from('companions')
        .insert({...formData, author })
        .select();

    if(error || !data) throw new Error(error?.message || 'Failed to create a companion');

    return data[0];
}

export const getAllCompanions = async ({ limit = 10, page = 1, subject, topic }: GetAllCompanions) => {
    const { userId } = await auth();
    
    // ✅ Require authentication
    if (!userId) throw new Error('You must be logged in to view companions');
    
    const supabase = createSupabaseServerClient();

    // ✅ Filter by current user's companions only
    let query = supabase
        .from('companions')
        .select()
        .eq('author', userId); // Only get user's own companions

    if(subject && topic) {
        query = query.ilike('subject', `%${subject}%`)
            .or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`)
    } else if(subject) {
        query = query.ilike('subject', `%${subject}%`)
    } else if(topic) {
        query = query.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`)
    }

    query = query.range((page - 1) * limit, page * limit - 1);

    const { data: companions, error } = await query;

    if(error) throw new Error(error.message);

    return companions;
}

export const getCompanion = async (id: string) => {
    const { userId } = await auth();
    
    // ✅ Require authentication
    if (!userId) throw new Error('You must be logged in to view companions');
    
    const supabase = createSupabaseServerClient();

    const { data, error } = await supabase
        .from('companions')
        .select()
        .eq('id', id)
        .eq('author', userId); // ✅ Only get if user is the author

    if(error) return console.log(error);

    // ✅ Return null if not found (user doesn't own this companion)
    return data?.[0] || null;
}

export const addToSessionHistory = async (companionId: string) => {
    const { userId } = await auth();
    
    // ✅ Require authentication
    if (!userId) throw new Error('You must be logged in');
    
    const supabase = createSupabaseServerClient();
    
    // ✅ Verify user owns the companion before adding to history
    const companion = await getCompanion(companionId);
    if (!companion) throw new Error('Companion not found or access denied');
    
    const { data, error } = await supabase.from('session_history')
        .insert({
            companion_id: companionId,
            user_id: userId,
        })

    if(error) throw new Error(error.message);

    return data;
}

export const getRecentSessions = async (limit = 10) => {
  const { userId } = await auth();
  
  // ✅ Require authentication
  if (!userId) throw new Error('You must be logged in');
  
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from('session_history')
    .select(`companions:companion_id (*)`)
    .eq('user_id', userId) // ✅ Only get current user's sessions
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  // Map out companions and filter duplicates by ID
  const companions = data
    .map(({ companions }) => companions)
    .filter(Boolean);

  // Deduplicate by companion ID
  const uniqueCompanions = Array.from(
    new Map(companions.map((c) => [c.id, c])).values()
  );

  return uniqueCompanions;
};

export const getUserSessions = async (userId: string, limit = 10) => {
    const { userId: currentUserId } = await auth();
    
    // ✅ Require authentication and ensure user can only access their own sessions
    if (!currentUserId) throw new Error('You must be logged in');
    if (currentUserId !== userId) throw new Error('You can only access your own sessions');
    
    const supabase = createSupabaseServerClient();
    
    const { data, error } = await supabase
        .from('session_history')
        .select(`companions:companion_id (*)`)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

    if(error) throw new Error(error.message);

    // ✅ FIX: Map out companions and filter duplicates by ID (same as getRecentSessions)
    const companions = data
        .map(({ companions }) => companions)
        .filter(Boolean);

    // Deduplicate by companion ID
    const uniqueCompanions = Array.from(
        new Map(companions.map((c) => [c.id, c])).values()
    );

    return uniqueCompanions;
}

export const getUserCompanions = async (userId: string) => {
    const { userId: currentUserId } = await auth();
    
    // ✅ Require authentication and ensure user can only access their own companions
    if (!currentUserId) throw new Error('You must be logged in');
    if (currentUserId !== userId) throw new Error('You can only access your own companions');
    
    const supabase = createSupabaseServerClient();
    
    const { data, error } = await supabase
        .from('companions')
        .select()
        .eq('author', userId)

    if(error) throw new Error(error.message);

    return data;
}

export const newCompanionPermissions = async () => {
  const { userId, has } = await auth();
  
  // ✅ Require authentication
  if (!userId) return false;
  
  const supabase = createSupabaseServerClient();

  // First, check if the user has a paid subscription or pro plan
  if (has({ plan: "pro" }) || has({ plan: "premium" })) {
    return true; // unlimited companions
  }

  // Otherwise, determine allowed companion limit via feature flags
  let limit = 3; // default free tier limit
  if (has({ feature: "10_companion_limit" })) limit = 10;

  // Count current companions
  const { data, error } = await supabase
    .from("companions")
    .select("id", { count: "exact" })
    .eq("author", userId);

  if (error) throw new Error(error.message);

  const companionCount = data?.length || 0;

  return companionCount < limit;
};

// Bookmarks
export const addBookmark = async (companionId: string, path: string) => {
  const { userId } = await auth();
  
  // ✅ Require authentication
  if (!userId) throw new Error('You must be logged in');
  
  const supabase = createSupabaseServerClient();
  
  // ✅ Verify companion exists and user has access to it
  const companion = await getCompanion(companionId);
  if (!companion) throw new Error('Companion not found or access denied');
  
  const { data, error } = await supabase.from("bookmarks").insert({
    companion_id: companionId,
    user_id: userId,
  });
  
  if (error) {
    throw new Error(error.message);
  }
  
  revalidatePath(path);
  return data;
};

export const removeBookmark = async (companionId: string, path: string) => {
  const { userId } = await auth();
  
  // ✅ Require authentication
  if (!userId) throw new Error('You must be logged in');
  
  const supabase = createSupabaseServerClient();
  
  const { data, error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("companion_id", companionId)
    .eq("user_id", userId);
    
  if (error) {
    throw new Error(error.message);
  }
  
  revalidatePath(path);
  return data;
};

export const getBookmarkedCompanions = async (userId: string) => {
  const { userId: currentUserId } = await auth();
  
  // ✅ Require authentication and ensure user can only access their own bookmarks
  if (!currentUserId) throw new Error('You must be logged in');
  if (currentUserId !== userId) throw new Error('You can only access your own bookmarks');
  
  const supabase = createSupabaseServerClient();
  
  const { data, error } = await supabase
    .from("bookmarks")
    .select(`companions:companion_id (*)`)
    .eq("user_id", userId);
    
  if (error) {
    throw new Error(error.message);
  }
  
  return data.map(({ companions }) => companions);
};

// Messages
export const saveMessage = async (
  companionId: string,
  role: 'user' | 'assistant',
  content: string
) => {
  const { userId } = await auth();
  
  // ✅ Require authentication
  if (!userId) {
    throw new Error('You must be logged in to save messages');
  }

  // ✅ Verify user owns the companion
  const companion = await getCompanion(companionId);
  if (!companion) throw new Error('Companion not found or access denied');

  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from('messages')
    .insert({
      companion_id: companionId,
      user_id: userId,
      role,
      content,
    })
    .select();

  if (error) {
    console.error('Failed to save message:', error);
    throw new Error(`Failed to save message: ${error.message}`);
  }
  
  return data?.[0];
};

export const getMessagesForCompanion = async (companionId: string) => {
  const { userId } = await auth();
  
  // ✅ Require authentication
  if (!userId) throw new Error('You must be logged in');
  
  // ✅ Verify user owns the companion
  const companion = await getCompanion(companionId);
  if (!companion) throw new Error('Companion not found or access denied');
  
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from('messages')
    .select()
    .eq('companion_id', companionId)
    .eq('user_id', userId) // ✅ Only get user's own messages
    .order('timestamp', { ascending: true });

  if (error) throw new Error(error.message);
  return data;
};