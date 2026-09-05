---
name: solid-principles
description: >-
  Directrices y ejemplos prácticos para aplicar los 5 principios SOLID en el desarrollo
  con TypeScript, NestJS y Arquitectura Limpia dentro del proyecto Turismo-Capilla.
---

# Principios SOLID en Turismo-Capilla

Este documento detalla cómo aplicar rigurosamente los principios SOLID en el backend y frontend del proyecto.

---

## 1. Single Responsibility Principle (SRP) — Responsabilidad Única
> *Una clase o módulo debe tener una sola razón para cambiar.*

* **En NestJS:**
  * **Controllers:** Su única responsabilidad es recibir el payload HTTP, invocar la validación de DTOs y delegar la ejecución al servicio/caso de uso. No contienen lógica de negocio ni consultas a la base de datos.
  * **Services / Use Cases:** Su única responsabilidad es orquestar la regla de negocio (por ejemplo, validar disponibilidad y crear la reserva).
  * **Repositories:** Su única responsabilidad es la persistencia y recuperación de datos contra la base de datos (Prisma).

**Anti-patrón:**
```typescript
// ❌ MAL: El servicio calcula precios, guarda en DB y envía emails directamente
class BookingService {
  async createBooking(data) {
    const total = data.nights * 100;
    await prisma.booking.create({ data: { ...data, total } });
    await nodemailer.sendMail({ to: data.email, subject: 'Reserva confirmada' });
  }
}
```

**Correcto:**
```typescript
// ✅ BIEN: Separación en componentes de responsabilidad única
class BookingService {
  constructor(
    private readonly bookingRepo: IBookingRepository,
    private readonly notificationService: INotificationService,
  ) {}

  async createBooking(command: CreateBookingCommand): Promise<Booking> {
    const booking = Booking.create(command);
    await this.bookingRepo.save(booking);
    await this.notificationService.sendBookingConfirmation(booking);
    return booking;
  }
}
```

---

## 2. Open/Closed Principle (OCP) — Abierto para Extensión, Cerrado para Modificación
> *El software debe estar abierto a extensiones sin necesidad de modificar el código existente.*

* Si se incorpora un nuevo método de notificación (por ejemplo, WhatsApp además de Email), no se debe modificar la lógica del servicio de reservas; se implementa una nueva estrategia que respete el contrato `INotificationService`.

```typescript
// Contrato base
interface INotificationService {
  sendBookingNotification(booking: Booking): Promise<void>;
}

// Extensiones sin modificar el llamador
class EmailNotificationService implements INotificationService { ... }
class WhatsAppNotificationService implements INotificationService { ... }
```

---

## 3. Liskov Substitution Principle (LSP) — Sustitución de Liskov
> *Los subtipos o implementaciones deben ser sustituibles por sus tipos base sin alterar el comportamiento del programa.*

* Si un repositorio de pruebas en memoria (`InMemoryBookingRepository`) implementa `IBookingRepository`, debe comportarse de forma idéntica a la implementación real (`PrismaBookingRepository`) en cuanto a contratos de retorno, tipos y excepciones esperadas.

---

## 4. Interface Segregation Principle (ISP) — Segregación de Interfaces
> *Los clientes no deben verse obligados a depender de interfaces que no utilizan.*

* Evitar interfaces "monolíticas" que mezclen operaciones no relacionadas.
* Es preferible definir interfaces pequeñas y cohesivas:

```typescript
// ❌ MAL: Interfaz gigante obligatoria
interface IAccommodationManager {
  createAccommodation(data: any): Promise<void>;
  updatePricing(id: string, price: number): Promise<void>;
  uploadPhotos(id: string, photos: File[]): Promise<void>;
  generateMonthlyRevenueReport(id: string): Promise<Report>;
}

// ✅ BIEN: Interfaces segregadas según el caso de uso
interface IAccommodationReader {
  findById(id: string): Promise<Accommodation | null>;
  search(criteria: SearchCriteria): Promise<Accommodation[]>;
}

interface IAccommodationWriter {
  save(accommodation: Accommodation): Promise<void>;
  delete(id: string): Promise<void>;
}
```

---

## 5. Dependency Inversion Principle (DIP) — Inversión de Dependencias
> *Los módulos de alto nivel no deben depender de módulos de bajo nivel. Ambos deben depender de abstracciones.*

