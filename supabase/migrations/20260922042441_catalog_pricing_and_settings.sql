-- Generated from Detalle de 7 productos The Mens Formula.xlsx. Maps values by normalized header names, never positions.

alter table public.products
  add column if not exists detail_points text[] not null default array[]::text[],
  add column if not exists consumer_price numeric(14, 2),
  add column if not exists price_3_plus numeric(14, 2),
  add column if not exists price_6_plus numeric(14, 2),
  add column if not exists box_price numeric(14, 2);

create table if not exists public.product_internal (
  product_id uuid primary key references public.products(id) on delete cascade,
  distributor_unit_price numeric(14, 8),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id smallint primary key default 1 check (id = 1),
  whatsapp_number text,
  whatsapp_product_message text not null default 'Hola, me interesa "{{product_name}}". Quisiera más información sobre este producto. {{product_url}}',
  updated_at timestamptz not null default now()
);

alter table public.product_internal enable row level security;
alter table public.site_settings enable row level security;

drop trigger if exists product_internal_set_updated_at on public.product_internal;
create trigger product_internal_set_updated_at before update on public.product_internal for each row execute function public.set_updated_at();
drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at before update on public.site_settings for each row execute function public.set_updated_at();

revoke all on public.product_internal from anon, authenticated;
revoke all on public.products from anon, authenticated;
grant select (id, name, slug, description, short_description, detail_points, category_id, brand_id, consumer_price, price_3_plus, price_6_plus, box_price, main_image_url, is_active, is_available, featured, is_new, color, model, specifications, created_at, updated_at) on public.products to anon, authenticated;
grant select on public.site_settings to anon, authenticated;

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings" on public.site_settings for select to anon, authenticated using (true);

insert into public.site_settings (id) values (1) on conflict (id) do nothing;

update public.products set
  description = 'Colonia para después del afeitado que refresca, hidrata y suaviza la piel.',
  short_description = 'Colonia para después del afeitado que refresca, hidrata y suaviza la piel.',
  detail_points = array['Fragancia MIDNIGHT con notas de limón, menta y verbena de la India.', 'Ideal para finalizar el afeitado dejando una sensación fresca y perfumada.']::text[],
  consumer_price = 99,
  price_3_plus = 80,
  price_6_plus = 69,
  box_price = null,
  price = 99
where slug = 'level3-after-shave-midnight';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 45 from public.products where slug = 'level3-after-shave-midnight'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Colonia para después del afeitado que refresca, hidrata y suaviza la piel.',
  short_description = 'Colonia para después del afeitado que refresca, hidrata y suaviza la piel.',
  detail_points = array['Fragancia FRESH con notas de bergamota de Calabria y pimienta.', 'Ayuda a calmar la piel después del afeitado y deja un aroma limpio y elegante.']::text[],
  consumer_price = 99,
  price_3_plus = 80,
  price_6_plus = 69,
  box_price = null,
  price = 99
where slug = 'level3-after-shave-fresh';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 45 from public.products where slug = 'level3-after-shave-fresh'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Colonia para después del afeitado que refresca, hidrata y suaviza la piel.',
  short_description = 'Colonia para después del afeitado que refresca, hidrata y suaviza la piel.',
  detail_points = array['Fragancia FROST con notas de nuez moscada, vainilla, bayas de enebro y maderas ambaradas.', 'Aporta frescura y una terminación aromática intensa.']::text[],
  consumer_price = 99,
  price_3_plus = 80,
  price_6_plus = 69,
  box_price = null,
  price = 99
where slug = 'level3-after-shave-frost';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 45 from public.products where slug = 'level3-after-shave-frost'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Colonia para después del afeitado que refresca, hidrata y suaviza la piel.',
  short_description = 'Colonia para después del afeitado que refresca, hidrata y suaviza la piel.',
  detail_points = array['Fragancia ROYALE con notas de pomelo, jengibre, ambrox y cítricos.', 'Ideal para completar el servicio de afeitado con un aroma moderno y sofisticado.']::text[],
  consumer_price = 99,
  price_3_plus = 80,
  price_6_plus = 69,
  box_price = null,
  price = 99
where slug = 'level3-after-shave-royale';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 45 from public.products where slug = 'level3-after-shave-royale'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Colonia para después del afeitado que refresca, hidrata y suaviza la piel.',
  short_description = 'Colonia para después del afeitado que refresca, hidrata y suaviza la piel.',
  detail_points = array['Fragancia AQUA con notas de pomelo, limón, menta y pimienta rosa.', 'Brinda una sensación fresca y revitalizante después del afeitado.']::text[],
  consumer_price = 99,
  price_3_plus = 80,
  price_6_plus = 69,
  box_price = null,
  price = 99
where slug = 'level3-after-shave-aqua';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 45 from public.products where slug = 'level3-after-shave-aqua'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Colonia para después del afeitado que refresca, hidrata y suaviza la piel.',
  short_description = 'Colonia para después del afeitado que refresca, hidrata y suaviza la piel.',
  detail_points = array['Fragancia VIBRANT con notas verdes, pomelo, especias, bergamota, lavanda y petitgrain.', 'Deja la piel suave, fresca y agradablemente perfumada.']::text[],
  consumer_price = 99,
  price_3_plus = 80,
  price_6_plus = 69,
  box_price = null,
  price = 99
