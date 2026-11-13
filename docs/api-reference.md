# Referencia Oficial de la API REST — Turismo Capilla del Monte

Documentación técnica exhaustiva de contratos de la API REST para desarrolladores frontend, backend y QA.

> [!TIP]
> Para el listado de usuarios de prueba, contraseñas y datos bancarios sembrados, consultá [docs/test-credentials.md](./test-credentials.md). Para la guía interactiva paso a paso, revisá el [Manual de Usuario Oficial](./user-manual.md).

---

## 1. Información General y Convenciones

* **Versión de la API:** `v1`
* **Prefijo base:** `/api/v1`
* **Documentación interactiva (Swagger UI):** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
* **Especificación OpenAPI (JSON):** [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)
* **Formato de intercambio:** `application/json` (UTF-8) y `multipart/form-data` para subida de medios.
* **Formato de fechas:** ISO 8601 (`YYYY-MM-DD` para reservas y `YYYY-MM-DDTHH:mm:ss.sssZ` para timestamps).
* **Moneda:** Pesos Argentinos (ARS) representados como número decimal con 2 decimales (`BigDecimal` / `Numeric(10,2)`).

---

## 2. Autenticación y Autorización

La API utiliza tokens de acceso **JSON Web Tokens (JWT)** con firma simétrica HMAC-SHA256 (`jwt.secret`).

### Formato de Cabecera
Para rutas protegidas, incluir en los encabezados HTTP:
```http
Authorization: Bearer <accessToken>
```

### Roles del Sistema (`Role`)
| Rol | Identificador | Alcance de Permisos |
| :--- | :--- | :--- |
| **Administrador** | `ADMIN` | Miembro de la Comisión de Turismo. Emite invitaciones a prestadores, suspende prestadores no regularizados, crea/edita paseos turísticos, emite alertas de seguridad y audita todas las reservas. |
| **Prestador / Cabañero** | `HOST` | Dueño o administrador de alojamientos formalmente adherido. Publica sus cabañas, sube fotos a Cloudinary, audita reservas recibidas y confirma/cancela reservas. |
| **Turista** | `TOURIST` | Visitante que consulta el catálogo, reserva estadías y audita su historial de reservas. |

---

## 3. Formato Estándar de Errores

Todas las respuestas con código de error (4xx y 5xx) siguen la estructura unificada manejada por el `GlobalExceptionHandler`:

```json
{
  "timestamp": "2026-11-13T11:30:00.000",
  "status": 409,
  "error": "Conflict",
  "message": "El alojamiento no tiene disponibilidad para las fechas seleccionadas.",
  "path": "/api/v1/bookings"
}
```

---

## 4. Índice Maestro de Endpoints

### 🔐 Autenticación e Invitaciones (`/api/v1/auth`, `/api/v1/invitations`)
| Método | Ruta | Rol Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/invitations` | `ADMIN` | Genera un token único de invitación para un prestador formalmente adherido (vigencia: 7 días). |
| `GET` | `/api/v1/invitations` | `ADMIN` | Lista todas las invitaciones emitidas, su estado y si fueron utilizadas. |
| `GET` | `/api/v1/invitations/validate/{token}` | Público | Valida si un token de invitación existe y no ha sido utilizado ni expirado. |
| `DELETE` | `/api/v1/invitations/{token}` | `ADMIN` | Revoca un token de invitación no consumido. |
| `POST` | `/api/v1/auth/register-host` | Público (con Token) | Registra un nuevo Prestador con rol `HOST` canjeando un token de invitación válido. |
| `POST` | `/api/v1/auth/register-tourist` | Público | Registra una cuenta de Turista con rol `TOURIST`. |
| `POST` | `/api/v1/auth/login` | Público | Inicia sesión con email y contraseña, retorna JWT y datos sanitizados del usuario. |
| `GET` | `/api/v1/auth/me` | Autenticado (`JWT`) | Retorna el perfil completo del usuario en sesión. |
| `POST` | `/api/v1/auth/change-password` | Autenticado (`JWT`) | Modifica la contraseña verificando la actual (mínimo 8 caracteres). |
| `POST` | `/api/v1/auth/forgot-password` | Público | Envía código OTP de 6 dígitos al correo registrado (expira a los 15 minutos, anti-enumeración). |
| `POST` | `/api/v1/auth/reset-password` | Público | Valida código OTP (límite de 5 intentos) y actualiza la contraseña del usuario. |

### 👥 Administración de Usuarios y Directorio (`/api/v1/users`)
| Método | Ruta | Rol Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/users` | `ADMIN` | Lista usuarios registrados con filtros opcionales por rol (`role`) y texto (`search`). |
| `GET` | `/api/v1/users/{id}` | `ADMIN` | Consulta el detalle de un usuario por su UUID con conteo de cabañas y reservas. |
| `GET` | `/api/v1/users/providers` | `ADMIN` | Directorio de prestadores habilitados con métricas de alojamientos y estado activo/suspendido. |
| `PATCH` | `/api/v1/users/providers/{id}/suspension` | `ADMIN` | Suspende o reactiva preventivamente a un prestador, afectando su acceso y la visibilidad de sus cabañas. |

