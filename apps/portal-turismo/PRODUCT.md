# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
- **Turista / Viajero:** Busca descanso, aventura, naturaleza o mística en las Sierras de Córdoba. Necesita explorar senderos, conocer tiempos y dificultades, y reservar cabañas seguras sin caer en estafas ni sobreprecios de intermediarios.
- **Cabañero / Prestador Local:** Gestiona su hospedaje, publica fotos y tarifas, y atiende reservas directamente desde una plataforma respaldada institucionalmente.
- **Comisión de Turismo (Municipalidad de Capilla del Monte):** Administra el portal oficial, audita prestadores habilitados y promueve el patrimonio natural y cultural del pueblo.

## Product Purpose
Proveer la plataforma digital y motor de reservas oficial (OTA directa) de Capilla del Monte, combinando descubrimiento turístico de alto impacto visual con reservas seguras entre turistas y prestadores habilitados. El éxito se mide por conversión de reservas directas, cero sobreventa (anti-overbooking) y respaldo institucional contra estafas de alquileres temporarios.

## Positioning
La única plataforma de reservas y guía de Capilla del Monte con certificación municipal directa: sin comisiones abusivas para el prestador, con tarifas transparentes y con garantía de prestadores formalmente inspeccionados y habilitados por la Secretaría de Turismo.

## Operating Context
- El turista navega frecuentemente desde dispositivos móviles antes y durante el viaje (incluso en zonas de montaña con conectividad 3G/4G irregular).
- El prestador administra sus reservas tanto desde el celular como desde una computadora en recepción.
- Capilla del Monte es un destino con fuerte identidad geológica (Cerro Uritorco, Los Terrones), mística y astroturismo (cielos limpios).

## Capabilities and Constraints
- Búsqueda de disponibilidad en tiempo real por fechas y huéspedes.
- Prevención estricta de solapamiento de reservas (anti-overbooking garantizado transaccionalmente).
- Mapa interactivo georreferenciado con atractivos naturales y hospedajes con tarifas visibles.
- Stack tecnológico: Astro 5 + React en frontend, NestJS + Prisma + PostgreSQL en backend.
- Cero tolerancia a interfaces genéricas ("AI slop") o patrones despersonalizados de plantillas SaaS.

## Brand Commitments
- **Nombre:** Turismo Capilla del Monte — Pueblo Uritorco.
- **Identidad Cromática Oficial:** Terracota Casonas (`#E06D39`), Verde Brote Uritorco (`#749B3F`), Verde Esmeralda Institucional (`#1C8B68`), Fondos Sand Cálidos (`#FAF8F5`, `#F4F0E8`).
- **Tipografía:** Outfit (Display / Títulos) y Plus Jakarta Sans (UI y cuerpo).

## Evidence on Hand
- Captura oficial del portal municipal (`media_1788589249119.png`) con paleta, tríada de tarjetas ("Qué Hacer", "Dónde Dormir", "Dónde Comer") y banner patrimonial "Casonas con Historia".
- Endpoints del backend NestJS operativos en `http://localhost:3001` (`/api/v1/attractions`, `/api/v1/accommodations`, `/api/v1/bookings`, `/api/v1/auth`).

## Product Principles
1. **Confianza Institucional Directa:** Cada cabaña listada cuenta con verificación municipal visible; el trato y el pago es directo con el dueño.
2. **Claridad Geográfica Inmediata:** La ubicación serrana (distancia al Uritorco, al río o al centro) es tan importante como el precio.
3. **Cero Fricción en el Embudo:** El cálculo de noches, tarifas y disponibilidad es instantáneo, sin formularios interminables.
4. **Respeto a la Identidad Autóctona:** Cada componente respeta la textura orgánica, mineral y cultural de Capilla del Monte.

## Accessibility & Inclusion
- Contraste WCAG 2.1 AA en todas las combinaciones de texto y fondos de marca.
- Navegación por teclado completa en el buscador y modales de reserva.
- Formatos de moneda y fecha adaptados a la localización argentina (`es-AR`).