where slug = 'level3-after-shave-vibrant';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 45 from public.products where slug = 'level3-after-shave-vibrant'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Colonia para después del afeitado que refresca, hidrata y suaviza la piel.',
  short_description = 'Colonia para después del afeitado que refresca, hidrata y suaviza la piel.',
  detail_points = array['Fragancia ROSÉ con notas de maracuyá, melocotón y frambuesa.', 'Ofrece un aroma frutal y fresco para finalizar el afeitado.']::text[],
  consumer_price = 99,
  price_3_plus = 80,
  price_6_plus = 69,
  box_price = null,
  price = 99
where slug = 'level3-after-shave-rose';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 45 from public.products where slug = 'level3-after-shave-rose'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Gel de afeitar transparente y sin espuma para lograr mayor precisión durante el rasurado.',
  short_description = 'Gel de afeitar transparente y sin espuma para lograr mayor precisión durante el rasurado.',
  detail_points = array['Su fórmula permite ver claramente la zona de trabajo, lubrica e hidrata la piel y ayuda a reducir la irritación y los pequeños cortes.', 'Fragancia AQUA.']::text[],
  consumer_price = 99,
  price_3_plus = 80,
  price_6_plus = 69,
  box_price = null,
  price = 99
where slug = 'level3-shaving-gel-aqua';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 59 from public.products where slug = 'level3-shaving-gel-aqua'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Gel de afeitar transparente y sin espuma para lograr mayor precisión durante el rasurado.',
  short_description = 'Gel de afeitar transparente y sin espuma para lograr mayor precisión durante el rasurado.',
  detail_points = array['Facilita el deslizamiento de la cuchilla, protege e hidrata la piel y permite delineados precisos al mantener visible la zona de afeitado.', 'Fragancia ICE.']::text[],
  consumer_price = 99,
  price_3_plus = 80,
  price_6_plus = 69,
  box_price = null,
  price = 99
where slug = 'level3-shaving-gel-ice';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 59 from public.products where slug = 'level3-shaving-gel-ice'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Mascarilla facial peel-off de carbón para limpieza profunda de la piel.',
  short_description = 'Mascarilla facial peel-off de carbón para limpieza profunda de la piel.',
  detail_points = array['Ayuda a retirar puntos negros, suciedad, células muertas y exceso de grasa.', 'Limpia los poros y deja la piel más suave, limpia y fresca.']::text[],
  consumer_price = 90,
  price_3_plus = 85,
  price_6_plus = 78,
  box_price = null,
  price = 90
where slug = 'level3-black-mask';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 49 from public.products where slug = 'level3-black-mask'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Mascarilla facial peel-off con arcilla de caolín para purificar y suavizar la piel.',
  short_description = 'Mascarilla facial peel-off con arcilla de caolín para purificar y suavizar la piel.',
  detail_points = array['Ayuda a remover impurezas y puntos negros, absorbe el exceso de grasa y favorece una apariencia más limpia, equilibrada y luminosa.']::text[],
  consumer_price = 90,
  price_3_plus = 85,
  price_6_plus = 78,
  box_price = null,
  price = 90
where slug = 'level3-pink-mask';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 49 from public.products where slug = 'level3-pink-mask'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Shampoo y acondicionador 2 en 1 con queratina para limpiar y acondicionar en un solo paso.',
  short_description = 'Shampoo y acondicionador 2 en 1 con queratina para limpiar y acondicionar en un solo paso.',
  detail_points = array['Ayuda a suavizar, controlar el frizz y mejorar el brillo y la manejabilidad del cabello.', 'Apto para todo tipo de cabello y práctico para uso profesional o en casa.']::text[],
  consumer_price = 120,
  price_3_plus = 108,
  price_6_plus = 100,
  box_price = null,
  price = 120
where slug = 'level3-shampoo-2en-1';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 59 from public.products where slug = 'level3-shampoo-2en-1'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Gel con color negro para peinar y cubrir temporalmente canas o cabellos blancos.',
  short_description = 'Gel con color negro para peinar y cubrir temporalmente canas o cabellos blancos.',
  detail_points = array['Proporciona color negro de aspecto natural, fijación fuerte, volumen, textura y brillo.', 'Fórmula a base de agua, sin escamas y fácil de retirar con el lavado.']::text[],
  consumer_price = 99,
  price_3_plus = 85,
  price_6_plus = 69,
  box_price = null,
  price = 99
where slug = 'level3-tinted-gel';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 49 from public.products where slug = 'level3-tinted-gel'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Polvo texturizante para aportar volumen, cuerpo y control al peinado.',
  short_description = 'Polvo texturizante para aportar volumen, cuerpo y control al peinado.',
  detail_points = array['Se aplica directamente en raíces o cabello seco para crear textura y elevar el cabello sin necesidad de productos pesados.', 'Ideal para estilos con volumen y acabado natural.']::text[],
  consumer_price = 110,
  price_3_plus = 95,
  price_6_plus = 79,
  box_price = null,
  price = 110
where slug = 'level3-styling-powder';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 59.82 from public.products where slug = 'level3-styling-powder'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Pomada de peinado para crear estilos definidos con control y brillo.',
  short_description = 'Pomada de peinado para crear estilos definidos con control y brillo.',
  detail_points = array['Ideal para peinados clásicos o pulidos.', 'Permite moldear y dar definición al cabello, proporcionando fijación y un acabado brillante de apariencia profesional.']::text[],
  consumer_price = 99,
  price_3_plus = 69,
  price_6_plus = null,
  box_price = null,
  price = 99
