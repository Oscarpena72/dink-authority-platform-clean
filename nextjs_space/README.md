# Dink Authority Magazine

Plataforma digital de revista para la comunidad global de pickleball. Incluye sistema de artículos, magazine con flipbook, tienda, tips, perfiles de juniors, sistema multi-país (Colombia, México, Canadá), panel de administración completo, y más.

---

## 📁 Estructura Principal de Carpetas

```
nextjs_space/
├── app/                          # Next.js App Router (páginas y API)
│   ├── _components/              # Componentes globales (header, footer, hero, etc.)
│   ├── api/                      # API Routes (REST endpoints)
│   │   ├── articles/             # CRUD de artículos
│   │   ├── magazine/             # CRUD de ediciones de revista + PDF proxy
│   │   ├── countries/            # Gestión de países
│   │   ├── events/               # Eventos
│   │   ├── products/             # Productos (tienda)
│   │   ├── tips/                 # Tips y autores
│   │   ├── settings/             # Configuración del sitio
│   │   ├── newsletter/           # Suscriptores newsletter
│   │   ├── contact/              # Formulario de contacto
│   │   ├── upload/presigned/     # Upload de archivos a S3
│   │   ├── media/                # Biblioteca de medios
│   │   ├── translate/            # Traducción con LLM
│   │   └── auth/[...nextauth]/   # Autenticación NextAuth
│   ├── admin/                    # Panel de administración
│   │   ├── articles/             # Gestión de artículos
│   │   ├── magazine/             # Gestión de ediciones de revista
│   │   ├── countries/            # Gestión de países
│   │   ├── events/               # Gestión de eventos
│   │   ├── products/             # Gestión de productos
│   │   ├── tips/                 # Gestión de tips
│   │   ├── media/                # Biblioteca de medios
│   │   ├── homepage/             # Configuración del homepage
│   │   ├── settings/             # Configuración general
│   │   ├── newsletter/           # Suscriptores
│   │   ├── subscribers/          # Gestión de suscriptores
│   │   ├── results/              # Resultados de torneos
│   │   ├── community/            # Comunidad
│   │   └── juniors/              # Perfiles de juniors
│   ├── articles/                 # Páginas públicas de artículos
│   ├── magazine/                 # Archivo de revista (central)
│   │   ├── [slug]/               # Visor flipbook de cada edición
│   │   └── _components/          # Componente compartido de galería
│   ├── [countrySlug]/            # Páginas por país (colombia, mexico, canada)
│   │   └── magazine/             # Archivo de revista por país
│   ├── tips/                     # Sección de tips
│   ├── juniors/                  # Sección de juniors
│   ├── shop/                     # Tienda
│   ├── community/                # Comunidad
│   ├── about/                    # Acerca de
│   ├── contact/                  # Contacto
│   ├── login/                    # Login admin
│   ├── layout.tsx                # Layout raíz
│   ├── page.tsx                  # Homepage
│   ├── globals.css               # Estilos globales
│   ├── providers.tsx             # Providers (SessionProvider, etc.)
│   ├── robots.ts                 # robots.txt dinámico
│   └── sitemap.ts                # sitemap.xml dinámico
├── components/                   # Componentes UI reutilizables (shadcn/ui)
│   └── ui/                       # Botones, inputs, dialogs, etc.
├── hooks/                        # Custom React hooks
├── lib/                          # Utilidades y configuración
│   ├── db.ts                     # Cliente Prisma
│   ├── auth-options.ts           # Configuración NextAuth
│   ├── s3.ts                     # Helpers para AWS S3
│   ├── aws-config.ts             # Configuración AWS
│   ├── i18n/                     # Sistema de internacionalización
│   ├── utils.ts                  # Utilidades generales
│   └── types.ts                  # Tipos TypeScript
├── prisma/
│   └── schema.prisma             # Schema de la base de datos
├── scripts/
│   ├── seed.ts                   # Script de seed (datos iniciales)
│   └── safe-seed.ts              # Wrapper seguro para seed
├── public/                       # Assets estáticos
│   ├── images/                   # Imágenes del sitio
│   ├── favicon.svg               # Favicon
│   ├── og-image.png              # Open Graph image
│   ├── manifest.json             # PWA manifest
│   ├── sw.js                     # Service worker
│   └── pdf.worker.min.mjs        # Worker para PDF.js (flipbook)
├── .env.example                  # Variables de entorno (plantilla)
├── package.json                  # Dependencias
├── tailwind.config.ts            # Configuración Tailwind CSS
├── tsconfig.json                 # Configuración TypeScript
├── next.config.js                # Configuración Next.js
└── postcss.config.js             # Configuración PostCSS
```

