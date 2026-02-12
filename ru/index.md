---
layout: home
pageClass: home-page

hero:
  name: Connectum
  text: Production-Ready gRPC фреймворк
  tagline: Создавайте надёжные gRPC/ConnectRPC микросервисы на Node.js без шаблонного кода
  image:
    light: /assets/splash.png
    dark: /assets/splash-dark.png
    alt: Connectum Framework
  actions:
    - theme: brand
      text: Быстрый старт
      link: /en/guide/quickstart
    - theme: alt
      text: GitHub
      link: https://github.com/Connectum-Framework/connectum

features:
  - icon: ⚡
    title: Нативный TypeScript
    details: Без этапа сборки благодаря стабильному type stripping в Node.js 25.2.0+. Пишите TypeScript, запускайте напрямую.
  - icon: 🛡️
    title: Встроенная отказоустойчивость
    details: 8 production-интерцепторов из коробки — timeout, retry, circuit breaker, bulkhead и другие.
  - icon: 📊
    title: Полная наблюдаемость
    details: OpenTelemetry трейсы, метрики и структурированное логирование без настройки.
  - icon: 🔌
    title: Плагины протоколов
    details: Расширяемая система протоколов — health checks, server reflection или создайте свой.
  - icon: 🏗️
    title: Явный жизненный цикл
    details: Полный контроль над запуском, хуками остановки и порядком зависимостей.
  - icon: 📦
    title: Модульная архитектура
    details: 6 пакетов в 3 слоях. Используйте только то, что нужно — от core до CLI.
---

## Пример

```typescript
import { createServer } from '@connectum/core';
import { Healthcheck, healthcheckManager, ServingStatus } from '@connectum/healthcheck';
import { Reflection } from '@connectum/reflection';
import { createDefaultInterceptors } from '@connectum/interceptors';
import routes from '#gen/routes.js';

const server = createServer({
    services: [routes],
    port: 5000,
    protocols: [Healthcheck({ httpEnabled: true }), Reflection()],
    interceptors: createDefaultInterceptors(),
    shutdown: { autoShutdown: true },
});

server.on('ready', () => {
    healthcheckManager.update(ServingStatus.SERVING);
    console.log(`Server ready on port ${server.address?.port}`);
});

await server.start();
```
