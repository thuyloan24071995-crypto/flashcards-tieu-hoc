# Flashcards Tiểu Học (Web)

Trang web flashcards cho học sinh tiểu học. **Không cần đăng nhập** — chỉ mở link là học.

## Chạy trên máy (tuỳ chọn)
1) Cài Node.js (khuyến nghị LTS)
2) Trong thư mục dự án:

```bash
npm install
npm run dev
```

## Deploy để có link chia sẻ (miễn phí)

### Cách 1 — Vercel (dễ nhất)
- Đẩy code lên GitHub
- Vào Vercel → New Project → Import repo
- Build Command: `npm run build`
- Output: `dist`
- Deploy → nhận link dạng `https://...vercel.app`

### Cách 2 — Netlify
- Đẩy code lên GitHub
- Vào Netlify → Add new site → Import an existing project
- Build command: `npm run build`
- Publish directory: `dist`

## Gợi ý cho lớp học
- Dán link lên nhóm lớp/Zalo, hoặc tạo QR code.
- Học sinh mở trên điện thoại/máy tính bảng là dùng được.
