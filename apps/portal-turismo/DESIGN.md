---
name: Turismo Capilla del Monte
description: Sistema de diseño oficial del Pueblo Uritorco y motor de reservas directas
colors:
  primary: "#E06D39"
  primary-hover: "#C95627"
  secondary: "#749B3F"
  secondary-dark: "#5C7E30"
  institutional: "#1C8B68"
  institutional-dark: "#0D2F22"
  neutral-bg: "#FAF8F5"
  neutral-surface: "#F4F0E8"
  neutral-border: "#ECE8DF"
  accent-navy: "#2B3648"
  accent-mahogany: "#4E261E"
  text-primary: "#22201E"
  text-muted: "#3C3833"
typography:
  display:
    fontFamily: "Outfit, Playfair Display, serif"
    fontWeight: 700
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Plus Jakarta Sans, -apple-system, sans-serif"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  full: "9999px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "12px 24px"
---

# Design System — Turismo Capilla del Monte

## Overview
Identidad visual y dirección de arte para el portal oficial y motor de reservas de Capilla del Monte, Córdoba. Combina la calidez orgánica de las sierras, los tonos minerales del Cerro Uritorco y la seriedad institucional de la Secretaría de Turismo, evitando patrones genéricos de plantillas de software ("AI slop").

## Colors
- **Terracota Casonas (`#E06D39` / `#C95627`):** Color nuclear de acción. Utilizado en botones de reserva, badges principales, precios y acentos prioritarios.
- **Verde Brote Uritorco (`#749B3F` / `#5C7E30`):** Isotipo oficial y atributos naturales. Señaliza paseos, senderismo, ecología y dificultad de montaña.
- **Verde Esmeralda Institucional (`#1C8B68` / `#0D2F22`):** Acento institucional de respaldo municipal, zócalo de contactos y barra legal.
- **Neutros Sand Cálidos (`#FAF8F5`, `#F4F0E8`, `#ECE8DF`):** Fondo mineral que reemplaza al blanco clínico para dar sensación acogedora de refugio de montaña.
- **Azul Noche Pizarra (`#2B3648`) & Caoba Rústico (`#4E261E`):** Fondos de banners temáticos (astroturismo, descargas de senderos y circuito histórico de casonas).

## Typography
- **Display / Títulos (`Outfit`):** Tipografía con personalidad geométrica y calidez editorial. Se emplea en h1, h2, h3 y números destacados de tarifas.
- **UI & Cuerpo (`Plus Jakarta Sans`):** Sans-serif limpia de alta legibilidad para formularios, filtros, tablas, descripciones y microcopy de fechas/precios.

## Layout
- Estructura fluida con contenedores de ancho máximo `max-w-7xl` y padding generoso (`px-4 sm:px-6 lg:px-8`).
- Grillas asimétricas (Bento Grids) para paseos y atractivos, rompiendo la monotonía de 3 columnas idénticas de IA.
- Zonas de respiro con espaciado vertical rítmico (`py-16 sm:py-20`).

## Elevation & Depth
- Sombras sutiles y cálidas teñidas con el tono arena (`shadow-sand-300/40`) en lugar de negros opacos artificiales.
- Capas de elevación controladas:
  - Base: `z-0`
  - Overlays de mapa / controles flotantes: `z-20`
  - Popovers y cards de vista previa: `z-30`
  - Modales de reserva: `z-50`
  - Toasts / Alertas: `z-[200]`

## Shapes
- Tarjetas y contenedores con esquinas suaves `rounded-2xl` o `rounded-3xl`.
- Chips y botones con `rounded-xl` o `rounded-full` según jerarquía.
- Prohibición estricta de bordes decorativos de un solo lado (`border-l-*`) o formas geométricas sin propósito funcional.

## Components
- **Buscador de Disponibilidad:** Segmentado en Check-in, Check-out, Huéspedes y CTA Terracota. Anclado con sombra suave al Hero.
- **Tríada de Accesos Rápidos:** 3 tarjetas con imagen inmersiva, overlay degradado y tipografía blanca centrada ("Qué Hacer", "Dónde Dormir", "Dónde Comer").
- **Cards de Alojamiento:** Fotografía con relación de aspecto 4:3, badge sólido de prestador habilitado, precio por noche formateado y comodidades en chips limpios.
- **Mapa Interactivo:** Mapa base CartoDB Voyager en tonos cálidos, marcadores DivIcon SVG (Terracota para hospedajes, Verde para paseos) y tarjeta popover flotante.

## Do's and Don'ts
- **DO:** Usar siempre variables del Design System (`--color-terracotta-*`, `--color-uritorco-*`, `--color-sand-*`).
- **DO:** Formatear importes en moneda argentina en tiempo real (`$95.000`).
- **DO:** Destacar la verificación municipal oficial como factor decisivo de confianza.
- **DON'T:** Usar gradientes plantilla de IA (`from-blue-* to-purple-*`) ni texto con gradiente (`text-transparent bg-clip-text`).
- **DON'T:** Usar fondos pastel deslavados semi-transparentes (`bg-amber-100`, `bg-blue-50/10`) en tarjetas o contenedores completos.
- **DON'T:** Usar iconos de `Sparkles` ni lenguaje de "asistente mágico" en un portal municipal y de reservas reales.