import { fetchAPI } from "./api.js";

// Guest cart management using localStorage
const GUEST_CART_KEY = "guest_cart";

const guestCartManager = {
  // Get guest cart from localStorage
  getGuestCart() {
    if (typeof window === "undefined") return [];
    try {
      const cart = localStorage.getItem(GUEST_CART_KEY);
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error("Error reading guest cart:", error);
      return [];
    }
  },

  // Save guest cart to localStorage
  saveGuestCart(cartItems) {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error saving guest cart:", error);
    }
  },

  // Add item to guest cart
  addToGuestCart(productId, quantity = 1) {
    const cart = this.getGuestCart();
    const existingItemIndex = cart.findIndex((item) => item.product.id === productId);

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item (we'll need to fetch product details)
      const newItem = {
        id: `guest_${productId}_${Date.now()}`, // Generate unique ID
        product: { id: productId }, // Basic product info, will be enriched later
        quantity: quantity,
      };
      cart.push(newItem);
    }

    this.saveGuestCart(cart);
    return cart;
  },

  // Update guest cart item quantity
  updateGuestCartItem(cartItemId, quantity) {
    const cart = this.getGuestCart();
    const itemIndex = cart.findIndex((item) => item.id === cartItemId);

    if (itemIndex >= 0) {
      if (quantity <= 0) {
        cart.splice(itemIndex, 1);
      } else {
        cart[itemIndex].quantity = quantity;
      }
      this.saveGuestCart(cart);
    }

    return cart;
  },

  // Remove item from guest cart
  removeFromGuestCart(cartItemId) {
    const cart = this.getGuestCart();
    const filteredCart = cart.filter((item) => item.id !== cartItemId);
    this.saveGuestCart(filteredCart);
    return filteredCart;
  },
};

// Helper function to check if user is authenticated
const isAuthenticated = () => {
  if (typeof window === "undefined") return false;
  const token = localStorage.getItem("token");
  return token && token !== "null" && token !== "undefined";
};

// Cart API services
export const cartServices = {
  // Get all cart items for the current user
  async getCartItems() {
    if (!isAuthenticated()) {
      // Return guest cart for non-authenticated users
      const guestCart = guestCartManager.getGuestCart();

      // Enrich guest cart items with full product data
      try {
        const enrichedCart = await Promise.all(
          guestCart.map(async (item) => {
            try {
              const product = await productServices.getProductById(item.product.id);
              return {
                ...item,
                product: product,
              };
            } catch (error) {
              console.error(`Error fetching product ${item.product.id}:`, error);
              return item; // Return item with basic product info if fetch fails
            }
          })
        );
        return enrichedCart;
      } catch (error) {
        console.error("Error enriching guest cart:", error);
        return guestCart;
      }
    }

    try {
      const response = await fetchAPI("carts/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.results || response;
    } catch (error) {
      console.error("Error fetching cart items:", error);
      return [];
    }
  },

  // Add item to cart
  async addToCart(productId, quantity = 1) {
    if (!isAuthenticated()) {
      // Handle guest cart
      try {
        const cart = guestCartManager.addToGuestCart(productId, quantity);
        console.log("Added to guest cart:", productId);
        return { success: true, cart };
      } catch (error) {
        console.error("Error adding to guest cart:", error);
        throw error;
      }
    }

    try {
      const response = await fetchAPI("carts/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: {
          product: productId,
          quantity: quantity,
        },
      });
      return response;
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  },

  // Update cart item quantity
  async updateCartItem(cartItemId, quantity) {
    if (!isAuthenticated()) {
      // Handle guest cart
      try {
        const cart = guestCartManager.updateGuestCartItem(cartItemId, quantity);
        return { success: true, cart };
      } catch (error) {
        console.error("Error updating guest cart item:", error);
        throw error;
      }
    }

    try {
      const response = await fetchAPI(`carts/${cartItemId}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: {
          quantity: quantity,
        },
      });
      return response;
    } catch (error) {
      console.error("Error updating cart item:", error);
      throw error;
    }
  },

  // Remove item from cart
  async removeFromCart(cartItemId) {
    if (!isAuthenticated()) {
      // Handle guest cart
      try {
        guestCartManager.removeFromGuestCart(cartItemId);
        return true;
      } catch (error) {
        console.error("Error removing from guest cart:", error);
        throw error;
      }
    }

    try {
      await fetchAPI(`carts/${cartItemId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return true;
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }
  },
};

// Product API services for recommendations
export const productServices = {
  // Get single product by ID
  async getProductById(productId) {
    try {
      const response = await fetchAPI(`products/${productId}/`);
      return response;
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      throw error;
    }
  },

  // Get random products for recommendations
  async getRandomProducts(limit = 5) {
    try {
      const response = await fetchAPI(`products/?limit=20&ordering=-created_at`);
      const products = response.results || response;

      // Randomly select 5 from the fetched products
      const shuffled = [...products].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, limit);
    } catch (error) {
      console.error("Error fetching random products:", error);
      return [];
    }
  },

  // Get products with filtering
  async getProducts(params = {}) {
    try {
      const queryParams = new URLSearchParams();

      if (params.search) queryParams.append("search", params.search);
      if (params.brand) queryParams.append("brand", params.brand);
      if (params.categories) queryParams.append("categories", params.categories);
      if (params.audiences) queryParams.append("audiences", params.audiencesWH);
      if (params.types) queryParams.append("types", params.types);
      if (params.ordering) queryParams.append("ordering", params.ordering);
      if (params.limit) queryParams.append("limit", params.limit);
      if (params.offset) queryParams.append("offset", params.offset);

      const response = await fetchAPI(`products/?${queryParams.toString()}`);
      return response.results || response;
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  },
};
