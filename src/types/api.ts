// API Response Types

export interface ApiPagination {
  currentPage: number;
  limit: number;
  numberOfPages: number;
  next?: number;
}

export interface ApiResponse<T> {
  results: number;
  metadata?: ApiPagination;
  data: T;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subcategory {
  _id: string;
  name: string;
  slug: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  quantity: number;
  price: number;
  priceAfterDiscount?: number;
  imageCover: string;
  images: string[];
  category: Category;
  subcategory: Subcategory[];
  brand: Brand;
  ratingsAverage: number;
  ratingsQuantity: number;
  sold: number;
  createdAt: string;
  updatedAt: string;
  id: string;
}

export interface CartProduct {
  _id: string;
  count: number;
  price: number;
  product: Product;
}

export interface Cart {
  _id: string;
  cartOwner: string;
  products: CartProduct[];
  totalCartPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartResponse {
  status: string;
  numOfCartItems: number;
  cartId?: string;
  data: Cart;
}

export interface WishlistResponse {
  status: string;
  count: number;
  data: Product[];
}

export interface Address {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
}

export interface AddressesResponse {
  status: string;
  data: Address[];
}

export interface Review {
  _id: string;
  title: string;
  ratings: number;
  user: { _id: string; name: string };
  product: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  user: { _id: string; name: string; email: string; phone: string };
  cartItems: { count: number; price: number; product: Product }[];
  totalOrderPrice: number;
  paymentMethodType: string;
  isPaid: boolean;
  isDelivered: boolean;
  shippingAddress?: { details: string; phone: string; city: string };
  createdAt: string;
  updatedAt: string;
  id: number;
}

export interface AuthUser {
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  message: string;
  user: AuthUser;
  token: string;
}

export interface ProductsQueryParams {
  limit?: number;
  page?: number;
  sort?: string;
  keyword?: string;
  brand?: string;
  'price[gte]'?: number;
  'price[lte]'?: number;
  'category[in]'?: string;
}
