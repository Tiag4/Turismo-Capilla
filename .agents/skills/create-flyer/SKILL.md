---
name: create-flyer
description: Directrices, pipeline de captura real y reglas anti-slop para la creación de flyers publicitarios y piezas de marketing visual para redes sociales (Instagram Stories 9:16, Feed Vertical 4:5, Cuadrado 1:1) en Equarys.
metadata:
  version: "1.11.0"
  author: equarys
---

# Create Flyer — Directrices de Diseño Publicitario y Anti-Slop (Equarys)

Esta skill establece el estándar obligatorio para la creación, maquetación y verificación visual de piezas publicitarias, flyers para redes sociales (Instagram Stories 9:16, Instagram/Facebook Feed 4:5 y Cuadrado 1:1) y materiales promocionales de Equarys.

---

## 1. El Principio Fundamental: Un Flyer NO es una Landing Page

Un flyer publicitario no es una página web ni un folleto técnico corporativo:
* **Objetivo de 3 segundos:** Frenar el scroll con un gancho visual y tipográfico contundente.
* **Escaneo de 5 segundos:** Transmitir una única propuesta de valor clara y humana (sin muros de texto ni grids de 4 tarjetas).
* **Acción clara:** Un único llamado a la acción visible y legible.

---

## 2. Arquitectura de Formatos y Organización de Carpetas

Todo set de flyers publicitarios de campaña debe organizarse en una carpeta raíz `Post/` con subcarpetas dedicadas por superficie de publicación:

```
Post/
├── Instagram Stories/
│   ├── flyer-story-1080x1920.html
│   ├── flyer-story-1080x1920.png
│   └── [assets locales: logos, capturas]
└── Facebook e Instagram Post/
    ├── flyer-feed-portrait-1080x1350.html
    ├── flyer-feed-portrait-1080x1350.png
    ├── flyer-feed-square-1080x1080.html
    ├── flyer-feed-square-1080x1080.png
    └── [assets locales: logos, capturas]
```

### 2.1 Especificaciones por Formato:
1. **Instagram Stories (`1080 × 1920 px` - 9:16):**
   * **Zona Segura Superior:** Mínimo 160 px libres de elementos críticos (reservado para avatar, username, tiempo y barra de progreso de Instagram).
   * **Zona Segura Inferior:** Mínimo 220 px libres (reservado para campo de respuesta, envío de mensaje y stickers de interacción).
   * **Flujo Vertical Centrado:** Header con marca -> Titular de impacto -> Mockup central con sombra profunda -> Checklist de beneficios limpio -> Bloque de acción con URL visible y llamado al sticker/link en bio.
2. **Feed Vertical Portrait (`1080 × 1350 px` - 4:5):**
   * El formato rey de feed en Instagram y Facebook Mobile (ocupa el máximo alto visible sin recorte).
   * Grid editorial a dos columnas (7 cols copy / 5 cols smartphone mockup) con pie de llamado a la acción en fondo sólido.
3. **Feed Cuadrado (`1080 × 1080 px` - 1:1):**
   * Formato multipropósito para posts de Facebook, grilla estándar y carruseles.
   * Ritmo vertical compacto, smartphone frame adaptado a `w-[305px] h-[645px]` para que el bottom navigation bar mantenga respiración perfecta sin desbordar el lienzo.

---

## 2. Pipeline de Captura Real de Producto (CERO Mockups Falsos / CERO UI Slop)

* **PROHIBIDO** dibujar interfaces web simuladas con HTML/CSS dentro de rectángulos, usar emojis como productos (🍕, 🥟) o fingir pantallas de software.
* **OBLIGATORIO:** Usar Playwright para capturar pantallas reales en alta resolución (`deviceScaleFactor: 2`, viewport móvil `375x790` o proporcional) de tiendas demo reales (ej: `http://localhost:4470/s/rotiseria-la-criolla` o producción).
* **Desactivación obligatoria de herramientas de desarrollo:**
  - En entornos locales o previews de Astro, **remover obligatoriamente** el `<astro-dev-toolbar>` antes de la captura:
    ```js
    await page.evaluate(() => document.querySelector('astro-dev-toolbar')?.remove());
    await page.addStyleTag({ content: 'astro-dev-toolbar { display: none !important; }' });
    ```
  - Cero tolerancia a botones flotantes de depuración, badges de inspectores o toolbars en la captura final.
