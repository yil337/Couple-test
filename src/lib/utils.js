/**
 * Get the base URL for the application
 * Returns production URL in production, localhost in development
 * Compatible with Edge Runtime (Cloudflare Pages)
 */
export function getBaseUrl() {
  // Check if we're in browser (client-side)
  if (typeof window !== 'undefined') {
    // In production (Cloudflare Pages), use production domain
    // Check if current origin is the production domain
    if (window.location.hostname === 'couple-test.pages.dev' || 
        window.location.hostname.endsWith('.pages.dev')) {
      return 'https://couple-test.pages.dev'
    }
    // In development, use current origin (localhost:3000)
    return window.location.origin
  }
  
  // Server-side / Edge Runtime: use environment variable or default
  // Cloudflare Pages sets NODE_ENV=production in production
  if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'production') {
    return 'https://couple-test.pages.dev'
  }
  
  // Fallback for SSR/Edge Runtime in development
  return 'http://localhost:3000'
}

