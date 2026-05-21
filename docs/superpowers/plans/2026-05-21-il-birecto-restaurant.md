# Il Birecto Restaurant Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Il Birecto as a new restaurant immediately after Le Arcate, using the provided `public/images/birecto.jpeg` photo and polished multilingual copy.

**Architecture:** Restaurant entries are stored as parallel markdown blocks in `src/data/content/texts.{locale}.md`. Slugs are assigned by item order from the English file, so every locale file must receive the new block in the same position. The hero image is selected by `src/lib/place-images.ts`, and blur placeholders are regenerated from `public/guide-webp`.

**Tech Stack:** Next.js 16, TypeScript, markdown content parser, Sharp image processing, generated blur data.

---

### Task 1: Prepare The Restaurant Image

**Files:**
- Read: `public/images/birecto.jpeg`
- Create: `public/guide-webp/Il-Birecto.webp`
- Modify: `src/lib/blur-data.generated.ts`

- [ ] **Step 1: Confirm the source image exists**

Run:

```bash
ls -lh public/images/birecto.jpeg
```

Expected: one JPEG file is listed.

- [ ] **Step 2: Create the optimized WebP used by place cards and details**

Run:

```bash
node --input-type=module -e "import sharp from 'sharp'; await sharp('public/images/birecto.jpeg').resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toFile('public/guide-webp/Il-Birecto.webp')"
```

Expected: `public/guide-webp/Il-Birecto.webp` is created.

- [ ] **Step 3: Regenerate blur placeholders**

Run:

```bash
npm run generate:blur
```

Expected: `src/lib/blur-data.generated.ts` contains a new `/guide-webp/Il-Birecto.webp` entry.

- [ ] **Step 4: Commit image preparation**

Run:

```bash
git add public/guide-webp/Il-Birecto.webp src/lib/blur-data.generated.ts
git commit -m "feat: add Il Birecto image asset"
```

### Task 2: Connect The Image To The Place Name

**Files:**
- Modify: `src/lib/place-images.ts`

- [ ] **Step 1: Add Il Birecto to the restaurant image mapping**

In `src/lib/place-images.ts`, inside the `// Restaurants` block, add the Birecto rule near the Atrani restaurants:

```ts
    if (n.includes("birecto")) return "/guide-webp/Il-Birecto.webp";
```

The restaurant section should include this sequence:

```ts
    if (n.includes("palme")) return "/guide-webp/le-palme.webp";
    if (n.includes("paranza")) return "/guide-webp/A-Paranza.webp";
    if (n.includes("smeraldino")) return "/guide-webp/Lo-Smeraldino.webp";
    if (n.includes("arcate")) return "/guide-webp/Le-Arcate.webp";
    if (n.includes("birecto")) return "/guide-webp/Il-Birecto.webp";
    if (n.includes("ciccio")) return "/guide-webp/Da-Ciccio-Cielo-Mare-Terra.webp";
```

- [ ] **Step 2: Run TypeScript/build verification after the content task**

Wait until Task 3 is complete, then run:

```bash
npm run build
```

Expected: build succeeds and the new image path resolves.

- [ ] **Step 3: Commit image mapping**

Run:

```bash
git add src/lib/place-images.ts
git commit -m "feat: map Il Birecto place image"
```

### Task 3: Add Il Birecto Content In Every Locale

**Files:**
- Modify: `src/data/content/texts.en.md`
- Modify: `src/data/content/texts.ru.md`
- Modify: `src/data/content/texts.it.md`
- Modify: `src/data/content/texts.fr.md`
- Modify: `src/data/content/texts.es.md`
- Modify: `src/data/content/texts.de.md`

- [ ] **Step 1: Insert the English block after Le Arcate and before A'Paranza**

In `src/data/content/texts.en.md`, insert:

```markdown
### Il Birecto (Atrani)
**Category**: All-Day Favorite
**Tagline**: Where you can always count on good food
**Hours**: Mon-Sun 08:00-23:00
**Price**: €€

**Short info:**
An all-day bar, restaurant, and pizzeria in Atrani, trusted for breakfast, seafood pasta, pizza, cocktails, and late lunches when almost everything else is closed.

**The Details:**
The full name is BAR RISTORANTE PIZZERIA IL BIRECTO, and that tells you a lot: this is one of the most useful places in Atrani, open almost whenever you need it.

From 8:00 in the morning, the counter starts with classic *pasticciotto atranese* baked in-house and excellent croissants from a local pastry chef, filled in different ways. Come early if you want breakfast: the croissants disappear quickly, because this is where the village starts its day.

From midday, Il Birecto shifts into restaurant mode. You can sit down for generous pasta, pizza, and seafood dishes made with fresh local ingredients. The owner is usually close by, and you feel that in the standards: the restaurant and bar are watched with real care. The cocktails are also very good. And if you need lunch at 16:00, when the rest of town has quietly closed its kitchens, this is exactly where you go.

> [!info] Key Links
> - **Google Maps**: [View Location](https://maps.app.goo.gl/UDgwYSSJf1gP4iZc6)
> - **Menu**: [View Menu](https://birecto.menu.band)
> - **TripAdvisor**: [TripAdvisor](https://www.tripadvisor.it/Restaurant_Review-g635619-d1510580-Reviews-Bistrot_Il_Birecto_Di_Domenico_Lagrotta-Atrani_Amalfi_Coast_Province_of_Salerno_C.html)

---
```