where slug = 'level3-pomade';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 49 from public.products where slug = 'level3-pomade'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Crema moldeadora de fijación media y brillo natural.',
  short_description = 'Crema moldeadora de fijación media y brillo natural.',
  detail_points = array['Aporta volumen y textura sin dejar el cabello rígido o pegajoso.', 'Su consistencia ligera permite remodelar el peinado y funciona especialmente bien en cabello fino o delgado.']::text[],
  consumer_price = 99,
  price_3_plus = 69,
  price_6_plus = null,
  box_price = null,
  price = 99
where slug = 'level3-forming-cream';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 49 from public.products where slug = 'level3-forming-cream'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Pasta de peinado con acabado mate y fijación firme.',
  short_description = 'Pasta de peinado con acabado mate y fijación firme.',
  detail_points = array['Aporta textura, definición y volumen sin brillo.', 'Su fórmula a base de agua es fácil de aplicar, permite retocar el estilo y se enjuaga sin dejar residuos.']::text[],
  consumer_price = 99,
  price_3_plus = 69,
  price_6_plus = null,
  box_price = null,
  price = 99
where slug = 'level3-paste';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 49 from public.products where slug = 'level3-paste'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Cera de fibra para crear textura, separación y definición en el cabello.',
  short_description = 'Cera de fibra para crear textura, separación y definición en el cabello.',
  detail_points = array['Su efecto fibroso facilita moldear estilos texturizados con control flexible.', 'Ideal para marcar mechones, aportar estructura y crear acabados modernos.']::text[],
  consumer_price = 99,
  price_3_plus = 69,
  price_6_plus = null,
  box_price = null,
  price = 99
where slug = 'level3-spider-wax';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 49 from public.products where slug = 'level3-spider-wax'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Crema de peinado diseñada para aportar brillo, control y una apariencia pulida.',
  short_description = 'Crema de peinado diseñada para aportar brillo, control y una apariencia pulida.',
  detail_points = array['Ofrece fijación duradera con flexibilidad para remodelar el cabello.', 'Su textura suave ayuda a mejorar la definición y el brillo sin dejar residuos visibles.']::text[],
  consumer_price = 99,
  price_3_plus = 69,
  price_6_plus = null,
  box_price = null,
  price = 99
where slug = 'level3-brillant-cream';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 49 from public.products where slug = 'level3-brillant-cream'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Masilla de peinado de fijación media y acabado mate.',
  short_description = 'Masilla de peinado de fijación media y acabado mate.',
  detail_points = array['Aporta volumen suave, textura ligera y control flexible.', 'Mantiene el cabello manejable y permite ajustar el peinado durante el día sin sensación pegajosa ni brillo.']::text[],
  consumer_price = 99,
  price_3_plus = 69,
  price_6_plus = null,
  box_price = null,
  price = 99
where slug = 'level3-matte-putty';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 49 from public.products where slug = 'level3-matte-putty'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Gel fuerte para peinar con fijación duradera y acabado brillante.',
  short_description = 'Gel fuerte para peinar con fijación duradera y acabado brillante.',
  detail_points = array['Aporta definición, volumen y control sin sensación grasosa.', 'Fórmula a base de agua y sin escamas, fácil de lavar y adecuada para estilos estructurados.']::text[],
  consumer_price = 75,
  price_3_plus = 70,
  price_6_plus = 65,
  box_price = null,
  price = 75
where slug = 'level3-hair-gel';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 40 from public.products where slug = 'level3-hair-gel'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Gel en crema con vitamina B5 que combina fijación media, brillo y acondicionamiento.',
  short_description = 'Gel en crema con vitamina B5 que combina fijación media, brillo y acondicionamiento.',
  detail_points = array['Ayuda a nutrir y proteger el cabello mientras aporta volumen, definición y control.', 'Fórmula a base de agua, sin escamas y adecuada para definir rizos o estilos con brillo natural.']::text[],
  consumer_price = 75,
  price_3_plus = 70,
  price_6_plus = 65,
  box_price = null,
  price = 75
where slug = 'level3-cream-gel';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 40 from public.products where slug = 'level3-cream-gel'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Mascarilla exfoliante de barro para limpiar profundamente, purificar y renovar la piel.',
  short_description = 'Mascarilla exfoliante de barro para limpiar profundamente, purificar y renovar la piel.',
  detail_points = array['Con arcilla de caolín y extracto de manzanilla.', 'Ayuda a retirar suciedad, exceso de grasa, impurezas, células muertas y puntos negros, dejando la piel más limpia y luminosa.']::text[],
  consumer_price = 120,
  price_3_plus = 100,
  price_6_plus = null,
  box_price = null,
  price = 120
where slug = 'level3-mud-scrub-mask';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 70 from public.products where slug = 'level3-mud-scrub-mask'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Polvo texturizador para peinar que aporta volumen y un acabado mate.',
  short_description = 'Polvo texturizador para peinar que aporta volumen y un acabado mate.',
  detail_points = array['Ideal para crear textura, levantar la raíz y dar cuerpo al cabello sin aspecto húmedo.', 'Se aplica en pequeñas cantidades sobre cabello seco y se moldea con los dedos.']::text[],
  consumer_price = 105,
  price_3_plus = 75,
  price_6_plus = 70,
  box_price = null,
  price = 105
