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
  - icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>'
    title: Нативный TypeScript
    details: Без этапа сборки благодаря стабильному type stripping в Node.js 25+. Пишите TypeScript, запускайте напрямую.
  - icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>'
    title: Встроенная отказоустойчивость
    details: 8 production-интерцепторов из коробки — timeout, retry, circuit breaker, bulkhead и другие.
  - icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg>'
    title: Полная наблюдаемость
    details: OpenTelemetry трейсы, метрики и структурированное логирование без настройки.
  - icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-5"/><path d="M15 8V2"/><path d="M17 8a1 1 0 0 1 1 1v4a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1z"/><path d="M9 8V2"/></svg>'
    title: Плагины протоколов
    details: Расширяемая система протоколов — health checks, server reflection или создайте свой.
  - icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/></svg>'
    title: Явный жизненный цикл
    details: Полный контроль над запуском, хуками остановки и порядком зависимостей.
  - icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><polyline points="3.29 7 12 12 20.71 7"/><path d="m7.5 4.27 9 5.15"/></svg>'
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
