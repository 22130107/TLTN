# HYUN - Nền Tảng Trải Nghiệm & Khám Phá Ẩm Thực Thông Minh

Nền tảng web hiện đại hỗ trợ thực khách khám phá các địa điểm ăn uống, đọc bài viết ẩm thực, đặt lịch hẹn trải nghiệm cùng bạn bè và tương tác bản đồ ẩm thực trực quan.

## Tính Năng Chính

- **Khám phá ẩm thực đa dạng**: Tìm kiếm quán ăn theo khu vực, danh mục, khoảng giá và xếp hạng với bộ lọc tiếng Việt tối ưu.
- **Tạp chí & Bài viết cộng đồng**: Chuyên trang bài viết ẩm thực phong phú, hỗ trợ người dùng đăng bài viết trải nghiệm gắn trực quan với từng quán ăn.
- **Lập lịch hẹn Food Tour**: Đặt lịch hẹn thưởng thức món ngon, chọn khung giờ, số lượng người và ghi chú chi tiết.
- **Bản đồ số Leaflet tương tác**: Trực quan hóa vị trí các điểm đến ẩm thực với ghim tùy chỉnh và hiệu ứng điều hướng mượt mà.
- **Hồ sơ cá nhân thời gian thực**: Quản lý danh sách quán đã lưu, bài viết đã đăng, lịch hẹn và định vị GPS địa phương.
- **Progressive Web App (PWA)**: Hỗ trợ cài đặt trực tiếp trên iOS, Android, máy tính để bàn và lưu trữ bộ nhớ đệm ngoại tuyến (Offline cache).

## Công Nghệ Sử Dụng

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, PostCSS, Neo-Brutalist Design System
- **Database & Auth**: Supabase (PostgreSQL, Row Level Security, Supabase Auth)
- **Object Storage**: Cloudflare R2 (S3-compatible) lưu trữ hình ảnh & CDN
- **Map & Geolocation**: Leaflet, OpenStreetMap API, Geolocation API

## Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Cài đặt các gói phụ thuộc:
```bash
npm install
```

### 2. Khởi chạy máy chủ phát triển:
```bash
npm run dev
```
Mở trình duyệt tại [http://localhost:3000](http://localhost:3000) để trải nghiệm ứng dụng.

### 3. Đóng gói bản Production:
```bash
npm run build
npm run start
```
