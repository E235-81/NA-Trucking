/*
  # Add imperial unit columns to freight_quotes table

  1. Schema Changes
    - Add `cargo_length` (decimal) - stored in feet or inches
    - Add `cargo_width` (decimal) - stored in feet or inches
    - Add `cargo_height` (decimal) - stored in feet or inches
    - Add `cargo_volume` (decimal) - stored in cubic feet or inches
    - Add `dimension_unit` (text) - tracks the unit of measurement
    - Update `gross_weight` to be stored in pounds

  2. Notes
    - All dimensions and weights are stored in imperial units, as entered by the user.
    - The `dimension_unit` column will store either 'feet' or 'inches'.
    - The `cargo_volume` column will be calculated in the frontend and stored directly.
*/

-- Add cargo dimension columns to freight_quotes table
ALTER TABLE freight_quotes ADD COLUMN cargo_length decimal(10,3) NOT NULL DEFAULT 0;
ALTER TABLE freight_quotes ADD COLUMN cargo_width decimal(10,3) NOT NULL DEFAULT 0;
ALTER TABLE freight_quotes ADD COLUMN cargo_height decimal(10,3) NOT NULL DEFAULT 0;
ALTER TABLE freight_quotes ADD COLUMN cargo_volume decimal(12,6);
ALTER TABLE freight_quotes ADD COLUMN dimension_unit text DEFAULT 'feet';

-- Add check constraints to ensure positive dimensions
ALTER TABLE freight_quotes ADD CONSTRAINT freight_quotes_cargo_length_positive CHECK (cargo_length >= 0);
ALTER TABLE freight_quotes ADD CONSTRAINT freight_quotes_cargo_width_positive CHECK (cargo_width >= 0);
ALTER TABLE freight_quotes ADD CONSTRAINT freight_quotes_cargo_height_positive CHECK (cargo_height >= 0);

-- Add check constraint for dimension_unit
ALTER TABLE freight_quotes ADD CONSTRAINT freight_quotes_dimension_unit_valid CHECK (dimension_unit IN ('inches', 'feet'));

-- Update the gross_weight column comment to indicate it's stored in pounds
COMMENT ON COLUMN freight_quotes.gross_weight IS 'Weight in pounds (lbs)';
COMMENT ON COLUMN freight_quotes.cargo_length IS 'Length in feet or inches (see dimension_unit)';
COMMENT ON COLUMN freight_quotes.cargo_width IS 'Width in feet or inches (see dimension_unit)';
COMMENT ON COLUMN freight_quotes.cargo_height IS 'Height in feet or inches (see dimension_unit)';
COMMENT ON COLUMN freight_quotes.cargo_volume IS 'Volume in cubic feet or cubic inches (see dimension_unit)';
COMMENT ON COLUMN freight_quotes.dimension_unit IS 'Unit for dimensions: inches or feet';
