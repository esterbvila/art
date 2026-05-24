"use client";
import { ArrowRight, X } from "lucide-react";
import { useState } from "react";

export default function AnnouncementBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  function handleClick() {
    if (window.location.pathname === "/") {
      document.getElementById("prints")?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/#prints";
    }
  }

  return (
    <div
      className="relative flex cursor-pointer items-center justify-center text-center bg-accent px-7 py-2.5 transition-opacity hover:opacity-90"
      onClick={handleClick}
    >
      <p className="font-medium font-sans text-[13px] text-text-light tracking-[0.5px]">
        Prints now available — first run of 10 —{" "}
        <span className="inline-flex items-center gap-1 font-semibold underline decoration-text-light/30 underline-offset-2">
          Shop the collection <ArrowRight size={13} />
        </span>
      </p>
      <button
        onClick={e => {
          e.stopPropagation();
          setDismissed(true);
        }}
        className="absolute right-4 text-text-light/60 transition-opacity hover:text-text-light"
        aria-label="Dismiss"
      >
        <X size={13} />
      </button>
    </div>
  );
}
