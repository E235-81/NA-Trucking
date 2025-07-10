/*
  # Create freight quotes table

  1. New Tables
    - `freight_quotes`
      - `id` (uuid, primary key)
      - `client_name` (text, required)
      - `client_phone` (text, required)
      - `client_email` (text, required)
      - `from_city` (text, required)
      - `to_city` (text, required)
      - `cargo_specialization` (text, required)
      - `other_cargo_description` (text, optional)
      - `truck_qty` (integer, required)
      - `gross_weight` (decimal, required)
      - `loading_date` (date, required)
      - `loading_hour` (integer, required)
      - `loading_minute` (integer, required)
      - `status` (text, default 'pending')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `freight_quotes` table
    - Add policy for public insert access (for form submissions)
    - Add policy for authenticated users to read all data
*/

CREATE TABLE IF NOT EXISTS freight_quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  client_phone text NOT NULL,
  client_email text NOT NULL,
  from_city text NOT NULL,
  to_city text NOT NULL,
  cargo_specialization text NOT NULL,
  other_cargo_description text DEFAULT '',
  truck_qty integer NOT NULL DEFAULT 1,
  gross_weight decimal(10,2) NOT NULL,
  loading_date date NOT NULL,
  loading_hour integer NOT NULL DEFAULT 9,
  loading_minute integer NOT NULL DEFAULT 0,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE freight_quotes ENABLE ROW LEVEL SECURITY;

-- Allow public to insert freight quotes (for form submissions)
CREATE POLICY "Allow public to insert freight quotes"
  ON freight_quotes
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to read all freight quotes
CREATE POLICY "Allow authenticated users to read freight quotes"
  ON freight_quotes
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to update freight quotes
CREATE POLICY "Allow authenticated users to update freight quotes"
  ON freight_quotes
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create an index on created_at for better query performance
CREATE INDEX IF NOT EXISTS idx_freight_quotes_created_at ON freight_quotes(created_at DESC);

-- Create an index on status for filtering
CREATE INDEX IF NOT EXISTS idx_freight_quotes_status ON freight_quotes(status);

-- Create an index on client_email for lookups
CREATE INDEX IF NOT EXISTS idx_freight_quotes_client_email ON freight_quotes(client_email);