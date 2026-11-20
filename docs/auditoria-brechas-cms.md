# Auditoría de Brechas Funcionales: Portal Turístico vs. Dashboard CMS (Issue #109)

Este documento consolida el relevamiento técnico comparativo entre el **Portal Turístico** (`apps/portal-turismo`), el **Dashboard CMS** (`apps/dashboard`) y la **API REST** (`backend-capilla-turismo`), detallando qué secciones ya operan extremo a extremo (E2E) tras las entregas `#110`–`#121` y cuáles mantienen datos estáticos, persistencia local (`localStorage`) o desconexión parcial.

---

## 1. Matriz Comparativa de Estado Actual

| Módulo / Sección | Estado en Portal (`apps/portal-turismo`) | Estado en Dashboard (`apps/dashboard`) | Backend (`backend-capilla-turismo`) | Diagnóstico |
| :--- | :--- | :--- | :--- | :--- |
| **Personalización de Portada** (`Hero`, `Duo Cards`, `Uritorco`, `CTA Final`) | Lee parcial desde `localStorage`; `uritorcoConfig`, `finalCtaConfig`, orden y visibilidad solo aplican en `?preview=true` | Editor visual completo con subida a Cloudinary (`PortalCustomizerPage.tsx`), pero persiste en `localStorage` | Inexistente | 🔴 **Brecha Crítica:** los cambios guardados en el CMS no se propagan a los turistas reales. |
| **Circuitos Temáticos** (`Místico`, `Sabores`, `Aventura`) | 100% estático en `circuitsData.ts` (incluye prestadores y 6 imágenes de `unsplash.com`) | Inexistente | Inexistente | 🔴 **Brecha Crítica:** contenido hardcodeado sin administración de paradas ni prestadores adheridos. |
| **Atractivos Destacados en Portada** | `FeaturedAttractionsSection.tsx` lee `MOCK_PLACES` estático (`att-2`, `att-4`, etc.); en `/atractivos` sí usa la API | `AttractionsManager.tsx` permite destacar y elegir tema (`DARK`/`LIGHT`) | `PATCH /api/v1/attractions/{id}/featured` | 🔴 **Brecha Crítica:** destacar un atractivo en el CMS no impacta en el Home. |
| **Mapa del Valle y Alojamientos Cercanos** | `ValleyMapSection.tsx` y `NearbyAccommodationsCard.tsx` leen `MOCK_PLACES` estático | N/A (debería derivar de entidades reales) | `GET /api/v1/accommodations` y `/attractions` | 🔴 **Brecha Crítica:** el mapa principal y sugerencias cercanas muestran lugares ficticios. |
| **Agenda Cultural / Eventos** | Conectado, pero `culturalEvents.service.ts` tiene fallback de producción apuntando a `render.com` | `CulturalAgendaManager.tsx` conectado E2E (incluye arancel gratis y horarios) | `EventController` (`/api/v1/events`) | 🟠 **Brecha Alta (Bug Prod):** si falta `VITE_API_URL`, en producción cae a eventos mock. `isFeatured` sin efecto en Home. |
| **Detalle de Senderos y Altimetría** | Ficha técnica y protocolos conectados; `TrekkingMonitorContainer` hardcodeado al Uritorco; `attractionMapper.ts` pisa fotos del CMS con locales | `AttractionEditorForm.tsx` edita telemetría, protocolos y checklist | `AttractionController` | 🟠 **Brecha Alta:** la altimetría es única para todos los senderos y las fotos locales pisan a las subidas en CMS. |
| **Moderación de Fotografías** | Solo muestra fotos `APPROVED` en endpoints públicos | Admin aprueba/rechaza con motivo (`ContentModerationView.tsx`), pero el cabañero no ve el estado ni motivo en su galería | `ModerationController` (`/api/v1/moderation/images`) | 🟠 **Brecha Alta:** falta visibilidad de rechazo al prestador y persistencia de orden/`isMain` al editar alojamiento. |
| **Auditoría Municipal de Alojamientos** | Sin impacto público visible | `useAdminAudit.ts` guarda el checklist en `localStorage` | Inexistente | 🟠 **Brecha Alta:** la auditoría no es compartida entre administradores. |
| **Alojamientos Destacados y Detalle** | Conectado E2E, pero `FeaturedCabinsSection.tsx` y `useAccommodationsFilter.ts` hardcodean `4.9 (20)` y matrículas ficticias; `getAccommodationDetail.ts` hardcodea `amenityCategories` | `AccommodationCard.tsx` y `AccommodationEditorForm.tsx` conectados | `AccommodationController` | 🟡 **Brecha Media:** datos de reseñas y categorías de amenities deben venir del backend. |
| **Guía "Cómo llegar"** | Peajes, tren, terminal y alertas conectados; `MobilityInteractiveMap.tsx` usa puntos estáticos | `MobilityManagerView.tsx` edita peajes, colectivos, tren y precauciones; no edita orígenes ni paradas | `MobilityController` (`GET/PUT /api/v1/mobility`) | 🟡 **Brecha Media:** rutas de origen (`originsData`), paradas de tren y pines del mapa siguen estáticos. |
| **Emergencias y Farmacias** | Farmacias y Hospital conectados E2E; teléfonos de rescate (`DUAR`, Bomberos) y protocolos estáticos | `EmergencySanitaryManagerView.tsx` conectado, pero muestra cartel engañoso `"Prototipo Mock"` | `EmergencySanitaryController` | 🟡 **Brecha Menor:** limpiar aviso engañoso en Dashboard; opcional parametrizar contactos de rescate. |
| **Alertas Oficiales y Reseñas** | Conectados E2E | Conectados E2E | `AlertController`, `ReviewController` | 🟢 **Cubierto E2E** (reseñas solo pendientes para atractivos). |

