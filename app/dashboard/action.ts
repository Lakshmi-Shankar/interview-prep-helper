"use server";

import { createClient } from "@/lib/supabase/server";

// Helper function to get session data
// Helper function to get session data
async function getSessionData(supabase: any, userId: string) {
  try {
    // 1. Get recent sessions (last 5)
    const { data: recentSessions, error: recentError } = await supabase
      .from("sessions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (recentError) throw recentError;

    // 2. Get all sessions (for stats & progress)
    const { data: allSessions, error: allError } = await supabase
      .from("sessions")
      .select("*")
      .eq("user_id", userId);

    if (allError) throw allError;

    // 3. Count sessions this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weeklySessions =
      allSessions?.filter(
        (session: any) =>
          new Date(session.created_at) >= oneWeekAgo
      ) || [];

    // 4. Calculate category progress (average score per category)
    const categoryMap: any = {};

    allSessions?.forEach((session: any) => {
      if (!categoryMap[session.category]) {
        categoryMap[session.category] = {
          totalScore: 0,
          count: 0,
        };
      }

      categoryMap[session.category].totalScore += session.score;
      categoryMap[session.category].count += 1;
    });

    const categoryProgress = Object.keys(categoryMap).map(
      (category) => ({
        category,
        progress: Math.round(
          categoryMap[category].totalScore /
            categoryMap[category].count
        ),
      })
    );

    return {
      recentSessions: recentSessions || [],
      allSessions: allSessions || [],
      weeklyCount: weeklySessions.length,
      totalSessions: allSessions?.length || 0,
      totalScore: allSessions?.reduce(
        (acc: number, session: any) => acc + session.score,
        0
      ) || 0,
      correct_answers: allSessions?.reduce(
        (acc: number, session: any) => acc + session.correct_answers,
        0
      ) || 0,
      totalQuestions: allSessions?.reduce(
        (acc: number, session: any) => acc + session.total_questions,
        0
      ) || 0,
      categoryProgress,
    };
  } catch (error) {
    console.error("❌ Error fetching session data:", error);

    return {
      recentSessions: [],
      weeklyCount: 0,
      totalSessions: 0,
      totalScore: 0,
      categoryProgress: [],
    };
  }
}


// Helper function to track daily activity
async function trackDailyActivity(supabase: any, userId: string) {
  const today = new Date().toISOString().split("T")[0];

  try {
    // Get current user data FIRST
    const { data: userData, error: userError } = await supabase
      .from("User")
      .select("currentStreak, longestStreak, lastActivityDate")
      .eq("id", userId)
      .single();

    if (userError) throw userError;

    const lastActivity = userData.lastActivityDate
      ? new Date(userData.lastActivityDate).toISOString().split("T")[0]
      : null;

    // If already logged today, skip
    if (lastActivity === today) {
      console.log(lastActivity, today);
      console.log("✅ Already logged activity for today");
      return;
    }

    // Insert today's activity
    const { error: activityError } = await supabase
      .from("Activity")
      .upsert(
        {
          userId: userId,
          activityDate: today,
        },
        {
          onConflict: "userId,activityDate",
          ignoreDuplicates: true,
        }
      );

    if (activityError) throw activityError;

    let newCurrentStreak = 1;
    let newLongestStreak = userData.longestStreak || 0;

    if (lastActivity) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      if (lastActivity === yesterdayStr) {
        // Consecutive day - increment streak
        newCurrentStreak = (userData.currentStreak || 0) + 1;
      }
      // else: Gap in activity - newCurrentStreak stays at 1
    }
    // else: First activity ever - newCurrentStreak stays at 1

    // Update longest streak if current exceeds it
    newLongestStreak = Math.max(newLongestStreak, newCurrentStreak);

    // Update user record
    await supabase
      .from("User")
      .update({
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        lastActivityDate: today,
      })
      .eq("id", userId);

    console.log("🔥 Streak updated:", {
      current: newCurrentStreak,
      longest: newLongestStreak,
      lastActivity: lastActivity,
      today: today,
    });
  } catch (error) {
    console.error("⚠️ Failed to track activity:", error);
    throw error;
  }
}

