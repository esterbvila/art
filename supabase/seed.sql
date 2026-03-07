-- ═══════════════════════════════════════════════════════════════════════════
-- Seed data — 16 original paintings by Ester Batllori
--
-- BEFORE running:
--   1. Upload all painting images to Supabase Storage bucket "artworks"
--      (or place them in /public/artworks/ for local Next.js serving).
--   2. Replace the image_url values below with the actual public URLs from
--      Supabase Storage, e.g.:
--      https://your-project.supabase.co/storage/v1/object/public/artworks/frigopie-edited.png
--
-- Prices are stored in euro CENTS (360€ → 36000).
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO artworks
  (title, description, process, medium, dimensions, year, price, image_url, stock, featured)
VALUES

-- 1. Memories of Egypt
(
  'Memories of Egypt',
  'This painting emerged from a journey through the ancient landscapes of Egypt — the dusty ochres, sun-bleached walls, and golden light that saturates everything. Working from memory rather than photographs, each brushstroke attempts to capture not what I saw, but what I felt: the weight of history, the warmth of stone, the quiet reverence of standing before something timeless.',
  'Built up in thin, translucent layers — each one drying before the next is applied. The texture comes from letting the brush move instinctively, guided by the memory of place rather than a planned composition.',
  'Acrylic on paper',
  '24×30"',
  '2024',
  36000,
  '/artworks/egipte-horitzontal-editada.png',
  1,
  FALSE
),

-- 2. Everything is possible
(
  'Everything is possible',
  'A spontaneous explosion of colour and line that refuses to stay within any boundary. Painted in a single session, the work captures a moment of complete creative liberation — where doubt dissolves and the hand follows pure instinct.',
  'Painted with acrylic and alcohol pen in a single uninterrupted session. The alcohol pen lines were added last, tracing paths that the brush had already suggested.',
  'Acrylic and alcohol pen',
  '20×20"',
  '2024',
  48000,
  '/artworks/boli-blanc-editat.png',
  1,
  FALSE
),

-- 3. Endometriosis
(
  'Endometriosis',
  'A deeply personal work born from lived experience. The layered reds and warm ochres map an internal landscape — pain rendered visible, transformed through the act of painting into something that can be held, named and understood.',
  'Worked wet-on-wet with a palette knife to build the dense, almost geological surface. Areas of transparency were preserved by wiping back layers before they dried.',
  'Acrylic on paper',
  '30×40"',
  '2024',
  28000,
  '/artworks/Period-edited.png',
  1,
  FALSE
),

-- 4. Sonnstiges Rain
(
  'Sonnstiges Rain',
  'Rain that arrives with the sun still shining. This painting explores the paradox of simultaneous warmth and sadness — brushstrokes running vertically like falling water across a field of gold.',
  'Applied with broad, sweeping gestures using a wide flat brush loaded with diluted paint, allowing the colour to pool and run freely down the surface.',
  'Oil on canvas',
  '24×24"',
  '2024',
  18000,
  '/artworks/pluja-edited.png',
  1,
  FALSE
),

-- 5. Touched by the sun
(
  'Touched by the sun',
  'An investigation of light at its most intense — the moment just before overexposure, when colour bleaches at the edges and the world seems to vibrate. Painted in late summer when the light in the studio was almost unbearable.',
  'Multiple thin glazes of translucent paint were built up over weeks, each layer shifting the temperature of the colour beneath. The central burst was the last element added.',
  'Mixed media',
  '18×24"',
  '2024',
  68000,
  '/artworks/egipt-detailed-edited.png',
  1,
  FALSE
),

-- 6. The pink panther (Featured)
(
  'The pink panther',
  'This piece was born from a single brushstroke that refused to be contained. What began as an experiment with deep reds became a meditation on passion and restraint — the tension between letting go and holding on.',
  'Layered with mixed media including acrylic, ink and collage fragments. The pink tones were achieved by washing transparent rose over a warm underpainting.',
  'Mixed media',
  '30×36"',
  '2024',
  66000,
  '/artworks/frigopie-edited.png',
  1,
  TRUE   -- This is the featured artwork
),

-- 7. Acuatic Peanut
(
  'Acuatic Peanut',
  'Playful and subconscious, this small work emerged from doodling — the kind of painting that reveals its subject only after it is finished. There is something aquatic and organic in the forms, like creatures glimpsed through murky water.',
  'Small format worked quickly in one sitting, with the image built from background to foreground in loosely defined washes.',
  'Mixed media',
  '18×24"',
  '2023',
  16000,
  '/artworks/acuatic-peanut-edited.png',
  1,
  FALSE
),

