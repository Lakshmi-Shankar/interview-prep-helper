"use client";

import React from "react";
import { Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProgressCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Your Progress</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center justify-center py-10 text-center">
        <Wrench className="w-10 h-10 text-muted-foreground mb-3 animate-pulse" />
        
        <p className="text-lg font-medium text-foreground">
          Under Construction
        </p>
        
        <p className="text-sm text-muted-foreground mt-1">
          This feature is being built. Check back soon.
        </p>
      </CardContent>
    </Card>
  );
}