where slug = 'immortal-inmortal-styling-powder';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 50 from public.products where slug = 'immortal-inmortal-styling-powder'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Sérum de cuidado para barba diseñado para suavizar, acondicionar y mejorar su apariencia.',
  short_description = 'Sérum de cuidado para barba diseñado para suavizar, acondicionar y mejorar su apariencia.',
  detail_points = array['Ayuda a mantener la barba más manejable y con aspecto cuidado, reduciendo la sensación de resequedad.', 'Aplicar unas gotas y distribuir de raíz a puntas.']::text[],
  consumer_price = 90,
  price_3_plus = 70,
  price_6_plus = null,
  box_price = null,
  price = 90
where slug = 'immortal-inmortal-beard-care-srerum';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 40 from public.products where slug = 'immortal-inmortal-beard-care-srerum'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Cera tipo pomada para moldear y controlar la barba y el bigote.',
  short_description = 'Cera tipo pomada para moldear y controlar la barba y el bigote.',
  detail_points = array['Permite ordenar cabellos rebeldes, definir la forma y dar un acabado pulido sin necesidad de usar grandes cantidades.', 'Trabajar entre las manos antes de aplicar.']::text[],
  consumer_price = 90,
  price_3_plus = 70,
  price_6_plus = null,
  box_price = null,
  price = 90
where slug = 'immortal-inmortal-beard-pomade-wax';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 40 from public.products where slug = 'immortal-inmortal-beard-pomade-wax'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Mascarilla facial negra tipo peel-off para limpieza profunda de la piel.',
  short_description = 'Mascarilla facial negra tipo peel-off para limpieza profunda de la piel.',
  detail_points = array['Ayuda a retirar impurezas, exceso de grasa y residuos superficiales, dejando una sensación de limpieza.', 'Aplicar una capa uniforme evitando ojos, labios y zonas con vello.']::text[],
  consumer_price = 85,
  price_3_plus = 72,
  price_6_plus = 69,
  box_price = null,
  price = 85
where slug = 'immortal-black-mask';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 38 from public.products where slug = 'immortal-black-mask'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Shampoo profesional de la línea Infuse para limpieza profunda y cuidado diario del cabello.',
  short_description = 'Shampoo profesional de la línea Infuse para limpieza profunda y cuidado diario del cabello.',
  detail_points = array['Limpia el cabello y el cuero cabelludo mientras ayuda a mantener suavidad y una apariencia fresca.', 'Adecuado para el lavado habitual en barbería o en casa.']::text[],
  consumer_price = 95,
  price_3_plus = 80,
  price_6_plus = null,
  box_price = null,
  price = 95
where slug = 'immortal-shampoo-immortal-infuse';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 42 from public.products where slug = 'immortal-shampoo-immortal-infuse'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Shampoo de cuidado capilar formulado para cuero cabelludo con tendencia a la caspa.',
  short_description = 'Shampoo de cuidado capilar formulado para cuero cabelludo con tendencia a la caspa.',
  detail_points = array['Limpia el cuero cabelludo y ayuda a controlar la acumulación visible de escamas y grasa.', 'Usar con masaje suave y enjuagar completamente.']::text[],
  consumer_price = 95,
  price_3_plus = 80,
  price_6_plus = null,
  box_price = null,
  price = 95
where slug = 'immortal-shampoo-immortal-anti-caspa';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 50 from public.products where slug = 'immortal-shampoo-immortal-anti-caspa'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Shampoo de cuidado para cabello fino, quebradizo o con tendencia a la caída.',
  short_description = 'Shampoo de cuidado para cabello fino, quebradizo o con tendencia a la caída.',
  detail_points = array['Proporciona limpieza del cabello y cuero cabelludo y está orientado a fortalecer la apariencia de la fibra capilar.', 'Utilizar de acuerdo con las indicaciones del envase.']::text[],
  consumer_price = 95,
  price_3_plus = 80,
  price_6_plus = null,
  box_price = null,
  price = 95
where slug = 'immortal-shampoo-immortal-anti-caida-de-cabello';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 50 from public.products where slug = 'immortal-shampoo-immortal-anti-caida-de-cabello'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Shampoo 3 en 1 para una rutina práctica de limpieza de cabello',
  short_description = 'Shampoo 3 en 1 para una rutina práctica de limpieza de cabello',
  detail_points = array['Permite realizar la limpieza diaria en un solo producto, con enjuague fácil y sensación de frescura.', 'Útil para casa, gimnasio o viaje.']::text[],
  consumer_price = 95,
  price_3_plus = 80,
  price_6_plus = null,
  box_price = null,
  price = 95
where slug = 'immortal-shampoo-immortal-3-en-1';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 50 from public.products where slug = 'immortal-shampoo-immortal-3-en-1'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Cera de fijación fuerte para crear peinados definidos con acabado brillante.',
  short_description = 'Cera de fijación fuerte para crear peinados definidos con acabado brillante.',
  detail_points = array['Su textura facilita la distribución y el moldeado del cabello.', 'Ideal para estilos pulidos que necesitan control y definición durante el día.']::text[],
  consumer_price = 55,
  price_3_plus = 35,
  price_6_plus = null,
  box_price = null,
  price = 55
