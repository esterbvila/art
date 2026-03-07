# Ester Batllori — Art Store

A Next.js e-commerce site for selling original abstract paintings, backed by Supabase and Stripe.

---

## Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Frontend    | Next.js 14 (Pages Router) + React |
| Styling     | Tailwind CSS v3 + shadcn/ui base  |
| Database    | Supabase (PostgreSQL)             |
| Auth/API    | Supabase                          |
| Payments    | Stripe Checkout                   |
| Hosting     | Vercel                            |

---

## Project Structure

```
/
├── pages/
│   ├── _app.js              # Global app wrapper
│   ├── _document.js         # HTML document + Google Fonts
│   ├── index.js             # Landing page
│   ├── [artworkId].js       # Artwork detail page
│   ├── success.js           # Post-purchase confirmation
│   └── api/
│       ├── checkout.js      # Creates Stripe Checkout Session
│       ├── webhook.js       # Stripe webhook → updates Supabase
│       └── contact.js       # Saves contact form submissions
├── components/
│   ├── Navigation.js
│   ├── Hero.js
│   ├── Gallery.js
│   ├── ArtworkCard.js
│   ├── PurchaseButton.js
│   ├── AboutArtist.js
│   ├── FeaturedPainting.js
│   ├── ContactForm.js
│   └── Footer.js
├── lib/
│   ├── supabase.js          # Supabase client + admin client
│   ├── stripe.js            # Stripe server-side client
│   └── utils.js             # cn(), formatPrice(), slugify()
├── styles/
│   └── globals.css          # Tailwind base + CSS utilities
├── public/
│   └── artworks/            # Painting images (copy from root)
└── supabase/
    ├── schema.sql           # Database schema + RPC functions
    └── seed.sql             # 16 artworks seed data
```

---

## Local Development

### 1. Clone & install

```bash
cd /path/to/art
npm install
```

### 2. Copy artwork images to `public/artworks/`

The paintings in the root of this repository need to be served by Next.js.
Create the public directory and copy them:

```bash
mkdir -p public/artworks
cp *.png public/artworks/
cp images/*.jpg public/artworks/   # if needed
```

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in:

| Variable                         | Where to find it                                              |
|----------------------------------|---------------------------------------------------------------|
| `NEXT_PUBLIC_SUPABASE_URL`       | Supabase Dashboard → Project Settings → API → Project URL    |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`  | Supabase Dashboard → Project Settings → API → anon key       |
| `SUPABASE_SERVICE_ROLE_KEY`      | Supabase Dashboard → Project Settings → API → service_role   |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → Developers → API keys → Publishable |
| `STRIPE_SECRET_KEY`              | Stripe Dashboard → Developers → API keys → Secret key        |
| `STRIPE_WEBHOOK_SECRET`          | See "Stripe Webhook" section below                           |
| `NEXT_PUBLIC_BASE_URL`           | `http://localhost:3000` for local dev                        |

### 4. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** and run `supabase/schema.sql` to create tables and functions.
3. Run `supabase/seed.sql` to insert the 16 artworks.

> **Images in the seed:** The seed references local paths like `/artworks/frigopie-edited.png`.
> These work when images are in `public/artworks/`. If you prefer Supabase Storage:
> - Upload images to a public bucket called `artworks`.
> - Update the `image_url` values in `seed.sql` to the full Supabase Storage URLs before running.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 6. Test Stripe webhooks locally

Install the Stripe CLI:

```bash
brew install stripe/stripe-cli/stripe
stripe login
```

Forward webhooks to your local server:

```bash
stripe listen --forward-to localhost:3000/api/webhook
```

Copy the webhook signing secret printed by the CLI and set it as
`STRIPE_WEBHOOK_SECRET` in `.env.local`.

Test a purchase with Stripe's test card: `4242 4242 4242 4242` (any future date, any CVC).

---

## Deployment to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "initial project"
git push origin main
```

### 2. Import in Vercel

1. Go to [vercel.com/new](https://vercel.com/new).
2. Import your GitHub repository.
3. Vercel auto-detects Next.js — no framework configuration needed.

### 3. Set environment variables

In **Vercel → Project → Settings → Environment Variables**, add all variables
from `.env.local.example`. Set `NEXT_PUBLIC_BASE_URL` to your production domain,
e.g. `https://your-store.vercel.app`.

### 4. Configure the Stripe production webhook

1. Go to **Stripe Dashboard → Developers → Webhooks → Add endpoint**.
2. URL: `https://your-store.vercel.app/api/webhook`
3. Events: select **checkout.session.completed**.
4. Copy the **Signing secret** and set it as `STRIPE_WEBHOOK_SECRET` in Vercel.

### 5. Deploy

Vercel deploys automatically on every push to `main`. You can also trigger a
manual deploy from the Vercel dashboard.

---

## Supabase Row-Level Security

The schema sets up the following RLS policies:

| Table                  | Policy                                      |
|------------------------|---------------------------------------------|
| `artworks`             | Public read (anyone can browse the gallery) |
| `orders`               | Admin only (service-role key bypasses RLS)  |
| `contact_submissions`  | Admin only                                  |

API routes use `createAdminClient()` (service-role key) for write operations
so they can bypass RLS. The public `supabase` client is used only for reads.

---

## Adding New Artworks

1. Upload the image to `public/artworks/` (or Supabase Storage).
2. In Supabase SQL Editor, run:

```sql
INSERT INTO artworks (title, description, process, medium, dimensions, year, price, image_url, stock)
VALUES (
  'My New Painting',
  'Description…',
  'Process note…',
  'Acrylic on canvas',
  '24×30"',
  '2026',
  45000,           -- 450€ in cents
  '/artworks/my-new-painting.png',
  1
);
```

3. To feature a painting, set `featured = TRUE` (only one should be featured at a time):

```sql
UPDATE artworks SET featured = FALSE;
UPDATE artworks SET featured = TRUE WHERE title = 'My New Painting';
```