* **Encuadre y relación de aspecto milimétrica:**
  - El contenedor del smartphone en el flyer debe tener una relación de aspecto que coincida con el viewport capturado, garantizando que elementos clave de navegación fija (como el bottom navbar con `Inicio`, `Catálogo`, `Favoritos`, `Perfil`) se visualicen completos y sin recortes.

---

## 3. Identidad de Marca y Logo Compuesto (Equarys vs Equarys Shop)

* **Equarys** es la marca madre institucional.
* **Equarys Shop** es el producto específico de tienda online y shopping/directorio.
* Toda pieza de publicidad dirigida a captar comercios para venta online debe portar el **logo compuesto**:
  - Isotipo geométrico institucional.
  - Wordmark `Equarys` (peso 850, tono pizarra o verde oscuro).
  - Descriptor de producto `Shop` (peso 750, verde institucional `#005530`).

---

## 4. Reglas Críticas Anti-Slop y Anti-Vibecoded

Toda pieza debe cumplir estrictamente con `.agents/skills/anti-vibecoded/SKILL.md` adaptado a diseño gráfico:

1. **PROHIBICIÓN DE EYEBROW MICRO-LABELS (Regla 35):**
   * PROHIBIDO usar textos flotantes en mayúsculas sostenidas con tracking extendido (`uppercase tracking-wider text-xs`). Ejemplo de slop: `CREÁ TU CATÁLOGO GRATIS`.
   * En su lugar, usar tipografía limpia en Sentence case con peso y tamaño natural.
2. **PROHIBICIÓN DE BADGES Y PILL BADGES DECORATIVOS (Reglas 5, 10, 27):**
   * PROHIBIDO agregar chips o pastillas flotantes sin función operativa (ej. badge "Compre Local" con puntito verde). El mensaje debe comunicarse mediante la composición o el titular, no con badges de plantilla.
3. **PROHIBICIÓN DE EMOJIS COMO ELEMENTOS DE DISEÑO (Regla 15):**
   * PROHIBIDO usar emojis (🔥, 🚀, 🍕, 🤍) como viñetas de listas, iconos o decoración de tarjetas.
4. **PROHIBICIÓN DE "TARJETITIS" / CARDS INNECESARIAS (Regla 29):**
   * PROHIBIDO encajonar listas de beneficios o ecuaciones en cajas o tarjetas flotantes grises o pastel. El texto debe respirar e integrarse directamente sobre el fondo limpio del lienzo.
5. **PROHIBICIÓN DE FONDOS OSCUROS TIPO SAAS CON GLOWS (Regla 14):**
   * La publicidad para comercios locales de barrio debe ser **cálida, luminosa y cercana**: fondos blancos puros (`#ffffff`) o neutros suaves, con curvas orgánicas en verde institucional **British Racing Green** (`#005530`) o esmeralda sobrio.
6. **PROHIBICIÓN DE FALSAS AFFORDANCES Y FONDOS PASTEL DESLAVADOS:**
   * PROHIBIDO diseñar el llamado a la acción con fondos pastel o deslavados (`bg-emerald-50`), que restan contraste y se perciben como slop genérico.
   * El botón o bloque de llamado a la acción debe portar **fondo sólido institucional** (British Racing Green `#005530` o `#0f172a`) con tipografía blanca nítida de alto contraste.
   * PROHIBIDO incluir cajas anidadas con flechas (`box-in-a-box` con `→`).
   * **URL CANÓNICA DE SHOPPING:** La dirección oficial para invitar a comercios a abrir su catálogo es estrictamente **`shop.equarys.com`**.