where slug = 'agiva-agiva-01-orange';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 23.5 from public.products where slug = 'agiva-agiva-01-orange'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Cera aqua de fijación muy fuerte para estilos que requieren mayor control.',
  short_description = 'Cera aqua de fijación muy fuerte para estilos que requieren mayor control.',
  detail_points = array['Permite dar forma, definir y mantener el peinado con un acabado brillante.', 'Aplicar una pequeña cantidad sobre cabello seco o ligeramente húmedo.']::text[],
  consumer_price = 55,
  price_3_plus = 35,
  price_6_plus = null,
  box_price = null,
  price = 55
where slug = 'agiva-agiva-02-blue';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 23.5 from public.products where slug = 'agiva-agiva-02-blue'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Pasta moldeadora de acabado mate para aportar textura y definición al cabello.',
  short_description = 'Pasta moldeadora de acabado mate para aportar textura y definición al cabello.',
  detail_points = array['Indicada para peinados naturales, texturizados o con volumen.', 'Se trabaja fácilmente con los dedos y ayuda a mantener el estilo sin brillo marcado.']::text[],
  consumer_price = 55,
  price_3_plus = 35,
  price_6_plus = null,
  box_price = null,
  price = 55
where slug = 'agiva-agiva-03-green';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 23.5 from public.products where slug = 'agiva-agiva-03-green'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Pomada de peinado para control y definición con acabado brillante.',
  short_description = 'Pomada de peinado para control y definición con acabado brillante.',
  detail_points = array['Se distribuye con facilidad y permite moldear distintos estilos, desde peinados clásicos hasta acabados más modernos.', 'Se retira con lavado.']::text[],
  consumer_price = 55,
  price_3_plus = 35,
  price_6_plus = null,
  box_price = null,
  price = 55
where slug = 'agiva-agiva-04-yellow';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 23.5 from public.products where slug = 'agiva-agiva-04-yellow'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Cera de fijación extra fuerte diseñada para estilos que necesitan máximo control.',
  short_description = 'Cera de fijación extra fuerte diseñada para estilos que necesitan máximo control.',
  detail_points = array['Ayuda a mantener cabellos difíciles en su lugar y a crear peinados definidos y duraderos.', 'Usar poca cantidad y distribuir uniformemente.']::text[],
  consumer_price = 55,
  price_3_plus = 35,
  price_6_plus = null,
  box_price = null,
  price = 55
where slug = 'agiva-agiva-05-red';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 23.5 from public.products where slug = 'agiva-agiva-05-red'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Cera cremosa de peinado que facilita el moldeado y el control del cabello.',
  short_description = 'Cera cremosa de peinado que facilita el moldeado y el control del cabello.',
  detail_points = array['Su consistencia permite repartir el producto de forma uniforme, definir mechones y retocar el peinado durante la aplicación.']::text[],
  consumer_price = 55,
  price_3_plus = 35,
  price_6_plus = null,
  box_price = null,
  price = 55
where slug = 'agiva-agiva-06-cream-wax';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 23.5 from public.products where slug = 'agiva-agiva-06-cream-wax'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Cera de efecto telaraña con textura fibrosa para crear definición y movimiento.',
  short_description = 'Cera de efecto telaraña con textura fibrosa para crear definición y movimiento.',
  detail_points = array['Al trabajarla entre las manos forma fibras que ayudan a repartir el producto, separar mechones y dar textura al peinado con un acabado moderno.']::text[],
  consumer_price = 55,
  price_3_plus = 35,
  price_6_plus = null,
  box_price = null,
  price = 55
where slug = 'agiva-agiva-10-grey-tela-de-arana';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 23.5 from public.products where slug = 'agiva-agiva-10-grey-tela-de-arana'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Polvo de peinado ligero para aportar volumen, textura y acabado mate.',
  short_description = 'Polvo de peinado ligero para aportar volumen, textura y acabado mate.',
  detail_points = array['Se aplica sobre cabello seco, especialmente en la raíz, para aumentar el cuerpo y facilitar el moldeado.', 'Usar poco producto y añadir más si es necesario.']::text[],
  consumer_price = 99,
  price_3_plus = 85,
  price_6_plus = 75,
  box_price = null,
  price = 99
where slug = 'agiva-agiva-styling-dust';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 45 from public.products where slug = 'agiva-agiva-styling-dust'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Gel transparente de afeitado para facilitar un rasurado preciso y cómodo.',
  short_description = 'Gel transparente de afeitado para facilitar un rasurado preciso y cómodo.',
  detail_points = array['Ayuda a lubricar e hidratar la piel durante el afeitado y permite ver el contorno mientras se trabaja.', 'Aplicar una capa fina antes de pasar la navaja o rasuradora.']::text[],
  consumer_price = 89,
  price_3_plus = 69,
  price_6_plus = 65,
  box_price = null,
  price = 89
where slug = 'agiva-shaving-gel';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 39 from public.products where slug = 'agiva-shaving-gel'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Cera de efecto telaraña con aroma a chicle para dar textura, forma y control al cabello.',
  short_description = 'Cera de efecto telaraña con aroma a chicle para dar textura, forma y control al cabello.',
  detail_points = array['Su textura fibrosa permite distribuir el producto entre los mechones y crear peinados definidos con movimiento.', 'Ideal para acabados modernos y texturizados.']::text[],
  consumer_price = 60,
  price_3_plus = 55,
  price_6_plus = null,
  box_price = null,
  price = 60
