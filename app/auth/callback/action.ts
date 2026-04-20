"use server";

import { createClient } from "@/lib/supabase/server";

export async function handleOAuthCallback() {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    console.error("❌ Auth error:", authError);
    return { success: false, error: "Authentication failed" };
  }

  console.log("✅ OAuth Callback User:", user.email);

  try {
    // Check if user exists in User table by email (using 'mail' field to match your schema)
    const { data: existingUser, error: fetchError } = await supabase
      .from("User")
      .select("id")
      .eq("mail", user.email)
      .single();

    // If user doesn't exist (PGRST116 is "no rows returned" error)
    if (!existingUser || fetchError?.code === "PGRST116") {
      console.log("🆕 Creating new user profile for:", user.email);

      // Extract name from user metadata
      const name = user.user_metadata?.full_name || 
                   user.user_metadata?.name || 
                   user.email?.split("@")[0] || 
                   "User";

      // Insert new user
      const { data: newUser, error: insertError } = await supabase
        .from("User")
        .insert({
          id: user.id,
          name: name,
          mail: user.email,
          attemptsCount: 0,
          videoUrls: [],
          rating: null,
          selfNotes: null,
        })
        .select()
        .single();

      if (insertError) {
        console.error("❌ Error creating user:", insertError);
        return { success: false, error: insertError.message };
      }

      console.log("✅ New user created:", newUser);
      return { success: true, isNewUser: true, user: newUser };
    }

    console.log("✅ Existing user found:", existingUser.id);
    return { success: true, isNewUser: false };

  } catch (error: any) {
    console.error("❌ Unexpected error:", error);
    return { success: false, error: error.message };
  }
}