7. **PROHIBICIÓN DE APILAR SUBTÍTULOS DENTRO DEL BOTÓN (SLOP TIPOGRÁFICO DE CARD/BOTÓN):**
   * PROHIBIDO meter dos niveles de texto con jerarquías y colores disonantes dentro de la misma pastilla (ej: un texto diminuto en verde claro como *"Creá tu tienda online gratis"* apilado encima del URL gigante en blanco *"shop.equarys.com"* dentro del mismo botón). Ese patrón de "tarjeta-botón híbrida" es clásico AI boilerplate.
   * **Composición humana correcta:** El llamado a la acción editorial se sitúa **afuera y sobre el canvas** (*"Creá tu tienda online gratis en"* en tipografía sobria y legible), y la pastilla sólida contiene **únicamente la acción o destino principal** (*"shop.equarys.com"*) con espaciado uniforme, balance visual y máxima fuerza gráfica.

8. **PROHIBICIÓN DE NAVEGADORES SIMULADOS (TRAFFIC LIGHT DOTS / BROWSER MOCKUPS):**
   * PROHIBIDO meter capturas de pantalla dentro de ventanas falsas de navegador con botones de semáforo (rojo, amarillo, verde) o barras de URL simuladas. Eso es boilerplate genérico de plantilla SaaS/Dribbble de IA.
   * Si se muestra software web, se muestra en un dispositivo físico real (tablet, laptop, smartphone) a escala generosa, o como crop de alta resolución limpio y directo sobre el canvas con sutil elevación y bordes redondeados sobrios.
9. **PROHIBICIÓN DE CONTENEDORES CON FONDO PASTEL EN PASOS Y LABELS:**
   * PROHIBIDO colocar píldoras con fondos desteñidos/pastel (`bg-[#005530]/10`, `bg-zinc-100`) para rotular pasos (`PASO 1`, `PASO 4`). El texto del paso debe ser parte integral del fondo general, estructurado tipográficamente con fuerza jerárquica (ej: número grande `01`, `02`, o en el titular directo `1. Publicás tus productos en minutos`).
10. **PROHIBICIÓN DE CONTADORES E INDICADORES DE CARRUSEL DUPLICADOS:**
   * PROHIBIDO dibujar barras de puntos (dots) o badges tipo `5/5` o `1/5` en la esquina superior del flyer. Las redes sociales (Instagram, Facebook) ya renderizan de forma nativa sus propios indicadores de carrusel sobre la publicación. Duplicarlos dentro del diseño satura visualmente, choca con elementos de marca y delata diseño vibecoded.
11. **REGLA DE ESCALA Y PROTAGONISMO VISUAL (PROHIBICIÓN DEL ESPACIO NEGATIVO ESTÉRIL / CAPTURAS ENANAS):**
   * Las imágenes y capturas de producto son lo más importante del flyer publicitario: deben verse y poder leerse sin esfuerzo en una pantalla de smartphone normal.
   * El elemento visual principal debe ocupar entre el **55% y el 75%** del área o altura del canvas.
   * PROHIBIDO encoger capturas de pantalla a miniaturas ilegibles rodeadas de grandes vacíos blancos. Si la pantalla original es compleja, se realiza un recorte focalizado en alta resolución (`crop` quirúrgico a 2x) que muestre los ítems, precios y botones con tamaño de fuente nítido y legible.
12. **PROHIBICIÓN DE TARJETITIS ATOMIZADA EN BENEFICIOS:**
   * PROHIBIDO dividir 3 ideas en 3 tarjetitas enanas con borde gris claro encajonadas al pie del diseño. Si se listan beneficios o conclusiones, se presentan con jerarquía editorial tipográfica limpia (lista con viñetas circulares sólidas o números limpios integrados al canvas), dejando que el aire y la tipografía hagan el trabajo, sin cajas innecesarias.
