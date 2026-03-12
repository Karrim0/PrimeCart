import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import RatingStars from '@/components/shared/RatingStars';
import QuantitySelector from '@/components/shared/QuantitySelector';
import ProductGrid from '@/components/products/ProductGrid';
import { useI18n } from '@/i18n/I18nProvider';
import { useProduct, useProducts } from '@/hooks/useProducts';
import { useAddToCart } from '@/hooks/useCart';
import { useAddToWishlist, useRemoveFromWishlist, useWishlist } from '@/hooks/useWishlist';
import { useProductReviews, useCreateReview } from '@/hooks/useReviews';
import { useAuthStore } from '@/stores/authStore';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useI18n();
  const { isAuthenticated } = useAuthStore();
  const { data: product, isLoading } = useProduct(id!);
  const { data: reviews } = useProductReviews(id!);
  const { data: relatedData } = useProducts({
    limit: 4,
    'category[in]': product?.category?._id,
  });
  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const { data: wishlistData } = useWishlist();
  const createReview = useCreateReview(id!);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [imgError, setImgError] = useState(false);

  const isInWishlist = wishlistData?.data?.some((p) => p._id === id) || false;

  if (isLoading) {
    return (
      <div className="container-main section-spacing">
        <div className="grid gap-12 lg:grid-cols-2">
          <Skeleton className="aspect-square rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const images = [product.imageCover, ...product.images];

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    createReview.mutate({ title: reviewText, ratings: reviewRating }, {
      onSuccess: () => { setReviewText(''); setReviewRating(5); }
    });
  };

  const relatedProducts = relatedData?.data?.filter((p) => p._id !== product._id) || [];

  return (
    <div className="container-main section-spacing">
      <Link to="/products" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ChevronLeft className="h-4 w-4" />
        {t.common.back}
      </Link>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Images */}
        <div>
          <motion.div
            className="overflow-hidden rounded-xl bg-muted aspect-square"
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <img
              src={imgError ? '/placeholder.svg' : images[selectedImage]}
              alt={product.title}
              className="h-full w-full object-cover"
              onError={() => setImgError(true)}
            />
          </motion.div>
          {images.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => { setSelectedImage(i); setImgError(false); }}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                    i === selectedImage ? 'border-foreground' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-sm text-muted-foreground">{product.brand?.name}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{product.title}</h1>

          <div className="mt-3">
            <RatingStars rating={product.ratingsAverage} count={product.ratingsQuantity} />
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="price-text text-2xl text-foreground" dir="ltr">
              {t.common.egp} {(product.priceAfterDiscount || product.price).toLocaleString()}
            </span>
            {product.priceAfterDiscount && (
              <span className="text-base text-muted-foreground line-through" dir="ltr">
                {t.common.egp} {product.price.toLocaleString()}
              </span>
            )}
          </div>

          <Separator className="my-6" />

          <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>

          <div className="mt-4 text-sm">
            <span className={product.quantity > 0 ? 'text-emerald-600' : 'text-destructive'}>
              {product.quantity > 0 ? t.products.inStock : t.products.outOfStock}
            </span>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">{t.products.quantity}</label>
              <QuantitySelector value={quantity} onChange={setQuantity} max={product.quantity} />
            </div>

            <div className="flex gap-3">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex-1">
                <Button
                  size="lg"
                  className="w-full h-12"
                  onClick={() => {
                    for (let i = 0; i < quantity; i++) addToCart.mutate(product._id);
                  }}
                  disabled={addToCart.isPending || !isAuthenticated || product.quantity === 0}
                >
                  <ShoppingCart className="me-2 h-4 w-4" />
                  {t.products.addToCart}
                </Button>
              </motion.div>
              {isAuthenticated && (
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12"
                    onClick={() => isInWishlist ? removeFromWishlist.mutate(product._id) : addToWishlist.mutate(product._id)}
                  >
                    <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-accent text-accent' : ''}`} />
                  </Button>
                </motion.div>
              )}
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">{t.products.category}:</span>
              <Link to={`/products?category=${product.category?._id}`} className="ms-1 font-medium hover:underline">
                {product.category?.name}
              </Link>
            </div>
            <div>
              <span className="text-muted-foreground">{t.products.brand}:</span>
              <Link to={`/products?brand=${product.brand?._id}`} className="ms-1 font-medium hover:underline">
                {product.brand?.name}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-16">
        <h2 className="heading-section mb-8">{t.reviews.title} ({reviews?.length || 0})</h2>

        {isAuthenticated && (
          <form onSubmit={handleSubmitReview} className="mb-8 rounded-xl bg-card card-elevated p-6">
            <h3 className="mb-4 font-semibold">{t.reviews.writeReview}</h3>
            <div className="mb-4 flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setReviewRating(star)}>
                  <Star className={`h-5 w-5 ${star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`} />
                </button>
              ))}
            </div>
            <Textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder={t.reviews.yourReview}
              className="mb-4"
            />
            <Button type="submit" disabled={createReview.isPending || !reviewText.trim()}>
              {t.reviews.submit}
            </Button>
          </form>
        )}

        {reviews && reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="rounded-xl bg-card card-elevated p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{review.user?.name}</span>
                  <RatingStars rating={review.ratings} showCount={false} size={12} />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{review.title}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{t.reviews.noReviews}</p>
        )}
      </section>

      {/* Related */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="heading-section mb-8">{t.products.relatedProducts}</h2>
          <ProductGrid products={relatedProducts.slice(0, 4)} />
        </section>
      )}
    </div>
  );
}