---

## 2. Priorización Técnica de Brechas

### Prioridad 1 — Críticas (Desconexión visible al turista o persistencia solo local)
1. **Conectar Home (`FeaturedAttractionsSection`, `ValleyMapSection`) y `NearbyAccommodationsCard` a la API real**, erradicando el uso de `MOCK_PLACES` en componentes públicos de producción.
2. **Corregir fallback de URL en `culturalEvents.service.ts`** (`services.equarys.com` unificado con `api.ts`).
3. **Persistencia Backend para `PortalConfig`** (Hero, Duo Cards, Uritorco, Final CTA, orden y visibilidad de secciones) para eliminar la dependencia de `localStorage` entre CMS y Portal.
4. **Módulo de Circuitos Temáticos (CMS + Backend + Portal)** para reemplazar `circuitsData.ts` y eliminar URLs externas de Unsplash.

### Prioridad 2 — Altas (Inconsistencias funcionales entre CMS y Portal)
5. **Corregir `attractionMapper.ts`** para que las imágenes cargadas desde el CMS tengan prioridad sobre las imágenes locales estáticas.
6. **Visibilidad de estado de moderación de fotos (`PENDING` / `REJECTED` + motivo)** en la galería del prestador (`SortablePhotoItem.tsx`) y persistencia de orden/`isMain` en `UpdateAccommodationDto`.
7. **Perfil altimétrico configurable o condicionado por atractivo** (evitar mostrar el perfil del Cerro Uritorco en senderos que no son el Uritorco).

### Prioridad 3 — Medias / Menores (Hardcodeos residuales y UX del CMS)
8. **Eliminar ratings (`4.9 / 20`) y matrículas ficticias** en tarjetas de alojamientos cuando no existan datos reales.
9. **Limpiar cartel de "Prototipo Mock"** en `EmergencySanitaryManagerView.tsx` y derivar `amenityCategories` desde los amenities reales en `getAccommodationDetail.ts`.
10. **Persistir `AdminAudit` en backend** y extender `MobilityController` para editar rutas de origen y puntos del mapa.

---

## 3. Modelos de Datos, DTOs y Endpoints Faltantes en Backend

### 3.1. Configuración Dinámica del Portal (`PortalConfig`)
Para reemplazar `turismo_capilla_portal_cms_config` en `localStorage`:

