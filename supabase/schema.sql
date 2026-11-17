-- ==============================================================================
-- HYUN (Minkura) Database Schema for Supabase
-- Designed for Next.js 15 App Router Food & Lifestyle Platform
-- Bulletproof Schema: Safe Execution on Fresh Supabase Projects
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PLACES TABLE (1,086 Authentic Places in Southern Vietnam)
CREATE TABLE IF NOT EXISTS public.places (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT NOT NULL,
  cover_image TEXT,
  rating NUMERIC(3, 1) DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  address TEXT NOT NULL,
  district TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'TP. Hồ Chí Minh',
  category_id TEXT,
  badge TEXT,
  badge_color TEXT DEFAULT 'bg-[#FF5376]',
  price_range TEXT DEFAULT '50.000đ - 150.000đ',
  hours TEXT DEFAULT '09:00 - 22:00',
  phone TEXT DEFAULT '0901 234 567',
  story TEXT,
  tags TEXT[] DEFAULT '{}',
  amenities JSONB DEFAULT '[]'::jsonb,
  menu_items JSONB DEFAULT '[]'::jsonb,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY,
  display_name TEXT NOT NULL DEFAULT 'Thực khách HYUN',
  email TEXT,
  avatar_url TEXT DEFAULT '/img/profile-avatar.png',
  bio TEXT DEFAULT 'Tín đồ ẩm thực, thích khám phá các quán ăn ngon và chia sẻ trải nghiệm.',
  phone TEXT,
  level TEXT DEFAULT 'Thực thần tập sự',
  points INTEGER DEFAULT 120,
  badges JSONB DEFAULT '["Check-in 10 quán", "Thành viên tích cực"]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id TEXT NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
  user_id UUID,
  author_name TEXT NOT NULL,
  author_avatar TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  rating NUMERIC(3, 1) NOT NULL DEFAULT 5.0,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ARTICLES TABLE (Food Magazine, Editorial & Blogs)
CREATE TABLE IF NOT EXISTS public.articles (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT[] NOT NULL DEFAULT '{}',
  content_html TEXT,
  quote_text TEXT,
  quote_author TEXT,
  cover_image TEXT NOT NULL,
  gallery TEXT[] DEFAULT '{}',
  category TEXT NOT NULL DEFAULT 'review',
  category_label TEXT NOT NULL DEFAULT 'Review Quán',
  tags TEXT[] DEFAULT '{}',
  author_name TEXT NOT NULL DEFAULT 'Biên tập viên',
  author_avatar TEXT NOT NULL DEFAULT '/img/profile-avatar.png',
  author_role TEXT NOT NULL DEFAULT 'Biên tập viên ẩm thực',
  user_id UUID,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  read_time TEXT DEFAULT '5 phút đọc',
  related_place_id TEXT,
  recommended_dish TEXT,
  cost_per_person TEXT,
  rating NUMERIC(3, 1),
  rating_breakdown JSONB,
  pros TEXT,
  cons TEXT,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. SCHEDULES TABLE (Culinary Tour, Food Bookings & Itinerary)
CREATE TABLE IF NOT EXISTS public.schedules (
  id TEXT PRIMARY KEY DEFAULT ('sch-' || substr(md5(random()::text), 1, 8)),
  user_id UUID,
  place_id TEXT REFERENCES public.places(id) ON DELETE CASCADE,
  scheduled_date DATE NOT NULL DEFAULT CURRENT_DATE,
  time_slot TEXT NOT NULL DEFAULT '18:30 - 20:00',
  party_size INTEGER DEFAULT 2,
  status TEXT NOT NULL DEFAULT 'confirmed',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. FAVORITES TABLE (User bookmarked places)
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  place_id TEXT NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, place_id)
);

-- 9. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_places_district ON public.places(district);
CREATE INDEX IF NOT EXISTS idx_places_city ON public.places(city);
CREATE INDEX IF NOT EXISTS idx_places_featured ON public.places(is_featured);
CREATE INDEX IF NOT EXISTS idx_places_rating ON public.places(rating DESC);
CREATE INDEX IF NOT EXISTS idx_articles_published ON public.articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_place ON public.reviews(place_id);

-- 10. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Public read permissions
DO $$ BEGIN
  CREATE POLICY "Allow public read places" ON public.places FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow service_role full places" ON public.places FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow public read categories" ON public.categories FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow service_role full categories" ON public.categories FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow public read reviews" ON public.reviews FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow service_role full reviews" ON public.reviews FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow public read articles" ON public.articles FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow service_role full articles" ON public.articles FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow public read profiles" ON public.profiles FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow service_role full profiles" ON public.profiles FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow public read schedules" ON public.schedules FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow service_role full schedules" ON public.schedules FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow public read favorites" ON public.favorites FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow service_role full favorites" ON public.favorites FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 11. COUPLES & COUPLE REQUESTS (Cặp đôi & Lời mời ghép đôi)
CREATE TABLE IF NOT EXISTS public.couples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_1 UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_2 UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  anniversary_date DATE NOT NULL DEFAULT CURRENT_DATE,
  nickname_1 TEXT,
  nickname_2 TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'separated')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT check_distinct_users CHECK (user_1 <> user_2)
);

CREATE INDEX IF NOT EXISTS idx_couples_user_1 ON public.couples(user_1) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_couples_user_2 ON public.couples(user_2) WHERE status = 'active';

CREATE TABLE IF NOT EXISTS public.couple_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'canceled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT check_distinct_request_users CHECK (sender_id <> receiver_id)
);

CREATE INDEX IF NOT EXISTS idx_couple_requests_receiver ON public.couple_requests(receiver_id, status);
CREATE INDEX IF NOT EXISTS idx_couple_requests_sender ON public.couple_requests(sender_id, status);

ALTER TABLE public.couples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.couple_requests ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Allow public read couples" ON public.couples FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow service_role full couples" ON public.couples FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow public read couple_requests" ON public.couple_requests FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow service_role full couple_requests" ON public.couple_requests FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 12. COUPLE MESSAGES (Lưu trữ tin nhắn cặp đôi)
CREATE TABLE IF NOT EXISTS public.couple_messages (
  id TEXT PRIMARY KEY DEFAULT ('msg-' || substr(md5(random()::text), 1, 10)),
  couple_id UUID NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  type TEXT DEFAULT 'text',
  status TEXT DEFAULT 'sent',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_couple_messages_lookup ON public.couple_messages(couple_id, created_at DESC);

ALTER TABLE public.couple_messages ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Allow public read couple_messages" ON public.couple_messages FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow service_role full couple_messages" ON public.couple_messages FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;