where slug = '4x4-cera-telarana-aroma-chicle';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 30.5922222 from public.products where slug = '4x4-cera-telarana-aroma-chicle'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Cera de efecto telaraña con aroma a banana para moldear y texturizar el cabello.',
  short_description = 'Cera de efecto telaraña con aroma a banana para moldear y texturizar el cabello.',
  detail_points = array['Forma fibras al trabajarla con las manos, facilitando la definición de mechones y el control del peinado.', 'Aplicar en pequeñas cantidades.']::text[],
  consumer_price = 60,
  price_3_plus = 55,
  price_6_plus = null,
  box_price = null,
  price = 60
where slug = '4x4-cera-telarana-aroma-banana';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 30.5922222 from public.products where slug = '4x4-cera-telarana-aroma-banana'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Pasta profesional para moldear el cabello y aportar textura y control.',
  short_description = 'Pasta profesional para moldear el cabello y aportar textura y control.',
  detail_points = array['Adecuada para crear peinados definidos y trabajables.', 'Distribuir una pequeña cantidad entre las manos y aplicar sobre cabello seco o ligeramente húmedo.']::text[],
  consumer_price = 60,
  price_3_plus = 50,
  price_6_plus = null,
  box_price = null,
  price = 60
where slug = '4x4-pasta-4x4-profesional-100g';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 30.5922222 from public.products where slug = '4x4-pasta-4x4-profesional-100g'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Pomada profesional para peinados controlados y de apariencia pulida.',
  short_description = 'Pomada profesional para peinados controlados y de apariencia pulida.',
  detail_points = array['Ayuda a ordenar el cabello, definir líneas y mantener la forma del peinado.', 'Ideal para estilos clásicos, laterales controlados y acabados de barbería.']::text[],
  consumer_price = 60,
  price_3_plus = 50,
  price_6_plus = null,
  box_price = null,
  price = 60
where slug = '4x4-pomada-4x4-profesional-100g';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 30.5922222 from public.products where slug = '4x4-pomada-4x4-profesional-100g'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Producto híbrido entre cera y gel para fijar, moldear y definir el cabello.',
  short_description = 'Producto híbrido entre cera y gel para fijar, moldear y definir el cabello.',
  detail_points = array['Combina la manejabilidad de una cera con la aplicación de un gel, permitiendo crear estilos definidos y con buena presencia.', 'Aplicar uniformemente sobre el cabello.']::text[],
  consumer_price = 75,
  price_3_plus = 60,
  price_6_plus = null,
  box_price = null,
  price = 75
where slug = '4x4-cera-gel-4x4-profesional-280g';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 42.24 from public.products where slug = '4x4-cera-gel-4x4-profesional-280g'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Spray enfriador para cuchillas de máquinas de barbería durante el trabajo.',
  short_description = 'Spray enfriador para cuchillas de máquinas de barbería durante el trabajo.',
  detail_points = array['Ayuda a reducir la temperatura de la cuchilla entre servicios o durante jornadas continuas.', 'Aplicar siguiendo las instrucciones del envase y evitando el contacto con la piel y los ojos.']::text[],
  consumer_price = 95,
  price_3_plus = 90,
  price_6_plus = null,
  box_price = null,
  price = 95
where slug = '4x4-enfriador-para-maquinas';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 57.7308333 from public.products where slug = '4x4-enfriador-para-maquinas'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Talco profesional para barbería con aroma Invencible y presentación dorada.',
  short_description = 'Talco profesional para barbería con aroma Invencible y presentación dorada.',
  detail_points = array['Ayuda a absorber humedad y a retirar pequeños residuos de cabello, dejando una sensación seca y cómoda después del corte o afeitado.']::text[],
  consumer_price = 55,
  price_3_plus = null,
  price_6_plus = null,
  box_price = null,
  price = 55
where slug = '4x4-talco-dorado-invensible-4x4-profesional';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 38.455 from public.products where slug = '4x4-talco-dorado-invensible-4x4-profesional'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Shampoo capilar de limpieza y cuidado formulado con CBD y minoxidil.',
  short_description = 'Shampoo capilar de limpieza y cuidado formulado con CBD y minoxidil.',
  detail_points = array['Limpia el cabello y el cuero cabelludo y está orientado al cuidado de cabellos que requieren una rutina fortalecedora.', 'Utilizar únicamente según las indicaciones del envase.']::text[],
  consumer_price = 100,
  price_3_plus = 80,
  price_6_plus = null,
  box_price = null,
  price = 100
where slug = '4x4-shampoo-cbd-minoxidil';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 38.455 from public.products where slug = '4x4-shampoo-cbd-minoxidil'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Polvo seco de peinado para aportar volumen, textura y un acabado mate.',
  short_description = 'Polvo seco de peinado para aportar volumen, textura y un acabado mate.',
  detail_points = array['Ideal para elevar la raíz, dar cuerpo y mejorar el agarre del cabello sin apariencia húmeda.', 'Aplicar poco a poco sobre cabello seco y moldear con los dedos.']::text[],
  consumer_price = 86,
  price_3_plus = 65,
  price_6_plus = null,
  box_price = null,
  price = 86
