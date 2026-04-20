"use client";

import React, { useState, useRef, useEffect } from "react";
import { saveUserNotes } from "@/app/dashboard/saveNotes";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NotesCard({ userData }) {

  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(userData.selfNotes || "");
  const [loading, setLoading] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto resize textarea
  const autoResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  };

  useEffect(() => {
    autoResize();
  }, [notes, isEditing]);


  const handleSave = async () => {

    setLoading(true);

    const result = await saveUserNotes(notes);

    setLoading(false);

    if (result.success) {
      setIsEditing(false); // ← this returns to Edit mode button
    }
  };


  const handleCancel = () => {
    setNotes(userData.selfNotes || "");
    setIsEditing(false);
  };


  return (

    <Card className="bg-card border-border animate-fade-in-up" style={{ animationDelay: "500ms" }}>
  <CardHeader className="pb-3">
    <div className="flex items-center justify-between">
      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/100">
        Notes
      </span>

      {isEditing ? (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={loading}
            className="h-7 px-3 text-xs"
          >
            {loading ? "Saving…" : "Save"}
          </Button>
        </div>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="text-xs text-muted-foreground/50 hover:text-primary transition-colors duration-200"
        >
          Edit
        </button>
      )}
    </div>
  </CardHeader>

  <CardContent className="pt-0">
    {isEditing ? (
      <textarea
        ref={textareaRef}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
        className="w-full text-sm text-foreground leading-relaxed bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/40"
        placeholder="Write something…"
        autoFocus
      />
    ) : (
      <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap">
        {notes || (
          <span className="text-muted-foreground/40 italic">
            No notes yet.
          </span>
        )}
      </p>
    )}
  </CardContent>
</Card>

  );
}