### 🏔️ Atractivos y Paseos Turísticos (`/api/v1/attractions`)
| Método | Ruta | Rol Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/attractions` | Público | Catálogo de paseos con filtros (`category`, `difficulty`, `requiresGuide`, `search`). |
| `GET` | `/api/v1/attractions/{id}` | Público | Ficha técnica completa, estado operativo (`OPEN`, `WEATHER_RESTRICTED`, `CLOSED`) y fotos. |
| `POST` | `/api/v1/attractions` | `ADMIN` | Alta de un nuevo paseo gestionado por la Comisión. |
| `PUT` | `/api/v1/attractions/{id}` | `ADMIN` | Actualización de datos o recomendaciones del paseo. |
| `DELETE` | `/api/v1/attractions/{id}` | `ADMIN` | Baja de un atractivo turístico. |

### 🏡 Alojamientos y Hospedajes (`/api/v1/accommodations`)
| Método | Ruta | Rol Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/accommodations` | Público | Búsqueda pública con filtros de fechas (`checkIn`, `checkOut`), huéspedes, tipo y precio. Excluye suspendidos. |
| `GET` | `/api/v1/accommodations/my-accommodations` | `HOST` / `ADMIN` | Lista los alojamientos pertenecientes al prestador autenticado. |
| `GET` | `/api/v1/accommodations/{id}` | Público | Detalle completo de un alojamiento (comodidades, fotos, datos bancarios de seña y desayuno). |
| `POST` | `/api/v1/accommodations` | `HOST` / `ADMIN` | Publicación de un nuevo alojamiento vinculado al prestador autenticado. |
| `PUT` | `/api/v1/accommodations/{id}` | Dueño `HOST` / `ADMIN` | Modificación de datos generales, tarifas o capacidad. |
| `DELETE` | `/api/v1/accommodations/{id}` | Dueño `HOST` / `ADMIN` | Eliminación de un alojamiento. |
| `GET` | `/api/v1/accommodations/{id}/room-types` | Público | Consulta de inventario multi-unidad y planes tarifarios de una hostería o hotel. |

### ☁️ Almacenamiento y Carga Multimedia (`/api/v1/media`)
| Método | Ruta | Rol Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/media/upload` | `HOST` / `ADMIN` | Carga binaria `multipart/form-data` (máx 5MB). Sube server-side a Cloudinary con auto-compresión WebP y CDN. |
| `DELETE` | `/api/v1/media/{publicId}` | `HOST` / `ADMIN` | Eliminación de archivo multimedia de Cloudinary por su `publicId`. |

### 📅 Motor de Reservas (`/api/v1/bookings`)
| Método | Ruta | Rol Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/bookings` | Público / `TOURIST` | Crea una solicitud de reserva atómica validando disponibilidad y previniendo overbooking (`PENDING`). |
| `GET` | `/api/v1/bookings/my-bookings` | `HOST` / `ADMIN` | Lista todas las reservas recibidas para los alojamientos del prestador. |
| `GET` | `/api/v1/bookings/public/lookup` | Público | Permite a cualquier huésped consultar su reserva con código `CAP-YYYY-XXXX` y email. |
| `GET` | `/api/v1/bookings/{id}` | Titular / Dueño / `ADMIN` | Consulta detallada de una reserva por ID. |
| `PATCH` | `/api/v1/bookings/{id}/status` | Dueño `HOST` / `ADMIN` | Cambia el estado de la reserva (`CONFIRMED`, `CANCELLED`, `COMPLETED`) y notifica al turista. |

### 🚨 Alertas de Seguridad y Meteorología (`/api/v1/alerts`)
| Método | Ruta | Rol Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/alerts/active` | Público | Lista alertas vigentes emitidas por Defensa Civil o Comisión (`INFO`, `WARNING`, `DANGER`). |
| `POST` | `/api/v1/alerts` | `ADMIN` | Emisión de una nueva alerta municipal con fecha de expiración y enlace informativo. |

### 🎭 Agenda Cultural y Eventos (`/api/v1/events`)
| Método | Ruta | Rol Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/events` | Público | Calendario de eventos y festivales de Capilla del Monte con filtros por categoría. |
| `POST` | `/api/v1/events` | `ADMIN` | Alta de festival o evento municipal. |

### 🩺 Monitoreo y Salud (`/api/v1/health`)
| Método | Ruta | Rol Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Público | Verifica tiempo de actividad (uptime) y conectividad activa con PostgreSQL. |

---

## 5. Reglas de Negocio Clave

### 5.1 Prevención de Sobreventa (Anti-Overbooking)
Dos rangos de fechas colisionan si y solo si:
$$\text{checkIn}_{\text{existente}} < \text{checkOut}_{\text{solicitado}} \quad \land \quad \text{checkOut}_{\text{existente}} > \text{checkIn}_{\text{solicitado}}$$
* El egreso ocurre a las 10:00 hs y el ingreso a las 14:00 hs. Por ende, si un huésped egresa el 15 de octubre, otro huésped **sí puede ingresar el 15 de octubre**.
* Toda reserva se procesa en una transacción aislada de base de datos con estado inicial `PENDING`. Si existe colisión con una reserva activa (`PENDING` o `CONFIRMED`), la API aborta la operación y retorna **HTTP 409 Conflict**.

### 5.2 Recuperación Autónoma de Contraseña con Código OTP
* **Solicitud de Código:** Al enviar el email (`POST /api/v1/auth/forgot-password`), la API invalida códigos previos no consumidos, genera un código criptográfico de 6 dígitos numéricos con validez de 15 minutos y lo envía al usuario. Si el email no existe, retorna igualmente éxito (`200 OK`) para prevenir la enumeración de cuentas.
* **Validación y Cambio de Clave:** Al ingresar el código y la nueva clave (`POST /api/v1/auth/reset-password`), se valida la no caducidad y se limita a un máximo de 5 intentos fallidos antes de invalidar el código permanentemente. Tras la validación, la contraseña se cifra con BCrypt y el código se marca como consumido.
