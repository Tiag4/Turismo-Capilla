# Turismo Capilla — Agent Guidelines

Este documento establece las directrices, estándares de ingeniería y convenciones para cualquier agente o desarrollador que trabaje en el repositorio **Turismo-Capilla**.

---

## 1. Contexto del Proyecto

* **Dominio:** Plataforma web turística y motor de reservas para la localidad de Capilla del Monte, Córdoba, Argentina.
* **Cliente:** Comisión de Turismo de Capilla del Monte.
* **Actores clave:**
  * **Turista:** Consulta información de la localidad, atractivos/paseos y solicita reservas de alojamientos.
  * **Cabañero / Prestador:** Administra sus establecimientos, fotos, tarifas y aprueba/cancela reservas.
  * **Comisión de Turismo (Admin):** Administra el sistema e invita mediante tokens seguros a prestadores formalmente adheridos.

---

## 2. Estructura de Monorepo (pnpm)

El proyecto utiliza una arquitectura monorepo organizada mediante `pnpm-workspace.yaml`:

```text
/
├── .agents/
│   ├── AGENTS.md
│   └── skills/
│       └── solid-principles/
├── apps/
│   ├── backend/             # API REST en NestJS + Prisma + PostgreSQL
│   └── frontend/            # Cliente web (Astro para portal público / React Vite para admin)
├── docs/                    # Documentación arquitectónica y requerimientos
├── package.json             # Root monorepo configuration
└── pnpm-workspace.yaml
```

---

## 3. Principios de Desarrollo y Buenas Prácticas

1. **SOLID:** Aplicación rigurosa de los 5 principios orientados a objetos. Revisar la skill `.agents/skills/solid-principles/SKILL.md`.
2. **Screaming Architecture & Modular Hexagonal:**
   * La estructura de carpetas en `apps/backend` debe reflejar los conceptos del negocio (`accommodations`, `bookings`, `attractions`, `users`, `invitations`).
   * Desacoplar la lógica de dominio de los detalles de infraestructura (ORM, HTTP, SDKs externos).
3. **Clean Code:**
   * Nombres descriptivos y en inglés para código, variables, métodos y tipos (`CreateBookingDto`, `findAvailableAccommodations`).
   * Funciones pequeñas con una única responsabilidad.
   * Manejo explícito de errores sin capturas genéricas silenciosas.
4. **Integridad Transaccional:**
   * En el módulo de reservas (`bookings`), garantizar la prevención de sobreventa (overbooking) mediante transacciones atómicas y validación estricta de rangos de fechas.

---

## 4. Convención de Git y Commits

* Utilizar **Conventional Commits**: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `test:`.
* Nunca incluir metadatos automáticos como `Co-Authored-By` o atribuciones a inteligencias artificiales en los mensajes de commit.
* Las ramas de trabajo deben seguir el formato: `feat/<nombre-tarea>`, `fix/<nombre-bug>`.
