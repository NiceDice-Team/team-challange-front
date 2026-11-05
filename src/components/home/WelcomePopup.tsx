"use client";

import { useEffect, useRef, useState } from "react";
import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

const STORAGE_KEY = "dice-decks-welcome-seen";
const VISIBLE_MS = 5000;

type WelcomePopupProps = {
  open?: boolean;
  onClose?: () => void;
};

function markSeen() {
  try {
    localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // Storage can be unavailable in private mode.
  }
}

function hasSeenWelcome() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export default function WelcomePopup({
  open: openProp,
  onClose,
}: WelcomePopupProps = {}) {
  const isControlled = openProp !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = isControlled ? openProp : uncontrolledOpen;
  const timerRef = useRef<number | null>(null);

  const dismiss = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (isControlled) {
      onClose?.();
      return;
    }
    markSeen();
    setUncontrolledOpen(false);
  };

  useEffect(() => {
    if (isControlled || hasSeenWelcome()) return;

    setUncontrolledOpen(true);
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      markSeen();
      setUncontrolledOpen(false);
    }, VISIBLE_MS);

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [isControlled]);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) dismiss();
      }}
    >
      <DialogContent className="max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-[36rem] gap-0 overflow-y-auto rounded-2xl border border-[#e4e2f2] bg-white p-5 text-center shadow-[0_8px_40px_rgba(73,71,145,0.12)] sm:max-w-[36rem] sm:rounded-2xl sm:p-8 [&>button.absolute]:hidden">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#eceaf8] sm:h-12 sm:w-12">
          <Info className="h-5 w-5 text-purple sm:h-6 sm:w-6" aria-hidden="true" />
        </div>

        <DialogTitle className="mt-3 text-center text-xl font-bold leading-tight text-[#2c2a5e] sm:mt-5 sm:text-2xl">
          Welcome to Dice & Decks!
        </DialogTitle>

        <p className="mt-2 text-base font-semibold text-purple sm:mt-3 sm:text-lg">
          Educational Demo Website
        </p>

        <DialogDescription className="mt-3 text-center text-sm leading-relaxed text-gray-2 sm:mt-4 sm:text-base">
          Dice & Decks is a student project created for educational and portfolio
          purposes. This is not a real online store. Orders and payments are for
          demonstration only. No real purchases will be processed.
        </DialogDescription>

        <div className="mt-4 flex items-center gap-2 rounded-lg bg-[#f3f1fb] px-4 py-3 text-left text-sm text-purple sm:mt-6">
          <Info className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Please do not enter real payment card details.</span>
        </div>

        <button
          type="button"
          onClick={dismiss}
          className="mt-4 h-12 w-full cursor-pointer rounded-lg bg-purple text-base font-semibold text-white transition-colors hover:bg-[#3d3b7a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple focus-visible:ring-offset-2"
        >
          Got it, let&apos;s explore!
        </button>
      </DialogContent>
    </Dialog>
  );
}
