# Dink Authority Magazine — Documentación Técnica del Sistema

**Fecha de generación:** 31 de marzo de 2026  
**Versión:** 1.0  
**Proyecto:** Dink Authority Magazine  
**URL de producción:** https://dink-authority-magaz-nlc0mg.abacusai.app  

---

## TABLA DE CONTENIDO

1. [Arquitectura del Proyecto](#1-arquitectura-del-proyecto)
2. [Manual del Panel de Administración](#2-manual-del-panel-de-administración)
3. [Guía de Deployment](#3-guía-de-deployment)
4. [Variables de Entorno (.env)](#4-variables-de-entorno-env)
5. [Procedimiento de Backup y Restauración](#5-procedimiento-de-backup-y-restauración)
6. [Confirmación de Portabilidad](#6-confirmación-de-portabilidad)

---

## 1. ARQUITECTURA DEL PROYECTO

### 1.1 Stack Tecnológico Completo

| Capa | Tecnología | Versión/Detalle |
|------|-----------|----------------|
| **Framework** | Next.js (App Router) | 14.2.28 |
| **Lenguaje** | TypeScript | 5.x |
| **Runtime** | Node.js | 18+ |
| **Base de datos** | PostgreSQL | Hospedada por Abacus.AI |
| **ORM** | Prisma Client | Última estable |
| **Autenticación** | NextAuth.js | v4 (Credentials provider) |
| **Almacenamiento** | AWS S3 | Via Abacus.AI Cloud Storage |
| **Hosting** | Abacus.AI App Platform | Standalone output mode |
| **Estilos** | Tailwind CSS + tailwindcss-animate | JIT |
| **UI Components** | Radix UI Primitives + shadcn/ui | Múltiples componentes |
| **Animaciones** | Framer Motion | |
| **Carruseles** | Embla Carousel | + autoplay plugin |
| **Iconos** | Lucide React | |
| **Internacionalización** | Sistema i18n propio | EN, ES, PT |
| **Traducción automática** | Abacus.AI LLM API | Vía OpenAI-compatible client |
| **Email** | Abacus.AI Notification API | Para notificaciones admin |
| **PDF Viewer** | react-pdf + react-pageflip | Lector de revista |
| **Gráficas** | Chart.js + Recharts | Admin dashboard |
| **Estado** | React hooks + SWR + Zustand + Jotai | |
| **Formularios** | React Hook Form + Zod + Yup + Formik | |
| **Package Manager** | Yarn | |

### 1.2 Estructura del Sistema

```
dink_authority_magazine/
└── nextjs_space/
    ├── app/
    │   ├── _components/          # Componentes globales (header, footer, hero, etc.)
    │   ├── api/                   # API Routes (REST endpoints)
    │   │   ├── articles/          # CRUD artículos
    │   │   ├── auth/              # NextAuth + login
    │   │   ├── community/         # Corresponsales comunitarios
    │   │   ├── contact/           # Formulario de contacto
    │   │   ├── countries/         # Ediciones por país
    │   │   ├── events/            # Eventos
    │   │   ├── juniors/           # Sección juniors
    │   │   ├── magazine/          # Ediciones de revista
    │   │   ├── media/             # Librería de medios
    │   │   ├── newsletter/        # Suscriptores newsletter
    │   │   ├── products/          # Tienda/productos
    │   │   ├── results/           # Resultados de torneos
    │   │   ├── settings/          # Configuraciones del sitio
    │   │   ├── signup/            # Registro de usuarios
    │   │   ├── sponsors/          # Banners patrocinadores
    │   │   ├── subscribers/       # Suscriptores inline
    │   │   ├── tip-authors/       # Autores de tips
    │   │   ├── tips/              # Tips de pickleball
    │   │   ├── translate/         # Traducción automática LLM
    │   │   └── upload/            # Presigned URLs para S3
    │   ├── admin/                 # Panel de administración
    │   │   ├── articles/          # Gestión de artículos
    │   │   ├── community/         # Corresponsales
    │   │   ├── countries/         # Ediciones por país
    │   │   ├── events/            # Eventos
    │   │   ├── homepage/          # Configuración homepage
    │   │   ├── juniors/           # Gestión juniors
    │   │   ├── magazine/          # Ediciones revista
    │   │   ├── media/             # Librería de medios
    │   │   ├── newsletter/        # Suscriptores
    │   │   ├── products/          # Productos tienda
    │   │   ├── results/           # Resultados torneos
    │   │   ├── settings/          # Configuración general
    │   │   ├── sponsors/          # Banners sponsors
    │   │   ├── subscribers/       # Suscriptores inline
    │   │   └── tips/              # Tips + autores
    │   ├── [countrySlug]/         # Páginas dinámicas por país
    │   ├── articles/              # Listado y detalle de artículos
    │   ├── community/             # Página de corresponsales
    │   ├── contact/               # Contacto
    │   ├── juniors/               # Sección juniors
    │   ├── magazine/              # Revista digital
    │   ├── places/                # Redirect → /articles?category=places
    │   ├── shop/                  # Tienda
    │   ├── tips/                  # Tips de pickleball
    │   ├── about/                 # Acerca de
    │   ├── login/                 # Login admin
    │   ├── layout.tsx             # Layout raíz (SEO, providers, JSON-LD)
    │   ├── page.tsx               # Homepage
    │   ├── globals.css            # Estilos globales
    │   ├── robots.ts              # robots.txt dinámico
    │   ├── sitemap.ts             # sitemap.xml dinámico
    │   └── news-sitemap.xml/      # Google News sitemap
    ├── components/
    │   ├── ui/                    # Componentes shadcn/ui
    │   ├── universal-video-module.tsx  # Video universal (YT, IG, TT, FB)
    │   └── theme-provider.tsx
    ├── hooks/                     # Custom hooks
    ├── lib/
    │   ├── db.ts                  # Instancia Prisma
    │   ├── s3.ts                  # Helpers AWS S3
    │   ├── auth.ts                # Configuración NextAuth
    │   ├── i18n/                  # Sistema de internacionalización
    │   │   ├── translations.ts    # Diccionario EN/ES/PT
    │   │   └── language-context.tsx # Provider de idioma
    │   └── utils.ts               # Utilidades generales
    ├── prisma/
    │   └── schema.prisma          # Esquema de base de datos
    ├── scripts/
    │   └── seed.ts                # Script de datos iniciales
    ├── public/
    │   ├── images/                # Imágenes estáticas
    │   ├── icons/                 # Iconos PWA
    │   ├── manifest.json          # PWA manifest
    │   ├── sw.js                  # Service Worker
    │   └── offline.html           # Página offline PWA
    ├── .env                       # Variables de entorno
    ├── next.config.js             # Configuración Next.js
    ├── tailwind.config.ts         # Configuración Tailwind
    ├── tsconfig.json              # Configuración TypeScript
    └── postcss.config.js          # PostCSS
```

### 1.3 Flujo Frontend → Backend → Base de Datos → Storage

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────┐     ┌─────────┐
│   BROWSER   │────→│  Next.js Server  │────→│  PostgreSQL  │     │  AWS S3  │
│  (React +   │←────│  (App Router +   │←────│  (Prisma)    │     │ (Cloud)  │
│  Tailwind)  │     │   API Routes)    │     └──────────────┘     └─────────┘
└─────────────┘     └──────────────────┘            │                   ↑
       │                     │                      │                   │
       │                     ├── NextAuth ──────────┘                   │
       │                     ├── Presigned URL ─────────────────────────┘
       │                     ├── LLM API (Abacus) ──→ Traducciones
       │                     └── Notification API ──→ Emails admin
       │
       └── Direct S3 Upload (via presigned URL)
```

**Flujo de datos típico:**

1. **Lectura**: Browser solicita página → Next.js Server Component consulta Prisma → PostgreSQL → renderiza HTML → envía al browser
2. **Escritura (admin)**: Formulario admin → fetch POST/PUT a API Route → validación → Prisma → PostgreSQL
3. **Upload de archivos**: Admin solicita presigned URL → API genera URL temporal → Browser sube directamente a S3 → Guarda referencia en DB
4. **Traducciones**: Browser detecta idioma → solicita traducción a `/api/translate` → LLM API genera traducción → cacheo en `ArticleTranslation`
5. **Autenticación**: Login form → NextAuth Credentials → bcrypt verify → JWT session → cookies httpOnly

### 1.4 Modelos de Base de Datos

| Modelo | Propósito |
|--------|----------|
| `User` | Usuarios admin del CMS |
| `Account` / `Session` / `VerificationToken` | NextAuth (autenticación) |
| `Article` | Artículos (news, pro-players, enthusiasts, places, etc.) |
| `ArticleTranslation` | Traducciones cacheadas de artículos |
| `Event` | Eventos de pickleball |
| `NewsletterSubscriber` | Suscriptores del newsletter |
| `Subscriber` | Suscriptores inline (email + teléfono) |
| `Media` | Librería de medios (archivos subidos a S3) |
| `SiteSetting` | Configuraciones del sitio (key-value) |
| `ContactSubmission` | Mensajes del formulario de contacto |
| `TournamentResult` | Resultados de torneos |
| `Product` | Productos de la tienda |
| `TipAuthor` | Autores de tips |
| `Tip` | Tips de pickleball |
| `Junior` | Perfiles de jugadores junior |
| `CommunityCorrespondent` | Registros de corresponsales comunitarios |
| `MagazineEdition` | Ediciones de la revista digital |
| `Country` | Configuración de ediciones por país |
| `SponsorBanner` | Banners publicitarios de patrocinadores |

---

## 2. MANUAL DEL PANEL DE ADMINISTRACIÓN

### 2.1 Acceso al Panel

- **URL**: `https://dink-authority-magaz-nlc0mg.abacusai.app/login`
- **Credenciales**: `admin@dinkauthority.com` / `DinkAuth2024!`
- **Protección**: Todas las rutas `/admin/*` requieren sesión activa. Si la sesión expira, redirige automáticamente a `/login`.

### 2.2 Crear Artículos

1. Ir a **Admin → Articles** (sidebar izquierdo)
2. Click en **"New Article"** (botón superior)
3. Completar el formulario:
   - **Title**: Título del artículo
   - **Slug**: URL amigable (se genera automáticamente, editable)
   - **Category**: Seleccionar categoría:
     - `news` — Noticias
     - `pro-players` — Jugadores profesionales
     - `enthusiasts` — Entusiastas
     - `places` — Lugares (canchas, clubes, resorts)
     - `results` — Resultados
     - `events` — Eventos
     - `gear` — (legacy, para artículos antiguos)
   - **Content**: Contenido completo del artículo (HTML)
   - **Excerpt**: Resumen corto
   - **Image URL**: Imagen principal (usar URL de Media Library)
   - **Focal Point X/Y**: Punto focal para recorte de imagen (0-100)
   - **Video URL**: (Opcional) URL de YouTube, Instagram, TikTok o Facebook
   - **Video Poster Image**: (Opcional) Imagen personalizada del video
   - **Author Name**: Nombre del autor
   - **Status**: `draft` o `published`
   - **Is Featured**: Destacar en homepage
   - **Is Hero Story**: Marcar como historia principal del hero
4. Click **"Save"**

**Para editar**: Click en el ícono de edición (lápiz) en la lista de artículos.
**Para eliminar**: Click en el ícono de papelera y confirmar.

### 2.3 Gestionar Sponsors (Banners Publicitarios)

1. Ir a **Admin → Sponsors**
2. Click **"Add Sponsor"**
3. Completar:
   - **Sponsor Name**: Nombre del patrocinador
   - **Image URL**: URL de la imagen del banner
   - **Link**: URL de destino al hacer click
   - **Región** (checkboxes): Seleccionar dónde mostrar:
     - Dink Central (homepage global)
     - Colombia / México / Canada (páginas por país)
   - **Sección** (checkboxes): En qué sección aparece:
     - News, Pro Players, Enthusiasts, Juniors, Tips, Results, Events, Places, Magazine, Shop
   - **Active**: Toggle para activar/desactivar
   - **Sort Order**: Orden de aparición en el carrusel
4. Click **"Save"**

**Segmentación dual**: Los banners se filtran por región Y sección simultáneamente. Un banner marcado como "Colombia" + "News" solo aparece en la sección de noticias de la página de Colombia.

### 2.4 Editar Banners/Contenido del Homepage

1. Ir a **Admin → Homepage**
2. **Ad Banner**: Configurar imagen y link del banner superior
3. **Hero Story**: Seleccionar de la lista de artículos publicados cuál será la historia principal
4. Click **"Save"**

**Configuraciones adicionales** en **Admin → Settings**:
- Sticky banner (imagen desktop, mobile, link)
- WhatsApp button (número de teléfono)
- Otras configuraciones key-value del sitio

### 2.5 Segmentación por País (Dink Authority World)

1. Ir a **Admin → Countries**
2. Seleccionar un país (Colombia, Canada, Mexico)
3. El editor tiene **5 pestañas**:

   **a) Magazine**: Configurar portada, título, link y PDF de la edición local de la revista
   
   **b) Content Boxes**: Agregar rutas de contenido a cada sección:
   - News Box, Pro Players Box, Enthusiasts Box, Juniors Box, Tips Box
   - Formato: Rutas como `/articles/slug-del-articulo` o `/tips/slug-del-tip`
   - El sistema resuelve automáticamente título, imagen y excerpt del contenido
   
   **c) Banners**: Configurar banners de la página del país:
   - Top Banner, Mid Banner, Bottom Banner, Sticky Banner
   - Cada uno con imagen y link
   
   **d) Social Media**: URLs de redes sociales del país:
   - Instagram, Facebook, TikTok, YouTube, Twitter/X
   
   **e) SEO**: Título, descripción y imagen OG para la página del país

4. Click **"Save"**

**Para agregar un nuevo país**: Requiere intervención técnica (crear registro en DB + actualizar `VALID_SLUGS` en `app/[countrySlug]/page.tsx`).

### 2.6 Subir Contenido del Magazine (Revista Digital)

1. Ir a **Admin → Magazine**
2. Click **"New Edition"**
3. Completar:
   - **Title**: Título de la edición
   - **Issue Number**: Número de edición
   - **Slug**: URL amigable
   - **Cover URL**: Imagen de portada (subir primero a Media Library)
   - **Description**: Descripción de la edición
   - **PDF URL**: URL del PDF (subir a Media Library o usar link externo)
   - **External URL**: Link externo alternativo
   - **Publish Date**: Fecha de publicación
   - **Is Current**: Marcar como edición actual
   - **Countries**: Seleccionar países donde se muestra (Central, Colombia, etc.)
4. Click **"Save"**

**Subir archivos PDF/imágenes**:
1. Ir a **Admin → Media**
2. Click **"Upload"** y seleccionar archivo
3. El archivo se sube directamente a S3
4. Copiar la URL generada para usarla en otros formularios

### 2.7 Otras Secciones del Admin

| Sección | Ruta | Descripción |
|---------|------|------------|
| Dashboard | `/admin` | Estadísticas generales |
| Tips | `/admin/tips` | Tips de pickleball |
| Tip Authors | `/admin/tips/authors` | Autores de tips |
| Juniors | `/admin/juniors` | Perfiles de jugadores junior |
| Events | `/admin/events` | Eventos de pickleball |
| Results | `/admin/results` | Resultados de torneos |
| Products | `/admin/products` | Productos de la tienda |
| Community | `/admin/community` | Corresponsales comunitarios |
| Newsletter | `/admin/newsletter` | Suscriptores del newsletter |
| Subscribers | `/admin/subscribers` | Suscriptores inline (con exportación CSV) |
| Media | `/admin/media` | Librería de medios (S3) |
| Settings | `/admin/settings` | Configuraciones generales |

---

## 3. GUÍA DE DEPLOYMENT

### 3.1 Dónde Está Hosteado

| Componente | Proveedor | Detalle |
|------------|-----------|--------|
| **Aplicación** | Abacus.AI App Platform | Standalone Next.js build |
| **Base de datos** | Abacus.AI (PostgreSQL) | Instancia compartida dev/prod |
| **Almacenamiento** | AWS S3 (via Abacus.AI) | Bucket con presigned URLs |
| **CDN/DNS** | Abacus.AI | Subdominio `.abacusai.app` |
| **Dominio actual** | `dink-authority-magaz-nlc0mg.abacusai.app` | Configurable a dominio custom |

### 3.2 Cómo Se Despliega

El deployment se realiza desde la plataforma **DeepAgent de Abacus.AI**:

1. **Proceso automático**: Al ejecutar un deploy, el sistema:
   - Compila TypeScript y genera el build de producción
   - Crea un paquete standalone con todas las dependencias
   - Lo empaqueta en un `.tgz`
   - Lo despliega en el servidor de producción
   - La app está live en ~5 minutos

2. **Comando de build** (referencia interna):
   ```bash
   NODE_OPTIONS="--max-old-space-size=6144" \
   NEXT_DIST_DIR=.build \
   NEXT_OUTPUT_MODE=standalone \
   yarn run build
   ```

3. **Variables de entorno**: Se cargan automáticamente desde `.env` durante el build y deployment.

### 3.3 Cómo Actualizar el Sitio

**Opción 1 — Via DeepAgent (recomendado):**
1. Abrir una conversación en [Abacus.AI App Management Console](https://apps.abacus.ai/chatllm/?appId=appllm_engineer)
2. Describir los cambios deseados
3. DeepAgent edita el código, hace pruebas y despliega

**Opción 2 — Desde el panel de administración (contenido):**
- Los cambios de contenido (artículos, eventos, sponsors, etc.) se hacen directamente desde `/admin` sin necesidad de redeploy
- Los cambios se reflejan inmediatamente ya que la app usa renderizado dinámico

**Opción 3 — Redeploy manual:**
1. Ir al [App Management Console](https://apps.abacus.ai/chatllm/?appId=appllm_engineer)
2. Seleccionar la conversación del proyecto
3. Usar el botón de "Deploy" en la interfaz

### 3.4 Cómo Reiniciar Servicios

- **La aplicación no requiere reinicio manual**. El servidor de producción de Abacus.AI gestiona automáticamente la disponibilidad.
- Si se detecta un problema, **redesplegar** el último checkpoint funciona como reinicio efectivo.
- Para reiniciar en desarrollo, basta con iniciar una nueva sesión en DeepAgent.

### 3.5 Dominio Personalizado

- El sitio actualmente usa `dink-authority-magaz-nlc0mg.abacusai.app`
- Se puede configurar un dominio personalizado desde **Settings → Domain** en la plataforma Abacus.AI
- Requiere configurar registros DNS (CNAME) apuntando al dominio de Abacus.AI

---

## 4. VARIABLES DE ENTORNO (.env)

| Variable | Propósito | Ejemplo |
|----------|-----------|--------|
| `DATABASE_URL` | Conexión a PostgreSQL | `postgresql://user:pass@host:5432/dbname` |
| `NEXTAUTH_SECRET` | Secret para firmar JWT sessions de NextAuth | String aleatorio de 32+ caracteres |
| `AWS_PROFILE` | Perfil AWS para S3 | Configurado por Abacus.AI |
| `AWS_REGION` | Región del bucket S3 | `us-east-1` |
| `AWS_BUCKET_NAME` | Nombre del bucket S3 | Configurado por Abacus.AI |
| `AWS_FOLDER_PREFIX` | Prefijo de carpeta dentro del bucket | Configurado por Abacus.AI |
| `ABACUSAI_API_KEY` | API Key para LLM (traducciones) | Configurado por Abacus.AI |
| `WEB_APP_ID` | ID de la app en Abacus.AI | Configurado por Abacus.AI |
| `NOTIF_ID_COMMUNITY_CORRESPONDENT_REGISTRATION` | ID de notificación para registro de corresponsales | Configurado por Abacus.AI |

**Variables automáticas (no en .env):**
- `NEXTAUTH_URL` — Configurada automáticamente por Abacus.AI según el entorno (preview vs producción)

**IMPORTANTE**: Nunca exponer estas variables en código del lado del cliente. Todas son server-side.

---

## 5. PROCEDIMIENTO DE BACKUP Y RESTAURACIÓN

### 5.1 Base de Datos

**Backup automático:**
- Abacus.AI realiza snapshots automáticos de la base de datos
- Accesible desde: **Settings → Database** en el panel derecho de la conversación de DeepAgent
- Cada checkpoint del proyecto incluye un snapshot de la DB

**Restauración:**
1. En la conversación de DeepAgent, ir a **Settings → Database**
2. Click en el ícono de snapshots (reloj con flecha)
3. Seleccionar el snapshot deseado
4. Previsualizar los cambios
5. Confirmar la restauración

**Restauración completa (código + DB):**
1. En la interfaz de DeepAgent, acceder a los checkpoints del proyecto
2. Cada checkpoint incluye código + snapshot de DB
3. Click en "Restore" para volver a un estado anterior
4. **ADVERTENCIA**: La restauración es irreversible y afecta tanto código como datos

### 5.2 Código Fuente

**Sistema de checkpoints:**
- Cada cambio significativo genera un checkpoint automático
- Los checkpoints se pueden previsualizar y restaurar desde la UI de DeepAgent
- El último checkpoint se puede desplegar directamente

**Backup manual:**
- El archivo ZIP entregado contiene el código fuente completo
- Para regenerar: solicitar un nuevo ZIP en cualquier conversación de DeepAgent

### 5.3 Archivos Multimedia (S3)

- Los archivos subidos a S3 persisten independientemente de los deployments
- No se incluyen en los checkpoints de código
- Para backup de S3, se requiere acceso directo al bucket (contactar soporte Abacus.AI si es necesario)

---

## 6. CONFIRMACIÓN DE PORTABILIDAD

### 6.1 Código Fuente — ✅ COMPLETO

El archivo ZIP entregado (`dink_authority_magazine_latest.zip`) contiene:

- ✅ Todo el código fuente de la aplicación Next.js
- ✅ Esquema de base de datos (`prisma/schema.prisma`)
- ✅ Script de seed con datos iniciales (`scripts/seed.ts`)
- ✅ Configuraciones (Tailwind, TypeScript, PostCSS, Next.js)
- ✅ Componentes UI, hooks, utilidades, sistema i18n
- ✅ Imágenes y assets estáticos (`public/`)
- ✅ Configuración PWA (manifest, service worker, offline page)

**NO incluidos (se regeneran automáticamente):**
- `node_modules/` — Ejecutar `yarn install`
- `.next/` / `.build/` — Ejecutar `yarn build`
- `yarn.lock` — Se genera con `yarn install`

### 6.2 Base de Datos — ✅ PORTABLE

La base de datos es **100% portable**:

- El esquema está definido en `prisma/schema.prisma` (Prisma ORM)
- Compatible con cualquier instancia PostgreSQL
- **Para migrar a otro servidor:**
  1. Crear una nueva instancia PostgreSQL
  2. Actualizar `DATABASE_URL` en `.env` con la nueva conexión
  3. Ejecutar `yarn prisma db push` para crear las tablas
  4. Ejecutar `yarn tsx scripts/seed.ts` para datos iniciales (opcional)
  5. O usar `pg_dump` / `pg_restore` para migrar datos existentes

### 6.3 Storage de Imágenes — ✅ TRANSFERIBLE

Los archivos multimedia están almacenados en AWS S3 (via Abacus.AI Cloud Storage):

- **Para migrar el storage:**
  1. Descargar todos los archivos del bucket S3 actual
  2. Subir a un nuevo bucket S3 o servicio compatible (MinIO, DigitalOcean Spaces, etc.)
  3. Actualizar las variables `AWS_*` en `.env`
  4. Actualizar las URLs almacenadas en la base de datos (tabla `Media` y campos de imagen en otras tablas)
  5. Actualizar `lib/s3.ts` si se cambia a un proveedor no compatible con AWS SDK

- **Imágenes estáticas** (`public/images/`): Ya incluidas en el ZIP, se sirven directamente desde el servidor

### 6.4 Dependencias Externas

| Servicio | Portable | Nota |
|----------|----------|------|
| PostgreSQL | ✅ | Cualquier instancia PostgreSQL 14+ |
| S3 Storage | ✅ | Cualquier storage compatible S3 API |
| NextAuth | ✅ | Solo requiere `NEXTAUTH_SECRET` |
| LLM API (traducciones) | ⚠️ | Actualmente usa Abacus.AI. Se puede reemplazar con OpenAI u otro proveedor compatible cambiando el endpoint en el código |
| Email Notifications | ⚠️ | Actualmente usa Abacus.AI Notification API. Se puede reemplazar con SendGrid, Resend, etc. |
| Hosting | ✅ | Compatible con Vercel, Railway, Docker, o cualquier host Node.js |

### 6.5 Pasos para Migración Completa

1. **Clonar código** del ZIP
2. **Instalar dependencias**: `cd nextjs_space && yarn install`
3. **Configurar .env** con las nuevas variables de conexión
4. **Crear tablas**: `yarn prisma db push`
5. **Migrar datos**: `pg_dump` del DB actual → `pg_restore` en nuevo DB
6. **Migrar archivos S3**: Copiar bucket → actualizar URLs en DB
7. **Build**: `yarn build`
8. **Deploy**: Según la plataforma elegida (Vercel, Docker, etc.)

---

## APÉNDICE A — Endpoints API

| Ruta | Métodos | Auth | Propósito |
|------|---------|------|----------|
| `/api/articles` | GET, POST | POST: sí | Artículos |
| `/api/articles/[id]` | GET, PUT, DELETE | PUT/DEL: sí | Artículo individual |
| `/api/auth/[...nextauth]` | GET, POST | — | NextAuth |
| `/api/community` | GET, POST | GET: sí | Corresponsales |
| `/api/community/[id]` | PUT, DELETE | Sí | Corresponsal individual |
| `/api/contact` | GET, POST | — | Contacto |
| `/api/countries` | GET, POST | POST: sí | Países |
| `/api/countries/[slug]` | GET, PUT | PUT: sí | País individual |
| `/api/events` | GET, POST | POST: sí | Eventos |
| `/api/events/[id]` | PUT, DELETE | Sí | Evento individual |
| `/api/juniors` | GET, POST | POST: sí | Juniors |
| `/api/juniors/[id]` | GET, PUT, DELETE | PUT/DEL: sí | Junior individual |
| `/api/magazine` | GET, POST | POST: sí | Ediciones revista |
| `/api/magazine/[id]` | GET, PUT, DELETE | PUT/DEL: sí | Edición individual |
| `/api/magazine/pdf-proxy` | GET | — | Proxy PDF |
| `/api/magazine/pdf-url` | GET | — | URL firmada PDF |
| `/api/media` | GET, POST, DELETE | Sí | Librería de medios |
| `/api/newsletter` | GET, POST | — | Newsletter |
| `/api/products` | GET, POST | POST: sí | Productos |
| `/api/products/[id]` | GET, PUT, DELETE | PUT/DEL: sí | Producto individual |
| `/api/results` | GET, POST | POST: sí | Resultados |
| `/api/results/[id]` | GET, PUT, DELETE | PUT/DEL: sí | Resultado individual |
| `/api/settings` | GET, PUT | PUT: sí | Configuraciones |
| `/api/signup` | POST | — | Registro |
| `/api/sponsors` | GET, POST | POST: sí | Sponsors |
| `/api/sponsors/[id]` | PUT, DELETE | Sí | Sponsor individual |
| `/api/subscribers` | GET, POST | GET: sí | Suscriptores inline |
| `/api/tip-authors` | GET, POST | POST: sí | Autores de tips |
| `/api/tip-authors/[id]` | GET, PUT, DELETE | PUT/DEL: sí | Autor individual |
| `/api/tips` | GET, POST | POST: sí | Tips |
| `/api/tips/[id]` | GET, PUT, DELETE | PUT/DEL: sí | Tip individual |
| `/api/translate` | POST | — | Traducción texto |
| `/api/translate/batch` | POST | — | Traducción batch |
| `/api/upload/presigned` | POST | Sí | URL presignada S3 |

---

## APÉNDICE B — Categorías de Artículos

| Valor | Nombre público | Sección nav |
|-------|---------------|-------------|
| `news` | News / Noticias | ✅ |
| `pro-players` | Pro Players | ✅ |
| `enthusiasts` | Enthusiasts | ✅ |
| `places` | Pickleball Places | ✅ (nuevo) |
| `results` | Results | ✅ |
| `events` | Events | ✅ |
| `gear` | Gear (legacy) | ❌ (solo admin) |

---

## APÉNDICE C — Secciones de Sponsors

`homepage`, `news`, `pro-players`, `enthusiasts`, `juniors`, `tips`, `results`, `events`, `places`, `magazine`, `shop`

---

*Documento generado automáticamente por DeepAgent — Abacus.AI*
