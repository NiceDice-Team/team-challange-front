import { create } from "zustand";
import { persist } from "zustand/middleware";
import { idsMatch } from "@/lib/cartStock";
import type { CartItem } from "@/types/cart";

export const GUEST_CART_STORAGE_KEY = "guest-cart";

function writeGuestCartToLocalStorage(
  token: string | null,
  items: CartItem[],
): void {
  if (typeof window === "undefined") {
    return;
  }

  if (!token) {
    localStorage.removeItem(GUEST_CART_STORAGE_KEY);
    return;
  }

  localStorage.setItem(
    GUEST_CART_STORAGE_KEY,
    JSON.stringify({
      state: { token, items },
      version: 0,
    }),
  );
}

export function removeGuestCartFromLocalStorage(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(GUEST_CART_STORAGE_KEY);
  }

  useGuestCartStore.setState({ token: null, items: [] });
}

export function saveGuestCartTokenToLocalStorage(token: string): void {
  useGuestCartStore.setState({ token, items: [] });
  writeGuestCartToLocalStorage(token, []);
}

export type GuestCartState = {
  token: string | null;
  items: CartItem[];
  setToken: (token: string) => void;
  setItems: (items: CartItem[]) => void;
  upsertItem: (item: CartItem) => void;
  removeItemByProductId: (productId: number | string) => void;
  clearGuestCart: () => void;
};

export const useGuestCartStore = create<GuestCartState>()(
  persist(
    (set, get, api) => ({
      token: null,
      items: [],
      setToken: (token) => set({ token }),
      setItems: (items) => set({ items }),
      upsertItem: (item) => {
        const items = get().items;
        const index = items.findIndex((existing) =>
          idsMatch(existing.product?.id, item.product?.id),
        );

        if (index >= 0) {
          const next = [...items];
          next[index] = item;
          set({ items: next });
          return;
        }

        set({ items: [...items, item] });
      },
      removeItemByProductId: (productId) => {
        set({
          items: get().items.filter(
            (item) => !idsMatch(item.product?.id, productId),
          ),
        });
      },
      clearGuestCart: () => {
        removeGuestCartFromLocalStorage();
        api.persist.clearStorage();
      },
    }),
    {
      name: "guest-cart",
      partialize: (state) => ({
        token: state.token,
        items: state.items,
      }),
    },
  ),
);

export function getGuestToken(): string | null {
  return useGuestCartStore.getState().token;
}
