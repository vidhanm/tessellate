"use client";

/**
 * There is no database. A return-in-progress lives in memory and is mirrored to
 * localStorage so a dropped connection on a slow network does not cost the user
 * their answers.
 */
import type { Persona, TaxInput } from "@/lib/schemas";

const KEY = "saral.session.v1";

export type SessionState = {
  personaId: string | null;
  persona: Persona | null;
  answers: Record<string, unknown>;
  taxInput: TaxInput | null;
  regime: "old" | "new" | null;
  ackNumber: string | null;
  verified: boolean;
  language: "en" | "hi";
  updatedAt: string;
};

export const EMPTY_SESSION: SessionState = {
  personaId: null,
  persona: null,
  answers: {},
  taxInput: null,
  regime: null,
  ackNumber: null,
  verified: false,
  language: "en",
  updatedAt: new Date(0).toISOString(),
};

let memory: SessionState = { ...EMPTY_SESSION };
const listeners = new Set<(s: SessionState) => void>();

export function loadSession(): SessionState {
  if (typeof window === "undefined") return memory;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) memory = { ...EMPTY_SESSION, ...JSON.parse(raw) };
  } catch {
    // A corrupt blob is not worth an error screen; start clean.
    memory = { ...EMPTY_SESSION };
  }
  return memory;
}

export function saveSession(patch: Partial<SessionState>): SessionState {
  memory = { ...memory, ...patch, updatedAt: new Date().toISOString() };
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(memory));
    } catch {
      // Private browsing or a full quota. In-memory state still works.
    }
  }
  for (const listener of listeners) listener(memory);
  return memory;
}

export function clearSession(): void {
  memory = { ...EMPTY_SESSION };
  if (typeof window !== "undefined") window.localStorage.removeItem(KEY);
  for (const listener of listeners) listener(memory);
}

export function subscribe(fn: (s: SessionState) => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