- [ ] **Step 2: Insert the Russian block in the same position**

In `src/data/content/texts.ru.md`, insert:

```markdown
### Il Birecto (Atrani)
**Category**: На Весь День
**Tagline**: Здесь всегда можно хорошо поесть
**Hours**: Mon-Sun 08:00-23:00
**Price**: €€

**Short info:**
Бар, ресторан и пиццерия в Атрани на весь день: завтрак, паста с морепродуктами, пицца, коктейли и поздний обед, когда почти всё вокруг уже закрыто.

**The Details:**
Полное название — BAR RISTORANTE PIZZERIA IL BIRECTO, и оно очень точно описывает это место: в Атрани сюда можно прийти почти в любой момент, когда хочется нормально поесть.

С 8:00 утра здесь уже есть классический *pasticciotto atranese*, который пекут на месте, и отличные круассаны с разными начинками от местного кондитера. Если хотите хороший завтрак, приходите пораньше: круассаны разлетаются быстро, потому что именно здесь начинает день вся деревня.

С полудня Il Birecto работает как ресторан. Здесь можно взять хорошую пасту, пиццу и блюда из свежих местных морепродуктов. Владелец обычно где-то рядом, и это чувствуется: качество кухни, бара и сервиса держат под внимательным контролем. Коктейли здесь тоже очень достойные. А если вы ищете обед в 16:00, когда большинство кухонь уже закрыто, вам точно сюда.

> [!info] Key Links
> - **Google Maps**: [View Location](https://maps.app.goo.gl/UDgwYSSJf1gP4iZc6)
> - **Menu**: [View Menu](https://birecto.menu.band)
> - **TripAdvisor**: [TripAdvisor](https://www.tripadvisor.it/Restaurant_Review-g635619-d1510580-Reviews-Bistrot_Il_Birecto_Di_Domenico_Lagrotta-Atrani_Amalfi_Coast_Province_of_Salerno_C.html)

---
```

- [ ] **Step 3: Insert the Italian block in the same position**

In `src/data/content/texts.it.md`, insert:

```markdown
### Il Birecto (Atrani)
**Category**: Aperto Tutto Il Giorno
**Tagline**: Dove puoi sempre contare su buon cibo
**Hours**: Mon-Sun 08:00-23:00
**Price**: €€

**Short info:**
Bar, ristorante e pizzeria ad Atrani per tutta la giornata: colazione, pasta ai frutti di mare, pizza, cocktail e pranzo tardi quando quasi tutto il resto è chiuso.

**The Details:**
Il nome completo è BAR RISTORANTE PIZZERIA IL BIRECTO, e racconta bene il posto: ad Atrani è uno di quei locali su cui puoi contare quasi sempre, quando hai voglia di mangiare bene.

Dalle 8:00 del mattino trovi il classico *pasticciotto atranese* preparato in casa e ottimi cornetti con diverse farciture, fatti da un pasticcere locale. Se vuoi fare una buona colazione, arriva presto: i cornetti spariscono in fretta, perché qui comincia la giornata di tutto il paese.

Da mezzogiorno Il Birecto diventa ristorante. Puoi sederti per una buona pasta, una pizza o piatti di pesce preparati con ingredienti freschi locali. Il proprietario è quasi sempre nei paraggi, e si sente: cucina, bar e servizio sono seguiti con grande attenzione. Anche i cocktail sono molto buoni. E se cerchi un pranzo alle 16:00, quando molte cucine sono chiuse, questo è il posto giusto.

> [!info] Key Links
> - **Google Maps**: [View Location](https://maps.app.goo.gl/UDgwYSSJf1gP4iZc6)
> - **Menu**: [View Menu](https://birecto.menu.band)
> - **TripAdvisor**: [TripAdvisor](https://www.tripadvisor.it/Restaurant_Review-g635619-d1510580-Reviews-Bistrot_Il_Birecto_Di_Domenico_Lagrotta-Atrani_Amalfi_Coast_Province_of_Salerno_C.html)

---
```

