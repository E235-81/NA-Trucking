/*
  # Add cargo dimensions to freight_quotes table

  1. Schema Changes
    - Add `cargo_length` (decimal, required) - stored in meters
    - Add `cargo_width` (decimal, required) - stored in meters  
    - Add `cargo_height` (decimal, required) - stored in meters
    - Add `cargo_volume` (decimal, computed) - stored in cubic meters
    - Add `dimension_unit` (text) - tracks original input unit for reference

  2. Notes
    - Dimensions are converted to meters for standardized storage
    - Volume is automatically calculated from length × width × height
    - Original unit is preserved for potential future reference
    - Weight remains in tons (converted from pounds in frontend)
*/

-- Add cargo dimension columns to freight_quotes table
DO $$
BEGIN
  -- Add cargo_length column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'freight_quotes' AND column_name = 'cargo_length'
  ) THEN
    ALTER TABLE freight_quotes ADD COLUMN cargo_length decimal(10,3) NOT NULL DEFAULT 0;
  END IF;

  -- Add cargo_width column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'freight_quotes' AND column_name = 'cargo_width'
  ) THEN
    ALTER TABLE freight_quotes ADD COLUMN cargo_width decimal(10,3) NOT NULL DEFAULT 0;
  END IF;

  -- Add cargo_height column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'freight_quotes' AND column_name = 'cargo_height'
  ) THEN
    ALTER TABLE freight_quotes ADD COLUMN cargo_height decimal(10,3) NOT NULL DEFAULT 0;
  END IF;

  -- Add cargo_volume column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'freight_quotes' AND column_name = 'cargo_volume'
  ) THEN
    ALTER TABLE freight_quotes ADD COLUMN cargo_volume decimal(12,6) GENERATED ALWAYS AS (cargo_length * cargo_width * cargo_height) STORED;
  END IF;

  -- Add dimension_unit column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'freight_quotes' AND column_name = 'dimension_unit'
  ) THEN
    ALTER TABLE freight_quotes ADD COLUMN dimension_unit text DEFAULT 'feet';
  END IF;
END $$;

-- Create index on cargo_volume for efficient queries
CREATE INDEX IF NOT EXISTS idx_freight_quotes_cargo_volume ON freight_quotes(cargo_volume);

-- Add check constraints to ensure positive dimensions
DO $$
BEGIN
  -- Check constraint for cargo_length
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'freight_quotes_cargo_length_positive'
  ) THEN
    ALTER TABLE freight_quotes ADD CONSTRAINT freight_quotes_cargo_length_positive CHECK (cargo_length > 0);
  END IF;

  -- Check constraint for cargo_width
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'freight_quotes_cargo_width_positive'
  ) THEN
    ALTER TABLE freight_quotes ADD CONSTRAINT freight_quotes_cargo_width_positive CHECK (cargo_width > 0);
  END IF;

  -- Check constraint for cargo_height
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'freight_quotes_cargo_height_positive'
  ) THEN
    ALTER TABLE freight_quotes ADD CONSTRAINT freight_quotes_cargo_height_positive CHECK (cargo_height > 0);
  END IF;

  -- Check constraint for dimension_unit
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'freight_quotes_dimension_unit_valid'
  ) THEN
    ALTER TABLE freight_quotes ADD CONSTRAINT freight_quotes_dimension_unit_valid CHECK (dimension_unit IN ('inches', 'feet'));
  END IF;
END $$;