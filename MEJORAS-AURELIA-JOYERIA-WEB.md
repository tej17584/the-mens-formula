# Mejoras Aurelia Joyería Web — contexto completo para porting

Documento generado para replicar trabajo en otro repositorio (p. ej. **The Men's Formula** u otra tienda Next.js + Supabase).

**Origen:** `aurelia-joyeria-web` (rama `develop`, commits ~SEO → admin → catálogo → fixes, incl. `6094fd1`, `ec82a52`, `5a46d1e`, `fd46c90`, `96d1d39`).

**Repo origen local:** `C:\Users\josea\Desktop\AureliaJoyeria\aurelia-joyeria-web`  
**Producción:** `https://www.aurelia-joyeria.store`  
**Supabase (prod):** proyecto *Aurelia-joyeria* (`uemfrvliloktzzmrrboe`)

---

## 1. Qué es el proyecto

| Pieza | Tecnología |
|--------|------------|
| Storefront + Admin | Next.js 16 App Router, React 19 |
| BD + Auth admin | Supabase (Postgres, RLS, Storage bucket `products`) |
| Deploy | Vercel |
| UI admin/storefront | shadcn/base-nova, Tailwind, i18n `es.json` |
| Errores | Sentry (DSN en `sentry.*.config.ts`) |

**Admin:** `/admin` — productos, categorías, materiales, marcas, contenido inicio, mensajes, configuración.  
**Storefront:** `/`, `/catalogo`, `/outlet`, `/producto/[slug]`, `/sobre`, contacto, etc.

---

## 2. SEO, marca y confianza (storefront)

### Objetivo

Diferenciar **Aurelia Joyería GT** (Guatemala) de otras marcas “Aurelia”; mejorar indexación y señales locales.

### Cambios realizados

- Texto visible **Guatemala / GT** en hero, footer, catálogo, contacto.
- Página **`/sobre`** con bloque de marca y enlaces oficiales (Instagram `@aureliajoyeria_gt`).
- **Sitemap**, metadatos por ruta, **JSON-LD** tipo `JewelryStore`.
- **Google Search Console:** meta `google-site-verification`; sitemap enviado (snippets en Google pueden tardar en actualizarse).
- Wordmark **GT**, menú **Sobre**, H1 alineado a “Aurelia Joyería GT”.
- Config canónica: `src/config/site.ts` (`siteSeoBrand`, `productionUrl`, keywords GT).

### Archivos de referencia

```
src/config/site.ts
src/lib/seo/*
src/app/sitemap.ts
src/components/about/*
src/components/home/brand-about-section.tsx
src/components/layout/storefront-shell.tsx
```

### Al portar a otro repo

- Sustituir `siteSeoBrand`, dominio, keywords, redes y textos legales.
- Mantener el patrón: JSON-LD + sitemap + página “Sobre” + verificación GSC.

---

## 3. UI y diseño — Panel admin

### 3.1 Inicio admin (antes vs después)

**Antes:** cuadrícula de 6 tarjetas solo con números (totales, activos, inactivos, destacados, outlet, mensajes).

**Después** (`src/components/admin/admin-dashboard.tsx` + shadcn `Card`):

1. **Cabecera:** subtítulo + **Nuevo producto** + **Ver tienda** (abre `/catalogo` público).
2. **3 KPIs** con icono, hint y enlace: total inventario, activos, mensajes nuevos.
3. **Acciones rápidas:** nuevo producto, inventario, contenido inicio, mensajes.
4. **Pendientes** (clicables): sin fotos, mensajes nuevos, inactivos, sin stock, límite destacados (10).
5. **Mensajes recientes** y **productos recientes** con enlaces.
6. Mini resumen: inactivos / destacados (x/10) / outlet.

**Datos:** `src/app/admin/(protected)/page.tsx` (queries Supabase).  
**Textos:** `admin.dashboard.*` en `src/i18n/messages/es.json`.

### 3.2 Formulario de producto

- Sección **Eliminar producto** (confirmación, borra Storage + fila).
- Checkboxes **Activo / Destacado / Outlet** con `AdminFormCheckbox` (mismo patrón que categorías).

### 3.3 Flash admin

- `admin-flash-banner.tsx`: `product-deleted`, `updated`, `saved`, errores de categoría en uso, etc.

---

## 4. UI y diseño — Catálogo (cliente)

### 4.1 Destacados

| Concepto | Significado |
|----------|-------------|
| **Destacado** (`is_featured`) | Flag en admin; máx. **10** productos |
| **Relevancia** (orden) | Solo orden en listado; **no** filtra destacados |

**Problema corregido:** “Ver destacados” en home iba a `/catalogo` sin filtro.

**Solución:**

- Home → `/catalogo?destacados=1`
- Título catálogo: **“Piezas destacadas”** + descripción cliente.
- Filtro lateral **“Solo destacados”** (paridad con Outlet).
- Chip **Destacados** en filtros activos; se puede quitar con X o “Limpiar filtros”.

**Copy (cliente, no admin):**

- Filtro: *“Nuestra selección favorita para regalar o estrenar”*
- Descripción listado: *“Piezas que Aurelia recomienda hoy…”*

### 4.2 Outlet (referencia)

- Home → **`/outlet`** (página dedicada).
- Catálogo: checkbox **Solo Outlet** → `?outlet=1`.

### 4.3 Límites destacados

| Dónde | Límite |
|--------|--------|
| Admin al marcar destacado | **10** (`MAX_FEATURED_PRODUCTS`) |
| Home (`getFeaturedProducts`) | Hasta **10** visibles |
| Catálogo `?destacados=1` | Todos los destacados visibles (≤ 10) |
| Catálogo completo | Sin límite; **20** productos/página |

**Home UI:** si hay **> 4** destacados → carrusel; si no → rejilla (`FEATURED_CAROUSEL_MIN_ITEMS = 4`).

### Archivos catálogo destacados

```
src/lib/catalog/catalog-href.ts          # destacados en query string
src/components/catalog/catalog-filter-shared.ts
src/components/catalog/catalog-filter-controls.tsx   # FeaturedFilter
src/components/catalog/catalog-active-filters.tsx
src/app/(storefront)/catalogo/page.tsx
src/app/(storefront)/page.tsx            # href="/catalogo?destacados=1"
src/lib/queries/catalog.ts               # options.featured → eq is_featured
src/lib/products/featured-limits.ts
```

---

## 5. Funcionalidad — Productos, URLs y códigos AUR

### 5.1 Slug estable

- **Crear:** slug desde nombre; si conflicto → `nombre-xxxxxxxx` (8 chars UUID).
- **Editar:** slug **no** se recalcula (enlaces y WhatsApp estables).
- Implementación: `src/app/admin/actions.ts` (`resolveProductSlug`, rama `updateId`).

### 5.2 Lookup y redirección canónica

- URL: `/producto/{slug}` o `/producto/AUR-10000028`.
- Entrada por código → **301** al slug bonito.
- `src/lib/catalog/product-lookup.ts`, `src/lib/queries/catalog.ts`.
- Test: `tests/catalog/product-lookup.test.mjs`.

### 5.3 Códigos `public_code` unificados

**Problema:** catálogo importado `AUR-10000001…54`; productos nuevos salían `AUR-000019`, `AUR-000020` (secuencia corta).

**Migración:** `supabase/migrations/20260929003000_unify_product_public_codes.sql`

- Remapea códigos `< 10000001` al siguiente hueco del rango alto.
- `setval` de `product_public_code_seq` al máximo actual.
- Siguiente producto nuevo: ~`AUR-10000057` (según estado de BD).

**Regla admin:** máx. 10 destacados; secuencia no reutiliza códigos borrados.

### 5.4 Eliminar producto

- `deleteProduct` en `actions.ts`: borra imágenes en Storage, luego fila `products` (cascade `product_images`, `product_internal`).
- UI: bloque rojo al final de `product-form.tsx`.
- Redirect: `/admin/products?status=product-deleted`.

### 5.5 Guardar producto (bugs corregidos)

**Síntomas:** precios, outlet, activo, destacado no persistían o al recargar se veía mal.

**Causas y fixes:**

| Fix | Detalle |
|-----|---------|
| `AdminFormCheckbox` | Envío correcto de `on` / ausente en FormData |
| `redirect()` servidor | Tras guardar, no solo `router.replace` en cliente |
| Key formulario | `productId:updated_at` para remontar defaults |
| `normalizeProductPayload` | Si `!is_outlet` → `outlet_price = null` |
| Precios en edit | `Number()` desde Supabase en edit page |
| `revalidatePath` | Incluye `/admin/products/{id}/edit` |

**Módulo:** `src/lib/admin/product-form-values.ts`  
**Tests:** `tests/admin/product-form-values.test.mjs` (`pnpm test:admin`)

---

## 6. Bugs y UX — Listado admin inventario

### 6.1 Activar / desactivar y URL del buscador

**Problema:** redirect  
`/admin/products?q=van&page=2` + `?status=updated`  
→ URL inválida; el campo **búsqueda** a veces mostraba `updated` o basura.

**Fix:**

- `withAdminPathQuery()` en `src/lib/admin/products-list.ts`
- `parseAdminProductsSearchParams()` — `status` solo para flash, no para filtros
- `toggleProduct` usa `withAdminPathQuery(..., { status: "updated" })`

**Test:** `tests/admin/products-list.test.mjs`

### 6.2 i18n

- Edit product usaba `admin.product.invalidFile` → clave real: **`admin.images.invalidFile`**.

### 6.3 TypeScript / build

- Dashboard: tipo `DashboardLabels` sin campo `images` fantasma.
- Commit `6094fd1` — Sentry 401 (ver §8).

---

## 7. Base de datos y migraciones

### Migraciones relevantes (revisar carpeta completa)

| Migración | Propósito |
|-----------|-----------|
| `20260928220000_site_settings_selling_copy.sql` | `selling_heading`, `selling_subheading` |
| `20260929003000_unify_product_public_codes.sql` | Unificar AUR al rango 100000xx |
| Schema base | `products`, `product_internal`, `product_images`, RLS admin |
| `20260926204848_grant_admin_product_code_sequence.sql` | Secuencia códigos en create |

### Fallback runtime

- `getSiteSettings()` en `src/lib/queries/site.ts`: si columna faltante (42703), fallback sin romper storefront.

### Constraints útiles

- `products_outlet_requires_price`: si `is_outlet` → `outlet_price` NOT NULL.
- `public_code` UNIQUE, patrón `^AUR-[0-9]{6,}$`.

---

## 8. Build, Sentry y observabilidad

### Error en Vercel

```
Failed to create release: 401 Unauthorized
runAfterProductionCompile (@sentry/nextjs)
```

**Causa:** `SENTRY_AUTH_TOKEN` en Vercel inválido o sin permisos, pero el hook de build intentaba release + source maps.

### Fix (`next.config.ts`)

- **Runtime Sentry** sigue (instrumentation + DSN).
- **Subida en build opt-in:**  
  `SENTRY_RELEASE_UPLOAD=true` **y** `SENTRY_AUTH_TOKEN` válido.
- Si no → export `nextConfig` sin `withSentryConfig` → sin 401 en build.

**`.env.example` actualizado.**

### Otros

- `@vercel/speed-insights` en `src/app/layout.tsx`
- CSP: Supabase, Sentry, Vercel Analytics en headers

---

## 9. Seguridad e infra (contexto operativo)

- **Vercel Firewall:** rate limit en `/admin` y `/api/`; evitar Challenge en POST login si bloquea sesión.
- **RLS:** políticas “Admins can manage products” etc.
- **Admin session:** `requireAdmin`, tabla `admin_users`.

---

## 10. Tests

```bash
pnpm test:catalog   # tests/catalog/product-lookup.test.mjs
pnpm test:admin     # tests/admin/product-form-values.test.mjs
                    # tests/admin/products-list.test.mjs
```

---

## 11. Mapa de archivos para copiar (porting)

Copiar y adaptar nombres de marca / rutas según el proyecto destino.

### Admin

```
src/components/admin/admin-dashboard.tsx
src/components/admin/admin-flash-banner.tsx
src/components/admin/product-form.tsx
src/components/admin/admin-form-controls.tsx    # AdminFormCheckbox
src/app/admin/(protected)/page.tsx
src/app/admin/actions.ts
src/lib/admin/product-form-values.ts
src/lib/admin/products-list.ts
src/components/ui/card.tsx                      # shadcn Card
```

### Storefront catálogo / home

```
src/app/(storefront)/page.tsx
src/app/(storefront)/catalogo/page.tsx
src/lib/catalog/catalog-href.ts
src/components/catalog/catalog-filter-shared.ts
src/components/catalog/catalog-filter-controls.tsx
src/components/catalog/catalog-active-filters.tsx
src/lib/queries/catalog.ts
src/lib/products/featured-limits.ts
```

### Producto / URLs

```
src/app/(storefront)/producto/[slug]/page.tsx
src/lib/catalog/product-lookup.ts
```

### Config / build / i18n

```
next.config.ts
.env.example
src/i18n/messages/es.json    # admin.dashboard.*, catalog.featured*
```

### Supabase

```
supabase/migrations/20260929003000_unify_product_public_codes.sql
(+ migraciones SEO/settings que necesites)
```

### Tests

```
tests/admin/*
tests/catalog/product-lookup.test.mjs
package.json                 # scripts test:admin, test:catalog
```

---

## 12. Variables de entorno

| Variable | Uso |
|----------|-----|
| `NEXT_PUBLIC_SITE_URL` | SEO, OG, sitemap |
| `NEXT_PUBLIC_SUPABASE_URL` | Cliente + imágenes |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Cliente |
| `SUPABASE_SERVICE_ROLE_KEY` | Solo scripts locales (no commit) |
| `SENTRY_AUTH_TOKEN` | Opcional; source maps |
| `SENTRY_RELEASE_UPLOAD=true` | Activa subida Sentry en build |
| `GOOGLE_SITE_VERIFICATION` | Meta GSC (si aplica) |

---

## 13. Cómo portar a otro repositorio

### A) Mismo linaje Git (fork / copia Aurelia)

```bash
git log develop --oneline
git cherry-pick <hash1> <hash2> ...
# o
git format-patch main..develop -o ./patches
# en el otro repo:
git am ./patches/*.patch
```

Luego: `supabase db push` o aplicar migraciones en el Supabase del nuevo proyecto.

### B) Proyecto distinto (p. ej. The Men's Formula)

1. Copiar bloques del §11.
2. Reemplazar `src/config/site.ts`, textos `es.json`, org/proyecto Sentry en `next.config.ts`.
3. Ajustar categorías/materiales/migraciones seed.
4. **No** copiar datos de producción Aurelia (productos, imágenes, mensajes).

### C) Checklist post-port

- [ ] Migraciones aplicadas en Supabase destino
- [ ] Env vars en Vercel
- [ ] Probar: crear/editar producto, outlet, destacados (límite 10)
- [ ] Probar: `/catalogo?destacados=1`, toggle activo en listado admin
- [ ] Probar: guardar producto y recargar; eliminar producto prueba
- [ ] Build Vercel sin Sentry 401 (o con token válido + `SENTRY_RELEASE_UPLOAD`)

---

## 14. Commits de referencia (develop)

```
6094fd1 Fixing 401
ec82a52 fixes de admin
5a46d1e Fixing issues
ebb8a23 Update
fd46c90 nuevo admin
96d1d39 Fixing issues en el catalogo
4c1a3ad Speed insights
a64266d Fixing error builds
3fff74c google site verification
1cc870f mejoras en SEO
… (rama SEO, security, admin imágenes, etc.)
```

Para diff completo en el momento del port:

```bash
cd aurelia-joyeria-web
git diff main...develop --stat
```

---

## 15. Glosario rápido

| Término | Significado |
|---------|-------------|
| **Destacado** | `is_featured`; aparece en home (≤10) y filtro `destacados=1` |
| **Outlet** | `is_outlet` + precio outlet; página `/outlet` |
| **Slug** | URL `/producto/mi-anillo`; estable al editar |
| **public_code** | `AUR-10000042`; identificador cliente/WhatsApp |
| **Flash `status`** | Query `?status=saved` en admin; no es filtro de búsqueda |

---

## 16. Notas para The Men's Formula

Al usar este doc en `the-mens-formula`:

1. Decidir si comparten **misma arquitectura** (Next + Supabase + admin similar) o solo ideas de UX.
2. Renombrar marca, colores (`aurelia-*` → tokens del nuevo diseño).
3. Revisar si el negocio usa **destacados** y **outlet** con las mismas reglas (10 destacados es decisión de Aurelia).
4. Guardar este archivo en el repo destino y enlazar PRs que implementen cada sección.

---

*Última actualización del documento: contexto de sesión de desarrollo Aurelia Joyería (admin dashboard, catálogo destacados, productos, AUR, Sentry build).*
