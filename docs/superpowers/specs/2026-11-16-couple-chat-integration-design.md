# Thiết Kế Tích Hợp Chat Cặp Đôi Vào ChatBox & Quản Lý Dữ Liệu Cloudflare D1

## 1. Tổng Quan & Bối Cảnh (Overview)
- **Vấn đề hiện tại:**
  - Ứng dụng trước đó có trang riêng `/couple` và liên kết điều hướng "Cặp đôi" trên Header chính, làm phân mảnh trải nghiệm người dùng khi phải chuyển trang.
  - Các bảng dữ liệu cặp đôi trên Supabase chưa được khởi tạo dẫn đến lỗi không thể kết nối, tra cứu hay gửi lời mời ghép đôi.
  - Kết nối WebSocket chat cặp đôi chưa được đồng bộ hoàn chỉnh giữa Cloudflare Worker và ứng dụng Next.js, khiến tin nhắn không lưu trữ vĩnh viễn và bị mất khi tải lại trang.
- **Mục tiêu giải pháp:**
  - Loại bỏ hoàn toàn trang độc lập `/couple` và gỡ bỏ liên kết "Cặp đôi" khỏi thanh điều hướng chính (`MainHeader` và `NavigationMenu`).
  - Hợp nhất toàn bộ tính năng Cặp đôi (lấy mã kết nối, gửi/nhận lời mời, quản lý ngày kỷ niệm, hủy ghép đôi, chat thời gian thực, thả tim bay, trạng thái trực tuyến) vào **Floating ChatBox** sẵn có của website.
  - Quản lý toàn bộ dữ liệu Cặp đôi & Tin nhắn trên **Cloudflare D1 Database (SQLite at the Edge)** và **Cloudflare Worker WebSocket**, giải phóng sự phụ thuộc vào các migration Supabase.

---

## 2. Thay Đổi Điều Hướng & Routing (Navigation & Routing)

### 2.1 Loại bỏ trang `/couple`
- File `src/app/couple/page.tsx` sẽ tự động chuyển hướng người dùng về trang chủ kèm cờ mở box chat: `redirect("/?openChat=couple")`.
- Không còn bất kỳ trang giao diện tĩnh nào cho `/couple`.

### 2.2 Dọn dẹp thanh điều hướng
- **`src/components/navigation/MainHeader.tsx`:**
  - Danh sách `navItems` trên Header máy tính và Menu Drawer di động chỉ còn 3 mục chính: *Trang chủ*, *Khám phá*, *Bài viết*.
  - Trong Menu tài khoản cá nhân (Profile Dropdown), mục "Cặp đôi & Trò chuyện" khi nhấp vào sẽ kích hoạt sự kiện `openChatBox("couple")` để mở ngay Box chat mà không chuyển trang.
- **`src/components/NavigationMenu.tsx`:**
  - Loại bỏ liên kết URL `/couple`, chuyển mục "Cặp đôi & Chat" thành nút gọi trực tiếp `openChatBox("couple")`.

---

## 3. Kiến Trúc Cơ Sở Dữ Liệu Cloudflare D1

Schema SQLite trên Cloudflare D1 (`cloudflare-chat-worker/schema.sql`):

```sql
-- 1. Bảng lưu thông tin các cặp đôi
CREATE TABLE IF NOT EXISTS couples (
  id TEXT PRIMARY KEY,
  user_1 TEXT NOT NULL,
  user_2 TEXT NOT NULL,
  anniversary_date TEXT NOT NULL,
  nickname_1 TEXT,
  nickname_2 TEXT,
  status TEXT NOT NULL DEFAULT 'active', -- 'active' | 'separated'
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- 2. Bảng lưu lời mời ghép đôi
CREATE TABLE IF NOT EXISTS couple_requests (
  id TEXT PRIMARY KEY,
  sender_id TEXT NOT NULL,
  receiver_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'accepted' | 'rejected' | 'canceled'
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- 3. Bảng lưu tin nhắn trò chuyện
CREATE TABLE IF NOT EXISTS couple_messages (
  id TEXT PRIMARY KEY,
  couple_id TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  text TEXT NOT NULL,
  type TEXT DEFAULT 'text', -- 'text' | 'heart'
  status TEXT DEFAULT 'sent',
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_couples_users ON couples(user_1, user_2);
CREATE INDEX IF NOT EXISTS idx_requests_receiver ON couple_requests(receiver_id, status);
CREATE INDEX IF NOT EXISTS idx_requests_sender ON couple_requests(sender_id, status);
CREATE INDEX IF NOT EXISTS idx_messages_couple ON couple_messages(couple_id, created_at ASC);
```

---

## 4. Cloudflare Worker API & WebSocket Protocol

