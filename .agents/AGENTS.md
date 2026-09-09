# Turismo Capilla — Reglas de Desarrollo y Arquitectura para Agentes (SSOT)

Este documento es la **fuente canónica y única de verdad (SSOT)** de directrices, estándares de ingeniería y restricciones operativas para todos los agentes de IA y desarrolladores en el repositorio **Turismo-Capilla**. Su cumplimiento es estricto y mandatorio.

---

## 1. Contexto del Proyecto

* **Dominio:** Plataforma web turística y motor de reservas (OTA) para la localidad de Capilla del Monte, Córdoba, Argentina.
* **Cliente:** Comisión de Turismo de Capilla del Monte.
* **Actores clave:**
  * **Turista:** Consulta atractivos/paseos serranos, busca alojamientos disponibles y realiza solicitudes de reserva.
  * **Cabañero / Prestador:** Administra sus establecimientos, fotos, tarifas por noche y gestiona reservas (confirmar/cancelar).
  * **Comisión de Turismo (Admin):** Administra el portal, modera contenidos e invita prestadores formalmente adheridos mediante tokens seguros.

---

## 2. Idioma y Formato de Comunicación

* **Español Rioplatense OBLIGATORIO en Chat:** Toda la comunicación directa con el usuario, explicaciones y razonamientos se redactan en español rioplatense natural (voseo).
* **Artefactos Técnicos en Inglés (Código) y Commits en Español OBLIGATORIO:** Código fuente, nombres de variables, funciones, interfaces, DTOs y comentarios en código deben redactarse en inglés. Los commits (conventional commits) deben redactarse estrictamente en español.

---

## 3. Operaciones Destructivas y Base de Datos (CRÍTICO)

### 3.1 Borrado de Datos y Archivos
* **PROHIBIDO** ejecutar procesos, queries de borrado destructivo (`DELETE`, `TRUNCATE`, `DROP TABLE`, `Remove-Item`, etc.) en la base de datos o en el sistema de archivos sin antes informarle al usuario:
  1. Qué registros, tablas o archivos específicos serán eliminados.
  2. Cómo se realizará técnicamente la operación.
  3. Cuál es el impacto exacto y los riesgos asociados.
* **OBLIGATORIO:** Esperar la aprobación explícita y afirmativa del usuario antes de proceder con cualquier borrado. Sin excepciones.

### 3.2 Migraciones de Base de Datos (Prisma)
* **PROHIBIDO ejecutar `prisma migrate reset`** en entornos con datos o sin previa confirmación explícita del usuario.
* Toda mutación de esquema se realiza mediante migraciones versionadas (`pnpm --filter backend prisma migrate dev --name <nombre>`), previa inspección del schema actual.

### 3.3 Prohibición de Reversión y Stashing sin Autorización en Git
* **PROHIBIDO** ejecutar comandos destructivos o de ocultamiento en Git sin autorización previa y explícita:
  * Reversión destructiva: `git checkout -- <file>`, `git restore <file>`, `git reset --hard`, `git clean -f`.
  * Manipulación de stash: `git stash`, `git stash pop`, `git stash drop`. Queda terminantemente prohibido hacer stash del trabajo en progreso sin orden explícita del usuario, ya que oculta cambios locales y genera falsas apariencias de regresión o pérdida de código.

---

## 4. Encoding y Escritura Segura de Archivos (CERO Mojibake)

* **UTF-8 sin BOM OBLIGATORIO** para todos los archivos del repositorio (`.ts`, `.tsx`, `.astro`, `.json`, `.css`, `.md`, `.sql`).
* **CERO TOLERANCIA a errores de encoding o mojibake** (caracteres corruptos tipo `Ã¡`, `Ã³`, ``).
* **Escritura Segura:** Evitar cmdlets de PowerShell (`Out-File`, `Set-Content`) sin especificar codificación UTF-8 explícita sin BOM. Preferir herramientas de edición granular/diff.