13. **ACCESIBILIDAD Y CONTRASTE WCAG 2.2 (AA / AAA OBLIGATORIO):**
   * Todo texto debe cumplir estrictamente con los ratios de contraste WCAG: $\ge 4.5:1$ para texto regular, $\ge 3:1$ para titulares grandes, y preferentemente $\ge 7:1$ (AAA) para textos de acción o prompts de deslizamiento.
   * **PROHIBIDO** el texto gris deslavado sobre fondo blanco (`#9ca3af`, `text-zinc-400`, `text-slate-400`). El pie de "Deslizá para ver el siguiente paso" debe usar `text-zinc-800` o `text-zinc-900` con flecha en verde corporativo (`#005530`), garantizando legibilidad total incluso con brillo bajo de pantalla.
14. **PROHIBICIÓN DE CAPTURAS DE DESKTOP ADAPTADAS A LA FUERZA EN MOCKUPS MÓVILES:**
   * PROHIBIDO capturar pantallas en viewport desktop (`1440x900`) y recortarlas para embutirlas en marcos de celular. La proporción de las fuentes, cards y tablas queda deformada e ilegible.
   * Si la pantalla se exhibe en un smartphone, **DEBE capturarse en un contexto móvil nativo** (`viewport: { width: 390, height: 844 }`, `isMobile: true`, `deviceScaleFactor: 2`). Así, la vista móvil responsiva real del software se muestra con sus layouts auténticos para celular.
15. **FORMATO AUTÉNTICO DE WHATSAPP (EQUARYS SHOP ORDER MESSAGE):**
   * Cuando se muestre la llegada de un pedido en WhatsApp, el formato debe replicar fielmente el diseño del mensaje oficial de Equarys Shop:
     - Encabezado con tarjeta de previsualización web enriquecida (thumbnail, título del comercio, subtítulo de catálogo y dominio `shop.equarys.com`).
     - Saludo formal e identificación del pedido con emojis estructurados (`🏷️ Pedido Nº`, `👤 Nombre`, `📱 Teléfono`, `📍 Entrega`, `💵 Pago`).
     - Desglose de ítems (`📦 Productos: • Ítem × Cantidad — $Precio`, con sub-opciones indentadas `↳ Variante (+$...)`).
     - Total resaltado (`💵 Total: $...`).
     - Enlace al comprobante web público (`🧾 Ver comprobante del pedido:` con URL canónica `https://shop.equarys.com/s/.../exito?orden=...`).
     - Hora y tildes azules de confirmación (doble check `✓✓`).
16. **BLOQUEO MATEMÁTICO DE ASPECT RATIO EN MOCKUPS MÓVILES (CERO RECORTES LATERALES):**
   * El contenedor interno de la pantalla del celular **DEBE portar estrictamente la relación de aspecto del viewport capturado** (`aspect-[390/844] w-full`).
   * **PROHIBIDO** forzar alturas arbitrarias (`h-[1050px]`) que no correspondan al ancho del contenedor. Cuando la relación de aspecto no coincide, `object-cover` agranda la imagen y recorta los laterales, cortando letras de menús, títulos ("Productos" -> "> roductos") o nombres de platos.
17. **PERSPECTIVA EN PRIMERA PERSONA DEL COMERCIANTE ("MI PANEL" Y "MI TIENDA"):**
   * PROHIBIDO rotular capturas con tono distante o de tercera persona tipo *"Panel del comerciante"* o *"Tienda del cliente"*.
   * Usar siempre la perspectiva del dueño de negocio: **"Mi panel"** y **"Mi tienda"**. La publicidad le habla directamente al comerciante que se imagina al mando de su negocio.
18. **MUESTRA OBLIGATORIA DE PRODUCTOS REALES EN LA FASE DE CATÁLOGO:**
   * En la diapositiva de catálogo ("Publicás tus productos en minutos"), la captura de la tienda **DEBE mostrar tarjetas de productos reales** (fotos de platos, nombres, precios y botones de agregado), scrolleando por debajo del hero si es necesario.
   * PROHIBIDO mostrar únicamente el banner y las categorías si el mensaje habla de publicar productos.
