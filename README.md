# Shop Checkit

Editorial e-commerce storefront for the DummyJSON assessment, built with Next.js 16 App Router, Cache Components, Server Actions, and a warm luxury-inspired design system.

## Setup

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Start development server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build
```

## Architecture Decisions

- `globalFetch` in `src/lib/fetch/globalFetch.ts` centralizes transport concerns: JSON normalization, auth header attachment, 401 refresh retry, and typed `FetchError` handling.
- Cached catalog reads live in `src/lib/api/products.ts` with `"use cache"`, `cacheLife()`, and `cacheTag()`; auth and cart endpoints stay uncached because they depend on request-time state.
- Auth uses Server Actions plus httpOnly cookies. `loginAction` writes `accessToken`, `refreshToken`, and a serialized session user cookie; `logoutAction` clears them and redirects.
- Cart state lives entirely in a persisted Zustand store because DummyJSON cart mutations are simulated and do not persist upstream. The UI still feels immediate, but persistence is intentionally browser-local.
- `src/proxy.ts` guards `/cart` before rendering and redirects unauthenticated requests to `/login?redirect=/cart`.
- React Compiler is enabled in `next.config.ts`, so the app intentionally avoids `useMemo`, `useCallback`, and `React.memo`.

## Performance Optimizations

- `cacheComponents: true` enables the Next.js 16 cache model across the app.
- Home, listing, and detail pages use page-level `"use cache"` with `cacheLife('hours' | 'minutes')`.
- Product APIs add `cacheTag()` so cart/admin-style mutations can invalidate downstream reads intentionally.
- Root layout injects Speculation Rules for product prerendering and broad conservative prefetching.
- Product cards and detail imagery use explicit dimensions and responsive `sizes`.
- The cart drawer stays mounted in `<Activity>` to avoid remount work and keep interactions feeling immediate.
- The cart store rehydrates from local storage, so cart state survives refreshes and return visits in the same browser.
- Review content streams through `Suspense` on the product detail page instead of blocking the shell.

## Caching Map

| Data | Directive | Profile | Tag | Invalidation |
| --- | --- | --- | --- | --- |
| Home featured products | `"use cache"` | `hours` | `products` | `revalidateTag('products', 'max')` when needed |
| Product listing | `"use cache"` | `minutes` | `products` | `revalidateTag('products', 'max')` |
| Product detail | `"use cache"` | `hours` | `product-{id}`, `products` | `revalidateTag('product-{id}', 'max')` |
| Categories | `"use cache"` | `days` | `categories` | rare/manual |
| Cart | browser-local Zustand | persisted client state | none | local updates only |
| Auth/session | no cache | request time | none | cookie mutation + redirect |

## Trade-offs & Known Limitations

- DummyJSON cart behavior is simulated through its REST endpoints, so cart persistence is intentionally handled client-side in this app instead of pretending the API is durable.
- The Cloudflare deployment setup is included through package/config/scripts, but advanced Worker response caching with `x-cache-status` still needs a custom OpenNext worker entry if you want full bonus parity.
- The rating filter behaves like a URL-driven refinement layered on top of the fetched dataset, which is a deliberate compromise to keep the server-only data rule intact without adding a bespoke search backend.

## If We Had More Time

The next feature I would add is a personalized discovery layer built around `recently viewed` and `similar products`.

- It would improve the site immediately without changing the core shopping flow, because the current catalog and detail experience already has the right data to support stronger merchandising.
- It fits the existing architecture well: recently viewed products can live in persisted client state beside the cart, while similar products can be rendered on the server from category and rating data.
- It would make the product detail page and cart page feel much more complete by giving shoppers a natural “what next?” path instead of a dead end after a single product view.

## Bonus Tasks

- Streaming reviews: implemented on `/products/[id]` with `Suspense` and a delayed async server component.
- Cloudflare deployment: `@opennextjs/cloudflare`, `wrangler.toml`, and `pnpm cf:build` / `pnpm cf:deploy` scripts are included.
- Accessibility/testing: Vitest plus Testing Library cover `ProductCard`, `ProductThumb`, `useDebounce`, and `formatPrice`.

## Verification

- `pnpm lint`
- `pnpm test:coverage`
- `pnpm build`
