/*
  # Update freight_quotes table to store imperial units

  1. Schema Changes
    - Update cargo dimensions to store in original imperial units (feet/inches)
    - Update weight to store in pounds (not tons)
    - Update volume calculation to work with imperial units
    - Add constraints for imperial measurements

  2. Notes
    - Dimensions stored in feet or inches as entered by user
    - Weight stored in pounds as entered by user
    - Volume calculated in cubic feet or cubic inches based on dimension_unit
    - No metric conversion - pure imperial storage
*/

-- Update the cargo_volume column to be a regular decimal column (not computed)
-- since we need to handle different units
DO $$
BEGIN
  -- Drop the existing computed column if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'freight_quotes' AND column_name = 'cargo_volume'
  ) THEN
    ALTER TABLE freight_quotes DROP COLUMN cargo_volume;
  END IF;
END $$;

-- Add cargo_volume as a regular decimal column
ALTER TABLE freight_quotes ADD COLUMN IF NOT EXISTS cargo_volume decimal(12,6);

-- Update check constraints to allow for imperial measurements
-- Drop existing constraints
ALTER TABLE freight_quotes DROP CONSTRAINT IF EXISTS freight_quotes_cargo_length_positive;
ALTER TABLE freight_quotes DROP CONSTRAINT IF EXISTS freight_quotes_cargo_width_positive;
ALTER TABLE freight_quotes DROP CONSTRAINT IF EXISTS freight_quotes_cargo_height_positive;

-- Add new constraints for imperial measurements
ALTER TABLE freight_quotes ADD CONSTRAINT freight_quotes_cargo_length_positive CHECK (cargo_length > 0);
ALTER TABLE freight_quotes ADD CONSTRAINT freight_quotes_cargo_width_positive CHECK (cargo_width > 0);
ALTER TABLE freight_quotes ADD CONSTRAINT freight_quotes_cargo_height_positive CHECK (cargo_height > 0);

-- Update dimension unit constraint to only allow imperial units
ALTER TABLE freight_quotes DROP CONSTRAINT IF EXISTS freight_quotes_dimension_unit_valid;
ALTER TABLE freight_quotes ADD CONSTRAINT freight_quotes_dimension_unit_valid CHECK (dimension_unit IN ('inches', 'feet'));

-- Update the gross_weight column comment to indicate it's stored in pounds
COMMENT ON COLUMN freight_quotes.gross_weight IS 'Weight in pounds (lbs)';
COMMENT ON COLUMN freight_quotes.cargo_length IS 'Length in feet or inches (see dimension_unit)';
COMMENT ON COLUMN freight_quotes.cargo_width IS 'Width in feet or inches (see dimension_unit)';
COMMENT ON COLUMN freight_quotes.cargo_height IS 'Height in feet or inches (see dimension_unit)';
COMMENT ON COLUMN freight_quotes.cargo_volume IS 'Volume in cubic feet or cubic inches (see dimension_unit)';
COMMENT ON COLUMN freight_quotes.dimension_unit IS 'Unit for dimensions: inches or feet';