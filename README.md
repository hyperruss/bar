# Gold Pour

React/Vite сайт для продажи мастер-классов по барному делу: витрина форматов, анимированная главная, форма оплаты и подготовленная интеграция оплаты.

## Страницы

- `/` - главная
- `/courses` - каталог мастер-классов
- `/courses/start`, `/courses/pro`, `/courses/service` - отдельные страницы форматов
- `/club`, `/reviews`, `/contacts` - информационные вкладки
- `/question` - форма обратной связи
- `/checkout` - запись и оплата
- `/terms`, `/privacy`, `/consent`, `/consent-spread`, `/consent-mailing` - юридические документы

## Запуск

```bash
npm install
npm run dev
```

Для проверки полной связки с серверной частью:

```bash
npm run build
npm run server
```

Для публикации на хостинге с прямыми ссылками вида `/courses/pro` нужен fallback на `index.html`.

## Cloudflare Pages

Настройки деплоя:

```bash
Build command: npm run build
Build output directory: dist
Root directory: /
```

Файл `public/_redirects` уже добавлен, чтобы все внутренние страницы React открывались напрямую.

## Оплата

Проект подготовлен к интернет-эквайрингу Т-Банка. Фронтенд отправляет заказ на `/api/payments/create`, сервер создаёт платёж через метод `Init` и возвращает ссылку `PaymentURL`.

```bash
VITE_PAYMENT_ENDPOINT=/api/payments/create
PORT=8787
PUBLIC_APP_URL=https://gold-pour.ru
TBANK_API_URL=https://securepay.tinkoff.ru/v2
TBANK_TERMINAL_KEY=
TBANK_PASSWORD=
TBANK_NOTIFICATION_URL=https://gold-pour.ru/api/payments/tbank/webhook
TBANK_SUCCESS_URL=https://gold-pour.ru/payment/success
TBANK_FAIL_URL=https://gold-pour.ru/payment/fail
TBANK_SEND_RECEIPT=false
TBANK_TAXATION=usn_income
TBANK_VAT=none
TBANK_PAYMENT_METHOD=full_prepayment
TBANK_PAYMENT_OBJECT=service

ATOL_ENABLED=true
ATOL_API_URL=https://online.atol.ru/possystem/v4
ATOL_INN=590850694160
ATOL_GROUP_CODE=
ATOL_LOGIN=
ATOL_PASSWORD=
ATOL_COMPANY_EMAIL=
ATOL_PAYMENT_ADDRESS=https://gold-pour.ru
ATOL_CALLBACK_URL=https://gold-pour.ru/api/receipts/atol/callback
ATOL_TAXATION=usn_income
ATOL_VAT=none
ATOL_PAYMENT_METHOD=full_prepayment
ATOL_PAYMENT_OBJECT=service
ATOL_MEASUREMENT_UNIT=шт.
```

Чеки отправляются напрямую в АТОЛ Онлайн после успешного webhook от Т-Банка. Чтобы не пробивать двойной чек, `TBANK_SEND_RECEIPT` должен оставаться `false`.

Секретные значения `TBANK_TERMINAL_KEY`, `TBANK_PASSWORD`, `ATOL_LOGIN` и `ATOL_PASSWORD` нельзя добавлять во фронтенд или коммитить в Git.

На сервере Node-приложение нужно держать запущенным отдельно от nginx, а `/api/` проксировать на порт `8787`.
