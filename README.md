# lms-api — Backend KidLearn

API cho KidLearn (NestJS 12 + Prisma 7 + MySQL). Giao diện ở repo `lms-web` gọi API qua đường `/api/v1/...` (ADR-005).

## Đã có (nền tảng, chưa có tính năng Lát 1)

| Phần | Ý nghĩa nghiệp vụ |
|---|---|
| Cơ sở dữ liệu | Đủ 15 bảng theo Data Model v1.2.0 (gia đình, bé, kế hoạch theo ngày, bài, câu hỏi, lịch, lượt làm, trả lời, sticker, đổi thưởng, mục tiêu tuần, cấu hình...) |
| Dữ liệu khởi tạo | 1 gia đình, 1 bé, cấu hình mặc định CFG-01…09, 3 nhân vật xe đua |
| PIN khu phụ huynh | Kiểm tra phía máy chủ; sai 5 lần khoá 5 phút (BRL-010); tự khoá sau 30 phút không thao tác; nút Khoá |
| Kiểm tra sức khoẻ | `/api/v1/health` và `/api/v1/health/db` |
| Tự kiểm tra (CI) | Mỗi lần đẩy code GitHub tự chạy lint, build, test với MySQL thật |

## Chạy trên máy

```bash
cp .env.example .env      # rồi điền mật khẩu MySQL, PIN_SECRET, SEED_PIN
npm install
npm run db:migrate        # tạo/cập nhật bảng
npm run db:seed           # tạo dữ liệu khởi tạo (chạy lại không sao)
npm run start:dev         # API chạy ở http://localhost:4000
```

Mở http://localhost:4000/api/v1/health/db, thấy `"database":"ok"` là chạy đúng.

Quên PIN: sửa `SEED_PIN` trong `.env` rồi chạy `npm run db:seed -- --reset-pin`.

## Danh sách API hiện có

| Phương thức | Đường dẫn | Cần PIN | Mục đích |
|---|---|---|---|
| GET | /api/v1/health | Không | API đang chạy |
| GET | /api/v1/health/db | Không | Kết nối được MySQL |
| GET | /api/v1/child/profile | Không | Tên gọi, nhân vật, số sticker của bé |
| POST | /api/v1/parent/unlock | — | Nhập PIN `{ "pin": "1234" }` để mở khu phụ huynh |
| POST | /api/v1/parent/lock | Không | Khoá khu phụ huynh |
| GET | /api/v1/parent/status | Không | Khu phụ huynh đang mở hay khoá |
| GET | /api/v1/parent/ping | Có | Mẫu API được bảo vệ bằng PIN |

## Kiểm thử

```bash
npm test          # kiểm thử đơn vị (không cần DB)
npm run test:e2e  # kiểm thử đầu-cuối, cần MySQL và đã seed
```
