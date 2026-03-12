export const ENDPOINTS = {
  // Auth
  SIGNUP: '/api/v1/auth/signup',
  SIGNIN: '/api/v1/auth/signin',
  FORGOT_PASSWORD: '/api/v1/auth/forgotPasswords',
  VERIFY_RESET_CODE: '/api/v1/auth/verifyResetCode',
  RESET_PASSWORD: '/api/v1/auth/resetPassword',
  VERIFY_TOKEN: '/api/v1/auth/verifyToken',
  CHANGE_PASSWORD: '/api/v1/users/changeMyPassword',
  UPDATE_ME: '/api/v1/users/updateMe',

  // Products
  PRODUCTS: '/api/v1/products',
  PRODUCT: (id: string) => `/api/v1/products/${id}`,
  PRODUCT_REVIEWS: (id: string) => `/api/v1/products/${id}/reviews`,

  // Categories
  CATEGORIES: '/api/v1/categories',
  CATEGORY: (id: string) => `/api/v1/categories/${id}`,
  CATEGORY_SUBCATEGORIES: (id: string) => `/api/v1/categories/${id}/subcategories`,

  // Subcategories
  SUBCATEGORIES: '/api/v1/subcategories',
  SUBCATEGORY: (id: string) => `/api/v1/subcategories/${id}`,

  // Brands
  BRANDS: '/api/v1/brands',
  BRAND: (id: string) => `/api/v1/brands/${id}`,

  // Cart (v2)
  CART: '/api/v2/cart',
  CART_ITEM: (productId: string) => `/api/v2/cart/${productId}`,
  CART_CLEAR: '/api/v2/cart',
  CART_COUPON: '/api/v2/cart/applyCoupon',

  // Wishlist
  WISHLIST: '/api/v1/wishlist',
  WISHLIST_ITEM: (productId: string) => `/api/v1/wishlist/${productId}`,

  // Addresses
  ADDRESSES: '/api/v1/addresses',
  ADDRESS: (id: string) => `/api/v1/addresses/${id}`,

  // Orders
  ORDERS: '/api/v1/orders',
  USER_ORDERS: (userId: string) => `/api/v1/orders/user/${userId}`,
  CASH_ORDER: (cartId: string) => `/api/v2/orders/${cartId}`,
  CHECKOUT_SESSION: (cartId: string) => `/api/v1/orders/checkout-session/${cartId}`,

  // Reviews
  REVIEWS: '/api/v1/reviews',
  REVIEW: (id: string) => `/api/v1/reviews/${id}`,
} as const;