---

## 🚀 Instrucciones para Correr Localmente

### Prerequisitos

- **Node.js** v18+ (recomendado v20 LTS)
- **Yarn** (gestor de paquetes)
- **PostgreSQL** (local o remoto)
- **Cuenta AWS** con un bucket S3 (para uploads de archivos)

### Pasos

1. **Clonar / copiar el proyecto:**
   ```bash
   cd nextjs_space
   ```

2. **Instalar dependencias:**
   ```bash
   yarn install
   ```

3. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   # Editar .env con tus credenciales reales
   ```

4. **Configurar la base de datos:**
   ```bash
   # Sincronizar schema con la DB
   yarn prisma db push
   
   # Generar el cliente Prisma
   yarn prisma generate
   
   # (Opcional) Poblar con datos iniciales
   yarn prisma db seed
   ```

5. **Ejecutar en modo desarrollo:**
   ```bash
   yarn dev
   ```
   La app estará disponible en `http://localhost:3000`

6. **Acceder al panel admin:**
   - URL: `http://localhost:3000/login`
   - Credenciales por defecto (del seed): `admin@dinkauthority.com` / `DinkAuth2024!`

---

## 🏗️ Instrucciones de Build

```bash
# Build de producción
yarn build

# Iniciar en modo producción
yarn start
```

El build genera una versión standalone en `.next/` (o `.build/` si se configura `NEXT_DIST_DIR`).

---

## 🌐 Instrucciones de Deploy

### Deploy en Abacus AI (actual)
El proyecto está configurado para deploy automático en Abacus AI. El deploy se realiza desde la plataforma Abacus AI.

### Deploy en Vercel
1. Conectar el repositorio a Vercel
2. Configurar las variables de entorno en el dashboard de Vercel
3. Asegurarse de que `DATABASE_URL` apunte a una DB PostgreSQL accesible
4. Vercel ejecutará `yarn build` automáticamente

### Deploy en servidor propio (Docker / PM2)
```bash
# Build
yarn build

# Usando PM2
pm2 start yarn --name "dink-authority" -- start

# O con Docker (crear Dockerfile según necesidades)
```

### Variables de entorno necesarias en producción:
- `DATABASE_URL` — conexión PostgreSQL
- `NEXTAUTH_SECRET` — secreto para JWT/sesiones
- `NEXTAUTH_URL` — URL base de la app en producción
- `AWS_REGION`, `AWS_BUCKET_NAME`, `AWS_FOLDER_PREFIX` — para uploads S3
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` — credenciales AWS (o usar IAM roles)

---

## 🔑 Dependencias Externas Importantes

| Servicio | Propósito | Obligatorio |
|---|---|---|
| **PostgreSQL** | Base de datos principal | ✅ Sí |
| **AWS S3** | Almacenamiento de PDFs, imágenes, medios | ✅ Sí (para uploads) |
| **Abacus AI API** | Traducción de artículos (EN/ES/PT) | ❌ Opcional |
| **NextAuth.js** | Autenticación del panel admin | ✅ Sí |

---

## 📚 Funcionalidades Principales

- **Artículos**: CRUD completo con categorías, hero article, featured articles, focal point de imágenes
- **Magazine**: Archivo de ediciones con visor flipbook (PDF.js + react-pageflip), filtrado por país
- **Multi-país**: Sistema de países (Colombia, México, Canadá) con contenido filtrado por región
- **Tienda**: Productos con galería de imágenes
- **Tips**: Consejos con videos y galerías
- **Juniors**: Perfiles de jugadores junior
- **Eventos**: Calendario de eventos
- **Comunidad**: Sección comunitaria con registro de corresponsales
- **Newsletter**: Sistema de suscripción
- **i18n**: Traducción dinámica EN/ES/PT
- **SEO**: Sitemap dinámico, robots.txt, JSON-LD, Open Graph
- **PWA**: Service worker, manifest, iconos
- **Panel Admin**: Dashboard completo para gestionar todo el contenido
- **Banner de suscripción**: Configurable desde admin para la sección magazine
- **Sticky banners**: Banners publicitarios configurables

---

## 📝 Notas

- El archivo `yarn.lock` se genera al ejecutar `yarn install` con el `package.json` incluido.
- Las imágenes del sitio (logos, iconos) están en `public/images/`.
- El schema de Prisma incluye todos los modelos necesarios — ejecutar `prisma db push` creará todas las tablas.
- El seed script (`scripts/seed.ts`) contiene datos iniciales de ejemplo para artículos, eventos, productos, etc.
