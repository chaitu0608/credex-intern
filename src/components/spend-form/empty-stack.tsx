"use client";

import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStackProps {
  isDragOver: boolean;
}

export function EmptyStack({ isDragOver }: EmptyStackProps) {
  return (
    <div
      className={cn(
        "flex min-h-[140px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 px-6 py-10 text-center transition-colors",
        isDragOver && "border-accent bg-accent/5 ring-2 ring-accent/30"
      )}
    >
      <Plus
        className={cn(
          "mb-3 h-8 w-8 text-muted-foreground",
          isDragOver && "text-accent"
        )}
        aria-hidden
      />
      <p className="text-sm font-medium text-foreground">
        {isDragOver ? "Drop to add tool" : "Your stack is empty"}
      </p>
      <p className="mt-1 max-w-xs text-xs text-muted-foreground">
        Click a tool above or drag it here to start your audit
      </p>
    </div>
  );
}