where slug = '4x4-polvo-voluminizador-seco';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 38.43541667 from public.products where slug = '4x4-polvo-voluminizador-seco'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Bálsamo negro líquido para retoques visuales y definición con aerógrafo.',
  short_description = 'Bálsamo negro líquido para retoques visuales y definición con aerógrafo.',
  detail_points = array['Permite sombrear, rellenar y marcar visualmente contornos de cabello o barba.', 'Aplicar en capas ligeras y uniformes hasta lograr el efecto deseado.']::text[],
  consumer_price = 80,
  price_3_plus = null,
  price_6_plus = null,
  box_price = null,
  price = 80
where slug = '4x4-balsamo-negro-liquido-para-aerografo';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 38.455 from public.products where slug = '4x4-balsamo-negro-liquido-para-aerografo'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Solución capilar de aplicación tópica con minoxidil.',
  short_description = 'Solución capilar de aplicación tópica con minoxidil.',
  detail_points = array['Producto de uso externo.', 'Aplicar únicamente conforme a la concentración, modo de uso y advertencias indicadas en el envase; evitar ojos y piel irritada.']::text[],
  consumer_price = 100,
  price_3_plus = 95,
  price_6_plus = null,
  box_price = 385,
  price = 100
where slug = '4x4-minoxidil-liquido-4x4';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 38.4466667 from public.products where slug = '4x4-minoxidil-liquido-4x4'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Cera capilar con aceite de oliva y esencia de coco para moldear y fijar el cabello.',
  short_description = 'Cera capilar con aceite de oliva y esencia de coco para moldear y fijar el cabello.',
  detail_points = array['Ayuda a dar forma, brillo y control al peinado con una textura fácil de trabajar.', 'Su aroma a coco aporta una sensación agradable durante el uso.']::text[],
  consumer_price = 30,
  price_3_plus = 23,
  price_6_plus = null,
  box_price = null,
  price = 30
where slug = 'evok-evoc-coco';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 14 from public.products where slug = 'evok-evoc-coco'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Cera capilar con aceite de oliva y esencia de fresa para moldear y fijar el cabello.',
  short_description = 'Cera capilar con aceite de oliva y esencia de fresa para moldear y fijar el cabello.',
  detail_points = array['Permite controlar y definir el peinado mientras aporta brillo y manejabilidad.', 'Su aroma a fresa complementa el acabado del producto.']::text[],
  consumer_price = 30,
  price_3_plus = 23,
  price_6_plus = null,
  box_price = null,
  price = 30
where slug = 'evok-evoc-fresa';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 14 from public.products where slug = 'evok-evoc-fresa'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Cera capilar con aceite de oliva y esencia de manzana para moldear y fijar el cabello.',
  short_description = 'Cera capilar con aceite de oliva y esencia de manzana para moldear y fijar el cabello.',
  detail_points = array['Facilita la creación de estilos definidos, ayuda a controlar cabellos rebeldes y aporta un acabado brillante con aroma a manzana.']::text[],
  consumer_price = 30,
  price_3_plus = 23,
  price_6_plus = null,
  box_price = null,
  price = 30
where slug = 'evok-evoc-manzana';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 14 from public.products where slug = 'evok-evoc-manzana'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Cera capilar con aceite de oliva y esencia de sábila para moldear y controlar el cabello.',
  short_description = 'Cera capilar con aceite de oliva y esencia de sábila para moldear y controlar el cabello.',
  detail_points = array['Ofrece fijación y manejabilidad para distintos estilos, dejando el cabello definido y con buena apariencia.', 'Se aplica en pequeñas cantidades.']::text[],
  consumer_price = 30,
  price_3_plus = 23,
  price_6_plus = null,
  box_price = null,
  price = 30
where slug = 'evok-evoc-sabila';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 14 from public.products where slug = 'evok-evoc-sabila'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Cera de máximo control en presentación negra para fijar y definir el peinado.',
  short_description = 'Cera de máximo control en presentación negra para fijar y definir el peinado.',
  detail_points = array['Su textura permite moldear el cabello y mantener estilos bien estructurados.', 'Ideal para peinados que requieren mayor control y acabado definido.']::text[],
  consumer_price = 35,
  price_3_plus = 28,
  price_6_plus = null,
  box_price = null,
  price = 35
where slug = 'evok-evoc-negro';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 19 from public.products where slug = 'evok-evoc-negro'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Cera aqua de máximo control en presentación azul para fijar y definir el peinado.',
  short_description = 'Cera aqua de máximo control en presentación azul para fijar y definir el peinado.',
  detail_points = array['Ayuda a mantener el cabello en su lugar y facilita el moldeado de estilos clásicos o modernos.', 'Aplicar una pequeña cantidad y distribuir uniformemente.']::text[],
  consumer_price = 35,
  price_3_plus = 28,
  price_6_plus = null,
  box_price = null,
  price = 35
where slug = 'evok-evoc-azul';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 19 from public.products where slug = 'evok-evoc-azul'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Cera de máximo control en presentación blanca para fijar y moldear el cabello.',
  short_description = 'Cera de máximo control en presentación blanca para fijar y moldear el cabello.',
  detail_points = array['Permite crear peinados definidos con buena manejabilidad y control.', 'Puede aplicarse sobre cabello seco o ligeramente húmedo.']::text[],
  consumer_price = 35,
  price_3_plus = 28,
  price_6_plus = null,
  box_price = null,
  price = 35