---

## 5. Estructura de Monorepo (pnpm)

```text
/
├── .agents/
│   ├── AGENTS.md            # Este documento (SSOT)
│   └── skills/              # Skills canónicas instaladas a nivel de proyecto
├── apps/
│   ├── backend/             # API REST en NestJS + Prisma + PostgreSQL
│   └── frontend/            # Astro 5 + React (Portal público, checkout y admin)
├── docs/                    # Documentación arquitectónica, API reference y guías de testing
├── package.json             # Root monorepo configuration
└── pnpm-workspace.yaml
```

---

## 6. Arquitectura Backend (NestJS + Prisma + Hexagonal Modular)

1. **Screaming Architecture:**
   * Carpetas organizadas por conceptos de negocio (`accommodations`, `bookings`, `attractions`, `users`, `invitations`, `auth`), no por tipos técnicos dispersos.
2. **SOLID Riguroso:** Aplicación estricta de la skill `.agents/skills/solid-principles/SKILL.md`.
3. **Integridad Transaccional Anti-Overbooking:**
   * Las reservas se crean dentro de transacciones atómicas de Prisma (`$transaction`) con chequeo estricto de solapamiento de fechas: `checkIn < existingCheckOut && checkOut > existingCheckIn`.
4. **Idempotencia e Inmutabilidad:**
   * Códigos de reserva únicos con formato de negocio auditado (`CAP-YYYY-XXXX`).

---

## 7. Arquitectura Frontend (Astro 5 + React + SOLID)

### 7.1 SOLID y Container-Presentational (Cero Monolitos)
Todo componente o vista interactiva que supere ~150 líneas DEBE desacoplarse:
1. **Smart Containers (`< 100 líneas`)**: Archivo de entrada que orquesta custom hooks, maneja el estado de la vista y distribuye props limpias a subcomponentes.
2. **Custom Hooks (`/hooks`)**: Toda la lógica no visual, data fetching, cálculos tarifarios y validaciones DEBE encapsularse en custom hooks. Prohibido mezclar `useEffect` + `useState` dispersos en la vista para fetching.
3. **Dumb Components (`/components` o `/ui`)**: Componentes visuales puros, predecibles y testeables que solo reciben props y disparan callbacks.

### 7.2 Tipado Defensivo y Safe Access (Cero Runtime Crashes)
* **Optional Chaining y Coalescencia Nula Obligatoria:** Todo formateo o acceso a datos de API o props debe usar safe access: `(cabin?.pricePerNight ?? 0).toLocaleString('es-AR')`. Cero tolerancia a `Cannot read properties of undefined`.
* **Límites de Líneas por Archivo:**
  * Páginas / Vistas: máximo 400 líneas.
  * Custom Hooks: máximo 250 líneas.
  * Componentes visuales: máximo 150 líneas.

---

## 8. UI/UX y Sistema de Diseño Oficial (Turismo-Capilla)

### 8.1 Identidad de Marca y Tokens Oficiales
* **Terracota Casonas / Atardecer (`#E06D39` / `#C95627`):** Color principal para CTAs de reserva, badges de estado y acentos prioritarios.
* **Verde Brote Uritorco (`#749B3F` / `#5C7E30`):** Isotipo oficial y atributos naturales/serranos.
* **Verde Esmeralda Institucional (`#1C8B68` / `#0D2F22`):** Bloques de contacto y pie institucional.
* **Neutros Cálidos Sand (`#FAF8F5`, `#F4F0E8`):** Fondos cálidos orgánicos que reemplazan al blanco clínico.
* **Tipografías Oficiales:** `Outfit` (display editorial y títulos) y `Plus Jakarta Sans` (cuerpo y UI).

