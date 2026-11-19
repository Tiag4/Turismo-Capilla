---
name: anti-vibecoded
description: >
  Evita patrones visuales genéricos “vibecoded” en interfaces de Turismo-Capilla y fuerza decisiones de UI con identidad serrana y de producto real.
  Trigger: usar cuando se diseñe, edite o revise UI/UX (componentes, pantallas, modales, cards, estados, microcopy visual).
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.2"
---

# Anti Vibecoded (Turismo-Capilla)

> [!IMPORTANT]
> Es OBLIGATORIO cargar, leer y consultar la skill `anti-vibecoded` antes de realizar cualquier cambio, adición o revisión de código en la interfaz de usuario (frontend) del repositorio.

## Cuándo usar

- Cambios en UI/UX del portal público (Astro/React), catálogo de alojamientos, paseos o panel de prestadores/admin.
- Refactors visuales de cards, badges, iconografía, colores o jerarquía.
- Revisión de PRs donde la UI se vea genérica, tipo plantilla SaaS o "vibecoded".

## Reglas críticas (MUST)

1. **Prohibido `border-l-*` decorativo en cards.** Extensión: Prohibido simular bordes coloreados de un solo lado (en cualquier borde de la tarjeta: superior, izquierdo, derecho o inferior) mediante elementos internos posicionados absolutamente (ej: `<div className="absolute left-0 top-0 bottom-0 w-1 bg-[...]">`) o mediante selectores de pseudo-elementos (`after:border-l-*`, `after:border-t-*`, etc.). Si se necesita indicar estado, usar un indicador funcional integrado como un status dot junto al texto o el contraste tipográfico.
2. **Prohibido `Sparkles` y clichés decorativos de IA.** Los iconos deben ser funcionales y representar atributos reales del destino o alojamiento (WiFi, cochera, dificultad de sendero, capacidad).
3. **Prohibido gradiente genérico `from-blue-* to-purple-*` en superficies principales.**
4. **Todo ícono debe representar acción o dato de negocio (nada decorativo).**
5. **No usar badges/chips flotantes sin función operativa (evitar etiquetas trilladas tipo "¡Imperdible!" o "Oferta mágica").**
6. **OBLIGATORIEDAD DEL THEME SYSTEM: Prohibido usar colores estáticos o escalas arbitrarias.** TODO contenedor, texto, aviso, badge o elemento decorativo DEBE utilizar las variables semánticas del sistema oficial de Turismo-Capilla (`--color-terracotta-*`, `--color-uritorco-*`, `--color-emerald-portal-*`, `--color-sand-*`, `--color-navy-portal-*`) definidas en `global.css`.
7. **Mantener identidad “Terracota Casonas & Verde Uritorco”**: Calidez serrana, texturas orgánicas limpias y seriedad institucional.
8. **Prohibido encajonar contenidos principales de bienvenida en tarjetas blancas flotantes rígidas sobre fondos grises.** El contenido debe fluir integrado con el fondo cálido `sand-50`.
9. **Los íconos encerrados en contenedores de fondo con colores pasteles o de estados suaves (ej. `bg-blue-50`, `bg-yellow-100`, etc.) son un antipatrón vibecoded trillado.** Renderizar el ícono solo, con su color semántico directo y sin fondo decorativo artificial.
10. **Prohibido el uso de 'pill badges' (insignias redondeadas) con fondo y contorno pastel de color de estado junto a iconos de check genéricos.** Preferir texto plano sin fondo ni borde, o badges sólidos con contraste alto.
11. **Prohibido anidar tarjetas blancas o grises con bordes y sombras para contener elementos de datos simples, textos de ayuda o botones de navegación de flechas (como `< 1 / 2 >`).** Estos elementos deben fluir de forma directa y transparente sobre el fondo general sin recuadros adicionales innecesarios.
12. **Prohibido glassmorphism decorativo (`backdrop-filter: blur()`) aplicado sin propósito funcional real.** El blur solo se justifica en capas superpuestas reales (navbar fijo al hacer scroll, modales flotantes).
13. **Prohibido gradient text en métricas, títulos o cualquier elemento textual.** Usar colores sólidos o tipografía display de peso adecuado (`Outfit`).
14. **Prohibido paletas neón y combinaciones cyan-on-dark (`text-cyan-400` sobre `bg-slate-900` o similar).** Turismo-Capilla utiliza tonos tierra y serranos con fondos `sand` cálidos.
15. **Prohibido usar emojis como iconos de navegación, bullets de listas o reemplazo de iconos funcionales.** Usar Lucide icons consistentes.
16. **Prohibido botones con gradiente (`bg-gradient-to-r from-* to-*`).** Los botones deben ser sólidos (`bg-terracotta-500`, `bg-uritorco-500`), con hover sutil por oscurecimiento.
17. **Prohibido el patrón de secciones con fondos alternados (zebra striping: `bg-gray-50 → bg-white → bg-gray-50 → bg-white`) como estructura de página.**
18. **Prohibido repetir el mismo layout de 3 columnas idénticas (`grid-cols-3 gap-4`) para secciones distintas.** La estructura de layout debe responder al contenido (bento grid, catálogo asimétrico, etc.).
19. **Prohibido usar múltiples acentos de color en distintos elementos sin lógica semántica.** Un solo acento de acción (Terracota) y acentos secundarios institucionales (Verde Uritorco / Esmeralda).
20. **Prohibido usar fuentes genéricas sin justificación.** Títulos en `Outfit` (display orgánico) y UI/cuerpo en `Plus Jakarta Sans`.
21. **Prohibido el hero layout predecible de IA (badge → h1 → 2 CTAs → 3-column features).** En hotelería el Hero debe centrarse en el buscador de disponibilidad y fotografía panorámica auténtica de las sierras.
22. **Prohibido encajonar botones o chips de estado de filtros rápidos en pequeñas tarjetitas con bordes rígidos y fondos sólidos que simulen una tarjeta individual flotante.** Deben integrarse de forma plana al fondo general usando fondos translúcidos sin bordes.
23. **Prohibido el uso de status dots (puntitos decorativos de color) antes del texto en botones de filtro rápidos de estado.** La semántica debe ser transmitida a través del propio icono funcional de negocio (ej: PackageX, AlertTriangle) o la tipografía.
24. **Prohibido el uso injustificado de barras laterales (aside sidebars) para estructurar paneles principales cuando no hay contenido secundario sustancial.** La información debe organizarse en una grilla o bento equilibrado de una sola columna o flujo integrado, evitando fragmentar la pantalla en columnas desbalanceadas de 2/3 y 1/3 sin necesidad operativa real.
25. **Prohibido el uso de fondos pastel semi-transparentes deslavados (ej. `bg-amber-500/15`, `bg-emerald-500/10`, `bg-blue-100`, `bg-amber-100`, `bg-amber-50/50`) en banners, alertas, barras de estado, tarjetas y contenedores.** Lavar contenedores completos con tintes pasteles semi-transparentes o amarillos deslucidos es un clásico anti-patrón de IA "vibecoded". En su lugar, usar contenedores neutros limpios (`bg-sand-50 border border-sand-200`) con insignias/badges **SÓLIDAS** de color de marca o estado (`bg-terracotta-500 text-white`, `bg-emerald-700 text-white`, `bg-rose-700 text-white`) con tipografía neutra de alto contraste.
26. **Accesibilidad Obligatoria:** Toda decisión de interfaz y diseño debe cumplir de forma mandatoria con las pautas de accesibilidad WCAG 2.1 AA detalladas en `.agents/skills/accessibility/SKILL.md`.
27. **REGLA DE BADGES SÓLIDOS (MANDATORIA)**: Todos los badges e insignias DEBEN tener fondo 100% SÓLIDO y opaco con texto de máximo contraste (ej: `bg-amber-600 text-white font-bold`, `bg-sand-900 text-white`, `bg-emerald-700 text-white`). Está ESTRICTAMENTE PROHIBIDO usar fondos pastel (ej. `bg-amber-100`, `bg-blue-50`, `bg-red-50`), colores deslavados o clases semi-transparentes/opacidades (ej. `bg-amber-500/10`, `bg-opacity-*`).
28. **PROHIBICIÓN DE "TARJETITIS" / EXCESO DE CARDS BLANCAS DESCONECTADAS (CARD FATIGUE - MANDATORIA)**:
    - **Diagnóstico**: Encajonar cada dato, estado, paso o bloque secundario en tarjetas blancas individuales flotantes con bordes y sombras (`bg-white rounded-2xl border border-sand-200 shadow-xs`). Este "muro de tarjetas" fragmenta visualmente la interfaz, satura al usuario y es el síntoma definitivo de UI generada por IA.
    - **Regla**: Prohibido fragmentar la información de una misma entidad (como un voucher o ficha de reserva) en tarjetas blancas flotantes aisladas o anidadas.
    - **Reemplazo correcto**:
      1. Utilizar **un único contenedor cohesivo o lienzo fluido** donde el contenido fluya con ritmo vertical y división funcional interna sutil (`divide-y divide-sand-200`, bordes sutiles, espaciado proporcional).
      2. Las cards se reservan **única y exclusivamente para colecciones de entidades homogéneas e independientes** (ej: grilla de alojamientos, tarjetas de senderos).
      3. Para comprobantes, vouchers, estados o resúmenes de reserva, la jerarquía debe lograrse mediante **tipografía, espaciado (`gap`, `py`), badges sólidos de estado e hileras divisorias**, NO encajonando cada párrafo o número en una cajita blanca individual.
