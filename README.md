# my-sneakers

A small full-stack todo app.

- **Frontend** — Vite + React 19, TanStack Router & Query ([`frontend/`](frontend/)), served on port `5173`
- **Backend** — NestJS + Prisma, a REST Todo API ([`backend/`](backend/)), served on port `3000`
- **Database** — PostgreSQL 16, on port `5432`

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) with Compose v2 (the `docker compose` command)
- For running services directly on the host instead: Node.js 22+ and a local Postgres

## Run it with Docker (recommended)

Everything — database, backend, and frontend — runs from a single Compose file.

1. **Create the environment file.** Compose reads database credentials from a root `.env`:

   ```bash
   cp .env.example .env
   ```

   The defaults (`postgres` / `postgres` / `sneakers`) work as-is for local development. A ready-to-use `.env` is already included in this repo.

2. **Start everything:**

   ```bash
   docker compose up --build
   ```

   On startup the backend automatically generates the Prisma client and syncs the schema to Postgres (`prisma db push`), so no manual migration step is needed.

3. **Open the app:**

   | Service   | URL                                              |
   | --------- | ------------------------------------------------ |
   | Frontend  | http://localhost:5173                            |
   | Backend   | http://localhost:3000                            |
   | Todos API | http://localhost:3000/todos                      |
   | Postgres  | `postgresql://postgres:postgres@localhost:5432/sneakers` |

To stop the stack, press `Ctrl+C`, or run `docker compose down`. Add `-v` to also delete the database volume:

```bash
docker compose down -v
```

### Environment variables

| Variable            | Used by             | Default    | Purpose                            |
| ------------------- | ------------------- | ---------- | ---------------------------------- |
| `POSTGRES_USER`     | Postgres, backend   | `postgres` | Database user                      |
| `POSTGRES_PASSWORD` | Postgres, backend   | `postgres` | Database password                  |
| `POSTGRES_DB`       | Postgres, backend   | `sneakers` | Database name                      |
| `DATABASE_URL`      | backend             | derived    | Full Postgres connection string. Set by Compose from the values above; needed as a `backend/.env` when running the backend outside Docker. |

## Run services directly on the host

Useful when you want hot-reload without rebuilding containers. You still need Postgres running — the quickest option is to start just that container:

```bash
docker compose up postgres
```

### Backend

```bash
cd backend
cp .env.example .env        # DATABASE_URL points at localhost:5432
npm install
npx prisma generate         # generate the Prisma client
npx prisma db push          # create the Todo table
npm run start:dev           # watch mode on http://localhost:3000
```

### Frontend

```bash
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

The frontend calls the backend at `http://localhost:3000` directly from the browser, so no frontend env config is required.

## API

The backend exposes a standard CRUD REST API for todos:

| Method   | Path          | Description          |
| -------- | ------------- | -------------------- |
| `GET`    | `/todos`      | List all todos       |
| `GET`    | `/todos/:id`  | Get a single todo    |
| `POST`   | `/todos`      | Create a todo        |
| `PUT`    | `/todos/:id`  | Update a todo        |
| `DELETE` | `/todos/:id`  | Delete a todo        |

Create a todo:

```bash
curl -X POST http://localhost:3000/todos \
  -H 'Content-Type: application/json' \
  -d '{"title": "Buy new sneakers"}'
```

A todo has the shape `{ id, title, completed, createdAt, updatedAt }`.

## Project layout

```
.
├── docker-compose.yml   # postgres + backend + frontend
├── .env.example         # database credentials for Compose
├── backend/             # NestJS + Prisma API
│   ├── prisma/schema.prisma
│   └── src/todo/        # Todo module (controller, service, DTOs)
└── frontend/            # Vite + React app
    └── src/pages/HomePage.tsx
```

## Tests

```bash
cd backend
npm test          # unit tests
npm run test:e2e  # end-to-end tests
```
