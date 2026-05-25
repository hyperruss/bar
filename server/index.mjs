import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import {
  createAtolSellReceipt,
  isAtolConfigured,
} from './payments/atol.mjs';
import {
  createTbankPayment,
  isTbankConfigured,
  mapTbankStatus,
  validateTbankNotificationToken,
} from './payments/tbank.mjs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');
const clientDistDir = path.join(projectRoot, 'dist');
const clientIndexFile = path.join(clientDistDir, 'index.html');
const storageDir = path.join(__dirname, 'storage');

const courses = {
  start: {
    id: 'start',
    title: 'Барный старт',
    priceRub: 34990,
  },
  pro: {
    id: 'pro',
    title: 'Миксология PRO',
    priceRub: 59990,
  },
  service: {
    id: 'service',
    title: 'Сервис HoReCa',
    priceRub: 19900,
  },
  waiter: {
    id: 'waiter',
    title: 'Официант',
    priceRub: 29990,
  },
};

function readBooleanEnv(name, fallback) {
  const value = process.env[name];

  if (value == null) {
    return fallback;
  }

  return value.trim().toLowerCase() === 'true';
}

function rublesToKopecks(value) {
  return Math.round(Number(value) * 100);
}

function requireText(value) {
  return String(value ?? '').trim();
}

function buildPublicUrl(pathname) {
  return new URL(pathname, env.publicAppUrl).toString();
}

const env = {
  port: Number(process.env.PORT ?? 8787),
  publicAppUrl: process.env.PUBLIC_APP_URL ?? 'http://localhost:8787',
  tbankApiUrl: process.env.TBANK_API_URL ?? 'https://securepay.tinkoff.ru/v2',
  tbankTerminalKey: process.env.TBANK_TERMINAL_KEY ?? '',
  tbankPassword: process.env.TBANK_PASSWORD ?? process.env.TBANK_SECRET_KEY ?? '',
  tbankNotificationUrl:
    process.env.TBANK_NOTIFICATION_URL ??
    `${process.env.PUBLIC_APP_URL ?? 'http://localhost:8787'}/api/payments/tbank/webhook`,
  tbankSuccessUrl:
    process.env.TBANK_SUCCESS_URL ??
    `${process.env.PUBLIC_APP_URL ?? 'http://localhost:8787'}/payment/success`,
  tbankFailUrl:
    process.env.TBANK_FAIL_URL ??
    `${process.env.PUBLIC_APP_URL ?? 'http://localhost:8787'}/payment/fail`,
  tbankPayType: process.env.TBANK_PAY_TYPE ?? 'O',
  tbankSendReceipt: readBooleanEnv('TBANK_SEND_RECEIPT', true),
  tbankTaxation: process.env.TBANK_TAXATION ?? 'usn_income',
  tbankVat: process.env.TBANK_VAT ?? 'none',
  tbankPaymentMethod: process.env.TBANK_PAYMENT_METHOD ?? 'full_prepayment',
  tbankPaymentObject: process.env.TBANK_PAYMENT_OBJECT ?? 'service',
  tbankFfdVersion: process.env.TBANK_FFD_VERSION ?? '',
  atolEnabled: readBooleanEnv('ATOL_ENABLED', false),
  atolApiUrl: process.env.ATOL_API_URL ?? 'https://online.atol.ru/possystem/v4',
  atolInn: process.env.ATOL_INN ?? '',
  atolGroupCode: process.env.ATOL_GROUP_CODE ?? '',
  atolLogin: process.env.ATOL_LOGIN ?? '',
  atolPassword: process.env.ATOL_PASSWORD ?? '',
  atolCompanyEmail: process.env.ATOL_COMPANY_EMAIL ?? '',
  atolPaymentAddress: process.env.ATOL_PAYMENT_ADDRESS ?? 'https://gold-pour.ru',
  atolCallbackUrl:
    process.env.ATOL_CALLBACK_URL ??
    `${process.env.PUBLIC_APP_URL ?? 'http://localhost:8787'}/api/receipts/atol/callback`,
  atolTaxation: process.env.ATOL_TAXATION ?? 'usn_income',
  atolVat: process.env.ATOL_VAT ?? 'none',
  atolPaymentMethod: process.env.ATOL_PAYMENT_METHOD ?? 'full_prepayment',
  atolPaymentObject: process.env.ATOL_PAYMENT_OBJECT ?? 'service',
  atolMeasure: process.env.ATOL_MEASURE ?? '0',
  atolMeasurementUnit: process.env.ATOL_MEASUREMENT_UNIT ?? 'шт.',
};

const app = express();
const orders = new Map();

app.use(cors());
app.use(express.json({ limit: '64kb' }));
app.use(express.urlencoded({ extended: false, limit: '64kb' }));

async function appendRecord(fileName, record) {
  await fs.mkdir(storageDir, { recursive: true });
  await fs.appendFile(
    path.join(storageDir, fileName),
    `${JSON.stringify(record)}\n`,
    'utf8',
  );
}

async function hydrateOrdersFromStorage() {
  const filePath = path.join(storageDir, 'orders.ndjson');

  try {
    const raw = await fs.readFile(filePath, 'utf8');

    for (const line of raw.split(/\r?\n/).filter(Boolean)) {
      try {
        const order = JSON.parse(line);
        const orderId = order.orderId ?? order.order_id;

        if (orderId) {
          orders.set(orderId, order);
        }
      } catch (error) {
        console.error('Skipping invalid order record:', error);
      }
    }
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      console.error('Failed to hydrate orders:', error);
    }
  }
}

