"use client";

import { Button } from "@/components/ui/button";

interface ResourceActionButtonProps {
  price: string;
  fileUrl: string | null;
}

export function ResourceActionButton({
  price,
  fileUrl,
}: ResourceActionButtonProps) {
  const isFree = price === "0.00";

  function handleClick() {
    if (isFree) {
      if (fileUrl) {
        window.open(fileUrl, "_blank");
      }
    } else {
      // Open Stripe payment modal to purchase this resource
    }
  }

  return (
    <Button className="w-full rounded-xl" size="lg" onClick={handleClick}>
      {isFree ? "Download for free" : "Get this resource"}
    </Button>
  );
}
