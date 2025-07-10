/*
  # Fix RLS policies for freight_quotes table

  1. Security Updates
    - Drop existing policies that may be causing conflicts
    - Create new comprehensive policies for freight_quotes table
    - Allow anonymous users to insert freight quotes (for public form)
    - Allow authenticated users to read and update freight quotes
    - Ensure policies work correctly with the form submission

  2. Policy Details
    - INSERT: Allow anonymous users to create new freight quotes
    - SELECT: Allow authenticated users to read all freight quotes
    - UPDATE: Allow authenticated users to update freight quotes
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow public to insert freight quotes" ON freight_quotes;
DROP POLICY IF EXISTS "Allow authenticated users to read freight quotes" ON freight_quotes;
DROP POLICY IF EXISTS "Allow authenticated users to update freight quotes" ON freight_quotes;

-- Create new INSERT policy for anonymous users (public form submissions)
CREATE POLICY "Enable insert for anonymous users"
  ON freight_quotes
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create SELECT policy for authenticated users
CREATE POLICY "Enable read access for authenticated users"
  ON freight_quotes
  FOR SELECT
  TO authenticated
  USING (true);

-- Create UPDATE policy for authenticated users
CREATE POLICY "Enable update for authenticated users"
  ON freight_quotes
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE freight_quotes ENABLE ROW LEVEL SECURITY;