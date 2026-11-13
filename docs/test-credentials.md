# Credenciales Oficiales de Demostración y Pruebas (Test Credentials)

Este documento reúne todas las cuentas de usuario, contraseñas, tokens, datos bancarios de prueba y parámetros de integración para la plataforma **Turismo Capilla del Monte**.

---

## 1. Cuentas de Usuario Sembradas (`DataInitializer`)

Al iniciar el backend (`.\mvnw.cmd spring-boot:run` o `./dev.ps1`), la base de datos se puebla automáticamente con los siguientes usuarios cifrados mediante BCrypt.

| Rol del Sistema | Nombre y Apellido / Entidad | Correo Electrónico | Contraseña Oficial | Panel / Ruta de Acceso | Alcance y Permisos |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`ADMIN`** | Comisión Oficial Turismo Capilla | `admin@capilladelmonte.gov.ar` | `AdminCapilla2026!` | `http://localhost:5174/overview` | Gestión integral municipal: Invitaciones a prestadores, directorio, suspensión de prestadores, atractivos, alertas meteorológicas, agenda de eventos y métricas de ocupación. |
| **`HOST` (Cabañas)** | Roberto Gómez (*Pircas del Uritorco*) | `host@capilladelmonte.gov.ar` | `HostCapilla2026!` | `http://localhost:5174/reservas` | Prestador con cabaña unifamiliar: tarifas, fotos a Cloudinary, confirmación de reservas recibidas y bloqueo de fechas en calendario. |
| **`HOST` (Hostería)** | Marcela Rossi (*Los Nogales*) | `marcela.rossi@capillaturismo.com.ar` | `HostCapilla2026!` | `http://localhost:5174/reservas` | Prestadora con inventario multi-unidad (habitaciones Standard, Superior y Suite), planes tarifarios con y sin desayuno. |
| **`HOST` (Refugio)** | Carlos Benítez (*Los Alazanes*) | `carlos.benitez@capillaturismo.com.ar` | `HostCapilla2026!` | `http://localhost:5174/reservas` | Prestador de monoambiente de montaña pet friendly con deck privado y seña del 40%. |
| **`TOURIST`** | Turista de Demostración | `turista@gmail.com` *(o registro libre)* | `TuristaCapilla2026!` | `http://localhost:5173` | Búsqueda de disponibilidad en el Portal público, solicitud de reserva directa y consulta pública por código `CAP-YYYY-XXXX`. |

> [!TIP]
> **Acceso Rápido en el Dashboard:** La pantalla de inicio de sesión (`http://localhost:5174`) dispone de botones de autocompletado rápido (**"Comisión (Admin)"** y **"Cabañero (Host)"**) que cargan automáticamente las credenciales oficiales sin necesidad de tipear.

---

## 2. Alojamientos y Cuentas Bancarias de Prueba

Cada prestador sembrado cuenta con su establecimiento y datos bancarios para validar el flujo de transferencias bancarias y acreditación de señas:

### 2.1 Cabañas Pircas del Uritorco (Roberto Gómez)
* **Tipo:** Cabaña serrana (`CABIN`)
* **Ubicación:** Camino a Los Terrones Km 3.5, Capilla del Monte
* **Capacidad Máxima:** 5 huéspedes
* **Precio por Noche:** `$85.000 ARS`
* **Porcentaje de Seña:** `50%`
* **Desayuno:** No incluido
* **Comodidades:** Piscina, Wi-Fi Starlink, Cochera techada, Parrilla individual, Aire acondicionado
* **Datos Bancarios para Transferencia:**
  * **Banco:** Banco de la Nación Argentina
  * **Titular:** Eduardo Soria - Pircas del Uritorco
  * **CBU:** `0110485530048500123456`
  * **Alias:** `PIRCAS.URITORCO.RIO`

### 2.2 Hostería Boutique Los Nogales (Marcela Rossi)
* **Tipo:** Hotel / Hostería (`HOTEL`)
* **Ubicación:** Av. Pueyrredón 340 (a 400 m de la Calle Techada)
* **Capacidad:** Hasta 4 huéspedes por unidad
* **Precio Base de Referencia:** `$120.000 ARS`
* **Porcentaje de Seña:** `30%`
* **Desayuno:** Incluido (*"Desayuno serrano casero"*)
* **Datos Bancarios para Transferencia:**
  * **Banco:** Banco Santander
  * **Titular:** Marcela Rossi
  * **CBU:** `0720234588000034567891`
  * **Alias:** `NOGALES.CAPILLA.BOU`
* **Inventario Multi-unidad y Planes de Tarifa:**
  1. **Standard Doble:** 6 unidades disponibles | Capacidad: 2 personas | `$120.000` (Tarifa Flexible) o `$135.000` (con desayuno serrano artesanal).
  2. **Superior:** 3 unidades disponibles | Capacidad: hasta 3 personas | `$165.000` con vista al cerro.
  3. **Suite:** 1 unidad disponible | Capacidad: hasta 4 personas | `$220.000` con jacuzzi y sector de estar independiente.

