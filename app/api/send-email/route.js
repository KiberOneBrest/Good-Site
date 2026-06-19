import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// In‑memory хранилище для rate limiting
// В продакшене используйте Redis (например, @upstash/ratelimit + @vercel/kv)
const rateLimitStore = new Map();

// Очистка старых записей (вызывается при каждом запросе)
function cleanExpiredEntries() {
  const now = Date.now();
  for (const [ip, timestamps] of rateLimitStore.entries()) {
    const filtered = timestamps.filter((ts) => now - ts < 60000); // 60 секунд
    if (filtered.length === 0) {
      rateLimitStore.delete(ip);
    } else {
      rateLimitStore.set(ip, filtered);
    }
  }
}

// Проверка лимита: не более 3 запросов за минуту
function isRateLimited(ip) {
  cleanExpiredEntries();
  const now = Date.now();
  const timestamps = rateLimitStore.get(ip) || [];
  if (timestamps.length >= 3) {
    return true;
  }
  timestamps.push(now);
  rateLimitStore.set(ip, timestamps);
  return false;
}

// Вспомогательная функция для получения IP клиента
function getClientIP(request) {
  // Для Vercel / Edge: request.ip
  // Или из заголовков при прокси
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.ip || 'unknown';
}

export async function POST(request) {
  try {
    // 1. Проверка rate limit
    const clientIP = getClientIP(request);
    if (isRateLimited(clientIP)) {
      return new Response(
        JSON.stringify({ error: 'Слишком много запросов. Попробуйте через минуту.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Получение и валидация данных
    const body = await request.json();
    const { firstName, lastName, age } = body;

    if (!firstName || !lastName || !age) {
      return new Response(
        JSON.stringify({ error: 'Все поля обязательны' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 3. Отправка письма через Resend
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', // замените на свой подтверждённый домен
      to: [process.env.RECIPIENT_EMAIL || 'kiberone7777@gmail.com'],
      subject: 'Новая заявка с сайта',
      html: `
        <h2>Данные формы</h2>
        <p><strong>Имя:</strong> ${firstName}</p>
        <p><strong>Фамилия:</strong> ${lastName}</p>
        <p><strong>Возраст:</strong> ${age}</p>
      `,
    });

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Письмо отправлено!' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: 'Ошибка сервера' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
