"use server";

import { createClient } from "@/lib/supabase/server";

export async function saveUserNotes(notes: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("User")
    .update({
      selfNotes: notes,
    })
    .eq("id", user.id);

    console.log("📝 Saving user notes:", { userId: user.id, notes });

  if (error) {
    console.error(error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