19. **BANDEJAS DE PEDIDOS LIMPIAS Y ACTIVAS (CERO POPOVERS EFÍMEROS):**
   * En la diapositiva de recepción y despacho de pedidos, **PROHIBIDO** incluir banners transitorios de permisos (ej. popover o botón *"¿Querés recibir alertas? Activar alertas"*).
   * La bandeja debe mostrar un flujo activo y realista de pedidos (4–5 pedidos con clientes diversos, importes variados y estados como *Nuevo*, *En preparación*, *En camino*, *Entregado*) para transmitir dinamismo comercial y volumen.
20. **LÍNEA BASE VERTICAL BLOQUEADA EN CARRUSELES (ANTI-JUMPING / COHERENCIA ENTRE PLACAS):**
   * En cualquier formato de carrusel, el encabezado de texto (título y subtítulo) **DEBE anclarse a una línea base vertical idéntica y fija en todas las diapositivas**.
   * **PROHIBIDO** centrar el bloque de texto con `my-auto` junto al mockup: como cada slide tiene elementos de diferente altura (un celular vs dos celulares vs celular + checklist), el título salta arriba y abajo al deslizar. El contenedor del encabezado debe tener altura y posición fijas, y el mockup debe centrarse en el espacio inferior restante.
21. **PROHIBICIÓN DE INTERFACES DE TERCEROS INVENTADAS CON CÓDIGO (CERO FAKE UIs):**
   * **PROHIBIDO** maquetar manualmente con HTML y CSS pantallas de aplicaciones de terceros (como chats de WhatsApp). Casi siempre lucen falsas, desproporcionadas o sin las texturas y microdetalles auténticos de la plataforma.
   * En su lugar, utilizar capturas reales o la herramienta de generación de imágenes con brief estricto para obtener interfaces hiperrealistas con tipografía, wallpapers y badges nativos de la aplicación.
22. **LENGUAJE DE MOSTRADOR VS JERGA TÉCNICA CORPORATIVA (PROHIBICIÓN DE "COMANDA", "POS", "SKU"):**
   * En comercios de barrio, rotiserías, pizzerías y negocios gastronómicos locales, **nadie habla de "comanda", "POS" ni "SKU"**. Esos términos provienen de software corporativo y restaurantes de alta gama, y generan fricción o distancia innecesaria con el comerciante.
   * **OBLIGATORIO** utilizar el vocabulario cotidiano del mostrador: **"pedido"**, **"venta"**, **"plato"**, **"producto"**, **"carta"**, **"local"**.
23. **ESCALA TIPOGRÁFICA Y PROHIBICIÓN DE MÁRGENES FANTASMA (ANTI-VOID):**
   * En lienzos de 1080 px de ancho, los títulos y subtítulos no pueden encajonarse en anchos tímidos (`max-w-2xl` o `max-w-3xl`) que dejen vacíos gigantes a los costados y tipografía minúscula.
   * Utilizar contenedores amplios (`max-w-4xl` o `max-w-[940px]`), con títulos contundentes (`54px` a `58px` en Stories 9:16) y subtítulos en `24px` a `26px` con peso medio (`font-medium text-zinc-700`) que tomen autoridad del espacio disponible con claridad y sin timidez.
24. **COHERENCIA VERTICAL Y ALTURA UNIFICADA EN CARRUSELES:**
   * Para evitar que la vista del usuario "se caiga" o salte al deslizar entre diapositivas (especialmente en el último paso):
     - Todos los titulares de 1 o 2 líneas deben compartir la misma altura y centro óptico, o unificarse en redacción a 2 líneas fluidas.
     - El footer debe reservar exactamente la misma altura física en todas las diapositivas (incluso en la placa final de cierre con llamado a la acción).
25. **BÚSQUEDA DE INSPIRACIÓN: ANUNCIOS PUBLICITARIOS REALES VS HEROES WEB:**
   * Al recopilar referencias de inspiración, enfocarse estrictamente en **piezas publicitarias pagas (Meta Ads, Instagram Stories y Feed)** y creatividades diseñadas para pauta, NUNCA en cabeceras o "heros" de páginas web corporativas (que suelen portar layouts estáticos, banners de cookies o slop institucional).