- [ ] **Step 4: Insert the French block in the same position**

In `src/data/content/texts.fr.md`, insert:

```markdown
### Il Birecto (Atrani)
**Category**: Toute La Journée
**Tagline**: L'adresse où l'on mange toujours bien
**Hours**: Mon-Sun 08:00-23:00
**Price**: €€

**Short info:**
Un bar, restaurant et pizzeria à Atrani pour toute la journée : petit-déjeuner, pâtes aux fruits de mer, pizza, cocktails et déjeuner tardif quand presque tout le reste est fermé.

**The Details:**
Son nom complet est BAR RISTORANTE PIZZERIA IL BIRECTO, et il résume parfaitement l'esprit du lieu : à Atrani, c'est l'une des adresses sur lesquelles on peut presque toujours compter pour bien manger.

Dès 8:00 du matin, on y trouve le classique *pasticciotto atranese*, préparé sur place, ainsi que d'excellents croissants aux différentes garnitures, réalisés par un pâtissier local. Pour un bon petit-déjeuner, mieux vaut arriver tôt : les croissants partent très vite, car c'est ici que le village commence sa journée.

À partir de midi, Il Birecto passe en mode restaurant. On peut s'installer pour une bonne assiette de pâtes, une pizza ou des plats de fruits de mer préparés avec des produits frais locaux. Le propriétaire est presque toujours dans les parages, et cela se sent : la cuisine, le bar et le service sont suivis avec beaucoup d'attention. Les cocktails sont aussi très bons. Et si vous cherchez où déjeuner à 16:00, quand la plupart des cuisines sont fermées, c'est exactement l'endroit qu'il vous faut.

> [!info] Key Links
> - **Google Maps**: [View Location](https://maps.app.goo.gl/UDgwYSSJf1gP4iZc6)
> - **Menu**: [View Menu](https://birecto.menu.band)
> - **TripAdvisor**: [TripAdvisor](https://www.tripadvisor.it/Restaurant_Review-g635619-d1510580-Reviews-Bistrot_Il_Birecto_Di_Domenico_Lagrotta-Atrani_Amalfi_Coast_Province_of_Salerno_C.html)

---
```

- [ ] **Step 5: Insert the Spanish block in the same position**

In `src/data/content/texts.es.md`, insert:

```markdown
### Il Birecto (Atrani)
**Category**: Todo El Día
**Tagline**: Donde siempre puedes comer bien
**Hours**: Mon-Sun 08:00-23:00
**Price**: €€

**Short info:**
Bar, restaurante y pizzería en Atrani para todo el día: desayuno, pasta con marisco, pizza, cócteles y comida tardía cuando casi todo lo demás está cerrado.

**The Details:**
El nombre completo es BAR RISTORANTE PIZZERIA IL BIRECTO, y describe muy bien el lugar: en Atrani es uno de esos sitios en los que casi siempre puedes confiar cuando quieres comer bien.

Desde las 8:00 de la mañana encontrarás el clásico *pasticciotto atranese*, hecho allí mismo, y excelentes cruasanes con distintos rellenos de un pastelero local. Si quieres un buen desayuno, llega pronto: los cruasanes desaparecen rápido, porque aquí empieza el día todo el pueblo.

A partir del mediodía, Il Birecto funciona como restaurante. Puedes sentarte a comer buena pasta, pizza y platos de marisco preparados con ingredientes frescos locales. El dueño suele estar cerca, y se nota: la cocina, el bar y el servicio están cuidados con mucha atención. También preparan muy buenos cócteles. Y si buscas comer a las 16:00, cuando la mayoría de cocinas ya está cerrada, este es exactamente el lugar.

> [!info] Key Links
> - **Google Maps**: [View Location](https://maps.app.goo.gl/UDgwYSSJf1gP4iZc6)
> - **Menu**: [View Menu](https://birecto.menu.band)
> - **TripAdvisor**: [TripAdvisor](https://www.tripadvisor.it/Restaurant_Review-g635619-d1510580-Reviews-Bistrot_Il_Birecto_Di_Domenico_Lagrotta-Atrani_Amalfi_Coast_Province_of_Salerno_C.html)

---
```

- [ ] **Step 6: Insert the German block in the same position**

In `src/data/content/texts.de.md`, insert:

