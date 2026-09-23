# The Men's Formula

Production baseline built with Next.js 16 App Router, React 19, TypeScript strict mode, Tailwind CSS 4, and Supabase.

## Setup

1. Copy `.env.example` to `.env.local` and provide the public Supabase URL and publishable key.
2. Run `volta run --pnpm 11.27.0 pnpm dev`.

`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is safe to expose. Never add a Supabase secret or service-role key to a `NEXT_PUBLIC_` variable or client component.

## Architecture

- `src/app`: App Router pages and external Route Handlers.
- `src/actions`: Server Actions for internal mutations; inputs are validated with Zod.
- `src/components`: reusable UI components, Server Components by default.
- `src/lib/supabase/client.ts`: browser-only Supabase client.
- `src/lib/supabase/server.ts`: server client using request cookies.
- `src/proxy.ts`: refreshes Supabase Auth cookies with `getClaims()` before routes render.
- `src/lib/supabase/auth.ts`: trusted server-side identity checks with verified JWT claims.
- `src/types/database.ts`: generated-shaped database types. Regenerate it after schema changes.

Always authorize inside Server Actions and Route Handlers; `proxy.ts` only maintains the authentication cookie. Enable RLS and add explicit policies to every table or storage bucket exposed through Supabase.

## Commands

- `pnpm lint` — ESLint 9
- `pnpm format` — checks Prettier with Tailwind class ordering
- `pnpm format:fix` — applies formatting
- `pnpm type-check` — strict TypeScript validation
- `pnpm check-all` — type-check, lint, and formatting checks
- `pnpm fix-all` — formatting, lint, and snapshot updates
- `pnpm supabase:types` — generates public-schema types safely
- `pnpm test` — Vitest + React Testing Library
- `pnpm test:e2e` — Playwright
- `pnpm build` — production build

Install Playwright browsers once with `pnpm exec playwright install`.

## Catálogo

The public catalog is sourced from `categories`, `brands`, `products`, and
`product_images` in Supabase. The versioned foundation and the initial 66
products are in `supabase/migrations/`. Public read access is protected by RLS;
there is deliberately no anonymous write policy.

- `pnpm catalog:generate-migration <excel> <migration> [preview-json]` builds
  the seed migration from the supplier workbook.
- `pnpm catalog:prepare-images <source-images> <excel> <public-output> [manifest]`
  finds, rotates, resizes, and converts matched products to 1200px WebP.
- `pnpm catalog:upload-images <prepared-images>` uploads the optimized output
  to `products/<product-id>/main.webp` and updates the database. It requires
  `SUPABASE_SERVICE_ROLE_KEY` locally; never expose that value in the browser.

`NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_CONTACT_EMAIL`, and
`NEXT_PUBLIC_INSTAGRAM_URL` centralize commercial contact details. Configure
them before using the consultation flow in production.