26. **PROHIBICIÓN DE METÁFORAS DE PAPEL FALSO / TICKETS TÉRMICOS IMPRESOS (RECEIPT SLOP):**
   * Dibujar o montar tickets de papel térmico, facturas flotantes, rollos de papel o recibos con bordes dentados simulados es otro cliché vibecoded de IA para "hacer tangible" una transacción. Se percibe como un truco de mockup barato y ensucia la pieza.
   * La contundencia comercial debe lograrse con **tipografía pura, contraste numérico directo y jerarquía editorial**, jamás con imitaciones de papel impreso.
27. **PROHIBICIÓN DE TARJETAS SATÉLITE / ALAS COMPARATIVAS FLOTANTES (WING CARDS SLOP):**
   * **PROHIBIDO** flanquear un smartphone o dispositivo con dos tarjetas flotantes simétricas (`[Apps ✕]` a la izquierda y `[Solución ✓]` a la derecha). Es el cliché máximo de plantilla SaaS de IA forzado dentro de un flyer publicitario.
   * Toda comparativa debe resolverse en el flujo editorial del copy o en un bloque tipográfico integrado directamente sobre el lienzo, sin cajas ni alas flotantes.
28. **PROHIBICIÓN DE TIRAS DE MÉTRICAS CON BARRAS/LÍNEAS DIVISORIAS (METRIC STRIP SLOP):**
   * **PROHIBIDO** encajar tiras horizontales de 3 métricas o estadísticas separadas por líneas divisorias verticales u horizontales (`border-y border-zinc-200`, `h-10 w-px bg-zinc-200`, barras tipo `0 Fotos | 100% Talles | 1 Clic`). Este recurso es un cliché repetitivo de infografía o landing SaaS de IA que ensucia la composición del flyer publicitario, le roba protagonismo a la captura de producto y se percibe como slop artificial.
   * La propuesta de valor debe comunicarse de forma fluida y directa a través del titular, el subtítulo y la contundencia visual del producto real, sin tablas, barras divisorias ni números descontextualizados.
29. **LEY DE PROXIMIDAD Y ACOPLAMIENTO ESTRICTO TEXTO-MOCKUP (CERO DESCONEXIÓN VERTICAL / GAP MÁXIMO 48px):**
   * **El Defecto Recurrente (Slop de Disociación Espacial y Vacío Inferior):**
     - En Stories 9:16: Fijar el texto contra el techo y mandar el visual a centrarse genera un desierto de 300px entre subtítulo e imagen.
     - En Feed 4:5 y 1:1: Apilar los elementos de arriba a abajo con márgenes fijos (`mt-6`) sin anclar el pie provoca que todo quede amontonado arriba, dejando un vacío muerto inmenso (200px–320px) en la parte inferior del diseño.
   * **Diferenciación Obligatoria por Formato:**
     - **En Instagram Stories (9:16 - 1080 × 1920):** Respetar zona segura superior (140px) e inferior (220px para reply bar). El bloque de texto y el mockup deben mantenerse acoplados con distancia $\le 48\text{px}$.
     - **En Feed Portrait (4:5 - 1080 × 1350) y Feed Cuadrado (1:1 - 1080 × 1080):** El canvas NO tiene barras de sistema que tapen el pie. La composición DEBE usar `flex flex-col justify-between`:
       1. Encabezado arriba (Logo + Titular + Subtítulo).
       2. Footer anclado al pie (`pb-8` en 4:5, `pb-6` en 1:1) marcando el llamado a la acción o prompt de deslizamiento.
       3. Visual principal centrado con `my-auto` en el espacio intermedio a escala dominante (ocupando el 55% al 65% del alto total del lienzo).
       4. **PROHIBIDO:** Dejar vacíos muertos superiores a `60px` al pie del canvas en formatos de Feed (4:5 y 1:1).
   * **PROHIBIDO:** Dejar distancias superiores a `48px` (en Stories 9:16) o `32px` (en Feed 4:5 y 1:1) entre el final del subtítulo y el borde superior del mockup o fotografía cuando están agrupados en un bloque unitario.

