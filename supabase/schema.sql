-- ═══════════════════════════════════════════════════════════════════════════
-- Ester Batllori Art Store — Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════════════════════

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── artworks ────────────────────────────────────────────────────────────────
-- Stores every painting available in the store.
CREATE TABLE IF NOT EXISTS artworks (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT        NOT NULL,
  description TEXT,
  process     TEXT,                       -- Artist's process note
  medium      TEXT,                       -- e.g. "Acrylic on paper"
  dimensions  TEXT,                       -- e.g. "24×30\""
  year        TEXT,                       -- e.g. "2024"
  price       INTEGER     NOT NULL,       -- Price in euro cents (360€ = 36000)
  image_url   TEXT        NOT NULL,       -- Public URL (Supabase Storage or /artworks/...)
  stock       INTEGER     NOT NULL DEFAULT 1, -- 1 = available, 0 = sold
  featured    BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── orders ──────────────────────────────────────────────────────────────────
-- Created by the Stripe webhook after a successful payment.
CREATE TABLE IF NOT EXISTS orders (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  artwork_id             UUID        REFERENCES artworks(id) ON DELETE SET NULL,
  stripe_session_id      TEXT        UNIQUE NOT NULL,
  amount_cents           INTEGER,             -- Total charged (in cents)
  customer_email         TEXT,
  customer_name          TEXT,
  customer_phone         TEXT,
  -- Shipping address (collected by Stripe Checkout)
  shipping_name          TEXT,
  shipping_line1         TEXT,
  shipping_line2         TEXT,
  shipping_city          TEXT,
  shipping_state         TEXT,
  shipping_postal_code   TEXT,
  shipping_country       TEXT,
  status                 TEXT        NOT NULL DEFAULT 'completed',
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── contact_submissions ──────────────────────────────────────────────────────
-- Stores messages sent via the contact form.
CREATE TABLE IF NOT EXISTS contact_submissions (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name  TEXT        NOT NULL,
  last_name   TEXT        NOT NULL,
  email       TEXT        NOT NULL,
  message     TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── RPC: decrement_stock ─────────────────────────────────────────────────────
-- Called by the Stripe webhook to reduce stock after a completed purchase.
-- Guards against going below 0.
CREATE OR REPLACE FUNCTION decrement_stock(artwork_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE artworks
     SET stock = GREATEST(stock - 1, 0)
   WHERE id = artwork_id;
END;
$$;

-- ─── Row-Level Security ───────────────────────────────────────────────────────
-- Anyone can read artworks (public gallery).
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "artworks: public read"
  ON artworks FOR SELECT USING (true);

-- Orders and contact submissions are admin-only (service-role bypasses RLS).
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- ─── Indexes ─────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS artworks_featured_idx  ON artworks (featured);
CREATE INDEX IF NOT EXISTS orders_artwork_id_idx   ON orders (artwork_id);
CREATE INDEX IF NOT EXISTS orders_stripe_id_idx    ON orders (stripe_session_id);
