# Tích Hợp Chat Cặp Đôi Vào ChatBox & Quản Lý Dữ Liệu Cloudflare D1 & Next.js API Proxy - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Loại bỏ hoàn toàn trang riêng `/couple` và menu điều hướng tĩnh "Cặp đôi", tích hợp trọn vẹn toàn bộ tính năng kết nối cặp đôi và chat thời gian thực (realtime) vào Floating ChatBox có sẵn của ứng dụng, đồng thời lưu trữ và đồng bộ dữ liệu qua Cloudflare D1 Database, WebSocket Worker và Next.js API Route Proxy.

**Architecture:** 
- Giao diện người dùng: Tích hợp trực tiếp vào `Floating ChatBox` (`ChatBox.tsx`, `CoupleChatTab.tsx`) gồm 2 tab (Cặp đôi và Trợ lý HYUN), điều phối mở từ sự kiện URL hoặc click từ Profile Menu / Navigation Menu.
- Next.js API Route Proxy (`/api/couple/[...action]`): Cung cấp REST endpoints nội bộ bảo vệ CORS và HTTPS mixed-content, chuyển tiếp cuộc gọi đến Cloudflare Worker hoặc fallback an toàn sang in-memory cache, đồng thời hỗ trợ tra cứu hồ sơ người thương qua Email hoặc User ID từ bảng `profiles`.
- Backend Cloudflare Worker: Cung cấp HTTP REST API và WebSocket Server (chat tức thì, typing, thả tim bay, trạng thái online/offline).
- Database: Cloudflare D1 (SQLite at the Edge) & In-memory cache lưu trữ vĩnh viễn bảng `couples`, `couple_requests`, `couple_messages`.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, Cloudflare Workers, Cloudflare D1 (SQLite), WebSockets, Supabase Profiles.

---

## Global Constraints
- Loại bỏ hoàn toàn liên kết `/couple` ở `MainHeader` và `NavigationMenu`.
- Trang `src/app/couple/page.tsx` tự động chuyển hướng về `/?openChat=couple` để đảm bảo tương thích ngược.
- Không làm gián đoạn tính năng của Tab Trợ lý Bot hiện có trong ChatBox.
- Không yêu cầu thay đổi schema trên Supabase; bảng `profiles` chỉ dùng để đọc thông tin hiển thị (tên, avatar).
- Hỗ trợ chạy local mượt mà qua lệnh `npm run dev` (`next dev` + `wrangler dev` song song).
- Đảm bảo `npm run build` pass 100% không có lỗi TypeScript hay linting.

---

### Task 1: Thiết Kế & Cập Nhật Schema Cloudflare D1 Database (Đã hoàn thành)
- [x] Step 1: Viết test cho tầng DB logic (D1 & memory cache)
- [x] Step 2: Cập nhật schema.sql với đầy đủ 3 bảng D1
- [x] Step 3: Cập nhật `src/types.ts` và `src/db.ts` trên Cloudflare Worker
- [x] Step 4: Chạy test xác nhận tầng DB (`node cloudflare-chat-worker/test/db.test.js`)
- [x] Step 5: Commit `6da4173`

---

### Task 2: Triển Khai Cloudflare Worker HTTP REST APIs (Đã hoàn thành)
- [x] Step 1: Viết test cho các HTTP endpoints
- [x] Step 2: Cập nhật router HTTP trong `cloudflare-chat-worker/src/index.ts`
- [x] Step 3: Chạy test xác nhận các route HTTP (`node cloudflare-chat-worker/test/api.test.js`)
- [x] Step 4: Commit `6715c35`

---

### Task 3: Xây Dựng Next.js API Route Proxy & Profile Resolver
**Files:**
- Create: `src/app/api/couple/[...action]/route.ts`
- Test: `scripts/test-api-couple-proxy.js`

**Interfaces:**
- Produces: 
  - `GET /api/couple/status?userId=<id>`: Lấy active couple (kèm partner profile), incoming requests (kèm sender profile), outgoing requests (kèm receiver profile).
  - `POST /api/couple/request`: Body `{ senderId, target }` (hỗ trợ target là UUID hoặc Email).
  - `POST /api/couple/accept`: Body `{ requestId, userId }`.
  - `POST /api/couple/reject`: Body `{ requestId, userId }`.
  - `POST /api/couple/cancel`: Body `{ requestId, userId }`.
  - `POST /api/couple/unpair`: Body `{ coupleId, userId }`.
  - `POST /api/couple/anniversary`: Body `{ coupleId, userId, date }`.
  - `POST /api/couple/message`: Body `{ coupleId, senderId, text, type }` (lưu tin nhắn qua HTTP khi socket gián đoạn).
  - `GET /api/couple/messages?coupleId=<id>`: Lấy 100 tin gần nhất qua HTTP.