where slug = 'evok-evoc-blanco';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 19 from public.products where slug = 'evok-evoc-blanco'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Cera de máximo control en presentación roja para fijar y estructurar el peinado.',
  short_description = 'Cera de máximo control en presentación roja para fijar y estructurar el peinado.',
  detail_points = array['Indicada para estilos que necesitan definición y control.', 'Trabajar una pequeña cantidad entre las manos antes de distribuir en el cabello.']::text[],
  consumer_price = 35,
  price_3_plus = 28,
  price_6_plus = null,
  box_price = null,
  price = 35
where slug = 'evok-evoc-rojo';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 19 from public.products where slug = 'evok-evoc-rojo'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Colonia after shave en spray para refrescar la piel después del afeitado.',
  short_description = 'Colonia after shave en spray para refrescar la piel después del afeitado.',
  detail_points = array['Ayuda a dejar una sensación fresca y una fragancia agradable al finalizar el servicio.', 'Aplicar sobre piel limpia evitando ojos y zonas irritadas.']::text[],
  consumer_price = 59,
  price_3_plus = 52,
  price_6_plus = 49,
  box_price = null,
  price = 59
where slug = 'evok-after-shave-evok';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 28 from public.products where slug = 'evok-after-shave-evok'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Gel transparente de afeitado para lubricar la piel y facilitar un rasurado preciso.',
  short_description = 'Gel transparente de afeitado para lubricar la piel y facilitar un rasurado preciso.',
  detail_points = array['Su transparencia permite visualizar los contornos mientras se afeita y ayuda a reducir la fricción de la cuchilla.', 'Aplicar una capa uniforme antes del afeitado.']::text[],
  consumer_price = 59,
  price_3_plus = 52,
  price_6_plus = null,
  box_price = null,
  price = 59
where slug = 'evok-shaving-gel-evok';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 33 from public.products where slug = 'evok-shaving-gel-evok'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Papel desechable negro para proteger el cuello durante cortes y servicios de barbería.',
  short_description = 'Papel desechable negro para proteger el cuello durante cortes y servicios de barbería.',
  detail_points = array['Se coloca alrededor del cuello antes de la capa para mejorar la higiene y evitar el contacto directo con cabellos sueltos, productos o la tela de la capa.']::text[],
  consumer_price = 70,
  price_3_plus = 67,
  price_6_plus = null,
  box_price = null,
  price = 70
where slug = 'evok-tubo-de-papel-cuello-color-negro';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 46 from public.products where slug = 'evok-tubo-de-papel-cuello-color-negro'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Papel desechable blanco para proteger el cuello durante cortes y servicios de barbería.',
  short_description = 'Papel desechable blanco para proteger el cuello durante cortes y servicios de barbería.',
  detail_points = array['Crea una barrera higiénica entre la piel y la capa de corte, ayudando a evitar el contacto con residuos de cabello y productos durante el servicio.']::text[],
  consumer_price = 60,
  price_3_plus = 55,
  price_6_plus = null,
  box_price = null,
  price = 60
where slug = 'evok-tubo-de-papel-cuello-color-blanco';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 46 from public.products where slug = 'evok-tubo-de-papel-cuello-color-blanco'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Cera de efecto telaraña con textura fibrosa para moldear y dar definición al cabello.',
  short_description = 'Cera de efecto telaraña con textura fibrosa para moldear y dar definición al cabello.',
  detail_points = array['Al trabajarla entre las manos forma fibras que facilitan la distribución, separación de mechones y creación de peinados con textura y movimiento.']::text[],
  consumer_price = 45,
  price_3_plus = 40,
  price_6_plus = null,
  box_price = null,
  price = 45
where slug = 'xiomara-tela-de-arana-xiomara';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 29.5 from public.products where slug = 'xiomara-tela-de-arana-xiomara'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Cera moldeadora para dar forma, definición y control al cabello.',
  short_description = 'Cera moldeadora para dar forma, definición y control al cabello.',
  detail_points = array['Adecuada para distintos estilos de peinado; permite trabajar y ordenar el cabello aplicando una pequeña cantidad y distribuyéndola de manera uniforme.']::text[],
  consumer_price = 40,
  price_3_plus = 35,
  price_6_plus = null,
  box_price = null,
  price = 40
where slug = 'xiomara-cera-moldeadora-xiomara';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 26 from public.products where slug = 'xiomara-cera-moldeadora-xiomara'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();

update public.products set
  description = 'Gel para crecimiento y cuidado de la barba, formulado con minoxidil y extractos que ayudan a fortalecer, nutrir y mejorar la apariencia del vello facial.',
  short_description = 'Gel para crecimiento y cuidado de la barba, formulado con minoxidil y extractos que ayudan a fortalecer, nutrir y mejorar la apariencia del vello facial.',
  detail_points = array['Catrin Gel de Crecimiento está diseñado para estimular los folículos y favorecer una barba con apariencia más densa y uniforme.', 'Su fórmula incluye minoxidil, bergamota y gotu kola; algunas presentaciones también incorporan aloe vera, vitamina E y aceites nutritivos.', 'Tiene textura en gel de fácil aplicación y rápida absorción']::text[],
  consumer_price = 185,
  price_3_plus = 165,
  price_6_plus = null,
  box_price = null,
  price = 185
where slug = 'catrin-minoxidil-en-gel-marca-catrin';

insert into public.product_internal (product_id, distributor_unit_price)
select id, 128 from public.products where slug = 'catrin-minoxidil-en-gel-marca-catrin'
on conflict (product_id) do update set distributor_unit_price = excluded.distributor_unit_price, updated_at = now();
