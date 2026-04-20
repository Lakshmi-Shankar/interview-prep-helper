import { createClient } from '@/lib/supabase/server';

// Sign up using Supabase Auth
export async function signUp(email: string, password: string, name: string) {
  const supabase = await createClient();

  // 1. Create auth user first
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        full_name: name,
      }
    }
  });

  if (authError) {
    throw new Error(authError.message);
  }

  // 2. Create profile in custom User table
  if (authData.user) {
    const { data: userData, error: userError } = await supabase
      .from('User')
      .insert({
        id: authData.user.id,
        name,
        mail: email,
        attemptsCount: 0,
        videoUrls: [],
        rating: null,
        selfNotes: null,
      })
      .select()
      .single();

    if (userError) {
      // If profile creation fails, we should clean up the auth user
      // but for now, let's just log the error
      console.error('Profile creation failed:', userError);
    }
  }

  return { user: authData.user, session: authData.session };
}

// Sign in using Supabase Auth
export async function signIn(email: string, password: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { user: data.user, session: data.session };
}

export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  
  if (!user) return null;

  // Get additional user profile data
  const { data: userProfile, error: profileError } = await supabase
    .from('User')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error('Error fetching user profile:', profileError);
    return user; // Return basic auth user if profile fetch fails
  }

  return { ...user, profile: userProfile };
}