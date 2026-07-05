import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface ProductItem {
  product_id: string;
  product_title: string;
  product_main_image_url: string;
  sale_price: string;
  original_price: string;
  promotion_link: string;
  discount: string;
  urgency_stock?: number;
  urgency_hours?: number;
  quantity?: number;
}

export interface WishlistBoard {
  name: string;
  slug: string;
  products: ProductItem[];
}

interface ShopState {
  wishlistBoards: WishlistBoard[];
  cart: ProductItem[];
  saveForLater: ProductItem[];
  createNewBoard: (boardName: string) => void;
  saveToBoard: (boardName: string, product: ProductItem) => void;
  removeFromBoard: (boardSlug: string, productId: string) => void;
  addToCart: (product: ProductItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  moveToSaveForLater: (productId: string) => void;
  moveToCartFromLater: (productId: string) => void;
  removeFromLater: (productId: string) => void;
  getGroupedAffiliateUrl: () => string;
}

export const useShopStore = create<ShopState>()(
  persist(
    (set, get) => ({
      wishlistBoards: [
        { name: "Tech Gadgets", slug: "tech-gadgets", products: [] },
        { name: "Home Decor", slug: "home-decor", products: [] },
        { name: "Birthday Gifts", slug: "birthday-gifts", products: [] },
      ],
      cart: [],
      saveForLater: [],

      createNewBoard: (boardName) => {
        const slug = boardName.toLowerCase().trim().replace(/\s+/g, "-");
        const exists = get().wishlistBoards.find((b) => b.slug === slug);
        if (exists) return;
        set({ wishlistBoards: [...get().wishlistBoards, { name: boardName, slug, products: [] }] });
      },

      saveToBoard: (boardName, product) => {
        const targetSlug = boardName.toLowerCase().trim().replace(/\s+/g, "-");
        
        // --- AUTO-CREATE BOARD IF IT DOES NOT EXIST ---
        const boardExists = get().wishlistBoards.find((b) => b.slug === targetSlug);
        if (!boardExists) {
          const currentBoards = get().wishlistBoards;
          const newBoard = { name: boardName, slug: targetSlug, products: [] };
          // State ko immediate update kar rahe hain taake map function ko new board mil sake
          set({ wishlistBoards: [...currentBoards, newBoard] });
        }
        // ----------------------------------------------

        const simulatedStock = Math.floor(Math.random() * 4) + 2;
        const simulatedHours = Math.floor(Math.random() * 3) + 1;

        const updatedBoards = get().wishlistBoards.map((board) => {
          if (board.slug === targetSlug) {
            const productExists = board.products.find((p) => p.product_id === product.product_id);
            if (productExists) return board;
            return {
              ...board,
              products: [...board.products, { ...product, urgency_stock: simulatedStock, urgency_hours: simulatedHours }],
            };
          }
          return board;
        });
        set({ wishlistBoards: updatedBoards });
      },

      removeFromBoard: (boardSlug, productId) => {
        const updatedBoards = get().wishlistBoards.map((board) => {
          if (board.slug === boardSlug) {
            return { ...board, products: board.products.filter((p) => p.product_id !== productId) };
          }
          return board;
        });
        set({ wishlistBoards: updatedBoards });
      },

      addToCart: (product) => {
        const currentCart = get().cart;
        const exists = currentCart.find((item) => item.product_id === product.product_id);
        if (exists) {
          set({
            cart: currentCart.map((item) =>
              item.product_id === product.product_id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
            ),
          });
        } else {
          const simulatedStock = Math.floor(Math.random() * 3) + 1;
          const simulatedHours = 2;
          set({
            cart: [...currentCart, { ...product, quantity: 1, urgency_stock: simulatedStock, urgency_hours: simulatedHours }],
          });
        }
      },

      removeFromCart: (productId) => set({ cart: get().cart.filter((item) => item.product_id !== productId) }),

      updateQuantity: (productId, quantity) => set({
        cart: get().cart.map((item) => item.product_id === productId ? { ...item, quantity: Math.max(1, quantity) } : item),
      }),

      moveToSaveForLater: (productId) => {
        const item = get().cart.find((i) => i.product_id === productId);
        if (!item) return;
        set({
          cart: get().cart.filter((i) => i.product_id !== productId),
          saveForLater: [...get().saveForLater, item],
        });
      },

      moveToCartFromLater: (productId) => {
        const item = get().saveForLater.find((i) => i.product_id === productId);
        if (!item) return;
        set({
          saveForLater: get().saveForLater.filter((i) => i.product_id !== productId),
          cart: [...get().cart, { ...item, quantity: 1 }],
        });
      },

      removeFromLater: (productId) => set({ saveForLater: get().saveForLater.filter((i) => i.product_id !== productId) }),

      getGroupedAffiliateUrl: () => {
        const activeCart = get().cart;
        if (activeCart.length === 0) return "#";
        return activeCart[0].promotion_link;
      },
    }),
    {
      name: "shoppeak-engine-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
