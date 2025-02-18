/*
  # Initial Schema for Shipping Application

  1. New Tables
    - `profiles`
      - Extended user profile information
      - Linked to auth.users
    - `routes`
      - Published shipping routes
      - Origin, destination, date, capacity
    - `shipments`
      - Package shipment requests
      - Links routes with users requesting shipping
    
  2. Security
    - RLS enabled on all tables
    - Policies for authenticated users
*/

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  phone TEXT,
  rating DECIMAL(3,2) DEFAULT 5.0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create routes table
CREATE TABLE routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  carrier_id UUID REFERENCES profiles(id) NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  departure_date DATE NOT NULL,
  arrival_date DATE NOT NULL,
  max_weight DECIMAL(10,2) NOT NULL,
  price_per_kg DECIMAL(10,2) NOT NULL,
  available_capacity DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create shipments table
CREATE TABLE shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID REFERENCES routes(id) NOT NULL,
  sender_id UUID REFERENCES profiles(id) NOT NULL,
  package_description TEXT NOT NULL,
  weight DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Routes policies
CREATE POLICY "Routes are viewable by everyone"
  ON routes FOR SELECT
  USING (true);

CREATE POLICY "Users can create routes"
  ON routes FOR INSERT
  WITH CHECK (auth.uid() = carrier_id);

CREATE POLICY "Carriers can update own routes"
  ON routes FOR UPDATE
  USING (auth.uid() = carrier_id);

-- Shipments policies
CREATE POLICY "Users can view own shipments"
  ON shipments FOR SELECT
  USING (
    auth.uid() = sender_id OR 
    auth.uid() IN (
      SELECT carrier_id FROM routes WHERE id = route_id
    )
  );

CREATE POLICY "Users can create shipments"
  ON shipments FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update own shipments"
  ON shipments FOR UPDATE
  USING (auth.uid() = sender_id);

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_routes_updated_at
  BEFORE UPDATE ON routes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_shipments_updated_at
  BEFORE UPDATE ON shipments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();