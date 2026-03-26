"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ResourceActionButtonProps {
  price: string;
  fileUrl: string | null;
  hasPurchased: boolean;
  resourceId: string;
  slug: string;
  showSuccess: boolean;
}

export function ResourceActionButton({
  price,
  fileUrl,
  hasPurchased,
  resourceId,
  slug,
  showSuccess,
}: ResourceActionButtonProps) {
  const [loading, setLoading] = useState(false);
  const isFree = price === "0.00";

  async function handleClick() {
    if (isFree || hasPurchased) {
      if (fileUrl) {
        window.open(fileUrl, "_blank");
      }
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId, slug }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } finally {
      setLoading(false);
    }
  }

  function displayButtonText() {
    if (isFree) return "Download for free";
    if (hasPurchased) return "Download";
    return "Get this resource";
  }

  return (
    <div className="space-y-3">
      {showSuccess && hasPurchased && (
        <p className="rounded-lg bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700">
          Payment successful! Your download is ready below.
        </p>
      )}
      <Button
        className="w-full rounded-xl"
        size="lg"
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? "Redirecting to checkout…" : displayButtonText()}
      </Button>
    </div>
  );
}
