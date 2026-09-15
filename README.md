# Turismo Capilla del Monte — Portal Turístico & Reservas (Frontend)

<p align="center">
  <img src="https://img.shields.io/badge/Proyecto-Turismo%20Capilla%20del%20Monte-2ea44f?style=for-the-badge" alt="Proyecto">
  <img src="https://img.shields.io/badge/Frontend-React%2019.3%20%2B%20Vite%208-61dafb?style=for-the-badge&logo=react" alt="React 19">
  <img src="https://img.shields.io/badge/Router-React%20Router%20v7-ca4245?style=for-the-badge&logo=reactrouter" alt="React Router">
  <img src="https://img.shields.io/badge/Estilos-Tailwind%20CSS%20v4-38bdf8?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Gestor-pnpm%2011-f69220?style=for-the-badge&logo=pnpm" alt="pnpm">
  <img src="https://img.shields.io/badge/Estado-Desarrollo%20Activo-brightgreen?style=for-the-badge" alt="Estado">
</p>

Plataforma web oficial para la promoción turística, catálogo de atractivos y motor de reservas directas de alojamientos en la localidad de **Capilla del Monte, Córdoba, Argentina**, desarrollada para la **Comisión de Turismo de Capilla del Monte**.

---

## 1. Arquitectura Multirepo del Proyecto

El sistema se encuentra estructurado bajo una arquitectura **Multirepo** desacoplada en dos repositorios independientes:

1. **Frontend (Este Repositorio — `Turismo-Capilla`):**
   * **Tecnologías:** React 19.3, Vite 8 (Rolldown), React Router v7, Tailwind CSS v4, Lucide React, GSAP.
   * **Puerto por defecto:** `http://localhost:4321`
   * **Responsabilidad:** Experiencia del turista, landing institucional, catálogo con filtros interactivos, visualización de mapas y asistente multi-paso de reserva.
2. **Backend (`Turismo-Capilla-Backend`):**
   * **Tecnologías:** NestJS 12, Prisma ORM 6, PostgreSQL 16, Swagger, Vitest.
   * **Puerto por defecto:** `http://localhost:3001` (API en `/api/v1`)
   * **Responsabilidad:** Lógica de negocio, autenticación JWT, prevención de overbooking con transacciones atómicas y persistencia en base de datos.

---

## 2. Estructura de Carpetas

```text
Turismo-Capilla/
├── .agents/                       # SSOT de ingeniería, estándares y skills de desarrollo
│   ├── AGENTS.md                  # Reglas maestras para agentes y programadores
│   └── skills/                    # Principios SOLID, reglas de React, commits y UI
├── apps/
│   └── portal-turismo/            # Aplicación SPA React 19 + Vite
│       ├── public/                # Assets estáticos y favicons
│       ├── src/
│       │   ├── components/        # Componentes desacoplados (Container-Presentational)
│       │   │   ├── accommodations/ # Catálogo de alojamientos, tabs, pills y cards (HU-04)
│       │   │   ├── home/          # Secciones modulares de la Landing Page (HU-01)
│       │   │   ├── layout/        # AppLayout, navbar responsive y footer
│       │   │   └── ui/            # DatePickers, CustomSelects y modales accesibles
│       │   ├── data/              # Mock data con tipado estricto (mock-places.ts)
│       │   ├── pages/             # Vistas principales montadas por React Router v7
│       │   ├── services/          # Cliente HTTP para comunicación con el backend (api.ts)
│       │   ├── styles/            # Tokens visuales y configuración Tailwind v4
│       │   ├── App.tsx            # Árbol central de rutas SPA
│       │   └── main.tsx           # Entry point de React 19
│       ├── index.html             # HTML con OpenGraph y marcado Schema.org JSON-LD
│       └── vite.config.ts         # Configuración de Vite con code-splitting funcional
├── docs/                          # Documentación arquitectónica, técnica y de QA
│   ├── frontend-architecture.md   # Arquitectura detallada de la SPA y patrones SOLID
│   ├── architecture.md            # Visión general del ecosistema completo
│   ├── api-reference.md           # Referencia de contratos de la API REST
│   └── manual-testing-guide.md    # Guías de testing manual de integración
├── package.json                   # Scripts unificados de ejecución
└── pnpm-workspace.yaml            # Configuración de workspaces
```

---

## 3. Pila Tecnológica (Stack)

