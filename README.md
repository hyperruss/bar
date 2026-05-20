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

По умолчанию форма создаёт демо-счёт в браузере. Для реального провайдера добавьте `.env`:

```bash
VITE_PAYMENT_ENDPOINT=https://your-backend.example.com/api/payments/create
```

`VITE_PAYMENT_ENDPOINT` должен принимать `POST` с заказом и возвращать JSON с одним из полей:

```json
{
  "confirmation_url": "https://payment-provider.example/checkout/..."
}
```

Также поддерживаются поля `payment_url`, `redirectUrl` и `url`.
