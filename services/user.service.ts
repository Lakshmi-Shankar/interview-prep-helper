import { createClient } from '@/lib/supabase/server';

export async function getAllUsers() {
  const supabase = await createClient(); // Add await
  
  const { data, error } = await supabase
    .from('User')
    .select('*');

  if (error) throw error;
  return data;
}

export async function getUserById(id: string) {
  const supabase = await createClient(); // Add await
  
  const { data, error } = await supabase
    .from('User')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function getUserByEmail(mail: string) {
  const supabase = await createClient(); // Add await
  
  const { data, error } = await supabase
    .from('User')
    .select('*')
    .eq('mail', mail)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function updateUser(id: string, updates: {
  name?: string;
  videoUrls?: string[];
  attemptsCount?: number;
  rating?: number;
  selfNotes?: string;
}) {
  const supabase = await createClient(); // Add await
  
  const { data, error } = await supabase
    .from('User')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}