29. **PROHIBICIÓN TOTAL DE ANIDACIÓN DE CARDS (CERO CARDS DENTRO DE CARDS - MANDATORIA)**:
    - Si una sección o panel ya se encuentra delimitado por un contenedor blanco con borde, sus componentes y registros internos JAMÁS deben ser tarjetas blancas o cajitas anidadas con bordes secundarios (`bg-sand-50/70 border border-sand-200/80`, `bg-amber-50/50 border border-amber-200/80`, `bg-white border`). Deben fluir como filas planas, tablas editoriales o bloques delimitados por divisores limpios (`border-t border-sand-200` o `divide-y divide-sand-200`).
30. **REGLA DE BOTTOMSHEETS Y DRAWERS EN MOBILE (MANDATORIA)**:
    - **Diagnóstico**: Mostrar modales flotantes centrados en escritorio que en dispositivos móviles (`< sm` / viewport táctil) quedan estrangulados, cortan contenidos o se vuelven incómodos para operar con una sola mano.
    - **Regla**: En mobile, todo modal o diálogo interactivo DEBE transformarse en un **Bottomsheet deslizante desde la parte inferior** (`fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6`).
    - **Requisitos de Bottomsheet en Mobile**:
      1. Esquinas redondeadas superiores en móvil (`rounded-t-3xl sm:rounded-2xl`).
      2. Tirador táctil visual (drag handle / pill): `<div className="sm:hidden w-12 h-1.5 bg-sand-300 rounded-full mx-auto my-2.5 shrink-0" />`.
      3. Altura máxima adaptada (`max-h-[92vh] sm:max-h-[88vh]`) con scroll interno suave (`overflow-y-auto`).
      4. Animación fluida de entrada desde el fondo (`animate-in slide-in-from-bottom duration-200 sm:zoom-in-95`).
      5. Aprovechar el pulgar del usuario para cerrar o confirmar sin forzar a estirar la mano hacia la esquina superior del teléfono.