### 2.3 Refugio de Montaña Los Alazanes (Carlos Benítez)
* **Tipo:** Departamento / Refugio (`APARTMENT`)
* **Ubicación:** Barrio La Banda, Calle Los Quebrachos 12
* **Capacidad Máxima:** 2 huéspedes (monoambiente con deck y vista al Dique El Cajón)
* **Precio por Noche:** `$65.000 ARS`
* **Porcentaje de Seña:** `40%`
* **Comodidades:** Deck privado, Wi-Fi, Parrilla, Cocina equipada, Pet friendly
* **Datos Bancarios para Transferencia:**
  * **Banco:** Mercado Pago / Banco Galicia
  * **Titular:** Carlos Benítez
  * **CBU:** `0070123430000045678902`
  * **Alias:** `ALAZANES.REFUGIO.MP`

---

## 3. Atractivos Turísticos y Circuitos Sembrados

El catálogo de paseos se encuentra listo para pruebas de filtrado por categoría, dificultad y estado operativo:

| Atractivo | Categoría | Dificultad | Tarifa de Ingreso | ¿Requiere Guía? | Estado Inicial |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Cerro Uritorco** | `HILL` (Cerro) | `ALTA` (7 hs ida y vuelta) | `$15.000 ARS` | No | `OPEN` (Abierto) |
| **Parque Los Terrones** | `NATURE_TRAIL` (Sendero) | `MEDIA` (2.5 a 3 hs) | `$8.000 ARS` | **Sí** | `OPEN` (Abierto) |
| **El Zapato** | `CULTURAL` (Geoforma) | `BAJA` (1 hora) | **Gratuito** | No | `OPEN` (Abierto) |
| **Dique El Cajón** | `RIVER_BEACH` (Balneario/Lago) | `BAJA` (Paseo libre) | **Gratuito** | No | `OPEN` (Abierto) |
| **Balneario La Toma** | `RIVER_BEACH` (Río Calabalumba) | `BAJA` (Medio día) | `$2.500 ARS` | No | `WEATHER_RESTRICTED` *(Aviso: Precaución por crecida)* |
| **Los Mogotes y Paso del Indio** | `NATURE_TRAIL` (Escalada/Sendero) | `MEDIA` (2 horas) | `$3.000 ARS` | No | `OPEN` (Abierto) |

---

## 4. Alertas y Eventos Sembrados

* **Alerta Activa:**
  * **Título:** Alerta Meteorológica: Riesgo Extremo de Incendios Forestales
  * **Severidad:** `DANGER` (Crítica)
  * **Vigencia:** 3 días desde la inicialización
  * **Enlace Oficial:** `https://capilladelmonte.gov.ar/defensa-civil`
* **Eventos Culturales:**
  1. **Festival del Alienígena 2026:** Categoría `FESTIVAL` | Entrada libre | Predio Gabriel Suárez y Calle Techada.
  2. **Noche de Astroturismo y Leyendas Serranas:** Categoría `COMMUNITY` | `$15.000 ARS` | Base del Cerro Uritorco.
  3. **Feria de Sabores y Artesanías del Uritorco:** Categoría `FAIR` | Entrada libre | Plaza San Martín.

---

## 5. Parámetros de Integración y Servicios Externos

Configuración para reproducir el entorno completo en `.env` (Backend):

```ini
# Base de datos local
DB_URL=jdbc:postgresql://localhost:5432/portal_turismo
DB_USERNAME=postgres
DB_PASSWORD=root

# Almacenamiento Cloudinary Activo
STORAGE_PROVIDER=cloudinary
CLOUDINARY_URL=cloudinary://476644815221196:x099anE0a2euhAxBy5mxP8yF3Sc@wgmfpnwz
CLOUDINARY_CLOUD_NAME=wgmfpnwz
CLOUDINARY_API_KEY=476644815221196
CLOUDINARY_API_SECRET=x099anE0a2euhAxBy5mxP8yF3Sc

# Correo Transaccional (Resend SMTP)
MAIL_ENABLED=false
MAIL_HOST=smtp.resend.com
MAIL_PORT=587
MAIL_USERNAME=resend
MAIL_PASSWORD=re_test_key_sample
MAIL_FROM=no-reply@capilladelmonte.gov.ar
MAIL_FROM_NAME=Cámara de Turismo de Capilla del Monte
PORTAL_BASE_URL=http://localhost:5173
```

---

## 6. Flujo de Prueba de Tokens de Invitación

Para incorporar un nuevo prestador durante las pruebas:

1. Iniciar sesión como Administrador (`admin@capilladelmonte.gov.ar`).
2. Dirigirse a **Tokens de Invitación** (`/invitations`) y presionar **"Generar Token"**.
3. Ingresar un email (por ejemplo: `nuevo.cabanero@capillaturismo.com.ar`).
4. Copiar el enlace de registro generado:
   ```text
   http://localhost:5174/registro-prestador?token=inv-<uuid>
   ```
5. Abrir una ventana de incógnito o cerrar sesión, acceder al enlace, ingresar nombre, apellido, teléfono y nueva contraseña.
6. La cuenta queda habilitada en el acto con rol `HOST`.