### 8.2 Reglas de Interfaz
* **Prohibido `alert()`, `confirm()` y `prompt()`:** Usar modales propios del sistema o notificaciones toast.
* **Scroll Lock Obligatorio:** Al abrir modales o drawers, bloquear el scroll del body (`overflow = 'hidden'`) y restaurarlo al cerrar.
* **Animaciones de Apertura y Cierre OBLIGATORIAS:** Todo overlay (modales, drawers laterales, bottom sheets, dropdowns, tooltips, toasts) DEBE contar obligatoriamente con animaciones fluidas tanto de apertura (*slide-in* / *fade-in*) como de cierre (*slide-out* / *fade-out*). Prohibido desmontar componentes interactivos abruptamente sin su respectiva transición de salida.
* **Jerarquía de Z-Index:** Modales base `z-50`, confirmaciones críticas `z-[100]`, toasts `z-[200]`.
* **Formateo Monetario:** Todo importe debe formatearse en tiempo real con separador de miles (`$150.000`) y almacenar internamente el número limpio.
* **Cero UI Vibecoded:** Cumplir obligatoriamente con `.agents/skills/anti-vibecoded/SKILL.md`.

---

## 9. Skills de Calidad OBLIGATORIAS según Contexto

| Contexto | Skill | ¿Cuándo cargar? (OBLIGATORIO) | Ubicación |
|---|---|---|---|
| **Diseño / Edición UI/UX** | `anti-vibecoded` | **MANDATORIA** antes de crear/editar componentes, cards, modales o layouts | `.agents/skills/anti-vibecoded/SKILL.md` |
| **Craft Visual y Microinteracciones** | `impeccable` | Al pulir jerarquía visual, espaciados, tipografía y responsive | `.agents/skills/impeccable/SKILL.md` |
| **Aesthetic Anti-Plantilla** | `design-taste-frontend` | Al estructurar páginas, evitar layouts predecibles de IA | `.agents/skills/design-taste-frontend/SKILL.md` |
| **Formularios y Checkout de Reserva** | `cro` | Al diseñar el buscador del hero, inputs de fechas y flujo de pago/reserva | `.agents/skills/cro/SKILL.md` |
| **SOLID (Backend y Frontend)** | `solid-principles` | Antes de implementar o refactorizar servicios, módulos o componentes | `.agents/skills/solid-principles/SKILL.md` |
| **Componentes React** | `react-solid-rules` | Al diseñar componentes interactivos, custom hooks y containers | `.agents/skills/solid-rules/SKILL.md` |
| **Animaciones Fluidas** | `gsap-core` / `gsap-scrolltrigger` | Al implementar scroll triggers, reveal de tarjetas y transiciones | `.agents/skills/gsap-core/SKILL.md` |
| **Commits y Versionado Git** | `git-commit-rules` | **MANDATORIA** antes de staging y commit | `.agents/skills/git-commit-rules/SKILL.md` |

---

## 10. Metodología SDD y Gestión de Memoria con Engram

* **SDD Exclusivo con Engram:** Queda estrictamente **PROHIBIDO** generar o depender de archivos locales automáticos de planning (`implementation_plan.md`, `task.md`).
* Toda la persistencia arquitectónica, tracking de decisiones y estado de fases se gestiona mediante **Engram** (`mem_save`, `mem_search`) con topic keys estructurados (`turismo-capilla/*`).
* **Aprobación Humana Obligatoria:** El agente nunca debe auto-aprobarse ni pasar de fase sin validación explícita del usuario.

---

## 11. Convenciones de Git y Commits

* **Inspección Previa:** `git status` y `git diff` obligatorios antes de staging.
* **Staging Granular:** PROHIBIDO `git add .` a ciegas. Seleccionar archivos específicos de la tarea.
* **Conventional Commits en Español:** `<type>(<scope>): <descripción>` (ej. `feat(bookings): validar solapamiento de fechas en reservas`).
* **Cero Atribución de IA:** Nunca incluir `Co-Authored-By` ni referencias a asistentes de IA en mensajes de commit o código.