31. **PROHIBICIÓN DE TEXTO GLUED / SIN ESPACIADO EN METADATOS (ZERO RUN-ON LABELS - MANDATORIA)**:
    - **Diagnóstico**: Renderizar pares etiqueta/valor sin separación espacial o semántica explícita (`span` pegado a otro `span` sin `block` o sin margin), como `2026-09-18Desde las 14:00 hs` o `4 noches1 alojamiento`.
    - **Regla**: Todo metadato secundario debe contar con espacio visual claro, salto de línea o divisor explícito (`block text-xs`, `mt-0.5`, o separador `·`). Jamás permitir que fechas, horas o números se concatenen visualmente en la misma línea sin espacio.
32. **PROHIBICIÓN DE PRE-TÍTULOS "EYEBROW" EN MAYÚSCULAS Y TRACKING FORZADO (MANDATORIA)**:
    - Prohibido usar microtextos flotantes en mayúsculas sostenidas con tracking amplio (`uppercase tracking-wider` / `tracking-widest` con `text-[10px]` o `text-xs`) encima de títulos o entidades ("CÓDIGO ÚNICO DE TRÁMITE", "DETALLE DE OPERACIÓN").
    - Reemplazo: Títulos en Sentence case con tipografía display (`Outfit`) y metadatos secundarios en tipografía neutra (`text-xs text-sand-500 font-medium`).
33. **PROHIBICIÓN DE FOOTERS REDUNDANTES CON BOTÓN 'CERRAR' EN MODALES (MANDATORIA)**:
    - Prohibido agregar barras de pie (footers) con el único fin de mostrar un botón "Cerrar" si el modal ya cuenta con 'X' en la cabecera, soporte de tecla Escape y cierre por clic en el backdrop. Omitir el footer para maximizar el espacio útil en pantalla.
