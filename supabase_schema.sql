-- =========================================================================
-- CLICK KARO DATE KARO - SUPABASE POSTGRESQL CRM & CMS DATABASE SCHEMA
-- =========================================================================
-- Run this SQL in your Supabase Project: Dashboard -> SQL Editor -> New query -> Run
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -------------------------------------------------------------------------
-- 1. CLIENTS / USERS TABLE (Customer Identity & CRM)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firebase_uid TEXT UNIQUE,
    auth_provider TEXT DEFAULT 'guest', -- 'google', 'phone', 'guest'
    full_name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'seeker', -- 'seeker', 'companion', 'admin'
    city TEXT,
    pin_code TEXT,
    is_verified BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}'::jsonb,
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup by phone, email, and firebase_uid
CREATE INDEX IF NOT EXISTS idx_clients_firebase_uid ON public.clients(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_clients_phone ON public.clients(phone);
CREATE INDEX IF NOT EXISTS idx_clients_email ON public.clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_city ON public.clients(city);

-- -------------------------------------------------------------------------
-- 2. BOOKINGS TABLE (Orders & Concierge CRM)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_code TEXT UNIQUE NOT NULL, -- e.g. CK-BK-49821
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    client_name TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    client_email TEXT,
    service_id TEXT NOT NULL, -- 'movie-partner', 'coffee-partner', 'travel-partner', etc.
    service_title TEXT NOT NULL,
    city TEXT NOT NULL,
    pin_code TEXT NOT NULL,
    booking_date DATE NOT NULL,
    hours INTEGER NOT NULL DEFAULT 2,
    total_price NUMERIC(10, 2) NOT NULL,
    companion_id TEXT,
    companion_name TEXT,
    companion_avatar TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'matched', 'confirmed', 'in_progress', 'completed', 'cancelled'
    payment_status TEXT DEFAULT 'unpaid', -- 'unpaid', 'pending', 'paid', 'refunded'
    concierge_notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_code ON public.bookings(booking_code);
CREATE INDEX IF NOT EXISTS idx_bookings_client_phone ON public.bookings(client_phone);
CREATE INDEX IF NOT EXISTS idx_bookings_city ON public.bookings(city);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(booking_date);

-- -------------------------------------------------------------------------
-- 3. PARTNER APPLICATIONS TABLE (Recruitment & Companion Onboarding CRM)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.partner_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_code TEXT UNIQUE NOT NULL, -- e.g. CK-PT-71923
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    city TEXT NOT NULL,
    pin_code TEXT NOT NULL,
    selected_plan TEXT DEFAULT '1-year',
    plan_price NUMERIC(10, 2) DEFAULT 499.00,
    kyc_status TEXT DEFAULT 'pending_verification', -- 'pending_verification', 'verified', 'flagged'
    status TEXT DEFAULT 'submitted', -- 'submitted', 'under_review', 'approved', 'rejected'
    reviewer_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_partner_apps_phone ON public.partner_applications(phone);
CREATE INDEX IF NOT EXISTS idx_partner_apps_city ON public.partner_applications(city);
CREATE INDEX IF NOT EXISTS idx_partner_apps_status ON public.partner_applications(status);

-- -------------------------------------------------------------------------
-- 4. WAITLIST LEADS TABLE (Geographical Expansion Intelligence)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.waitlist_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pin_code TEXT NOT NULL,
    city TEXT,
    phone TEXT,
    source TEXT DEFAULT 'landing_launch_cities_checker',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_waitlist_pin ON public.waitlist_leads(pin_code);

-- -------------------------------------------------------------------------
-- 5. COMPANIONS CMS TABLE (Dynamic Companion Profiles)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.companions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    city TEXT NOT NULL,
    pin_code TEXT NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 4.9,
    review_count INTEGER DEFAULT 0,
    hourly_rate NUMERIC(10, 2) NOT NULL DEFAULT 1999.00,
    avatar_url TEXT NOT NULL,
    bio TEXT,
    badges TEXT[] DEFAULT '{}',
    services TEXT[] DEFAULT '{}',
    verified_kyc BOOLEAN DEFAULT true,
    online BOOLEAN DEFAULT true,
    distance_km NUMERIC(4, 1) DEFAULT 1.5,
    languages TEXT[] DEFAULT ARRAY['English', 'Hindi'],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 6. SITE ASSETS CMS TABLE (Dynamic Website Visuals & Hero Images)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_assets (
    id TEXT PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    category TEXT NOT NULL, -- 'hero', 'service', 'brand', 'testimonial'
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Enable public read & insert for landing interactions
-- -------------------------------------------------------------------------
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_assets ENABLE ROW LEVEL SECURITY;

-- Allow public inserts and selects for client app
CREATE POLICY "Allow public insert to clients" ON public.clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select clients" ON public.clients FOR SELECT USING (true);
CREATE POLICY "Allow public update clients" ON public.clients FOR UPDATE USING (true);

CREATE POLICY "Allow public insert to bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select bookings" ON public.bookings FOR SELECT USING (true);

CREATE POLICY "Allow public insert to partner_applications" ON public.partner_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select partner_applications" ON public.partner_applications FOR SELECT USING (true);

CREATE POLICY "Allow public insert to waitlist_leads" ON public.waitlist_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select waitlist_leads" ON public.waitlist_leads FOR SELECT USING (true);

CREATE POLICY "Allow public read companions" ON public.companions FOR SELECT USING (true);
CREATE POLICY "Allow public insert companions" ON public.companions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update companions" ON public.companions FOR UPDATE USING (true);

CREATE POLICY "Allow public update bookings" ON public.bookings FOR UPDATE USING (true);
CREATE POLICY "Allow public read site_assets" ON public.site_assets FOR SELECT USING (true);

-- -------------------------------------------------------------------------
-- INITIAL CMS SEED: VERIFIED COMPANIONS
-- -------------------------------------------------------------------------
INSERT INTO public.companions (id, name, age, city, pin_code, rating, review_count, hourly_rate, avatar_url, bio, badges, services, verified_kyc, online, distance_km, languages)
VALUES 
('comp-priya', 'Priya Sharma', 24, 'Delhi NCR', '110001', 4.98, 142, 1999.00, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80', 'Literature graduate & verified lifestyle companion in Connaught Place & Saket. Friendly, cultured, and respectful company for cafe talks, dining, movies, and city road trips.', ARRAY['Official Companion', '100% Aadhaar KYC', 'Top Rated Partner'], ARRAY['hangout', 'movie-partner', 'clubbing', 'lunch-dinner', 'travel-partner', 'coffee-partner'], true, true, 1.5, ARRAY['Hindi', 'English']),
('comp-2', 'Anjali Mehta', 26, 'Mumbai', '400050', 5.00, 218, 2999.00, 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80', 'Fashion stylist & social connector in Bandra. Verified companion for chic rooftop lounges, weekend clubbing, gourmet dinners, and road trips.', ARRAY['Clubbing Specialist', 'Fine Dining', 'Verified VIP'], ARRAY['clubbing', 'lunch-dinner', 'travel-partner', 'coffee-partner'], true, true, 3.2, ARRAY['Hindi', 'English', 'Gujarati']),
('comp-3', 'Rohan Kapoor', 27, 'Bangalore', '560001', 4.92, 89, 1999.00, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80', 'Startup product designer & outdoor enthusiast in Indiranagar & Koramangala. Available for social meetups, cafe work sessions, gym company, and weekend hikes.', ARRAY['Tech Networking', 'Fitness Buddy', 'English Fluent'], ARRAY['hangout', 'movie-partner', 'coffee-partner', 'travel-partner'], true, true, 2.1, ARRAY['English', 'Hindi', 'Kannada']),
('comp-4', 'Kavya Singhania', 23, 'Jaipur', '302001', 4.95, 67, 1999.00, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80', 'History student & food explorer in C-Scheme & Malviya Nagar. Loves traditional cuisine, photography walks, quiet cafe study sessions, and museum tours.', ARRAY['Cultural Guide', 'Heritage Dining', 'Photography'], ARRAY['hangout', 'lunch-dinner', 'coffee-partner', 'movie-partner'], true, false, 4.5, ARRAY['Hindi', 'English', 'Marwari']),
('comp-5', 'Aarav Verma', 28, 'Dehradun', '248001', 4.88, 54, 2499.00, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80', 'Architect & guitarist residing in Rajpur Road. Ideal companion for Mussoorie scenic drives, cafe hopping, peaceful mountain getaways, and evening dinner talks.', ARRAY['Mountain Treks', 'Road Trips', 'Campfire Acoustic'], ARRAY['travel-partner', 'hangout', 'coffee-partner', 'lunch-dinner'], true, true, 1.8, ARRAY['Hindi', 'English']),
('comp-6', 'Meera Iyer', 25, 'Chandigarh', '160017', 4.97, 112, 1999.00, 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80', 'Creative writer in Sector 17 & 35. Warm, energetic conversationalist for live theatre, Elante mall movies, jazz bars, and peaceful lake evening strolls.', ARRAY['Sukhna Lake Regular', 'Live Gigs', 'Film Lover'], ARRAY['movie-partner', 'clubbing', 'hangout', 'coffee-partner'], true, true, 2.8, ARRAY['Hindi', 'English', 'Punjabi'])
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  pin_code = EXCLUDED.pin_code,
  hourly_rate = EXCLUDED.hourly_rate,
  rating = EXCLUDED.rating;

