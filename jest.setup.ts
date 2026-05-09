import "@testing-library/jest-dom";
import path from "node:path";
import fs from "node:fs";

const COMMON_JSON_PATH = path.resolve(process.cwd(), "public/locales/en/common.json");
const commonTranslations = JSON.parse(fs.readFileSync(COMMON_JSON_PATH, "utf8")) as Record<
  string,
  unknown
>;

function lookupTranslation(key: string): string {
  const parts = key.split(".");
  let cur: unknown = commonTranslations;
  for (const p of parts) {
    cur = cur && typeof cur === "object" ? (cur as Record<string, unknown>)[p] : undefined;
  }
  return typeof cur === "string" ? cur : key;
}

jest.mock("react-i18next", () => ({
  initReactI18next: { type: "3rdParty", init: jest.fn() },
  useTranslation: () => ({
    t: (key: string) => lookupTranslation(key),
    i18n: { language: "en", changeLanguage: jest.fn() },
  }),
}));

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};
Object.defineProperty(window, "sessionStorage", {
  value: sessionStorageMock,
});

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  value: class IntersectionObserver {
    root = null;
    rootMargin = "";
    thresholds = [];
    
    constructor() {}
    observe() {
      return null;
    }
    disconnect() {
      return null;
    }
    unobserve() {
      return null;
    }
    takeRecords() {
      return [];
    }
  },
});

// Silence console errors in tests unless explicitly needed
const originalConsole = global.console;
global.console = {
  ...originalConsole,
  error: jest.fn(),
  warn: jest.fn(),
};
