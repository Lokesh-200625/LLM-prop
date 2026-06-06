"use client";

import { Check, Copy, Loader2, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { createShare } from "@/services/sharing/sharingService";
import { Button } from "@/components/ui/button";

type SharePredictionButtonProps = {
  predictionId?: string | null;
  title: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "icon";
};

export function SharePredictionButton({
  predictionId,
  title,
  variant = "outline",
  size = "sm",
}: SharePredictionButtonProps) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (!predictionId) {
      toast.error("Save the prediction before sharing.");
      return;
    }

    setLoading(true);
    try {
      const url = `${window.location.origin}/share/${predictionId}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Share link copied.");
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to create share link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button type="button" variant={variant} size={size} onClick={handleShare} disabled={loading}>
      {loading ? <Loader2 className="size-4 animate-spin" /> : copied ? <Check className="size-4" /> : <Share2 className="size-4" />}
      {size !== "icon" ? "Share" : null}
    </Button>
  );
}
