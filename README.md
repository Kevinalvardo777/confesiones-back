# Confessions Back

Backend NestJS para una plataforma de confesiones universitarias por campus, pensado para trabajar junto al frontend React + Vite ubicado en `../confessions-front`.

## Stack final recomendado

- NestJS 11 con TypeScript estricto
- PostgreSQL + Prisma ORM
- Redis para cache y evolución futura de colas y sesiones distribuidas
- JWT access tokens + refresh tokens hasheados
- Swagger, Jest, Docker Compose
- Helmet, CORS, throttling, validación global, filtros globales y logs estructurados con `pino-http`

## Arquitectura elegida

Se usa un `modular monolith` con organización `feature-first` y capas internas ligeras por módulo:

- `application`: casos de uso y servicios
- `domain`: entidades y contratos del dominio
- `infrastructure`: repositorios y adaptadores externos
- `presentation`: controllers y DTOs

Esta forma mantiene bajo acoplamiento, facilita testeo y permite extraer módulos a microservicios en el futuro si el producto crece.

## Estructura

```text
src/
  common/
  config/
  database/
    prisma/
    redis/
  modules/
    auth/
    users/
    sections/
    confessions/
    comments/
    reports/
    ranking/
    moderation/
    admin/
    notifications/
  app.module.ts
  main.ts
prisma/
  schema.prisma
  seed.ts
test/
docker-compose.yml
Dockerfile
```

## Convenciones

- Clases Nest en `PascalCase`
- Archivos en `kebab-case`
- DTOs terminan en `.dto.ts`
- Repositorios terminan en `.repository.ts`
- Servicios de aplicación terminan en `.service.ts`
- Endpoints versionados bajo `/api/v1`

## Modelo de datos inicial

Entidades principales:

- `User`, `Role`, `RefreshToken`
- `Section`
- `Confession`, `ConfessionRating`
- `Comment`
- `Report`, `ModerationAction`
- `AuditLog`

Reglas clave ya modeladas:

- secciones públicas con ids estables `espol`, `ucg`, `udla`
- confesiones anónimas o con alias
- votos únicos por usuario por confesión
- soft delete
- estados de contenido y reportes
- moderación y auditoría básica

## Cómo correrlo

1. Copia el archivo de ambiente que necesites:
   - `.env.local.example` a `.env.local`
   - `.env.dev.example` a `.env.dev`
   - `.env.cert.example` a `.env.cert`
   - `.env.prod.example` a `.env.prod`
2. Instala dependencias con `npm install`.
3. Genera cliente Prisma con el ambiente correspondiente, por ejemplo `npm run prisma:generate:local`.
4. Levanta servicios con `docker-compose up -d postgres redis`.
5. Ejecuta migraciones con el ambiente correspondiente, por ejemplo `npm run prisma:migrate:local`.
6. Siembra datos base con el ambiente correspondiente, por ejemplo `npm run prisma:seed:local`.
7. Inicia el backend con el script del ambiente:
   - `npm run start:local`
   - `npm run start:dev`
   - `npm run start:cert`
   - `npm run start:prod`

Swagger quedará disponible en `/docs`.

## Healthcheck

El backend expone estos endpoints públicos:

- `GET /api/v1/health`
- `GET /api/v1/health/ready`

`/health` devuelve el estado general de la app y sus dependencias.
`/health/ready` responde correctamente solo cuando PostgreSQL y Redis están disponibles.

## Seguridad y transporte

- Las contraseñas y refresh tokens no se cifran reversiblemente: se almacenan hasheados con Argon2.
- Los access tokens y refresh tokens son JWT firmados, no cifrados. La confidencialidad del tránsito se resuelve con HTTPS/TLS.
- El refresh token se entrega además como cookie `httpOnly`, para que el frontend no tenga que persistirlo en `localStorage`.
- En producción debes publicar la API detrás de un proxy o plataforma con TLS, por ejemplo Railway, Render, Fly.io, Nginx o Caddy.
- Si despliegas detrás de proxy, activa:

```env
NODE_ENV=production
TRUST_PROXY=true
SWAGGER_ENABLED=false
AUTH_COOKIE_SECURE=true
```

- Define `CORS_ORIGINS` con los dominios exactos del frontend, separados por coma.
- Nunca uses secretos por defecto en producción; `JWT_ACCESS_SECRET` y `JWT_REFRESH_SECRET` deben ser valores largos y aleatorios.

## Datos sembrados

Campus:

- `ESPOL`
- `UCG`
- `UDLA`

Usuarios iniciales:

- `admin@campusconfessions.local`
- `moderator@campusconfessions.local`
- `user@campusconfessions.local`

Clave temporal de seed: `ChangeMe123!`

## Endpoints principales

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/guest`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `GET /api/v1/users/me`
- `PATCH /api/v1/users/me`
- `GET /api/v1/sections`
- `GET /api/v1/sections/:slug`
- `GET /api/v1/confessions`
- `GET /api/v1/confessions/:id`
- `POST /api/v1/confessions`
- `POST /api/v1/confessions/:id/vote`
- `GET /api/v1/comments?confessionId=:id`
- `POST /api/v1/comments`
- `POST /api/v1/comments/:id/reply`
- `POST /api/v1/reports`
- `GET /api/v1/reports`
- `PATCH /api/v1/reports/:id`
- `GET /api/v1/ranking`
- `GET /api/v1/ranking/global`
- `GET /api/v1/ranking/sections/:slug`
- `GET /api/v1/admin/metrics`
- `GET /api/v1/admin/users`
- `GET /api/v1/admin/confessions`
- `GET /api/v1/admin/comments`
- `GET /api/v1/admin/reports`

## Integración con el frontend React

El frontend ya usa `VITE_API_BASE_URL=/api/v1`. Para conectarlo:

1. Define en `confessions-front/.env`:

```env
VITE_USE_MOCKS=false
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

2. Asegura que el backend permita CORS desde `http://localhost:5173`.
3. Mantén los ids de campus como `espol`, `ucg`, `udla`.
4. El frontend ya espera respuestas con `data`; este backend responde además con `success`, `message`, `meta` y `timestamp`, sin romper ese consumo.

## Estado actual

La base del backend quedó implementada con módulos reales, `schema.prisma`, seeds, Docker, Swagger, auth con refresh tokens, ranking, comentarios, reportes, moderación y endpoints administrativos. Falta ejecutar `npm install`, generar Prisma y correr tests en este entorno para validar compilación final.

## CI

El repositorio incluye un workflow de GitHub Actions en `.github/workflows/ci.yml` que valida:

- backend: `npm ci`, `prisma generate`, `lint`, `test`, `build`
- frontend: `npm ci`, `lint`, `test:ci`, `build`

## Deploy

El repositorio incluye un workflow de despliegue en `.github/workflows/deploy.yml` con el siguiente mapeo:

- `dev` o `develop` -> despliegue a `dev`
- `main` o `master` -> despliegue a `prod`

La guÃ­a de integraciÃ³n estÃ¡ en `docs/deploy.md`.
"# confesiones-back"