export async function getUserDashboardData() {
  const supabase = await createClient();

  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !authUser) {
    console.error("❌ Auth error:", authError);
    return { success: false, error: "Not authenticated" };
  }

  try {
    const { data: userData, error: userError } = await supabase
      .from("User")
      .select("*")
      .eq("id", authUser.id)
      .maybeSingle();

    if (userError) {
      console.error("❌ Error fetching user data:", userError);
      return { success: false, error: userError.message };
    }

    // If no user record exists, create one
    if (!userData) {
      console.log("📝 Creating new user record for:", authUser.email);

      const { data: newUser, error: insertError } = await supabase
        .from("User")
        .insert({
          id: authUser.id,
          mail: authUser.email,
          name:
            authUser.user_metadata?.full_name ||
            authUser.email?.split("@")[0] ||
            "User",
          password: "OAUTH_USER",
          videoUrls: [],
          attemptsCount: 0,
          rating: 0,
          selfNotes: "",
          currentStreak: 0,
          longestStreak: 0,
          lastActivityDate: null,
        })
        .select()
        .single();

      if (insertError) {
        console.error("❌ Error creating user record:", insertError);
        return { success: false, error: insertError.message };
      }

      // Track first activity (BLOCKING - wait for it)
      await trackDailyActivity(supabase, newUser.id);

      // Fetch UPDATED user data
      const { data: updatedNewUser } = await supabase
        .from("User")
        .select("*")
        .eq("id", newUser.id)
        .single();
        

      return {
        success: true,
        user: {
          id: updatedNewUser.id,
          name: updatedNewUser.name,
          mail: updatedNewUser.mail,
          videoUrls: updatedNewUser.videoUrls || [],
          attemptsCount: updatedNewUser.attemptsCount || 0,
          rating: updatedNewUser.rating || 0,
          selfNotes: updatedNewUser.selfNotes || "",
          currentStreak: updatedNewUser.currentStreak || 0,
          longestStreak: updatedNewUser.longestStreak || 0,
          lastActivityDate: updatedNewUser.lastActivityDate,
          avatar_url:
            authUser.user_metadata?.avatar_url || "/avatars/Snowman-1.png",
          createdAt: updatedNewUser.created_at || authUser.created_at,
        },

      };
    }

    console.log("✅ Fetched user data for:", userData.mail);

    // Track today's activity (BLOCKING - WAIT FOR IT!)
    await trackDailyActivity(supabase, userData.id);

    // Fetch UPDATED user data AFTER tracking
    const { data: updatedUserData, error: updateError } = await supabase
      .from("User")
      .select("*")
      .eq("id", userData.id)
      .single();

    if (updateError) {
      console.error("❌ Error fetching updated user data:", updateError);
      return { success: false, error: updateError.message };
    }

    console.log("📊 Returning updated data:", {
      current: updatedUserData.currentStreak,
      longest: updatedUserData.longestStreak,
    });

    // ✅ Get session data
    const sessionData = await getSessionData(
      supabase,
      updatedUserData.id
    );


    // Return user data with UPDATED streaks
    return {
      success: true,
      user: {
        id: updatedUserData.id,
        name: updatedUserData.name,
        mail: updatedUserData.mail,
        videoUrls: updatedUserData.videoUrls || [],
        attemptsCount: updatedUserData.attemptsCount || 0,
        rating: updatedUserData.rating || 0,
        selfNotes: updatedUserData.selfNotes || "",
        currentStreak: updatedUserData.currentStreak || 0,
        longestStreak: updatedUserData.longestStreak || 0,
        lastActivityDate: updatedUserData.lastActivityDate,
        avatar_url:
          authUser.user_metadata?.avatar_url || "/avatars/Snowman-1.png",
        createdAt: updatedUserData.created_at || authUser.created_at,
      },
      sessionData: {
        sessions: sessionData.recentSessions,
        allSessions: sessionData.allSessions,
        weeklySessionsCount: sessionData.weeklyCount,
        totalSessions: sessionData.totalSessions,
        totalScore: sessionData.totalScore,
        correctAnswers: sessionData.correct_answers,
        totalQuestions: sessionData.totalQuestions,
        categoryProgress: sessionData.categoryProgress,
      }
    };
  } catch (error: unknown | any) {
    console.error("❌ Unexpected error:", error);
    return { success: false, error: error.message };
  }
}



export const fetchSessions = async () => {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase fetch error:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Failed to fetch sessions:", error)
    return null
  }
}

export const fetchQAData = async (sessionId: string) => {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .eq("id", sessionId)

    if (error) {
      console.error("Supabase fetch error:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Failed to fetch Q&A data:", error)
    return null
  }
}