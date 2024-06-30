```markdown
# Proyecto Next.js

Este es un proyecto de Next.js inicializado con create-next-app.

## Descarga del Proyecto

Para descargar el proyecto, clona el repositorio desde GitHub:

```bash
git clone https://github.com/cdgn-coding/lesscode.git
```

## Pre-requisitos

Para ejecutar este proyecto, necesitas tener instalados los siguientes componentes:

- Node.js
- MongoDB

## Instalación de Dependencias

Instala las dependencias necesarias utilizando npm, yarn, pnpm o bun:

```bash
npm install
# o
yarn install
# o
pnpm install
# o
bun install
```

## Levantar MongoDB en Local con Docker

Puedes levantar una instancia de MongoDB en tu entorno local usando Docker:

```bash
docker run --name mongodb -d -p 27017:27017 mongo
```

## Levantar Vercel Blob en Local con Docker

Levanta Vercel Blob en tu entorno local utilizando Docker:

```bash
docker run --name vercel-blob -d -p 3001:3001 vercel-blob-server
```

## Configurar Variables de Entorno

Configura las siguientes variables de entorno en un archivo `.env.local` en la raíz del proyecto:

```
AUTH0_SECRET=
AUTH0_BASE_URL=
AUTH0_ISSUER_BASE_URL=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
AUTH0_DOMAIN=

MONGODB_URI=
MONGODB_DB=

BLOB_READ_WRITE_TOKEN=

NEXT_PUBLIC_AUTH0_BASE_URL=
```

## Cómo Correr el Proyecto

Primero, ejecuta el servidor de desarrollo:

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
# o
bun dev
```

Abre [http://localhost:3000](http://localhost:3000) con tu navegador para ver el resultado.

Puedes comenzar a editar la página modificando `app/page.tsx`. La página se actualizará automáticamente a medida que edites el archivo.

## Más Información

Para aprender más sobre Next.js, consulta los siguientes recursos:

- [Documentación de Next.js](https://nextjs.org/docs) - Aprende sobre las características y la API de Next.js.
- [Aprende Next.js](https://nextjs.org/learn) - Un tutorial interactivo de Next.js.

También puedes revisar el [repositorio de Next.js en GitHub](https://github.com/vercel/next.js) - ¡Tus comentarios y contribuciones son bienvenidos!