### 4.1 HTTP REST Endpoints (CORS Enabled)
- `GET /api/couple/status?userId=<id>`: Trả về mối quan hệ active hiện tại của `userId`, danh sách lời mời nhận được (`incoming`) và danh sách lời mời đã gửi (`outgoing`).
- `POST /api/couple/request`: Nhận `{ senderId, receiverId }`. Kiểm tra hợp lệ (không tự mời chính mình, không có cặp đôi active, chưa có lời mời pending).
- `POST /api/couple/accept`: Nhận `{ requestId, userId }`. Cập nhật trạng thái request thành `accepted`, tạo bản ghi trong bảng `couples`, hủy các request pending khác của 2 bên.
- `POST /api/couple/reject`: Nhận `{ requestId, userId }`. Đánh dấu `rejected`.
- `POST /api/couple/cancel`: Nhận `{ requestId, userId }`. Người gửi thu hồi lời mời (`canceled`).
- `POST /api/couple/unpair`: Nhận `{ coupleId, userId }`. Đánh dấu cặp đôi `separated`.
- `POST /api/couple/anniversary`: Nhận `{ coupleId, userId, anniversaryDate }`. Cập nhật ngày kỷ niệm.

### 4.2 WebSocket Protocol
- Kết nối URL: `wss://.../?coupleId=<id>&userId=<id>` (Local dev: `ws://127.0.0.1:8787/?coupleId=...`)
- Sự kiện hỗ trợ:
  - `join`: Khách hàng tham gia phòng. Server nạp 100 tin nhắn gần nhất từ bảng `couple_messages` và trả về `history`, đồng thời gửi `partner_status` (Online/Offline).
  - `message`: Nhận tin nhắn, ghi vào bảng `couple_messages` qua D1 và phát sóng ngay lập tức tới cả 2 người.
  - `typing`: Đồng bộ trạng thái đối phương đang gõ phím (`isTyping: true/false`).
  - `heart_ping`: Hiển thị hiệu ứng mưa tim / tim bay trên màn hình của người thương.
  - `partner_status`: Tự động kích hoạt khi socket của đối phương kết nối hoặc ngắt kết nối.

---

## 5. Thiết Kế Giao Diện Box Chat (Floating ChatBox UI)

### 5.1 Cấu trúc Tab Kép
- Box chat nổi ở góc dưới bên phải (`src/components/ChatBox.tsx`):
  - **Tab 1: ❤️ Cặp đôi / [Tên người thương]**: Quản lý ghép đôi & phòng chat người thương. Có chấm đỏ thông báo khi có lời mời kết nối đang chờ.
  - **Tab 2: 🤖 Trợ lý HYUN**: Tư vấn quán ăn ngon, gợi ý món ăn chuẩn gu.

### 5.2 Trạng thái của Tab Cặp đôi (`CoupleChatTab.tsx`)
1. **Chưa đăng nhập:** Hiển thị thông báo thân thiện và nút "Đăng nhập ngay ❤️" mở AuthModal.
2. **Đã đăng nhập nhưng chưa ghép đôi (Pairing Dashboard):**
   - Hộp "Mã kết nối của bạn" hiển thị User ID kèm nút "Sao chép" 1 chạm.
   - Form nhập User ID người thương kèm nút "Gửi lời mời kết nối ❤️".
   - Danh sách "Lời mời nhận được": Hiển thị người gửi kèm 2 nút "Đồng ý ❤️" và "Từ chối".
   - Danh sách "Lời mời đã gửi": Hiển thị mã đối phương kèm nút "Hủy".
3. **Đã ghép đôi (Realtime Chat Room):**
   - Header phòng chat: Avatar người thương, chấm tròn xanh Online / xám Offline, nhãn "Đang trực tuyến" / "Đang soạn tin...", huy hiệu đếm ngày "❤️ X ngày", và nút Cài đặt (bánh răng).
   - Drawer Cài đặt: Form sửa ngày bắt đầu yêu (Anniversary date) và nút "Hủy ghép đôi" (kèm popup xác nhận an toàn).
   - Danh sách tin nhắn: Bong bóng chat phân biệt màu (Tôi: hồng gradient cánh sen, Người thương: xám than tối viền mềm), định dạng giờ gửi rõ ràng, tự động cuộn xuống cuối khi có tin mới.
   - Khung nhập tin nhắn: Ô nhập văn bản, nút chèn nhanh icon ❤️, nút gửi tin nhắn, hoặc nút Thả tim bay khi ô nhập đang trống.
   - Hiệu ứng tim bay (`HeartAnimationOverlay`): Các trái tim màu hồng bay lượn từ dưới lên khi nhận được `heart_ping`.

---

## 6. Kế Hoạch Kiểm Thử & Xác Nhận (Testing & Verification)
1. **Kiểm tra Navigation:** Đảm bảo không còn nút `/couple` trên Header/Menu, không có lỗi 404 khi truy cập URL cũ.
2. **Kiểm tra D1 Database & API:** Chạy kiểm thử tự động các endpoint ghép đôi, gửi/nhận lời mời, cập nhật ngày kỷ niệm trên Cloudflare Worker.
3. **Kiểm tra Chat Realtime:** Giả lập 2 client kết nối đồng thời qua WebSocket để xác nhận:
   - Nhận tin nhắn tức thì < 50ms.
   - Lưu trữ vĩnh viễn vào D1, reload trang không mất tin nhắn.
   - Hiển thị đúng trạng thái đang gõ phím (`typing`) và Online/Offline.
   - Hiệu ứng thả tim bay hoạt động chính xác.
4. **Kiểm tra Build Next.js:** Chạy `npm run build` để đảm bảo không có lỗi TypeScript hoặc linting nào.
