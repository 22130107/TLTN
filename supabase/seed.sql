-- ==============================================================================
-- HYUN (Minkura) Initial Seed Data for Supabase
-- Populates exact data matching the website interface
-- ==============================================================================

-- 1. SEED CATEGORIES
INSERT INTO public.categories (id, name, icon, description, display_order)
VALUES
  ('quan-an', 'Quán ăn', '🍙', 'Các quán ăn gia đình, đặc sản truyền thống', 1),
  ('ca-phe', 'Cà phê & Trà', '☕', 'Không gian cà phê chill, làm việc và hẹn hò', 2),
  ('nha-hang', 'Nhà hàng', '🍽️', 'Nhà hàng sang trọng, ẩm thực Nhật, Âu, Á', 3),
  ('via-he', 'Quán vỉa hè', '🏮', 'Ăn vặt đường phố, nhậu đêm bình dân', 4),
  ('khac', 'Khác', '🌸', 'Tiệm bánh, tráng miệng, ẩm thực chay', 5)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  icon = EXCLUDED.icon;

-- 2. SEED FEATURED & EXPLORE PLACES
INSERT INTO public.places (
  id, name, image, rating, review_count, address, district, city,
  category_id, badge, badge_color, price_range, hours, phone,
  story, tags, amenities, menu_items, latitude, longitude, is_featured
)
VALUES
  (
    'sakura-restaurant',
    'Sakura Japanese Restaurant',
    '/img/sakura-restaurant.jpg',
    4.7,
    142,
    'Số 120 Đường Nguyễn Du, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    'Quận 1',
    'TP. Hồ Chí Minh',
    'nha-hang',
    'Nhà hàng Nhật',
    'bg-[#FF5376]',
    '150.000đ - 450.000đ',
    '10:30 - 22:30',
    '0902 456 789',
    'Sakura mang đến trải nghiệm ẩm thực xứ sở Phù Tang chân thực nhất giữa lòng Sài Gòn. Toàn bộ hải sản được nhập khẩu trực tiếp hàng ngày và được chế biến bởi các đầu bếp hơn 10 năm kinh nghiệm.',
    ARRAY['Sushi', 'Ramen', 'Yakiniku', 'Sashimi'],
    '[
      {"icon": "🅿️", "label": "Chỗ đỗ ô tô & xe máy rộng"},
      {"icon": "📶", "label": "Wi-Fi tốc độ cao miễn phí"},
      {"icon": "💳", "label": "Thanh toán thẻ & chuyển khoản"},
      {"icon": "🏮", "label": "Phòng VIP riêng tư phong cách Nhật"}
    ]'::jsonb,
    '[
      {"name": "Set Nigiri Cá Hồi Thượng Hạng", "price": "199.000đ", "desc": "Cá hồi Na Uy tươi sống kết hợp cơm giấm Akasu truyền thống", "isSignature": true},
      {"name": "Mì Ramen Tonkotsu Nước Dùng 18h", "price": "145.000đ", "desc": "Nước hầm xương heo béo ngậy kèm trứng lòng đào và thịt chashu", "isSignature": true},
      {"name": "Bò Wagyu Nướng Sốt Teriyaki", "price": "389.000đ", "desc": "Thịt bò vân mỡ tan chảy trên chảo gang nóng hổi", "isSignature": false},
      {"name": "Tempura Hải Sản Giòn Rụm", "price": "129.000đ", "desc": "Tôm sú và rau củ organic tẩm bột chiên vàng giòn rụm", "isSignature": false}
    ]'::jsonb,
    10.7769,
    106.7009,
    true
  ),
  (
    'luna-cafe',
    'Luna Cafe & Bistro',
    '/img/luna-cafe.jpg',
    4.8,
    215,
    '45 Đường Ngô Đức Kế, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    'Quận 1',
    'TP. Hồ Chí Minh',
    'ca-phe',
    'Dành cho cặp đôi',
    'bg-[#FF5376]',
    '45.000đ - 120.000đ',
    '07:30 - 23:00',
    '0903 888 999',
    'Luna Cafe & Bistro là điểm hẹn hò lãng mạn với ánh sáng ấm cúng, âm nhạc acoustic du dương và các món đồ uống signature pha chế tỉ mỉ.',
    ARRAY['Café', 'Âu', 'View đẹp', 'Bistro'],
    '[
      {"icon": "📶", "label": "Wi-Fi tốc độ cao"},
      {"icon": "🔌", "label": "Ổ cắm điện từng bàn"},
      {"icon": "🌸", "label": "Góc check-in sống ảo cực đẹp"},
      {"icon": "🎵", "label": "Acoustic live tối thứ 6 & 7"}
    ]'::jsonb,
    '[
      {"name": "Cold Brew Hoa Hồng", "price": "65.000đ", "desc": "Cà phê ủ lạnh kết hợp siro cánh hoa hồng thơm ngát", "isSignature": true},
      {"name": "Mỳ Ý Sốt Kem Nấm Truffle", "price": "135.000đ", "desc": "Sợi mỳ dẻo dai quyện sốt kem béo ngậy và hương nấm đặc trưng", "isSignature": true},
      {"name": "Croissant Bơ Pháp Nướng Nóng", "price": "45.000đ", "desc": "Bánh sừng bò ngàn lớp giòn tan thơm lừng bơ", "isSignature": false}
    ]'::jsonb,
    10.7735,
    106.7042,
    true
  ),
  (
    'bui-vien',
    'Phố Ẩm Thực Bùi Viện',
    '/img/bui-vien.jpg',
    4.5,
    380,
    'Khu phố Tây Bùi Viện, Phường Phạm Ngũ Lão, Quận 1, TP. Hồ Chí Minh',
    'Quận 1',
    'TP. Hồ Chí Minh',
    'via-he',
    'Quán ăn đường phố',
    'bg-emerald-500',
    '30.000đ - 180.000đ',
    '16:00 - 03:00 sáng',
    '0909 111 222',
    'Thiên đường ẩm thực đêm nhộn nhịp bậc nhất Sài Gòn quy tụ hàng trăm món ăn vặt đường phố hấp dẫn cùng âm nhạc sôi động.',
    ARRAY['Đặc sản', 'Đường phố', 'Giá tốt', 'Ăn đêm'],
    '[
      {"icon": "🍺", "label": "Bia mát lạnh & đồ nhắm"},
      {"icon": "🛵", "label": "Gửi xe máy thuận tiện"},
      {"icon": "🌃", "label": "Không khí về đêm rực rỡ"}
    ]'::jsonb,
    '[
      {"name": "Xiên Nướng Sa Tế Ngũ Vị", "price": "15.000đ/xiên", "desc": "Bò cuộn nấm kim châm, ba chỉ nướng than hoa cay nồng", "isSignature": true},
      {"name": "Ốc Hương Sốt Trứng Muối", "price": "120.000đ", "desc": "Ốc tươi giòn sần sật đẫm sốt bơ béo", "isSignature": true}
    ]'::jsonb,
    10.7674,
    106.6934,
    true
  ),
  (
    'riverside-garden',
    'Riverside Garden',
    '/img/riverside-garden.jpg',
    4.6,
    98,
    'Khu Bờ Sông Thanh Đa, Phường 27, Quận Bình Thạnh, TP. Hồ Chí Minh',
    'Bình Thạnh',
    'TP. Hồ Chí Minh',
    'nha-hang',
    'View đẹp',
    'bg-sky-500',
    '120.000đ - 350.000đ',
    '09:00 - 22:00',
    '0908 333 444',
    'Không gian sân vườn sinh thái ven sông xanh mát, nơi bạn có thể thưởng thức hải sản tươi sống và đón những cơn gió trong lành.',
    ARRAY['Việt Nam', 'Âu', 'Hải sản', 'Gia đình'],
    '[
      {"icon": "🌊", "label": "View trực diện sông thoáng mát"},
      {"icon": "🅿️", "label": "Bãi đỗ xe ô tô miễn phí"},
      {"icon": "👶", "label": "Ghế ăn cho trẻ em"}
    ]'::jsonb,
    '[
      {"name": "Tôm Càng Xanh Nướng Mọi", "price": "290.000đ", "desc": "Tôm tươi chắc thịt nướng than thơm lừng", "isSignature": true},
      {"name": "Cá Lóc Nướng Trui Cuốn Bánh Tráng", "price": "180.000đ", "desc": "Món ăn miệt vườn chuẩn vị kèm rau rừng tươi ngon", "isSignature": true}
    ]'::jsonb,
    10.8123,
    106.7231,
    true
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  rating = EXCLUDED.rating,
  address = EXCLUDED.address;