-- 8. The Nile
(
  'The Nile',
  'A response to the overwhelming scale of the Nile — a body of water that has sustained civilisations for millennia. The painting attempts to hold both the intimacy of a single bank and the vastness of the river''s reach.',
  'Worked on a large canvas in stages: first the sky tones, then the water, finally the earthy banks. The surface was repeatedly scraped and repainted to achieve the weathered, ancient quality.',
  'Acrylic on canvas',
  '36×36"',
  '2023',
  16000,
  '/artworks/egipt-tiny-edited.png',
  1,
  FALSE
),

-- 9. Period.
(
  'Period.',
  'A period at the end of a sentence. A pause. A cycle completed. This painting is about the rhythms of the body and the quiet dignity of things that recur — that are ordinary and extraordinary at the same time.',
  'Painted on linen, which holds the pigment differently from canvas — more absorbent, with a warmer tooth that influences every mark. The composition evolved through many sessions of addition and removal.',
  'Acrylic on linen',
  '20×28"',
  '2024',
  24000,
  '/artworks/menstruation-edited.png',
  1,
  FALSE
),

-- 10. Twin girl
(
  'Twin girl',
  'One half of a diptych. The girl twin holds tension — a sense of things unsaid, of interiority kept carefully contained. Her colours are cooler, quieter than her brother''s, but no less intense beneath the surface.',
  'Painted alongside its pair (Twin boy) in alternating sessions, each work informing the other. The final colour balance was resolved by viewing both canvases side by side.',
  'Acrylic on canvas',
  '30×30"',
  '2024',
  12000,
  '/artworks/twin-girl-dizzy-edited.png',
  1,
  FALSE
),

-- 11. Twin boy
(
  'Twin boy',
  'The other half of the diptych. Warmer, more outwardly exuberant, but with the same underlying complexity. The two works are companions — they can live separately but speak most fully when together.',
  'Worked in oil on canvas to achieve the depth of colour and the slow-drying quality that allowed extensive blending and reworking.',
  'Oil on canvas',
  '18×24"',
  '2024',
  12000,
  '/artworks/twin-boy-edited.png',
  1,
  FALSE
),

-- 12. Alien sea
(
  'Alien sea',
  'The ocean as it might exist on another world — familiar in structure, utterly alien in colour. Blues shift into greens and then into colours without a name. Painted during a period of obsessive reading about deep-sea biology.',
  'Built on a wooden panel with multiple layers of texture medium before the first wash of colour was applied. The final surface has a relief quality that shifts under different lighting conditions.',
  'Acrylic on wood',
  '24×24"',
  '2023',
  62000,
  '/artworks/mar-edited-1.png',
  1,
  FALSE
),

-- 13. Touched by Autumn
(
  'Touched by Autum',
  'The particular melancholy of autumn — not sadness exactly, but a fullness that is also an ending. The painting holds both the richness of the season and the knowledge that it will not last.',
  'Painted outside in early October, with direct observation of the changing light. The canvas was left in the studio for two weeks before the final session, which resolved the tonal relationships.',
  'Acrylic on canvas',
  '20×30"',
  '2023',
  24000,
  '/artworks/tardor-edited.png',
  1,
  FALSE
),

-- 14. Getting over Autumn
(
  'Getting over Autum',
  'The other side. After the peak of autumn, when the leaves are gone and the light is simply grey — and you find that you are fine, that the world is still beautiful in a quieter way.',
  'Painted on linen in a single extended session. The restraint of the palette — limited to a narrow range of warm greys and muted golds — was a conscious decision to work against the richness of the previous painting.',
  'Oil on linen',
  '24×36"',
  '2023',
  8000,
  '/artworks/tiny-1-edited.png',
  1,
  FALSE
),

-- 15. Just do it
(
  'Just do it',
  'A reminder to myself. Painted during a period of creative paralysis, when every idea seemed insufficient before it reached the canvas. The painting is the act of breaking through — imperfect, urgent, and completely alive.',
  'Rapid, gestural work completed in under two hours. No preliminary sketches. The surface was left intentionally rough, preserving the energy of the first marks.',
  'Acrylic on canvas',
  '28×28"',
  '2023',
  8000,
  '/artworks/fosforito-edited.png',
  1,
  FALSE
),

-- 16. Decaff week.
(
  'Decaff week.',
  'Seven days without caffeine. The world went slower, softer, a little more purple at the edges. This small painting is a document of that altered state — everything slightly off-frequency, slightly more bearable.',
  'Small format worked in mixed media including watercolour and acrylic. The lilac tones came from mixing complementary colours rather than using purple directly.',
  'Mixed media',
  '20×20"',
  '2023',
  7000,
  '/artworks/lila-edited.png',
  1,
  FALSE
);