---

## 5. Honestidad y Veracidad en el Mensaje (CERO Promesas Engañosas)

* **PROHIBIDO** redactar afirmaciones que puedan confundir o engañar al usuario, como *"Sin suscripciones"*.
* Equarys cuenta con planes superiores; por lo tanto, el mensaje correcto y transparente es:
  * *"Plan inicial $0"*
  * *"Comenzá gratis sin costo de apertura"*
  * *"Publicá tu tienda sin costo inicial"*

---

## 6. Bucle Obligatorio de Verificación Visual

Todo proceso de creación de flyer debe seguir este ciclo:
1. **Redacción y Composición:** Estructurar titular, propuesta de valor, captura real y llamado a la acción.
2. **Maquetación:** Renderizar en canvas 1080x1350 px en Open Design / HTML.
3. **Captura Visual (Screenshot Playwright):** Tomar screenshot del resultado renderizado (`page.screenshot`).
4. **Auditoría de Slop:** Inspeccionar la captura con visión crítica:
   - ¿Hay herramientas o toolbars de desarrollo en la captura del producto?
   - ¿El bottom navbar de la tienda se ve completo?
   - ¿Hay tarjetas innecesarias o badges flotantes?
   - ¿Hay etiquetas en mayúsculas sostenidas con tracking amplio (eyebrows)?
   - ¿El logo es el compuesto oficial (Equarys Shop)?
   - ¿El llamado a la acción es editorial y apunta al dominio canónico `equarys.com`?
   - ¿El copy es 100% veraz?
   - ¿El bloque de texto y el mockup están acoplados de forma íntima (gap $\le 48\text{px}$) o hay un desierto muerto desproporcionado que disocie el texto de la imagen (Regla 29)?
5. **Corrección e iteración:** Pulir los defectos antes de entregar la pieza.

---

## 7. Carruseles Deslizables Paso a Paso (Narrativa Educativa en 5 Diapositivas)

Cuando el objetivo sea educar al comerciante sobre cómo funciona la herramienta o derribar objeciones (ej: *"¿cómo recibo pedidos sin volverme loco?"*), se utiliza una estructura de **carrusel en 5 diapositivas**:

1. **Slide 1 — Portada / Gancho (The Hook):**
   * Disparador empático sobre el dolor diario (*"¿Cómo recibir pedidos por WhatsApp sin volverte loco?"*).
   * Mockup del smartphone con la tienda real + notificación sutil de pedido entrante.
   * Prompt de deslizamiento accesible y en Sentence case (*"Deslizá para ver el siguiente paso →"* en `text-zinc-800`). CERO badges tipo `1/5`.
2. **Slide 2 — Paso 1: Catálogo y Vidriera 24/7:**
   * Comparativa dual en smartphones reales: panel móvil de productos (`mobile-dash-productos.png`) vs tienda pública (`rotiseria-store.png`).
   * Valor: la tienda está abierta todo el tiempo sin mandar fotos sueltas por chat.
3. **Slide 3 — Paso 2: El Cliente Elige y Personaliza:**
   * Captura del modal de personalización del plato (ej: empanadas con salsas, variantes, notas) y botón visible `Agregar al pedido`.
   * Valor: cero esperas para el cliente y pedidos autogestionados.
4. **Slide 4 — Paso 3: Comanda Estructurada en WhatsApp:**
   * Mockup de smartphone con chat de WhatsApp mostrando el pedido entrante en formato oficial Equarys Shop (`mobile-whatsapp-order.png`).
   * Valor: sin audios confusos de 3 minutos ni órdenes en servilletas.
5. **Slide 5 — Paso 4: Vos Confirmás y Despachás + CTA Canónico:**
   * Pantalla móvil real de bandeja de pedidos recibidos (`mobile-dash-pedidos.png`) + 3 beneficios integrados tipográficamente (sin cajas ni tarjetitis).
   * Botón sólido en British Racing Green (`#005530`) con `shop.equarys.com` y recordatorio de guardado (*"Guardá este post 🔖"*).
