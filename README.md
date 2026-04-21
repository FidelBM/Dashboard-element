# Element Loyalty+ / Element Elite Fleet

Aplicación full stack sobre Next.js App Router, Prisma, PostgreSQL y NextAuth para el programa de lealtad B2B de flotillas Element Loyalty+ / Element Elite Fleet.

## Arranque

1. Copia `.env.example` a `.env`.
2. Levanta PostgreSQL con `docker compose up -d postgres`.
3. Instala dependencias con `npm install`.
4. Ejecuta `npx prisma migrate dev --name init` o `npm run db:push`.
5. Ejecuta `npm run db:seed`.
6. Inicia la app con `npm run dev`.
7. Abre `http://localhost:3000/login`.

## Credenciales demo

- `superadmin@element.com` / `Element123!`
- `admin@element.com` / `Element123!`
- `ana@logisticadelnorte.com` / `Element123!`
- `marco@movilidadurbana.com` / `Element123!`
- `analyst@element.com` / `Element123!`

## Endpoints principales

- `GET /api/auth/me`
- `GET /api/dashboard?companyId=<id>`
- `GET /api/dashboard/profile?companyId=<id>`
- `GET /api/dashboard/activity?companyId=<id>`
- `GET /api/fleet?companyId=<id>`
- `GET /api/fleet/purchases?companyId=<id>`
- `POST /api/fleet/purchases`
- `GET /api/rewards`
- `POST /api/rewards`
- `POST /api/rewards/:rewardId/redeem`
- `GET /api/incentives/rules`
- `GET /api/incentives/campaigns`
- `POST /api/incentives/campaigns`
- `PATCH /api/incentives/campaigns/:campaignId`
- `GET /api/incentives/points-history?companyId=<id>`
- `GET /api/users`
- `POST /api/users`
- `PATCH /api/users/:userId`
- `DELETE /api/users/:userId`
- `POST /api/admin/points-adjustments`

## Roles

- `SUPER_ADMIN`: control total, campañas, recompensas, usuarios, ajustes.
- `ADMIN_ELEMENT`: administra clientes, recompensas, campañas y ajustes; no crea super admins.
- `FLEET_MANAGER`: consulta y opera únicamente sobre su empresa.
- `ANALYST_OPERATIONS`: solo lectura analítica y visibilidad global.

## Navegación principal

- `/login`: acceso público con branding Element Loyalty+.
- `/dashboard`: vista ejecutiva principal con score, campañas, recomendaciones y actividad.
- `/fleet`: resumen de flotilla, compras y alta de compras.
- `/benefits`: catálogo de recompensas estándar y World Cup con redención.
- `/incentives`: reglas, campañas y movimientos de puntos.
- `/analytics`: gráficas de score, compras y pilares.
- `/users`: administración de usuarios para admins.
- `/admin/users-access`: validación de contraseña adicional para acceso administrativo sensible.
- `/admin/users`: panel de registro rápido, edición, privilegios y activación/desactivación.
- `/settings`: campañas, recompensas y ajustes manuales de puntos.
- `/customers`: lista de cuentas para admins y analistas.
- `/customers/[companyId]`: detalle profundo por cliente.

## Qué probar por rol

- `SUPER_ADMIN`
  Puede entrar a todas las vistas, crear usuarios, campañas, recompensas y ajustes de puntos.
- `ADMIN_ELEMENT`
  Puede operar usuarios, configuración, campañas, recompensas y revisar cuentas.
- `SUPER_ADMIN` y `ADMIN_ELEMENT`
  También pueden abrir `/admin/users-access` y luego `/admin/users` usando la contraseña adicional temporal.
- `FLEET_MANAGER`
  Puede navegar Dashboard, Mi Flota, Beneficios, Incentivos y Análisis para su empresa.
- `ANALYST_OPERATIONS`
  Puede revisar Dashboard, Análisis y Cuentas con foco en monitoreo e intervención.

## Acceso administrativo adicional

1. Inicia sesión con `SUPER_ADMIN` o `ADMIN_ELEMENT`.
2. Ve a `/admin/users-access`.
3. Ingresa la contraseña adicional configurada en `ADMIN_PAGE_PASSWORD`.
4. Si es correcta, se crea una cookie `httpOnly` temporal con duración de 30 minutos y se redirige a `/admin/users`.

La contraseña demo por defecto es `contraseña123`, pero debe cambiarse en `.env` o en la variable de entorno `ADMIN_PAGE_PASSWORD`.