function createOrderFromRequest(body) {
  const courseId = requireText(body.courseId);
  const course = courses[courseId];

  if (!course) {
    throw new Error('Выбранный формат не найден.');
  }

  const customer = {
    name: requireText(body.customer?.name ?? body.name),
    phone: requireText(body.customer?.phone ?? body.phone),
    email: requireText(body.customer?.email ?? body.email),
  };

  if (!customer.name || !customer.phone || !customer.email) {
    throw new Error('Заполните имя, телефон и email.');
  }

  const promo = requireText(body.promo).toUpperCase();
  const discount = promo === 'GOLD10' ? 0.1 : 0;
  const amount = rublesToKopecks(course.priceRub * (1 - discount));
  const orderId = crypto.randomUUID();

  return {
    orderId,
    status: 'pending',
    createdAt: new Date().toISOString(),
    course,
    customer,
    promo,
    amount,
    description: `Gold Pour: ${course.title}`,
  };
}

app.get('/api/health', (_request, response) => {
  response.json({
    ok: true,
    tbank_configured: isTbankConfigured(env),
    atol_enabled: env.atolEnabled,
    atol_configured: isAtolConfigured(env),
  });
});

app.post('/api/payments/create', async (request, response) => {
  try {
    const order = createOrderFromRequest(request.body);
    const payment = await createTbankPayment(order, env);
    const storedOrder = {
      ...order,
      paymentId: payment.paymentId,
      paymentUrl: payment.paymentUrl,
      tbankStatus: payment.status,
    };

    orders.set(order.orderId, storedOrder);
    await appendRecord('orders.ndjson', storedOrder);

    response.json({
      success: true,
      order_id: order.orderId,
      payment_id: payment.paymentId,
      payment_url: payment.paymentUrl,
    });
  } catch (error) {
    console.error('Payment creation failed:', error);
    response.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Не удалось создать платёж.',
    });
  }
});

app.post('/api/payments/tbank/webhook', async (request, response) => {
  try {
    if (!validateTbankNotificationToken(request.body, env.tbankPassword)) {
      response.status(400).send('INVALID TOKEN');
      return;
    }

    const orderId = requireText(request.body.OrderId);
    const currentOrder = orders.get(orderId) ?? { orderId };
    let updatedOrder = {
      ...currentOrder,
      status: mapTbankStatus(request.body.Status, Boolean(request.body.Success)),
      paymentId: requireText(request.body.PaymentId) || currentOrder.paymentId,
      tbankStatus: requireText(request.body.Status),
      webhookReceivedAt: new Date().toISOString(),
      webhookPayload: request.body,
    };

    const shouldCreateAtolReceipt =
      updatedOrder.status === 'succeeded' &&
      isAtolConfigured(env) &&
      !updatedOrder.atolReceiptUuid &&
      updatedOrder.course &&
      updatedOrder.customer &&
      updatedOrder.amount;

    if (shouldCreateAtolReceipt) {
      try {
        const receipt = await createAtolSellReceipt(updatedOrder, env);

        updatedOrder = {
          ...updatedOrder,
          atolReceiptCreatedAt: new Date().toISOString(),
          atolReceiptSkipped: Boolean(receipt.skipped),
          atolReceiptSkipReason: receipt.reason ?? null,
          atolReceiptUuid: receipt.uuid ?? null,
          atolReceiptStatus: receipt.status ?? null,
          atolReceiptResponse: receipt.raw ?? null,
        };

        await appendRecord('atol-receipts.ndjson', {
          createdAt: updatedOrder.atolReceiptCreatedAt,
          orderId,
          paymentId: updatedOrder.paymentId,
          skipped: Boolean(receipt.skipped),
          reason: receipt.reason ?? null,
          uuid: receipt.uuid ?? null,
          status: receipt.status ?? null,
          request: receipt.requestPayload ?? null,
          response: receipt.raw ?? null,
        });
      } catch (error) {
        updatedOrder = {
          ...updatedOrder,
          atolReceiptErrorAt: new Date().toISOString(),
          atolReceiptError:
            error instanceof Error ? error.message : 'Не удалось создать чек в АТОЛ.',
        };

        await appendRecord('atol-receipts.ndjson', {
          createdAt: updatedOrder.atolReceiptErrorAt,
          orderId,
          paymentId: updatedOrder.paymentId,
          error: updatedOrder.atolReceiptError,
        });

        console.error('ATOL receipt creation failed:', error);
      }
    }

    orders.set(orderId, updatedOrder);
    await appendRecord('payment-notifications.ndjson', updatedOrder);
    await appendRecord('orders.ndjson', updatedOrder);

    response.status(200).send('OK');
  } catch (error) {
    console.error('T-Bank webhook failed:', error);
    response.status(500).send('ERROR');
  }
});

app.get('/api/payments/status/:orderId', (request, response) => {
  response.json(
    orders.get(request.params.orderId) ?? {
      orderId: request.params.orderId,
      status: 'unknown',
    },
  );
});

app.post('/api/receipts/atol/callback', async (request, response) => {
  try {
    await appendRecord('atol-callbacks.ndjson', {
      receivedAt: new Date().toISOString(),
      body: request.body,
    });
    response.status(200).send('OK');
  } catch (error) {
    console.error('ATOL callback failed:', error);
    response.status(500).send('ERROR');
  }
});

app.use(express.static(clientDistDir));

app.get(/^(?!\/api).*/, async (_request, response) => {
  try {
    await fs.access(clientIndexFile);
    response.sendFile(clientIndexFile);
  } catch {
    response.status(404).send('Сначала соберите фронтенд командой npm run build.');
  }
});

hydrateOrdersFromStorage().then(() => {
  app.listen(env.port, () => {
    console.log(`Gold Pour server: ${env.publicAppUrl}`);
    console.log(`API health: ${buildPublicUrl('/api/health')}`);
  });
});