* **Entidad / Tabla (`portal_config`):** registro singleton (`id = 'default'`) con columna `config_json` (`JSONB`) o campos estructurados + `updated_at` / `updated_by`.
* **Endpoints:**
  * `GET /api/v1/portal-config` *(Público)*: retorna la configuración vigente del Home.
  * `PUT /api/v1/portal-config` *(ADMIN)*: actualiza la configuración y valida URLs de imágenes.
* **DTO (`PortalConfigDto`):**
  ```typescript
  export interface PortalConfigDto {
    hero: {
      title: string;
      subtitle: string;
      backgroundImageUrl: string;
      ctaLabel: string;
    };
    duoAccess: {
      exploreTitle: string;
      exploreSubtitle: string;
      exploreImageUrl: string;
      stayTitle: string;
      staySubtitle: string;
      stayImageUrl: string;
    };
    uritorco: {
      title: string;
      description: string;
      imageUrl: string;
      badgeText: string;
    };
    finalCta: {
      title: string;
      subtitle: string;
      buttonLabel: string;
    };
    sectionsOrder: string[];
    sectionsVisibility: Record<string, boolean>;
  }
  ```

### 3.2. Circuitos Temáticos (`ThematicCircuit`)
Para reemplazar `circuitsData.ts`:

* **Entidades:**
  * `ThematicCircuit`: `id (UUID)`, `slug` (`mistico` | `gastronomico` | `aventura`), `title`, `subtitle`, `description`, `coverImageUrl`, `isActive`.
  * `CircuitStop`: `id (UUID)`, `circuitId`, `name`, `category`, `description`, `imageUrl`, `address`, `phone`, `whatsapp`, `specialty`, `licenseNumber`, `latitude`, `longitude`, `displayOrder`, `isActive`.
* **Endpoints:**
  * `GET /api/v1/circuits` *(Público)*: lista circuitos activos con sus paradas ordenadas.
  * `GET /api/v1/circuits/{slug}` *(Público)*: detalle de un circuito.
  * `POST /api/v1/circuits/{circuitId}/stops` *(ADMIN)*: alta de parada o prestador adherido.
  * `PUT /api/v1/circuits/stops/{stopId}` *(ADMIN)*: edición de parada.
  * `DELETE /api/v1/circuits/stops/{stopId}` *(ADMIN)*: baja lógica o eliminación.

### 3.3. Extensiones sobre Endpoints Existentes
* **`UpdateAccommodationDto` / `AccommodationController`:** aceptar actualización de `order` e `isMain` sobre imágenes ya existentes sin requerir nueva subida.
* **`AdminAudit`:** `PATCH /api/v1/accommodations/{id}/audit` *(ADMIN)* para persistir el checklist de inspección municipal en base de datos.

---

## 4. Desglose de Historias Técnicas para Cierre al 100%

1. **HT-01 (Inmediata — Frontend Portal):** Desconectar `MOCK_PLACES` de `FeaturedAttractionsSection.tsx`, `ValleyMapSection.tsx` y `NearbyAccommodationsCard.tsx`; corregir URL fallback de `culturalEvents.service.ts`; priorizar imágenes del CMS en `attractionMapper.ts`; corregir ratings/matrículas ficticias y limpiar aviso mock en `EmergencySanitaryManagerView.tsx`.
2. **HT-02 (Fullstack — Portada Dinámica):** Crear `PortalConfigController` en `backend-capilla-turismo` y conectar `PortalCustomizerPage.tsx` + `HomePage.tsx` al endpoint real en lugar de `localStorage`.
3. **HT-03 (Fullstack — Circuitos Temáticos):** Crear módulo `circuits` en backend + vista de administración en `apps/dashboard` + consumo dinámico en `MysticCircuitView`, `GastronomicCircuitView` y `AdventureCircuitView`.
4. **HT-04 (Fullstack — Moderación y Auditoría):** Mostrar estado `PENDING`/`REJECTED` y `rejectionReason` en la galería del host, persistir reordenamiento/`isMain` de fotos y persistir auditoría municipal en DB.
5. **HT-05 (Fullstack — Altimetría y Movilidad Extendida):** Parametrizar perfiles altimétricos por atractivo y ampliar `MobilityController` para rutas de origen y puntos del mapa.
