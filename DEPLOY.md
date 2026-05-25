# Деплой через GitHub Actions

Проект настроен так, чтобы один `git push` обновлял фронт и серверную часть на `gold-pour.ru`.

## Что делает авто-деплой

- копирует проект на сервер в `/var/www/goldpour`;
- не трогает серверный `.env`;
- не трогает `server/storage`;
- выполняет `npm ci --omit=dev`;
- собирает фронт через `npm run build`;
- выкладывает содержимое `dist` в корень сайта;
- перезапускает API `pm2 restart goldpour-api`;
- перезагружает nginx.

## Что нужно настроить один раз

1. Создать SSH-ключ для GitHub Actions:

```powershell
ssh-keygen -t ed25519 -f $env:USERPROFILE\.ssh\goldpour_github_actions -C "github-actions-goldpour"
```

2. Добавить публичный ключ на сервер:

```powershell
type $env:USERPROFILE\.ssh\goldpour_github_actions.pub | ssh root@89.104.74.226 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys"
```

3. Открыть приватный ключ:

```powershell
notepad $env:USERPROFILE\.ssh\goldpour_github_actions
```

4. В GitHub открыть репозиторий `hyperruss/bar`:

```text
Settings -> Secrets and variables -> Actions -> New repository secret
```

5. Добавить секреты:

```text
SERVER_HOST = 89.104.74.226
SERVER_USER = root
SERVER_PORT = 22
SERVER_SSH_KEY = весь текст приватного ключа goldpour_github_actions
```

`SERVER_SSH_KEY` должен начинаться с `-----BEGIN OPENSSH PRIVATE KEY-----` и заканчиваться `-----END OPENSSH PRIVATE KEY-----`.

## Как выкладывать любые изменения

```powershell
cd C:\Users\gribu\Desktop\vlad
git status
git add .
git commit -m "Описание изменений"
git push origin master
```

Дальше GitHub сам обновит сервер. Статус можно смотреть:

```text
GitHub -> репозиторий -> Actions -> Deploy Gold Pour
```

## Если менялась только .env

`.env` специально не хранится в Git и не перезаписывается авто-деплоем. Его менять только на сервере:

```bash
cd /var/www/goldpour
nano .env
pm2 restart goldpour-api
```

## Проверка после деплоя

```text
https://gold-pour.ru/
https://gold-pour.ru/api/health
https://gold-pour.ru/robots.txt
https://gold-pour.ru/sitemap.xml
```
