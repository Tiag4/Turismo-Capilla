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
