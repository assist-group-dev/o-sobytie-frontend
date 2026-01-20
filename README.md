# Entertainment Commerce

Frontend-проект на Next.js 15 с модульной архитектурой.

## Технологии

- **Next.js 15** - React фреймворк с App Router
- **TypeScript** - строгая типизация
- **Tailwind CSS** - утилитарный CSS фреймворк
- **Zustand** - управление состоянием
- **i18next** - интернационализация
- **React Hook Form + Zod** - работа с формами и валидация
- **Lucide React** - иконки

## Структура проекта

```
entertaiment-commerce/
├── app/
│   ├── (landing)/          # Модуль лендинга
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── types/
│   ├── (cabinet)/          # Модуль личного кабинета
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── types/
│   │   └── stores/
│   ├── (admin)/            # Модуль админ панели
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── types/
│   │   └── stores/
│   ├── layout.tsx          # Root layout
│   ├── loading.tsx         # Global loading
│   ├── error.tsx           # Global error boundary
│   ├── not-found.tsx       # 404 page
│   └── globals.css
├── ui/                     # Общие UI компоненты
│   └── components/
├── stores/                 # Общие Zustand stores
├── utils/                  # Общие утилиты
├── types/                  # Общие типы
├── constants/              # Константы
├── locales/                # Переводы i18next
│   ├── ru.json
│   └── en.json
├── middleware.ts           # Next.js middleware
└── public/                 # Статические файлы
```

## Модули

Проект разделен на три основных модуля:

1. **Лендинг** (`app/(landing)/`) - публичная часть сайта
2. **Личный кабинет** (`app/(cabinet)/`) - пользовательская часть
3. **Админ панель** (`app/(admin)/`) - административная часть

Каждый модуль имеет свою изолированную структуру с компонентами, хуками, утилитами и типами.

## Запуск проекта

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev

# Сборка для production
npm run build

# Запуск production сервера
npm start

# Линтинг
npm run lint
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## Особенности

- ✅ Модульная архитектура с изоляцией модулей
- ✅ TypeScript со строгой типизацией
- ✅ Поддержка темной/светлой темы
- ✅ Интернационализация (ru/en)
- ✅ Error boundaries и loading states
- ✅ SEO оптимизация
- ✅ ESLint + Prettier

## Дизайн-система

### Шрифт

Проект использует **Inter** — равноширокий кругловатый шрифт, похожий на Product Sans (логотип Google). Шрифт настроен в `app/layout.tsx` и применяется глобально через CSS переменную `--font-sans`.

### Цветовая палитра

Все цвета определены в `app/globals.css` и доступны через CSS переменные:

- `--foreground: #3a2f2a` — основной цвет текста
- `--color-peach: #f1d6cf` — персиковый
- `--color-peach-light: #f4dad5` — светло-персиковый
- `--color-golden: #c8a96a` — золотистый
- `--color-cream: #f5efe6` — кремовый
- `--color-cream-light: #f7f0e8` — светло-кремовый

Использование:
- В CSS: `var(--color-peach)`, `var(--color-golden)`
- В Tailwind: `bg-[var(--color-peach)]`, `text-[var(--color-golden)]`

## Алиасы путей

Проект использует алиасы для импортов:

- `@/*` - корень проекта
- `@/ui/*` - UI компоненты
- `@/stores/*` - Zustand stores
- `@/utils/*` - утилиты
- `@/types/*` - типы
- `@/constants/*` - константы
- `@/locales/*` - переводы
