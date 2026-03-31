# Dink Authority Magazine — Manual Operativo del CMS

**Para:** Equipo editorial y administrativo  
**Fecha:** 31 de marzo de 2026  
**Nivel requerido:** No se necesita conocimiento técnico  

---

## TABLA DE CONTENIDO

1. [Acceso al Panel de Administración](#1-acceso-al-panel-de-administración)
2. [Vista General del Panel](#2-vista-general-del-panel)
3. [Crear y Editar Artículos](#3-crear-y-editar-artículos)
4. [Editar el Hero Principal (Historia Destacada)](#4-editar-el-hero-principal)
5. [Configurar el Banner del Homepage](#5-configurar-el-banner-del-homepage)
6. [Gestionar Sponsors (Banners Publicitarios)](#6-gestionar-sponsors)
7. [Subir Ediciones del Magazine](#7-subir-ediciones-del-magazine)
8. [Gestionar Productos del Shop](#8-gestionar-productos-del-shop)
9. [Segmentación por País](#9-segmentación-por-país)
10. [Manejo de Idiomas](#10-manejo-de-idiomas)
11. [Otras Secciones del Panel](#11-otras-secciones-del-panel)
12. [Preguntas Frecuentes](#12-preguntas-frecuentes)

---

## 1. ACCESO AL PANEL DE ADMINISTRACIÓN

### Cómo ingresar

1. Abrir el navegador y visitar:  
   **https://dink-authority-magaz-nlc0mg.abacusai.app/login**

2. Ingresar las credenciales:
   - **Email:** `admin@dinkauthority.com`
   - **Contraseña:** `DinkAuth2024!`

3. Hacer click en **"Sign In"**

4. Serás redirigido al **Dashboard** del panel de administración

### Notas importantes
- La sesión expira automáticamente después de un período de inactividad
- Si ves una pantalla de login inesperada, simplemente vuelve a ingresar tus credenciales
- Todos los cambios de contenido se reflejan **inmediatamente** en el sitio público (no hace falta "publicar" ni esperar)

---

## 2. VISTA GENERAL DEL PANEL

Al ingresar, verás el **Dashboard** con:

- **Estadísticas rápidas:** Total de artículos, publicados, borradores, suscriptores, eventos activos, mensajes de contacto
- **Artículos recientes:** Los últimos artículos creados o editados
- **Acciones rápidas:** Botones para las tareas más comunes

### Menú lateral (sidebar)

El menú de la izquierda contiene todas las secciones del panel:

| Icono | Sección | Qué gestiona |
|-------|---------|---------------|
| 📊 | Dashboard | Estadísticas generales |
| 📰 | Articles | Artículos de todas las categorías |
| 💡 | Tips | Tips de pickleball |
| ✍️ | Tip Authors | Autores de los tips |
| 👦 | Juniors | Perfiles de jugadores junior |
| 📅 | Events | Eventos de pickleball |
| 🏆 | Results | Resultados de torneos |
| 🏠 | Homepage | Configuración de la página principal |
| 📖 | Magazine | Ediciones de la revista digital |
| 🛍️ | Products | Productos de la tienda |
| 📢 | Sponsors | Banners publicitarios |
| 🌍 | Countries | Ediciones por país |
| 🤝 | Community | Corresponsales comunitarios |
| 📧 | Newsletter | Suscriptores del newsletter |
| 👥 | Subscribers | Suscriptores inline (con exportación) |
| 🖼️ | Media | Librería de imágenes y archivos |
| ⚙️ | Settings | Configuraciones generales del sitio |

---

## 3. CREAR Y EDITAR ARTÍCULOS

### Crear un artículo nuevo

1. En el menú lateral, click en **"Articles"**
2. Click en el botón **"New Article"** (esquina superior)
3. Completar el formulario:

| Campo | Qué escribir | Obligatorio |
|-------|-------------|-------------|
| **Title** | Título del artículo | ✅ Sí |
| **Slug** | URL amigable (se genera solo al escribir el título, pero puedes editarlo) | ✅ Sí |
| **Category** | Seleccionar una categoría (ver tabla abajo) | ✅ Sí |
| **Content** | Contenido completo del artículo (acepta HTML) | ✅ Sí |
| **Excerpt** | Resumen corto (1-2 oraciones) que aparece en las tarjetas | Recomendado |
| **Image URL** | URL de la imagen principal (copiar de Media Library) | Recomendado |
| **Focal Point X / Y** | Punto focal de la imagen (0-100). Por defecto 50/50 = centro | Opcional |
| **Video URL** | Link de YouTube, Instagram, TikTok o Facebook | Opcional |
| **Video Poster Image** | Imagen personalizada para el video | Opcional |
| **Author Name** | Nombre del autor del artículo | Recomendado |
| **Status** | `draft` (borrador) o `published` (publicado) | ✅ Sí |
| **Is Featured** | ¿Mostrar en la sección de destacados del homepage? | Opcional |
| **Is Hero Story** | ¿Es la historia principal del hero? (solo una a la vez) | Opcional |

4. Click en **"Save"**

### Categorías disponibles

| Categoría | Dónde aparece en el sitio |
|-----------|---------------------------|
| `news` | Sección de Noticias (homepage + /articles) |
| `pro-players` | Sección Pro Players |
| `enthusiasts` | Sección Enthusiasts |
| `places` | Sección Places (canchas, clubes, resorts) |
| `results` | Sección Results |
| `events` | Sección Events |

### Editar un artículo existente

1. Ir a **Articles** en el menú lateral
2. Encontrar el artículo en la lista
3. Click en el **ícono de lápiz** (✏️) a la derecha del artículo
4. Modificar los campos necesarios
5. Click en **"Save"**

### Eliminar un artículo

1. En la lista de artículos, click en el **ícono de papelera** (🗑️)
2. Confirmar la eliminación

> ⚠️ **Precaución:** La eliminación es permanente. No se puede deshacer.

### Subir imágenes para artículos

1. Primero ir a **Media** en el menú lateral
2. Click en **"Upload"** y seleccionar la imagen
3. Esperar a que se suba (verás una barra de progreso)
4. Una vez subida, click en **"Copy URL"** junto a la imagen
5. Volver al formulario del artículo y pegar la URL en el campo **"Image URL"**

---

## 4. EDITAR EL HERO PRINCIPAL

El "Hero" es la historia grande que aparece al tope de la página principal con imagen de fondo completa.

### Cambiar la historia del Hero

1. Ir a **Homepage** en el menú lateral
2. En la sección **"Hero Story"**, verás una lista de artículos publicados
3. Click en **"Set as Hero"** junto al artículo que deseas destacar
4. El artículo seleccionado aparecerá inmediatamente como hero en el homepage

### Requisitos para un buen Hero

- El artículo debe tener **status: published**
- Debe tener una **imagen de alta calidad** (recomendado: 1200×630px mínimo)
- El **excerpt** aparece como subtítulo, así que debe ser conciso y atractivo
- Ajustar el **Focal Point** de la imagen si el sujeto principal no está centrado

### Método alternativo (desde el artículo)

1. Al crear/editar un artículo, activar el checkbox **"Is Hero Story"**
2. Esto automáticamente lo convierte en el hero del homepage

> 💡 **Tip:** Solo un artículo puede ser hero a la vez. Al marcar uno nuevo, el anterior deja de serlo.

---

## 5. CONFIGURAR EL BANNER DEL HOMEPAGE

El banner publicitario es la franja que aparece en la parte superior del homepage, debajo del menú.

### Cambiar el banner

1. Ir a **Homepage** en el menú lateral
2. En la sección **"Ad Banner"**:
   - **Banner Image URL:** Pegar la URL de la imagen del banner
   - **Banner Link URL:** Pegar la URL de destino (a dónde lleva al hacer click)
3. Click en **"Save Banner Settings"**

### Sticky Banner (banner flotante inferior)

El sticky banner es el que aparece fijo en la parte inferior de la pantalla:

1. Ir a **Settings** en el menú lateral
2. Buscar los campos:
   - **stickyBannerImage:** URL de la imagen (versión desktop)
   - **stickyBannerMobileImage:** URL de la imagen (versión móvil)
   - **stickyBannerLink:** URL de destino
3. Guardar cambios

### Banner de sponsors dinámico (carrusel)

Además del banner estático, el homepage tiene un **carrusel rotativo de sponsors**. Este se gestiona desde la sección de **Sponsors** (ver sección 6).

---

## 6. GESTIONAR SPONSORS

Los sponsors son banners publicitarios que aparecen en diferentes secciones del sitio como carruseles rotativos.

### Crear un nuevo sponsor

1. Ir a **Sponsors** en el menú lateral
2. Click en **"Add Sponsor"**
3. Completar el formulario:

| Campo | Qué escribir |
|-------|--------------|
| **Sponsor Name** | Nombre del patrocinador (ej: "Coca-Cola", "Joola") |
| **Image URL** | URL de la imagen del banner (subir primero a Media) |
| **Link** | URL de destino al hacer click |
| **Active** | Toggle ON/OFF para activar/desactivar |
| **Sort Order** | Número para ordenar (menor = aparece primero) |

4. Seleccionar **REGIONES** (dónde se muestra geográficamente):
   - ☐ Dink Central (homepage global / página principal)
   - ☐ Colombia
   - ☐ México
   - ☐ Canada

5. Seleccionar **SECCIONES** (en qué sección del sitio aparece):
   - ☐ Homepage, ☐ News, ☐ Pro Players, ☐ Enthusiasts
   - ☐ Juniors, ☐ Tips, ☐ Results, ☐ Events
   - ☐ Places, ☐ Magazine, ☐ Shop

6. Click en **"Save"**

### Cómo funciona la segmentación dual

Los banners se filtran por **región + sección** simultáneamente:

- Un banner marcado como **"Colombia"** + **"News"** solo aparecerá en la sección de noticias cuando el usuario está viendo la página de Colombia
- Un banner marcado como **"Dink Central"** + **"Homepage"** aparecerá en el carrusel del homepage global
- Puedes marcar **múltiples regiones y secciones** para que un mismo banner aparezca en varios lugares

### Ejemplo práctico

> Quiero que el banner de Joola aparezca en Tips de todos los países:
> - Regiones: ✅ Dink Central, ✅ Colombia, ✅ México, ✅ Canada
> - Secciones: ✅ Tips

> Quiero un banner de un patrocinador local solo para Colombia en News:
> - Regiones: ✅ Colombia
> - Secciones: ✅ News

### Editar o eliminar sponsors

- **Editar:** Click en el sponsor de la lista → modificar campos → Save
- **Desactivar temporalmente:** Toggle OFF el campo "Active" (no lo elimina, solo lo oculta)
- **Eliminar permanentemente:** Click en el ícono de papelera 🗑️

---

## 7. SUBIR EDICIONES DEL MAGAZINE

La sección Magazine permite gestionar las ediciones de la revista digital con visor de PDF integrado.

### Crear una nueva edición

1. Ir a **Magazine** en el menú lateral
2. Click en **"New Edition"**
3. Completar:

| Campo | Qué escribir |
|-------|--------------|
| **Title** | Título de la edición (ej: "Edición Marzo 2026") |
| **Issue Number** | Número de edición (ej: "Vol. 3 No. 12") |
| **Slug** | URL amigable (ej: "marzo-2026") |
| **Cover URL** | URL de la imagen de portada (subir a Media primero) |
| **Description** | Descripción breve de esta edición |
| **PDF URL** | URL del archivo PDF (subir a Media primero) |
| **External URL** | Link externo alternativo (si aplica) |
| **Publish Date** | Fecha de publicación |
| **Is Current** | ✅ Marcar si es la edición actual/más reciente |
| **Countries** | Seleccionar en qué países se muestra |

4. Click en **"Save"**

### Proceso para subir el PDF

1. Ir a **Media** → Click **"Upload"**
2. Seleccionar el archivo PDF de la revista
3. Esperar a que se suba completamente
4. Click en **"Copy URL"** junto al archivo subido
5. Volver al formulario de Magazine y pegar en **"PDF URL"**

### Proceso para la portada

1. Ir a **Media** → Click **"Upload"**
2. Seleccionar la imagen de portada (recomendado: 600×800px, formato vertical)
3. **"Copy URL"** → pegar en **"Cover URL"** del formulario de Magazine

### Marcar edición como actual

- Solo una edición debe tener **"Is Current"** activado a la vez
- La edición marcada como actual aparece destacada en el homepage y la página del magazine
- Al marcar una nueva como actual, desactivar manualmente la anterior

---

## 8. GESTIONAR PRODUCTOS DEL SHOP

La tienda usa **Stripe Payment Links** para los pagos. No hay carrito de compras — cada producto tiene su propio botón de compra que redirige a Stripe.

### Crear un producto nuevo

1. Ir a **Products** en el menú lateral
2. Click en **"New Product"**
3. Completar:

| Campo | Qué escribir |
|-------|--------------|
| **Name** | Nombre del producto (ej: "Dink Authority Hoodie") |
| **Slug** | URL amigable (se genera automáticamente) |
| **Category** | Categoría del producto (ej: "merchandise") |
| **Price** | Precio en USD (ej: 59.99) |
| **Short Description** | Descripción breve para la tarjeta |
| **Full Description** | Descripción completa para la página de detalle |
| **Images** | URLs de imágenes del producto (hasta 5). La primera es la principal |
| **Stripe Payment Link** | URL de pago de Stripe (ver abajo cómo obtenerla) |
| **Button Label** | Texto del botón de compra (por defecto: "Buy Now") |
| **Inventory Status** | `in_stock`, `out_of_stock`, o `coming_soon` |
| **Is Active** | Toggle para mostrar/ocultar en la tienda |
| **Is Featured** | Toggle para destacar |

4. Click en **"Save"**

### Cómo crear un Stripe Payment Link

1. Iniciar sesión en **https://dashboard.stripe.com**
2. Ir a **"Payment Links"** en el menú lateral
3. Click en **"+ New"**
4. Agregar el producto con su precio
5. Configurar opciones de pago
6. Copiar el link generado (ej: `https://buy.stripe.com/test_xxxxx`)
7. Pegar en el campo **"Stripe Payment Link"** del producto en el CMS

### Cambiar estado de inventario

- **`in_stock`**: Producto disponible, botón de compra activo
- **`out_of_stock`**: Producto agotado, botón deshabilitado
- **`coming_soon`**: Próximamente, se muestra etiqueta especial

---

## 9. SEGMENTACIÓN POR PAÍS

El sistema **"Dink Authority World"** permite crear ediciones localizadas del magazine para diferentes países. Actualmente hay 3 países configurados:

- 🇨🇴 **Colombia** → `/colombia`
- 🇨🇦 **Canada** → `/canada`
- 🇲🇽 **México** → `/mexico`

### Editar la página de un país

1. Ir a **Countries** en el menú lateral
2. Click en el país que deseas editar
3. El editor tiene **5 pestañas**:

#### Pestaña 1: Magazine
Configurar la revista local del país:
- **Magazine Cover:** URL de la imagen de portada
- **Magazine Title:** Título de la edición local
- **Magazine Link:** URL de la edición completa
- **Magazine PDF URL:** URL del PDF

#### Pestaña 2: Content Boxes
Aquí seleccionas qué contenido aparece en cada sección de la página del país:

- **News Box:** Artículos de noticias para este país
- **Pro Players Box:** Artículos de jugadores pro del país
- **Enthusiasts Box:** Artículos de entusiastas del país
- **Juniors Box:** Perfiles de juniors del país
- **Tips Box:** Tips relevantes para este país

**Cómo agregar contenido:**
- Escribir la ruta del artículo o tip: `/articles/slug-del-articulo` o `/tips/slug-del-tip`
- El sistema busca automáticamente el título, imagen y resumen
- Puedes agregar múltiples rutas por sección

#### Pestaña 3: Banners
Configurar banners específicos de la página del país:
- **Top Banner:** Banner superior (imagen + link)
- **Mid Banner:** Banner medio (imagen + link)
- **Bottom Banner:** Banner inferior (imagen + link)
- **Sticky Banner:** Banner flotante inferior (imagen desktop + mobile + link)

#### Pestaña 4: Social Media
URLs de redes sociales del país:
- Instagram, Facebook, TikTok, YouTube, Twitter/X

#### Pestaña 5: SEO
- **Meta Title:** Título para buscadores
- **Meta Description:** Descripción para buscadores
- **OG Image:** Imagen para compartir en redes sociales

### Cómo se ven las páginas de país

Cada página de país replica la estructura del homepage global pero con contenido local:
- Hero con la revista local
- Secciones de News, Pro Players, Enthusiasts, Juniors, Tips
- Banners de sponsors filtrados automáticamente por país
- Redes sociales del país
- CTA de corresponsales comunitarios

> 💡 **Tip:** Los banners de sponsors con la región del país activada aparecen automáticamente en la página del país, sin configuración adicional.

---

## 10. MANEJO DE IDIOMAS

El sitio soporta **3 idiomas**: Inglés (EN), Español (ES) y Portugués (PT).

### Cómo funciona

- El **usuario** cambia de idioma usando el **selector de globo** (🌐) en el header del sitio
- Los **elementos de interfaz** (menús, botones, etiquetas) se traducen automáticamente
- Los **artículos y contenido** se traducen automáticamente usando inteligencia artificial cuando el usuario cambia de idioma

### Qué se traduce automáticamente

| Elemento | ¿Se traduce? | Cómo |
|----------|-------------|------|
| Menú de navegación | ✅ Sí | Traducciones predefinidas |
| Botones y etiquetas | ✅ Sí | Traducciones predefinidas |
| Títulos de artículos | ✅ Sí | IA (bajo demanda) |
| Contenido de artículos | ✅ Sí | IA (bajo demanda) |
| Nombres de categorías | ✅ Sí | Traducciones predefinidas |
| Productos del shop | ❌ No | Se muestran tal como se ingresan |
| PDFs del magazine | ❌ No | Son archivos estáticos |

### Qué idioma usar al crear contenido

- **Siempre crear contenido en inglés** (es el idioma base)
- Las traducciones a español y portugués se generan automáticamente cuando un usuario las necesita
- Las traducciones se cachean para no regenerarlas cada vez

### Idiomas disponibles para el usuario

| Código | Idioma | Bandera |
|--------|--------|---------|
| `en` | English | 🇺🇸 |
| `es` | Español | 🇪🇸 |
| `pt` | Português | 🇧🇷 |

---

## 11. OTRAS SECCIONES DEL PANEL

### Tips de Pickleball

**Gestión de Tips:** Admin → Tips
- Similar a artículos pero con campos adicionales: autor, galería de imágenes, banners intercalados, video
- Cada tip necesita un **Tip Author** creado previamente

**Gestión de Autores:** Admin → Tip Authors
- Crear autores con nombre, foto, biografía
- Los autores se asignan a los tips

### Juniors

**Admin → Juniors**
- Perfiles de jugadores junior con nombre, país, edad, contenido, galería, video
- Similar en estructura a los tips

### Eventos

**Admin → Events**
- Crear eventos con nombre, descripción, ubicación, fechas, imagen, link externo
- Los eventos futuros aparecen en la sección "Upcoming Events" del homepage

### Resultados de Torneos

**Admin → Results**
- Registrar resultados: torneo, división, ganador, subcampeón, score, fecha
- Aparecen en la sección "Recent Results" del homepage

### Corresponsales Comunitarios

**Admin → Community**
- Ver registros de personas que se inscribieron como corresponsales
- Cambiar status: `new` → `reviewed` → `approved` / `rejected`
- Exportar lista a CSV

### Newsletter y Subscribers

- **Admin → Newsletter:** Lista de suscriptores del formulario de newsletter
- **Admin → Subscribers:** Lista de suscriptores del formulario inline (aparece dentro de artículos). Con exportación CSV

### Media Library

**Admin → Media**
- Subir imágenes y archivos al almacenamiento en la nube
- Copiar URL para usar en artículos, productos, etc.
- Eliminar archivos que ya no se necesiten

### Configuración General

**Admin → Settings**
- Configurar banners sticky (desktop y mobile)
- Configurar número de WhatsApp
- Otras configuraciones key-value del sitio

---

## 12. PREGUNTAS FRECUENTES

### ¿Cuánto tarda en verse un cambio en el sitio público?
**Inmediatamente.** Los cambios de contenido (artículos, sponsors, productos, etc.) se reflejan al instante porque el sitio usa renderizado dinámico.

### ¿Puedo deshacer un cambio?
No directamente desde el panel. Si eliminaste algo por error, contacta al equipo técnico. Los cambios en textos se pueden corregir editando el mismo registro.

### ¿Qué formato deben tener las imágenes?
- **Formato:** JPG o PNG (preferir JPG para fotos, PNG para gráficos con transparencia)
- **Tamaño recomendado:** Mínimo 1200×630px para artículos y hero
- **Peso:** Preferiblemente menos de 2MB por imagen
- **Portadas de magazine:** Formato vertical, aprox. 600×800px

### ¿Puedo usar imágenes de cualquier URL?
Sí, pero es recomendable subirlas a la **Media Library** del panel para garantizar que siempre estén disponibles. Las URLs externas podrían dejar de funcionar si el sitio origen las elimina.

### ¿Cómo agrego un nuevo país al sistema?
Esto requiere intervención técnica (no se puede hacer desde el panel). Contacta al equipo de desarrollo.

### ¿Se puede tener más de un usuario administrador?
Sí. Para crear un nuevo admin, el equipo técnico debe registrarlo vía la API de signup o el script de seed.

### ¿Qué es el "Slug" de un artículo?
Es la parte de la URL que identifica al artículo. Por ejemplo, si el slug es `nuevo-torneo-miami`, la URL será `tudominio.com/articles/nuevo-torneo-miami`. Se genera automáticamente del título pero puedes personalizarlo.

### ¿Cómo sé qué imagen usar para un sponsor?
Las dimensiones ideales para banners de sponsor son:
- **Desktop:** 1200×120px (horizontal, tipo banner)
- **Mobile:** Se redimensiona automáticamente
- Usar fondo transparente o blanco

### ¿Qué pasa si marco dos artículos como "Hero Story"?
Solo el más reciente se mostrará como hero. El sistema usa el último artículo marcado.

### ¿Puedo programar artículos para que se publiquen después?
No hay programación automática. Para "publicar después":
1. Crear el artículo con status **"draft"**
2. Cuando sea el momento, editarlo y cambiar a **"published"**

### ¿Cómo exporto la lista de suscriptores?
1. Ir a **Admin → Subscribers**
2. Click en el botón **"Export CSV"**
3. Se descargará un archivo .csv con todos los emails y teléfonos

---

*Manual generado el 31 de marzo de 2026 — Dink Authority Magazine*
