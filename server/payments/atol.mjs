function hasValue(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function toRubles(kopecks) {
  return Number((Number(kopecks) / 100).toFixed(2));
}

function formatAtolTimestamp(date = new Date()) {
  const pad = (value) => String(value).padStart(2, '0');

  return [
    `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`,
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`,
  ].join(' ');
}

function normalizePhone(phone) {
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

function buildAtolErrorMessage(payload, fallback) {
  const error = payload?.error ?? payload?.Error ?? payload;
  const parts = [
    error?.code,
    error?.text,
    error?.message,
    payload?.message,
  ]
    .map((value) => String(value ?? '').trim())
    .filter(Boolean);

  return parts.length ? parts.join(' | ') : fallback;
}

function isAtolV5(env) {
  return String(env.atolApiUrl ?? '').includes('/v5');
}

export function isAtolConfigured(env) {
  if (!env.atolEnabled) {
    return false;
  }

  return [
    env.atolApiUrl,
    env.atolInn,
    env.atolGroupCode,
    env.atolLogin,
    env.atolPassword,
    env.atolCompanyEmail,
    env.atolPaymentAddress,
  ].every(hasValue);
}

export async function getAtolToken(env) {
  const response = await fetch(`${env.atolApiUrl}/getToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      login: env.atolLogin,
      pass: env.atolPassword,
    }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok || !hasValue(payload?.token)) {
    throw new Error(
      buildAtolErrorMessage(payload, 'АТОЛ не вернул токен авторизации.'),
    );
  }

  return payload.token;
}

export function buildAtolSellPayload(order, env) {
  const amount = toRubles(order.amount);
  const customer = {};
  const customerEmail = String(order.customer?.email ?? '').trim();
  const customerPhone = normalizePhone(order.customer?.phone);

  if (customerEmail) {
    customer.email = customerEmail;
  }

  if (customerPhone) {
    customer.phone = customerPhone;
  }

  if (order.customer?.name) {
    customer.name = String(order.customer.name).trim();
  }

  const item = {
    name: order.course.title.slice(0, 128),
    price: amount,
    quantity: 1,
    sum: amount,
    payment_method: env.atolPaymentMethod,
    payment_object: env.atolPaymentObject,
    vat: {
      type: env.atolVat,
    },
  };

  if (isAtolV5(env)) {
    item.measure = Number(env.atolMeasure);
  } else {
    item.measurement_unit = env.atolMeasurementUnit;
  }

  return {
    timestamp: formatAtolTimestamp(),
    external_id: `tbank-${order.orderId}`,
    service: {
      callback_url: env.atolCallbackUrl,
    },
    receipt: {
      client: customer,
      company: {
        email: env.atolCompanyEmail,
        sno: env.atolTaxation,
        inn: env.atolInn,
        payment_address: env.atolPaymentAddress,
      },
      items: [item],
      payments: [
        {
          type: 1,
          sum: amount,
        },
      ],
      total: amount,
    },
  };
}

export async function createAtolSellReceipt(order, env) {
  if (!isAtolConfigured(env)) {
    return {
      skipped: true,
      reason: 'АТОЛ не включён или не настроен.',
    };
  }

  const token = await getAtolToken(env);
  const requestPayload = buildAtolSellPayload(order, env);
  const url = `${env.atolApiUrl}/${encodeURIComponent(env.atolGroupCode)}/sell`;
  const response = await fetch(`${url}?token=${encodeURIComponent(token)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestPayload),
  });
  const responsePayload = await response.json().catch(() => ({}));

  if (!response.ok || !hasValue(responsePayload?.uuid)) {
    throw new Error(
      buildAtolErrorMessage(responsePayload, 'АТОЛ не принял чек прихода.'),
    );
  }

  return {
    skipped: false,
    uuid: responsePayload.uuid,
    status: responsePayload.status ?? null,
    requestPayload,
    raw: responsePayload,
  };
}
