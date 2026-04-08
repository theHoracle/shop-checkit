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

## OpenNext Cloudflare Cache Mapping

- Next.js `cache: "force-cache"` and server-side cache APIs such as `"use cache"` are mapped by OpenNext onto its incremental cache layer in the Workers runtime. In practice, that means OpenNext stores cacheable RSC/fetch artifacts through the configured `incrementalCache` adapter rather than through browser memory.
- Next.js time-based revalidation such as `next: { revalidate: 60 }` or cache profiles like `cacheLife("minutes")` depend on that same incremental cache layer plus OpenNext's Cloudflare revalidation plumbing. On Cloudflare, those entries are meant to live in the configured persistent backend and be refreshed when their TTL expires.
- Next.js `cache: "no-store"` bypasses the OpenNext incremental cache and always executes at request time in the Worker.
- Tag/path invalidation APIs such as `revalidateTag()` and `revalidatePath()` are not just browser hints on Cloudflare. OpenNext maps them to Worker-side cache metadata/invalidation infrastructure, which is why persistent cache storage matters if you want those semantics to survive across requests and deployments.
- For this assessment repo, persistent OpenNext cache storage is intentionally not enabled yet: `r2IncrementalCache` is left commented out in `open-next.config.ts` because the current Cloudflare account cannot enable R2 without billing being active.

## Cloudflare Listing Edge Cache

- The `/products` HTML response is wrapped by a custom Cloudflare worker entry in `custom-worker.ts`.
- That worker uses `caches.default` to store listing page responses for 5 minutes and stamps `x-cache-status: MISS` on the first render and `x-cache-status: HIT` on subsequent edge-cache hits.
- The cache key varies by full listing URL plus a hashed `sessionUser` cookie value so search/filter URLs stay distinct and authenticated users do not receive another shopper's cached shell.
- Because this edge layer sits in front of the generated OpenNext worker, it is separate from OpenNext's incremental cache. The response cache is for HTML page delivery; the incremental cache is for Next/OpenNext fetch and RSC caching semantics.
- Example verification:

```bash
curl -s -D - -o /dev/null "https://shop-checkit-assessment.thehoraclestudio.xyz/products" | grep -i x-cache-status
curl -s -D - -o /dev/null "https://shop-checkit-assessment.thehoraclestudio.xyz/products?page=2&category=beauty" | grep -i x-cache-status
```

The second request to the same URL should show `x-cache-status: HIT` when the Workers cache entry is warm.

## Trade-offs & Known Limitations

- DummyJSON cart behavior is simulated through its REST endpoints, so cart persistence is intentionally handled client-side in this app instead of pretending the API is durable.
- OpenNext persistent cache storage is not enabled yet because the current Cloudflare account cannot turn on R2 without billing being active. During preview/deploy, OpenNext's own incremental cache therefore remains on the dummy adapter until billing is available.
- The rating filter behaves like a URL-driven refinement layered on top of the fetched dataset, which is a deliberate compromise to keep the server-only data rule intact without adding a bespoke search backend.

## If We Had More Time

The next feature I would add is a personalized discovery layer built around `recently viewed` and `similar products`.

- It would improve the site immediately without changing the core shopping flow, because the current catalog and detail experience already has the right data to support stronger merchandising.
- It fits the existing architecture well: recently viewed products can live in persisted client state beside the cart, while similar products can be rendered on the server from category and rating data.
- It would make the product detail page and cart page feel much more complete by giving shoppers a natural “what next?” path instead of a dead end after a single product view.

## Bonus Tasks

- Streaming reviews: implemented on `/products/[id]` with `Suspense` and a delayed async server component.
- Cloudflare deployment: `@opennextjs/cloudflare`, `wrangler.jsonc`, and `pnpm cf:build` / `pnpm cf:deploy` scripts are included.
- Cloudflare Workers edge caching: `/products` now adds an `x-cache-status` header from a custom worker wrapper around the OpenNext output so HIT/MISS can be checked in DevTools or with `curl`.
- OpenNext cache mapping is documented above, including the current limitation that persistent R2-backed incremental cache storage is still pending Cloudflare billing activation.
- Accessibility/testing: Vitest plus Testing Library cover `ProductCard`, `ProductThumb`, `useDebounce`, and `formatPrice`.

## Verification

- `pnpm lint`
- `pnpm test:coverage`
- `pnpm build`
