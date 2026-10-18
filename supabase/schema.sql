-- ==============================================================================
-- HYUN (Minkura) Database Schema for Supabase
-- Designed for Next.js 15 App Router Food & Lifestyle Platform
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS & DOMAINS
DO $$ BEGIN
  CREATE TYPE article_category_enum AS ENUM ('review', 'culture', 'guide', 'couple');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE schedule_status_enum AS ENUM ('confirmed', 'pending', 'completed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (Linked with Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  email TEXT,
  avatar_url TEXT DEFAULT '/img/profile-avatar.png',
  bio TEXT DEFAULT 'Tín đồ ẩm thực, thích khám phá các quán ăn ngon và chia sẻ trải nghiệm.',
  phone TEXT,
  level TEXT DEFAULT 'Thực thần tập sự',
  points INTEGER DEFAULT 120,
  badges JSONB DEFAULT '["Check-in 10 quán", "Thành viên tích cực", "Chuyên gia ẩm thực Sài Gòn"]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PLACES TABLE (Restaurants, Cafes, Street food spots)
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
  category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
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

-- 6. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id TEXT NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_avatar TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  rating NUMERIC(2, 1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ARTICLES TABLE (Food Magazine, Editorial & Blogs)
CREATE TABLE IF NOT EXISTS public.articles (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT[] NOT NULL,
  quote_text TEXT,
  quote_author TEXT,
  cover_image TEXT NOT NULL,
  category article_category_enum NOT NULL DEFAULT 'review',
  category_label TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  author_name TEXT NOT NULL,
  author_avatar TEXT NOT NULL,
  author_role TEXT NOT NULL DEFAULT 'Biên tập viên ẩm thực',
  published_at TIMESTAMPTZ DEFAULT NOW(),
  read_time TEXT DEFAULT '5 phút đọc',
  related_place_id TEXT REFERENCES public.places(id) ON DELETE SET NULL,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SCHEDULES TABLE (Culinary Tour, Food Bookings & Itinerary)
CREATE TABLE IF NOT EXISTS public.schedules (
  id TEXT PRIMARY KEY DEFAULT ('sch-' || substr(md5(random()::text), 1, 8)),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  place_id TEXT NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
  scheduled_date DATE NOT NULL DEFAULT CURRENT_DATE,
  time_slot TEXT NOT NULL DEFAULT '18:30 - 20:00',
  party_size INTEGER DEFAULT 2,
  status schedule_status_enum NOT NULL DEFAULT 'confirmed',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. FAVORITES TABLE (User bookmarked places)
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  place_id TEXT NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, place_id)
);

-- ==============================================================================
-- INDEXES FOR HIGH-PERFORMANCE SEARCH & FILTERING
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_places_category ON public.places(category_id);
CREATE INDEX IF NOT EXISTS idx_places_district ON public.places(district);
CREATE INDEX IF NOT EXISTS idx_places_featured ON public.places(is_featured);
CREATE INDEX IF NOT EXISTS idx_places_rating ON public.places(rating DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON public.articles(is_featured);
CREATE INDEX IF NOT EXISTS idx_articles_published ON public.articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_place ON public.reviews(place_id);
CREATE INDEX IF NOT EXISTS idx_schedules_user ON public.schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites(user_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Policies (Anyone with publishable key can view)
DROP POLICY IF EXISTS "Public places are viewable by everyone" ON public.places;
CREATE POLICY "Public places are viewable by everyone" ON public.places FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public categories are viewable by everyone" ON public.categories;
CREATE POLICY "Public categories are viewable by everyone" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public articles are viewable by everyone" ON public.articles;
CREATE POLICY "Public articles are viewable by everyone" ON public.articles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public reviews are viewable by everyone" ON public.reviews;
CREATE POLICY "Public reviews are viewable by everyone" ON public.reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);

-- 2. Authenticated User Policies
-- Profiles: Users can edit their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Reviews: Authenticated users can insert reviews
DROP POLICY IF EXISTS "Authenticated users can create reviews" ON public.reviews;
CREATE POLICY "Authenticated users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can delete own reviews" ON public.reviews;
CREATE POLICY "Users can delete own reviews" ON public.reviews FOR DELETE USING (auth.uid() = user_id);

-- Schedules: Users manage their own schedule
DROP POLICY IF EXISTS "Users can view own schedules" ON public.schedules;
CREATE POLICY "Users can view own schedules" ON public.schedules FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can create schedules" ON public.schedules;
CREATE POLICY "Users can create schedules" ON public.schedules FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can update own schedules" ON public.schedules;
CREATE POLICY "Users can update own schedules" ON public.schedules FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own schedules" ON public.schedules;
CREATE POLICY "Users can delete own schedules" ON public.schedules FOR DELETE USING (auth.uid() = user_id);

-- Favorites: Users manage their own favorites
DROP POLICY IF EXISTS "Users can view own favorites" ON public.favorites;
CREATE POLICY "Users can view own favorites" ON public.favorites FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can add favorites" ON public.favorites;
CREATE POLICY "Users can add favorites" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete favorites" ON public.favorites;
CREATE POLICY "Users can delete favorites" ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- ==============================================================================
-- AUTOMATIC TRIGGER: UPDATE PLACE RATING ON NEW REVIEW
-- ==============================================================================
CREATE OR REPLACE FUNCTION update_place_rating_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.places
  SET 
    rating = ROUND((SELECT COALESCE(AVG(rating), 5.0) FROM public.reviews WHERE place_id = COALESCE(NEW.place_id, OLD.place_id)), 1),
    review_count = (SELECT COUNT(*) FROM public.reviews WHERE place_id = COALESCE(NEW.place_id, OLD.place_id)),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.place_id, OLD.place_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_place_rating ON public.reviews;
CREATE TRIGGER trigger_update_place_rating
AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION update_place_rating_stats();

-- ==============================================================================
-- AUTOMATIC TRIGGER: CREATE PROFILE ON NEW USER SIGNUP (SUPABASE AUTH)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '/img/profile-avatar.png')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