- [ ] **Step 1: Viết test script kiểm thử Next.js API Couple Proxy**
- [ ] **Step 2: Triển khai Route Handler trong `src/app/api/couple/[...action]/route.ts`**
  - Chuyển tiếp tới Cloudflare Worker (`http://127.0.0.1:8787` hoặc fallback in-memory).
  - Tích hợp tra cứu profile từ Supabase qua UUID hoặc Email.
  - Tự động gắn `partner`, `sender_profile`, `receiver_profile` trước khi trả về client.
- [ ] **Step 3: Chạy test script xác nhận proxy hoạt động chuẩn xác**
- [ ] **Step 4: Commit**

---

### Task 4: Cập Nhật Client Services & Hooks Trong Next.js
**Files:**
- Modify: `src/services/coupleService.ts`
- Modify: `src/hooks/useCouple.ts`
- Modify: `src/hooks/useCoupleChat.ts`
- Test: `scripts/test-couple-service.js`

**Interfaces:**
- Consumes: Next.js API `/api/couple/*` & WebSocket Worker (`ws://127.0.0.1:8787` / `NEXT_PUBLIC_CF_CHAT_WS_URL`).
- Produces: React Hooks `useCouple` & `useCoupleChat` cung cấp trạng thái tức thì, tự động kết nối lại và HTTP fallback.

- [ ] **Step 1: Cập nhật `src/services/coupleService.ts`**
  - Thay thế toàn bộ truy vấn Supabase `couples` và `couple_requests` (gây lỗi PGRST205) bằng các lệnh fetch tới `/api/couple/*`.
- [ ] **Step 2: Cập nhật `src/hooks/useCoupleChat.ts`**
  - Bổ sung HTTP fallback nạp tin nhắn từ `/api/couple/messages` khi WebSocket chưa kết nối.
  - Hỗ trợ gửi tin nhắn qua HTTP `/api/couple/message` nếu socket bị ngắt.
- [ ] **Step 3: Chạy test kiểm tra TypeScript compilation**
- [ ] **Step 4: Commit**

---

### Task 5: Hoàn Thiện Giao Diện ChatBox & CoupleChatTab
**Files:**
- Modify: `src/components/chat/CoupleChatTab.tsx`
- Modify: `src/components/NavigationMenu.tsx`
- Modify: `src/components/navigation/MainHeader.tsx`
- Modify: `src/app/couple/page.tsx`

**Interfaces:**
- UI:
  - Form kết nối cho phép nhập User ID hoặc Email người thương.
  - Tự động hiển thị tên thật và avatar đối phương khi đã ghép đôi.
  - Tính toán số ngày yêu chuẩn xác (tránh lỗi NaN).
  - Dọn dẹp liên kết `/couple`, đảm bảo mọi nơi đều kích hoạt mở `openChatBox("couple")`.

- [ ] **Step 1: Cập nhật `CoupleChatTab.tsx`**
  - Input label & placeholder: "Nhập User ID hoặc Email của đối phương...".
  - Safe parsing cho `daysTogether`.
- [ ] **Step 2: Dọn dẹp `NavigationMenu.tsx` và `MainHeader.tsx`**
- [ ] **Step 3: Cập nhật `src/app/couple/page.tsx` điều hướng an toàn**
- [ ] **Step 4: Commit**

---

### Task 6: Kiểm Thử Toàn Diện & Verification
**Files:**
- Run: `npm run build`
- Run: `node cloudflare-chat-worker/test/db.test.js`
- Run: `node cloudflare-chat-worker/test/api.test.js`
- Run: `node scripts/test-cf-worker-ws.js`
- Run: `node scripts/test-api-couple-proxy.js`

- [ ] **Step 1: Chạy toàn bộ test suites**
- [ ] **Step 2: Chạy `npm run build` xác nhận không có lỗi build/type**
- [ ] **Step 3: Commit & Push hoàn thiện**