-- 3. SEED ARTICLES
INSERT INTO public.articles (
  id, slug, title, excerpt, content, quote_text, quote_author, cover_image,
  category, category_label, tags, author_name, author_avatar, author_role,
  published_at, read_time, related_place_id, views, likes, is_featured
)
VALUES
  (
    'tinh-hoa-sushi-sakura',
    'tinh-hoa-sushi-sakura',
    'Nghệ Thuật Ẩm Thực Omakase & Hương Vị Cá Hồi Tươi Sống Tại Sakura',
    'Khám phá hành trình tạo nên từng miếng Nigiri hoàn hảo với kỹ thuật dùng dao điêu luyện của các đầu bếp xứ Phù Tang ngay giữa lòng Sài Gòn.',
    ARRAY[
      'Ẩm thực Nhật Bản từ lâu đã nổi tiếng với triết lý tôn trọng vị nguyên bản của nguyên liệu tươi ngon nhất. Tại Sakura Japanese Restaurant, mỗi lát sashimi cá hồi Na Uy hay cá ngừ đại dương đều được xử lý ở nhiệt độ chuẩn xác để giữ trọn vẹn từng thớ mỡ béo ngậy tan chảy trên đầu lưỡi.',
      'Không gian quán mang đậm phong cách truyền thống với vách gỗ Shoji ấm cúng và ánh đèn vàng dịu nhẹ. Ngồi tại quầy sushi bar, thực khách có thể tận mắt chiêm ngưỡng bàn tay tài hoa của bếp trưởng khi thoăn thoắt nặn từng viên cơm giấm Akasu dẻo thơm kết hợp cùng hải sản tươi rói vừa cập bến mỗi sáng.',
      'Đặc biệt, món lẩu Sukiyaki bò Wagyu thượng hạng với nước dùng ngọt thanh từ đậu nành lên men và rau củ hữu cơ chắc chắn sẽ làm xiêu lòng bất kỳ tín đồ mê đồ Nhật nào trong những ngày mưa lất phất của thành phố.'
    ],
    'Ẩm thực Nhật Bản không chỉ là món ăn để lấp đầy dạ dày, mà là một bức tranh tĩnh lặng tôn vinh sự tinh khiết của tự nhiên.',
    'Bếp trưởng Kenji - Sakura Restaurant',
    '/img/sakura-restaurant.jpg',
    'review',
    'Review Quán',
    ARRAY['Sushi', 'Ẩm thực Nhật', 'Omakase', 'Sashimi'],
    'Minh Thư (Foodie)',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    'Biên tập viên ẩm thực',
    NOW(),
    '5 phút đọc',
    'sakura-restaurant',
    1840,
    142,
    true
  ),
  (
    'goc-hen-ho-luna-cafe',
    'goc-hen-ho-luna-cafe',
    'Buổi Chiều Hoàng Hôn Lãng Mạn Tại Luna Cafe & Bistro Quận 1',
    'Tọa lạc trên con phố rợp bóng mát, Luna Cafe đem đến góc hẹn hò lý tưởng cho các cặp đôi với tách Cold Brew hoa hồng và món Steak sốt tiêu đen tuyệt hảo.',
    ARRAY[
      'Nếu bạn đang tìm kiếm một địa điểm hẹn hò vừa riêng tư vừa tinh tế cho dịp cuối tuần, Luna Cafe & Bistro chính là câu trả lời xứng đáng nhất. Bước qua cánh cửa vòm phong cách Paris cổ điển, hương cà phê rang mộc quyện cùng hương bánh sừng bò nướng bơ ngào ngạt sẽ lập tức xua tan đi sự ồn ào của phố thị.',
      'Góc bàn cạnh cửa sổ kính lớn hướng ra ban công hoa giấy là vị trí đắc địa nhất. Khi ánh hoàng hôn buông xuống, những ngọn nến lung linh được thắp lên, biến bữa tối của bạn và người thương thành khoảnh khắc điện ảnh khó quên.',
      'Thực đơn của quán kết hợp hài hòa giữa các dòng cà phê thủ công Pour-over và ẩm thực Bistro Âu hiện đại. Đừng quên thử món Mỳ Ý sốt kem Truffle và bánh Tart trứng béo ngậy trứ danh nhé!'
    ],
    'Một tách cà phê ngon giữa không gian đầy ánh sáng ấm áp chính là chất xúc tác ngọt ngào nhất cho mọi câu chuyện tình yêu.',
    'Luna Bistro Story',
    '/img/luna-cafe.jpg',
    'couple',
    'Hẹn Hò & Tụ Họp',
    ARRAY['Café', 'Hẹn hò', 'Bistro Âu', 'Quận 1'],
    'Hoàng Nam',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    'Reviewer đời sống',
    NOW() - INTERVAL '2 days',
    '4 phút đọc',
    'luna-cafe',
    2420,
    215,
    false
  ),
  (
    'dem-khong-ngu-bui-vien',
    'dem-khong-ngu-bui-vien',
    'Khám Phá Thiên Đường Ẩm Thực Đường Phố Không Ngủ Tại Phố Bùi Viện',
    'Âm nhạc sôi động, khói nướng nghi ngút và những món nhắm dân dã đậm chất hè phố đã tạo nên nhịp sống rực rỡ nhất về đêm của giới trẻ Sài Thành.',
    ARRAY[
      'Khi màn đêm buông xuống và những ánh đèn neon bật sáng rực rỡ, con phố Bùi Viện lại bừng tỉnh với nguồn năng lượng cuồng nhiệt không đâu sánh bằng. Đây không chỉ là nơi gặp gỡ của bạn bè bốn phương mà còn là thiên đường của các món ăn vặt đường phố siêu cuốn.',
      'Từ những que xiên nướng sa tế cay nồng bốc khói, ốc hương sốt trứng muối béo ngậy cho đến món bánh tráng nướng Đà Lạt giòn rụm với trứng cút và mỡ hành, mọi giác quan của bạn sẽ được đánh thức trọn vẹn.',
      'Cảm giác ngồi bên chiếc bàn nhựa con con, nâng ly bia mát lạnh cùng bạn bè và đắm chìm trong tiếng cười nói náo nhiệt chính là trải nghiệm văn hóa đường phố đặc trưng nhất của Sài Gòn.'
    ],
    NULL,
    NULL,
    '/img/bui-vien.jpg',
    'culture',
    'Văn Hóa Ẩm Thực',
    ARRAY['Đường phố', 'Ăn đêm', 'Sài Gòn', 'Bùi Viện'],
    'Lê Cường',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    'Nhiếp ảnh & Ẩm thực',
    NOW() - INTERVAL '4 days',
    '6 phút đọc',
    'bui-vien',
    3100,
    289,
    false
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt;

-- 4. SEED SAMPLE REVIEWS
INSERT INTO public.reviews (place_id, author_name, author_avatar, rating, comment)
VALUES
  ('sakura-restaurant', 'Ngọc Ánh', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 5.0, 'Sashimi cực kỳ tươi và béo, không gian yên tĩnh và phục vụ rất chu đáo. Chắc chắn sẽ quay lại!'),
  ('sakura-restaurant', 'Minh Tuấn', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 4.5, 'Mì ramen nước dùng rất đậm đà, chuẩn vị Nhật. Giá cả hợp lý so với chất lượng.'),
  ('luna-cafe', 'Phương Linh', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 5.0, 'Quán decor siêu xinh, chụp ảnh góc nào cũng đẹp. Bánh croissant giòn thơm nức mũi!'),
  ('bui-vien', 'Trần Hưng', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 4.5, 'Không khí cuối tuần cực sung, đồ nướng ăn kèm bia mát lạnh hết sẩy.');
