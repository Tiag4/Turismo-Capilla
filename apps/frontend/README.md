# Frontend — Turismo Capilla del Monte

Portal turístico público y panel de administración desarrollado con **Astro 5**, **React**, **Tailwind CSS v4** y **GSAP** bajo la **Arquitectura de Islas** y principios de diseño **Anti-AI Slop**.

---

## 1. Tecnologías y Arquitectura

* **Astro 5 (SSG / Islas):** Renderizado estático ultra rápido y optimizado para SEO en el portal público de paseos y cabañas.
* **React (Componentes Interactivos):** Componentes dinámicos para formularios de búsqueda, modales de reserva y el panel de administración privado (`/admin/*`).
* **Tailwind CSS v4:** Tokens de diseño nativos inspirados en Capilla del Monte (Terracota Los Terrones, Verde Monte Serrano, Piedra Cálida).
* **GSAP (GreenSock):** Micro-interacciones y animaciones de alto rendimiento.

---

## 2. Puesta en Marcha

Desde la raíz del monorepo:

```bash
# Iniciar el servidor de desarrollo en http://localhost:4321
pnpm dev:frontend

# Compilar para producción (cero errores)
pnpm --filter frontend run build

# Previsualizar el build de producción localmente
pnpm --filter frontend run preview
```

---

## 3. Estructura de Carpetas

```text
apps/frontend/
├── public/                 # Favicon, imágenes públicas y assets
├── src/
│   ├── components/         # Jerarquía de Componentes
│   │   └── ui/             # Átomos y moléculas (Button, Badge, Card, etc.)
│   ├── layouts/            # Layouts principales (Layout.astro con Navbar y Footer)
│   ├── lib/                # Utilidades (cn para tailwind-merge y clsx)
│   ├── pages/              # Rutas basadas en archivos
│   │   └── index.astro     # Landing Page principal con buscador
│   ├── services/           # Cliente API tipado para conectar con NestJS (http://localhost:3001/api/v1)
│   └── styles/             # Design tokens y configuración de Tailwind en global.css
├── astro.config.mjs        # Integración de React y Tailwind Vite
├── package.json
└── tsconfig.json
```
