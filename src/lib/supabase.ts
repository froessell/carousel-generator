import { createClient } from '@supabase/supabase-js';
import { DocumentSchema } from '@/lib/validation/document-schema';
import { z } from 'zod';
import { defaultValues } from '@/lib/default-document';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
});

// Helper function to upload an AI-generated image
export async function uploadAiGeneratedImage(imageUrl: string, userId: string): Promise<string | null> {
  try {
    // Fetch the image data
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    // Generate a unique filename
    const filename = `ai-generated/${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('carousel-images')
      .upload(filename, blob, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('carousel-images')
      .getPublicUrl(filename);

    return publicUrl;
  } catch (error) {
    console.error('Error processing image:', error);
    return null;
  }
}

// Helper function to get user session
export async function getCurrentUser() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting session:', error);
    return null;
  }
  return session?.user ?? null;
}

// Helper function to sign in with email magic link
export async function signInWithEmail(email: string) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  return { error };
}

// Helper function to sign up with email and password
export async function signUpWithPassword(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
}

// Helper function to sign in with email and password
export async function signInWithPassword(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

// Helper function to sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

// Type for carousel data
export type CarouselData = typeof defaultValues;

// Save carousel to user's library
export async function saveCarousel(carousel: CarouselData) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('carousels')
    .insert({
      user_id: user.id,
      name: carousel.filename,
      data: carousel,
      last_modified: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update existing carousel
export async function updateCarousel(id: string, carousel: CarouselData) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('carousels')
    .update({
      name: carousel.filename,
      data: carousel,
      last_modified: new Date().toISOString()
    })
    .eq('id', id)
    .eq('user_id', user.id) // Ensure user owns this carousel
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Get all carousels for current user
export async function getUserCarousels() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('carousels')
    .select('*')
    .eq('user_id', user.id)
    .order('last_modified', { ascending: false });

  if (error) throw error;
  return data;
}

// Get a specific carousel
export async function getCarousel(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('carousels')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id) // Ensure user owns this carousel
    .single();

  if (error) throw error;
  return data;
}

// Delete a carousel
export async function deleteCarousel(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('carousels')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id); // Ensure user owns this carousel

  if (error) throw error;
} 