34. **PROHIBICIÓN DE ÍCONOS INCRUSTADOS EN HEADINGS (H1 / H2 / H3)**: Prohibido incrustar íconos directamente adentro de las etiquetas de encabezado `h1` o `h2`. Los títulos deben mantenerse tipográficamente limpios, nítidos y de lectura directa.
35. **PROHIBICIÓN DE BUZZWORDS DE IA Y DISCURSO RIMBOMBANTE ("SOBERANÍA DIGITAL", ETC.)**: Prohibido el uso exagerado de términos de pitch o plantillas de IA en copy institucional. La comunicación debe ser natural, humana, directa y honesta.
36. **PROHIBICIÓN DE BORDES "FEATURED TIER" SaaS EN PANELES INTERNOS**: Prohibido aplicar bordes de color de acento o sombras especiales a una opción operativa simulando planes comerciales de un SaaS.
37. **PROHIBICIÓN DE CONTROLES SEGMENTADOS CON BANDEJAS GRISES APAGADAS**: Prohibido usar bandejas grises artificiales con texto gris apagado para controles segmentados o selectores de opciones. Usar botones o tabs con contraste alto e identidad de marca.
38. **PROHIBICIÓN DE FONDOS GRISES/AMARILLOS ARTIFICIALES DESCOLGADOS EN COMPONENTES**: Todo contenedor debe utilizar el fondo general de la superficie del sistema (`bg-sand-50`, `bg-white`), integrándose con bordes sutiles del tema (`border-sand-200`).
39. **PROHIBICIÓN DE ENCAJONAR IMÁGENES EN SUB-CARDS**: Las imágenes no deben estar contenidas dentro de una card o recuadro con fondo gris o marco anidado. Renderizar la imagen directamente sobre la superficie base con sus bordes redondeados limpios.

## Anti-patrones → reemplazo recomendado

| Anti-patrón | Evitar | Reemplazo |
|---|---|---|
| Card-itis / Muro de tarjetas | Envolver cada dato, estado o sección en una tarjeta blanca flotante con borde y sombra | Contenedor único con filas planas delimitadas por `divide-y divide-sand-200` y ritmo tipográfico |
| Anidación de tarjetas (Cards in cards) | Tarjeta blanca contenedora que encajona tarjetas o cajitas internas con bordes secundarios | Bloque contenedor único sin cajas flotantes internas; divisores limpios o tablas compactas |
| Modales flotantes en mobile | Modales rígidos de escritorio centrados en pantallas pequeñas que recortan contenido | Bottomsheet deslizante desde abajo (`items-end sm:items-center`, `rounded-t-3xl sm:rounded-2xl`, tirador táctil) |
| Texto concatenado sin espacio | `2026-09-18Desde las 14:00 hs` o `4 noches1 alojamiento` | Clases `block`, márgenes verticales (`mt-0.5`), tipografía jerárquica clara |
| Fondos pastel deslavados | `bg-amber-50/50`, `bg-amber-100`, `bg-emerald-500/10` manchando contenedores enteros | Superficie limpia `bg-sand-50` con borde sutil `border-sand-200` y badge SÓLIDO de estado |
| Pre-títulos eyebrow en mayúsculas | `uppercase tracking-wider text-[10px]` encima de títulos | Tipografía limpia en Sentence case sin mayúsculas forzadas |
| Footer redundante con "Cerrar" | Barra de pie de modal solo con botón "Cerrar" | Omitir footer; usar "X", Escape, swipe down y clic en backdrop |
| Borde izquierdo decorativo | `border-l-4 ...` | Card completa con `border` + `surface` tokenizada |
| “Magia IA” genérica | `Sparkles` | Ícono funcional del dominio (estado/acción real) |
| Gradiente plantilla IA | `from-blue-* to-purple-*` | Paleta/tokens Turismo-Capilla (`--color-terracotta-500`, `--color-uritorco-500`, `--color-sand-*`) |
| Botón con gradiente | `bg-gradient-to-r from-X to-Y` | Botón sólido con `bg-terracotta-500` y hover sutil por oscurecimiento |

## Checklist rápido

- [ ] No sufre de "tarjetitis" o fragmentación en tarjetas blancas flotantes desconectadas (Regla 28).
- [ ] No anida cards dentro de cards del mismo fondo/color ni cajitas internas (Regla 29).
- [ ] En mobile, los modales se abren como bottomsheets deslizantes desde abajo con tirador táctil (Regla 30).
- [ ] No hay textos pegados o concatenados sin separación espacial en fechas, horas o números (Regla 31).
- [ ] No usa pre-títulos eyebrow en mayúsculas forzadas con tracking amplio (Regla 32).
- [ ] No agrega footers redundantes con botón 'Cerrar' en modales cuando ya existe 'X' y backdrop (Regla 33).
- [ ] No usa fondos pastel deslavados (`bg-amber-50/50`, `bg-emerald-100`, etc.) en contenedores (Regla 25).
- [ ] Badges e insignias de estado son 100% SÓLIDOS y de máximo contraste (Regla 27).
- [ ] No usa `border-l-*` decorativo en cards.
- [ ] No usa sparkles ni iconos decorativos sin semántica.
- [ ] No usa gradientes azul-púrpura genéricos ni gradient text.
- [ ] Usa tokens de tema (`terracotta`, `uritorco`, `emerald-portal`, `sand`).
- [ ] Mantiene identidad cálida y serrana de Turismo-Capilla del Monte.
