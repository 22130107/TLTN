# Hướng Dẫn Thiết Lập Supabase Cho Dự Án HYUN

## 1. Cấu Hình Thông Tin Khóa API
- **Publishable Key (`anon`)**: Lấy từ Supabase Dashboard > Project Settings > API
- **Secret Key (`service_role`)**: Lấy từ Supabase Dashboard > Project Settings > API

## 2. Lấy URL Dự Án (Project URL)
Trong trang quản trị Supabase Dashboard:
1. Vào **Project Settings** > **API**.
2. Tìm mục **Project URL** (có dạng: `https://[project-ref].supabase.co`).
3. Mở file `.env.local` ở thư mục gốc và thay thế giá trị mẫu bằng thông tin thật của bạn:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   ```

## 3. Tạo Cơ Sở Dữ Liệu Trên Supabase
1. Vào **SQL Editor** trên Supabase Dashboard.
2. Mở file `supabase/schema.sql`, sao chép toàn bộ nội dung và bấm **Run** để khởi tạo:
   - Bảng `profiles`: Hồ sơ người dùng
   - Bảng `categories`: Danh mục ẩm thực (Quán ăn, Cà phê, Nhà hàng, Vỉa hè, Khác)
   - Bảng `places`: Quán ăn, thông tin chi tiết, tiện ích, menu và tọa độ bản đồ
   - Bảng `reviews`: Đánh giá của khách hàng (kèm trigger tự động tính điểm trung bình cho quán)
   - Bảng `articles`: Tạp chí bài viết ẩm thực
   - Bảng `schedules`: Lịch hẹn và kế hoạch food tour
   - Bảng `favorites`: Danh sách quán yêu thích của người dùng
   - Các chỉ mục tối ưu tìm kiếm (Indexes)
   - Phân quyền bảo mật hàng (Row Level Security - RLS)
3. Mở file `supabase/seed.sql`, sao chép toàn bộ nội dung và bấm **Run** để nạp dữ liệu mẫu ban đầu khớp 100% với giao diện hiện tại.
