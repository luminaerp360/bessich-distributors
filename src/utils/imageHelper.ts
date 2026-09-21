import React from 'react';

/**
 * Resolves a product image URL to either direct or server-proxied,
 * ensuring high reliability inside iframes, previews, and restrictive networks.
 */
export function getProductImageUrl(rawUrl: string | undefined): string {
  if (!rawUrl) {
    return 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=800&q=80';
  }

  // If the image is hosted on ke-thebar-business.agiza.io or aws s3,
  // proxy it through /api/image-proxy for instant, cached delivery without referrer/CORS blocks
  if (rawUrl.includes('ke-thebar-business.agiza.io') || rawUrl.includes('amazonaws.com')) {
    return `/api/image-proxy?url=${encodeURIComponent(rawUrl)}`;
  }

  return rawUrl;
}

export function handleImageError(
  e: React.SyntheticEvent<HTMLImageElement>,
  fallback = 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=800&q=80'
) {
  const target = e.currentTarget;
  if (target.src !== fallback) {
    target.src = fallback;
  }
}
