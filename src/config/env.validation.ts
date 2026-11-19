/**
 * Kiểm tra biến môi trường lúc khởi động: thiếu biến bắt buộc thì API
 * dừng ngay với thông báo rõ ràng, thay vì lỗi khó hiểu lúc chạy.
 */
const REQUIRED = [
  'DB_HOST',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'PIN_SECRET',
] as const;

export function validateEnv(config: Record<string, unknown>) {
  const missing = REQUIRED.filter(
    (k) => config[k] === undefined || config[k] === null,
  );
  if (missing.length > 0) {
    throw new Error(`Thiếu biến môi trường: ${missing.join(', ')}`);
  }
  const secret = String(config.PIN_SECRET);
  if (secret.length < 32) {
    throw new Error('PIN_SECRET phải dài ít nhất 32 ký tự');
  }
  return config;
}
