import { create } from "zustand";
import { persist } from "zustand/middleware";
import { idsMatch } from "@/lib/cartStock";
import type { CartItem } from "@/types/cart";

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
        set({ token: null, items: [] });
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