```markdown
### Il Birecto (Atrani)
**Category**: Den Ganzen Tag
**Tagline**: Hier bekommst du immer gutes Essen
**Hours**: Mon-Sun 08:00-23:00
**Price**: €€

**Short info:**
Bar, Restaurant und Pizzeria in Atrani für den ganzen Tag: Frühstück, Pasta mit Meeresfrüchten, Pizza, Cocktails und spätes Mittagessen, wenn fast alles andere geschlossen ist.

**The Details:**
Der vollständige Name lautet BAR RISTORANTE PIZZERIA IL BIRECTO, und er beschreibt den Ort ziemlich gut: In Atrani ist es eines dieser Lokale, auf die man sich fast immer verlassen kann, wenn man gut essen möchte.

Ab 8:00 Uhr morgens gibt es hier den klassischen *pasticciotto atranese*, der direkt vor Ort gebacken wird, und ausgezeichnete Croissants mit verschiedenen Füllungen von einem lokalen Konditor. Wenn du gut frühstücken möchtest, komm früh: Die Croissants sind schnell weg, denn hier beginnt das ganze Dorf seinen Tag.

Ab mittags wird Il Birecto zum Restaurant. Du bekommst gute Pasta, Pizza und Gerichte mit frischen lokalen Meeresfrüchten. Der Besitzer ist meistens irgendwo in der Nähe, und das merkt man: Küche, Bar und Service werden aufmerksam geführt. Auch die Cocktails sind sehr gut. Und wenn du um 16:00 Uhr ein Mittagessen suchst, während die meisten Küchen schon geschlossen sind, bist du hier genau richtig.

> [!info] Key Links
> - **Google Maps**: [View Location](https://maps.app.goo.gl/UDgwYSSJf1gP4iZc6)
> - **Menu**: [View Menu](https://birecto.menu.band)
> - **TripAdvisor**: [TripAdvisor](https://www.tripadvisor.it/Restaurant_Review-g635619-d1510580-Reviews-Bistrot_Il_Birecto_Di_Domenico_Lagrotta-Atrani_Amalfi_Coast_Province_of_Salerno_C.html)

---
```

- [ ] **Step 7: Verify canonical slug alignment**

Run:

```bash
rg -n "### Il Birecto" src/data/content
```

Expected: six matches, one in each localized content file, and each one appears immediately after `### Le Arcate (Atrani)`.

- [ ] **Step 8: Commit multilingual content**

Run:

```bash
git add src/data/content/texts.en.md src/data/content/texts.ru.md src/data/content/texts.it.md src/data/content/texts.fr.md src/data/content/texts.es.md src/data/content/texts.de.md
git commit -m "feat: add Il Birecto restaurant content"
```

### Task 4: Verify The New Restaurant In The App

**Files:**
- Read: `src/data/content/texts.en.md`
- Read: `src/lib/place-images.ts`
- Read: `src/lib/blur-data.generated.ts`

- [ ] **Step 1: Run lint**

Run:

```bash
npm run lint
```

Expected: lint succeeds.

- [ ] **Step 2: Run production build**

Run:

```bash
npm run build
```

Expected: build succeeds. The prebuild step regenerates route, blur, and gallery data.

- [ ] **Step 3: Start the dev server**

Run:

```bash
npm run dev
```

Expected: local Next.js server starts and prints a localhost URL.

- [ ] **Step 4: Browser-check the English restaurant list and details page**

Open the local site and verify:

```text
Il Birecto appears in Favourite Restaurants immediately after Le Arcate.
The card uses the provided Birecto food image.
The details view uses the same image.
The Menu link opens https://birecto.menu.band.
The Google Maps link opens https://maps.app.goo.gl/UDgwYSSJf1gP4iZc6.
The TripAdvisor link opens the provided TripAdvisor URL.
```

- [ ] **Step 5: Browser-check at least Russian and Italian locales**

Open the Russian and Italian versions and verify:

```text
The Il Birecto entry appears in the same position.
The localized title, tagline, short info, details, hours, price, and links render.
Opening the details page keeps the canonical slug stable across languages.
```

- [ ] **Step 6: Commit verification-only generated changes if build updated them**

If `npm run build` or `npm run generate:*` changes generated files, run:

```bash
git status --short
git add src/lib/blur-data.generated.ts src/lib/place-gallery.generated.ts public/sw.js
git commit -m "chore: refresh generated assets"
```

Expected: only generated files from the build are committed.

---

## Self-Review

**Spec coverage:** The plan adds Il Birecto after Le Arcate, uses the provided `birecto.jpeg`, rewrites the Russian description into polished English and parallel localized copy, includes the menu link, Google Maps link, and TripAdvisor link.

**Placeholder scan:** No implementation step depends on TBD text. All content blocks and commands are explicit.

**Type consistency:** The image path `/guide-webp/Il-Birecto.webp` is used consistently in `place-images.ts`, the generated blur data, and verification steps. The markdown structure matches the existing parser fields.
