# Shop Checkit

Editorial e-commerce storefront for the DummyJSON assessment, built with Next.js 16 App Router, Cache Components, Server Actions, and a warm luxury-inspired design system.

## Setup

```bash
pnpm install
cp .env.example .env.local
pnpm dev
pnpm test
pnpm build
```

## Architecture Decisions

- `globalFetch` in `src/lib/fetch/globalFetch.ts` centralizes transport concerns: JSON normalization, auth header attachment, 401 refresh retry, and typed `FetchError` handling.
- Cached catalog reads live in `src/lib/api/products.ts` with `"use cache"`, `cacheLife()`, and `cacheTag()`; auth and cart endpoints stay uncached because they depend on request-time state.
- Auth uses Server Actions plus httpOnly cookies. `loginAction` writes `accessToken`, `refreshToken`, and a serialized session user cookie; `logoutAction` clears them and redirects.
- `src/proxy.ts` guards `/cart` before rendering and redirects unauthenticated requests to `/login?redirect=/cart`.
- React Compiler is enabled in `next.config.ts`, so the app intentionally avoids `useMemo`, `useCallback`, and `React.memo`.

## Performance Optimizations

- `cacheComponents: true` enables the Next.js 16 cache model across the app.
- Home, listing, and detail pages use page-level `"use cache"` with `cacheLife('hours' | 'minutes')`.
- Product APIs add `cacheTag()` so cart/admin-style mutations can invalidate downstream reads intentionally.
- Root layout injects Speculation Rules for product prerendering and broad conservative prefetching.
- Product cards and detail imagery use explicit dimensions and responsive `sizes`.
- The cart drawer stays mounted in `<Activity>` to avoid remount work and keep interactions feeling immediate.
- Review content streams through `Suspense` on the product detail page instead of blocking the shell.

## Caching Map

| Data | Directive | Profile | Tag | Invalidation |
| --- | --- | --- | --- | --- |
| Home featured products | `"use cache"` | `hours` | `products` | `revalidateTag('products', 'max')` when needed |
| Product listing | `"use cache"` | `minutes` | `products` | `revalidateTag('products', 'max')` |
| Product detail | `"use cache"` | `hours` | `product-{id}`, `products` | `revalidateTag('product-{id}', 'max')` |
| Categories | `"use cache"` | `days` | `categories` | rare/manual |
| Cart | no cache | request time | `cart-user-{id}` | `updateTag('cart-user-{id}')` |
| Auth/session | no cache | request time | none | cookie mutation + redirect |

## Trade-offs & Known Limitations

- DummyJSON cart behavior is simulated through its REST endpoints, so cart persistence is limited by the upstream API rather than a real backend.
- The Cloudflare deployment setup is included through package/config/scripts, but advanced Worker response caching with `x-cache-status` still needs a custom OpenNext worker entry if you want full bonus parity.
- The rating filter behaves like a URL-driven refinement layered on top of the fetched dataset, which is a deliberate compromise to keep the server-only data rule intact without adding a bespoke search backend.

## Bonus Tasks

- Streaming reviews: implemented on `/products/[id]` with `Suspense` and a delayed async server component.
- Cloudflare deployment: `@opennextjs/cloudflare`, `wrangler.toml`, and `pnpm cf:build` / `pnpm cf:deploy` scripts are included.
- Accessibility/testing: Vitest plus Testing Library cover `ProductCard`, `ProductThumb`, `useDebounce`, and `formatPrice`.

## Verification

- `pnpm lint`
- `pnpm test:coverage`
- `pnpm build`