* Los servicios del dominio (`BookingService`) nunca importan directamente el cliente de Prisma o el SDK de Cloudinary.
* Dependen de interfaces (puertos) inyectadas en el constructor mediante los mecanismos de Inversión de Control (IoC) de NestJS.

```typescript
// Token de inyección y abstracción
export const BOOKING_REPOSITORY = Symbol('BOOKING_REPOSITORY');

export interface IBookingRepository {
  findOverlappingBookings(accommodationId: string, from: Date, to: Date): Promise<Booking[]>;
  save(booking: Booking): Promise<void>;
}

// Servicio desacoplado de Prisma
@Injectable()
export class CreateBookingUseCase {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepo: IBookingRepository,
  ) {}
}
```

---

## 6. SOLID en Frontend (React & Astro Islands)

En la capa de presentación (`apps/frontend`), aplicamos los mismos 5 principios para evitar componentes monolíticos y frágiles:

### 6.1 S - Single Responsibility Principle (SRP) & Container-Presentational
* **Smart Containers (`< 100 líneas`)**: Se encargan de orquestar custom hooks, coordinar el estado de la búsqueda o reserva, y distribuir datos a subcomponentes. No renderizan markup visual complejo ni layouts densos.
* **Custom Hooks (`/hooks`)**: Toda la lógica no visual, cálculo de noches/tarifas y llamadas a la API de NestJS vive encapsulada en custom hooks (`useBookingFlow`, `useAvailabilitySearch`).
* **Dumb Components (`/components` o `/ui`)**: Componentes puramente visuales, puros y testeables que solo reciben props y disparan callbacks. Cero efectos secundarios directos (`useEffect` con fetch de datos).

```tsx
// ❌ MAL: Componente monolítico de 300 líneas con fetch, cálculo y renderizado mezclado
export function CabinCard({ cabinId }: { cabinId: string }) {
  const [data, setData] = useState(null);
  useEffect(() => { fetch(`/api/v1/accommodations/${cabinId}`).then(...); }, []);
  // ... cálculos de fechas, modales y JSX mezclado ...
}

// ✅ BIEN: SRP con Custom Hook + Dumb Component
export function CabinCardContainer({ cabinId }: { cabinId: string }) {
  const { cabin, isLoading, onBook } = useCabinBooking(cabinId);
  if (isLoading) return <CabinCardSkeleton />;
  return <CabinCardView cabin={cabin} onBook={onBook} />;
}
```

### 6.2 O - Open/Closed Principle (OCP)
* Extender componentes mediante composición (`children` o slots) en lugar de agregar cadenas interminables de `if/else` o booleanos como `isPromoted`, `isFeatured`, `hasSeasonalDiscount` dentro del mismo componente.

```tsx
// ✅ BIEN: Composición abierta a extensión
export function CardHeader({ title, badge }: { title: string; badge?: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center">
      <h3 className="font-display font-bold text-lg">{title}</h3>
      {badge}
    </div>
  );
}
```

### 6.3 L - Liskov Substitution Principle (LSP)
* Todo componente derivado o wrapper (ej. `Button`, `DateInput`, `Modal`) debe propagar correctamente referencias (`forwardRef`) y aceptar todas las propiedades estándar del elemento HTML subyacente sin alterar su contrato funcional.

### 6.4 I - Interface Segregation Principle (ISP)
* Los componentes visuales no deben recibir entidades gigantes si solo necesitan 2 o 3 campos. Pasar solo lo indispensable para reducir acoplamiento y re-renders innecesarios.

```tsx
// ❌ MAL: Acopla la tarjeta a toda la entidad de base de datos
function PriceBadge({ accommodation }: { accommodation: AccommodationWithRelations }) {
  return <span>${accommodation.pricePerNight}</span>;
}

// ✅ BIEN: Interfaz segregada mínima
function PriceBadge({ pricePerNight }: { pricePerNight: number }) {
  return <span>${pricePerNight.toLocaleString('es-AR')}</span>;
}
```

### 6.5 D - Dependency Inversion Principle (DIP)
* Los dumb components dependen de funciones callback abstractas (`onSelectDate`, `onConfirmBooking`) provistas por el container, nunca de mutaciones o llamadas directas a APIs globales.

