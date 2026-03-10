/**
 * Shipping rates by size category and zone (amounts in euro cents).
 *
 * Size definitions (adjust as needed):
 *   small  — up to ~30×40 cm
 *   medium — up to ~60×80 cm
 *   large  — anything bigger
 *
 * Provisional prices — update when you have real courier quotes.
 */
export const SHIPPING_RATES = {
  small:  { de:  800, eu: 1500, world: 2500 },
  medium: { de: 1200, eu: 2200, world: 3500 },
  large:  { de: 1800, eu: 3200, world: 5000 },
};

/**
 * Returns the 3 Stripe shipping_options for a given size category.
 * Falls back to 'medium' if the category is unknown.
 */
export function getShippingOptions(sizeCategory) {
  const rates = SHIPPING_RATES[sizeCategory] ?? SHIPPING_RATES.medium;
  return [
    {
      shipping_rate_data: {
        type: 'fixed_amount',
        fixed_amount: { amount: rates.de, currency: 'eur' },
        display_name: 'Germany',
      },
    },
    {
      shipping_rate_data: {
        type: 'fixed_amount',
        fixed_amount: { amount: rates.eu, currency: 'eur' },
        display_name: 'Europe',
      },
    },
    {
      shipping_rate_data: {
        type: 'fixed_amount',
        fixed_amount: { amount: rates.world, currency: 'eur' },
        display_name: 'Worldwide',
      },
    },
  ];
}

/** Returns the rates object for a size category, for display on the artwork page. */
export function getShippingRates(sizeCategory) {
  return SHIPPING_RATES[sizeCategory] ?? SHIPPING_RATES.medium;
}
