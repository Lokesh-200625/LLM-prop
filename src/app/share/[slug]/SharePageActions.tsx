"use client";

import { Check, Copy, Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { deleteShare } from "@/services/sharing/sharingService";

type SharePageActionsProps = {
  slug: string;
  canDelete: boolean;
};

export function SharePageActions({ slug, canDelete }: SharePageActionsProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Share link copied.");
    window.setTimeout(() => setCopied(false), 1800);
  };

  const remove = async () => {
    setDeleting(true);
    try {
      await deleteShare(slug);
      toast.success("Share deleted.");
      router.push("/history");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete share.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button type="button" variant="outline" onClick={copy}>
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        Copy link
      </Button>
    </div>
  );
}
