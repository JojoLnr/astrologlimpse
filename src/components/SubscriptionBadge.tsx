import React from 'react';
import { Star } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { STRIPE_PRODUCTS } from '@/stripe-config';

export default function SubscriptionBadge() {
  const { isActive, loading } = useSubscription();

  if (loading || !isActive) return null;

  const product = STRIPE_PRODUCTS[0];

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium">
      <Star className="w-3 h-3 fill-violet-400 text-violet-400" />
      {product.name}
    </span>
  );
}