| Capa | Tecnología | Versión | Propósito |
| :--- | :--- | :--- | :--- |
| **Framework UI** | `React` | `^19.3.0` | Motor de interfaz declarativo con soporte nativo para transiciones fluidas. |
| **Bundler & Dev Server** | `Vite` | `^8.3.0` | Servidor ultrarrápido con Rolldown para code-splitting por librerías (`vendor`, `gsap`, `leaflet`). |
| **Enrutador en Cliente** | `React Router` | `^7.18.4` | Navegación SPA instantánea sin recargas de página. |
| **Motor de Estilos** | `Tailwind CSS` | `^4.0.0` | Utilidades de estilos atómicos con tokens de identidad serrana (Terracota, Brote, Sand). |
| **Animaciones** | `GSAP` | `^3.12.7` | Animaciones fluidas, parallax del Cerro Uritorco y revelación de tarjetas. |
| **Mapas** | `Leaflet` | `^1.9.4` | Mapa interactivo de Capilla del Monte con geolocalización de cabañas y paseos. |

---

## 4. Criterio Académico de Cátedra & Estrategia de SEO

### 4.1 Justificación Curricular (Programación III)
Por requerimiento pedagógico y curricular de la cátedra de **Programación III**, se definió la restricción formal de **no utilizar meta-frameworks orientados a SSR/SSG (como Astro o Next.js)**. 

El objetivo formativo de esta directiva es evaluar directamente la capacidad del equipo para:
1. Diseñar y construir una **Single Page Application (SPA) pura** con React.
2. Dominar patrones de arquitectura limpios en cliente (**Container-Presentational**, custom hooks reutilizables, tipado defensivo).
3. Resolver el ciclo de vida, la gestión de estado y el enrutamiento dinámico íntegramente en el navegador.

### 4.2 Mitigación de SEO en una SPA Pura
Dado que los motores de búsqueda y scrapers de redes sociales (WhatsApp, Telegram, X/Twitter) tradicionalmente requieren HTML estructurado antes de ejecutar JavaScript, se implementó una estrategia técnica de mitigación:
* **Metadatos OpenGraph Canónicos en `index.html`:** Tarjetas de previsualización automáticas con imágenes del Cerro Uritorco, títulos y descripciones institucionales procesables sin ejecutar JavaScript.
* **Marcado Estructurado Schema.org (JSON-LD):** Bloque semántico modelando la entidad oficial `TouristDestination` para indexación de *Rich Snippets* en Google.
* **Optimización Extrema de Core Web Vitals:** Carga del bundle principal en < 800ms, compresión de assets, precarga de fuentes tipográficas y cero saltos visuales (`CLS = 0`).

---

## 5. Puesta en Marcha Rápida (Quick Start)

### 5.1 Prerrequisitos
* **Node.js:** `>= 22.0.0`
* **pnpm:** `>= 10.0.0` (`npm install -g pnpm`)

### 5.2 Pasos de Instalación y Ejecución
```bash
# 1. Clonar el repositorio
git clone https://github.com/Tiag4/Turismo-Capilla.git
cd Turismo-Capilla

# 2. Instalar dependencias
pnpm install

# 3. Iniciar el portal en modo desarrollo
pnpm dev
```

* **Portal Web:** [http://localhost:4321](http://localhost:4321)
* **Compilación de Producción:**
  ```bash
  pnpm build
  ```

---

## 6. Mapeo de Historias de Usuario (Backlog Frontend)

| Código | Historia de Usuario | Estado |
| :--- | :--- | :---: |
| `HU-01` | Landing Page Institucional de Capilla del Monte | ✅ Implementado |
| `HU-02` | Explorar Paseos y Atractivos Turísticos | ✅ Implementado |
| `HU-03` | Ficha Técnica y Detalle del Atractivo | ✅ Implementado |
| `HU-04` | Explorar Catálogo de Alojamientos con Filtros | ✅ Implementado |
| `HU-05` | Ficha de Detalle de Alojamiento y Comodidades | ✅ Implementado |
| `HU-06` | Motor y Asistente de Reserva de Alojamiento | ✅ Implementado |
| `HU-08` | Ubicación y Mapa Interactivo de Capilla del Monte | ✅ Implementado |

---

## 7. Equipo de Desarrollo

* **Tiago Nicolitsis**
* **Martino Costigliolo**
* **Juan Larcher**

**Cátedra:** Programación III — 2026.  
**Cliente:** Comisión de Turismo de Capilla del Monte, Córdoba, Argentina.

---

## 8. 📚 Documentación y Recursos

* **Documento de Arquitectura Frontend:** [`docs/frontend-architecture.md`](./docs/frontend-architecture.md)
* **Google Drive:** Almacena la documentación académica y entregables formales.  
  [Acceder a la carpeta del proyecto en Google Drive](https://drive.google.com/drive/u/1/folders/1KQLWydgsWH7hCD0RqfqIrFO5AzJRqB5E)

---

<p align="center">
  <strong>Turismo Capilla del Monte</strong><br>
  Plataforma web oficial y motor de reservas directas de Capilla del Monte, Córdoba.
</p>
