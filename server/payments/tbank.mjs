import crypto from 'node:crypto';

function hasValue(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function buildTbankErrorMessage(payload, fallback) {
  const parts = [payload?.ErrorCode, payload?.Message, payload?.Details]
    .map((value) => String(value ?? '').trim())
    .filter(Boolean);

  return parts.length ? parts.join(' | ') : fallback;
}

export function buildTbankToken(payload, password) {
  const tokenSource = { Password: password };

  for (const [key, value] of Object.entries(payload)) {
    if (key === 'Token' || value == null || typeof value === 'object') {
      continue;
    }

    tokenSource[key] = String(value);
  }

  const rawToken = Object.keys(tokenSource)
    .sort()
    .map((key) => tokenSource[key])
    .join('');

  return crypto.createHash('sha256').update(rawToken, 'utf8').digest('hex');
}

export function isTbankConfigured(env) {
  return hasValue(env.tbankTerminalKey) && hasValue(env.tbankPassword);
}

export function assertTbankConfigured(env) {
  if (!isTbankConfigured(env)) {
    throw new Error('Т-Банк ещё не настроен: заполните TBANK_TERMINAL_KEY и TBANK_PASSWORD.');
  }
}

export function normalizePhone(phone) {
  const value = String(phone ?? '').trim();
  const digits = value.replace(/\D/g, '');

  if (digits.length === 11 && digits.startsWith('8')) {
    return `+7${digits.slice(1)}`;
  }

  if (digits.length === 11 && digits.startsWith('7')) {
    return `+${digits}`;
  }

  if (value.startsWith('+')) {
    return value;
  }

  return value;
}

function withOrderId(url, orderId) {
  const parsedUrl = new URL(url);
  parsedUrl.searchParams.set('order_id', orderId);
  return parsedUrl.toString();
}

export function buildTbankInitPayload(order, env) {
  const payload = {
    TerminalKey: env.tbankTerminalKey,
    Amount: order.amount,
    OrderId: order.orderId,
    Description: order.description.slice(0, 140),
    PayType: env.tbankPayType,
    Language: 'ru',
    NotificationURL: env.tbankNotificationUrl,
    SuccessURL: withOrderId(env.tbankSuccessUrl, order.orderId),
    FailURL: withOrderId(env.tbankFailUrl, order.orderId),
    DATA: {
      Email: order.customer.email,
      Phone: normalizePhone(order.customer.phone),
      Name: order.customer.name,
      CourseId: order.course.id,
      Promo: order.promo,
    },
  };

  if (env.tbankSendReceipt) {
    payload.Receipt = {
      Email: order.customer.email,
      Phone: normalizePhone(order.customer.phone),
      Taxation: env.tbankTaxation,
      Items: [
        {
          Name: order.course.title.slice(0, 128),
          Price: order.amount,
          Quantity: 1,
          Amount: order.amount,
          Tax: env.tbankVat,
          PaymentMethod: env.tbankPaymentMethod,
          PaymentObject: env.tbankPaymentObject,
        },
      ],
    };

    if (env.tbankFfdVersion) {
      payload.Receipt.FfdVersion = env.tbankFfdVersion;
    }
  }

  return payload;
}

export async function createTbankPayment(order, env) {
  assertTbankConfigured(env);

  const payload = buildTbankInitPayload(order, env);
  const requestPayload = {
    ...payload,
    Token: buildTbankToken(payload, env.tbankPassword),
  };

  let response;

  try {
    response = await fetch(`${env.tbankApiUrl}/Init`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestPayload),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'неизвестная ошибка сети';
    throw new Error(`Не удалось отправить запрос Init в Т-Банк: ${message}`);
  }

  let responsePayload;

  try {
    responsePayload = await response.json();
  } catch {
    throw new Error('Т-Банк вернул некорректный JSON на запрос Init.');
  }

  if (!response.ok || !responsePayload?.Success || !hasValue(responsePayload?.PaymentURL)) {
    throw new Error(
      buildTbankErrorMessage(responsePayload, 'Т-Банк не вернул ссылку на оплату.'),
    );
  }

  return {
    paymentId: String(responsePayload.PaymentId ?? '').trim(),
    paymentUrl: String(responsePayload.PaymentURL ?? '').trim(),
    status: String(responsePayload.Status ?? '').trim(),
    raw: responsePayload,
  };
}

export function validateTbankNotificationToken(body, password) {
  const providedToken = String(body?.Token ?? '').trim().toLowerCase();

  if (!providedToken || !hasValue(password)) {
    return false;
  }

  return buildTbankToken(body, password) === providedToken;
}

export function mapTbankStatus(status, success) {
  const normalizedStatus = String(status ?? '').trim().toUpperCase();

  if (success && normalizedStatus === 'CONFIRMED') {
    return 'succeeded';
  }

  if (['REJECTED', 'CANCELED', 'DEADLINE_EXPIRED'].includes(normalizedStatus)) {
    return 'failed';
  }

  return 'pending';
}
