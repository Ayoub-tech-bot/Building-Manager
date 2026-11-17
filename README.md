# Building-Manager (Habita)

A modern full-stack SaaS platform for residential property management (Syndic, Owners, Employees).

## Architecture

The project is structured into two independent applications within a single monorepo:

```text
Building-Manager/
│
├── backend/          # Spring Boot 4.x / Java 25 REST API
│   ├── src/
│   ├── pom.xml
│   ├── mvnw
│   └── mvnw.cmd
│
├── frontend/         # React + Vite + Tailwind CSS SPA
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## Getting Started

### 1. Backend (Spring Boot)
- **Requirements**: Java 21+ (Java 25 configured) and MySQL running on port 3306 with database `Saas`.
- Run using Maven:
  ```bash
  cd backend
  ./mvnw spring-boot:run
  ```
- Backend API base URL: `http://localhost:8080/api/v1`
- Swagger UI / OpenAPI: `http://localhost:8080/swagger-ui.html`

### 2. Frontend (React + Vite)
- **Requirements**: Node.js 18+ & npm/pnpm.
- Install dependencies:
  ```bash
  cd frontend
  npm install
  ```
- Start development server:
  ```bash
  npm run dev
  ```
- Local URL: `http://localhost:5173`

---

## Docker Setup

Docker provides a consistent environment for running the application without manually installing and configuring each service.

- **Dockerfile**: Defines how to build an application image.
- **Docker Image**: Packages the application and its dependencies.
- **Docker Container**: Runs an instance of an image.
- **Docker Compose**: Coordinates multiple containers (frontend, backend, database).

### Environment Configuration

Create a `.env` file in the project root using `.env.example` as a template.

Configure your own database credentials. Never commit `.env` to GitHub.

### Running with Docker Compose

From the project root:

```bash
docker compose up --build
```

Run in detached mode:

```bash
docker compose up --build -d
```

Useful commands:

```bash
docker compose ps          # List running containers
docker compose logs -f     # View logs
docker compose down        # Stop containers
```

## Development Without Docker

Docker is optional. Each application can be developed and executed independently:

- **Backend**: Run through IntelliJ IDEA or Maven.
- **Frontend**: Run through Vite using `npm run dev`.
- **Database**: Use a locally installed MySQL Server.

Docker Compose is mainly useful for running the complete application environment together and ensuring consistency across development machines.

## Environment Variables

- `.env`: Contains local configuration and credentials (never commit).
- `.env.example`: Provides a template for other developers.
- Database credentials should never be hardcoded in `application.properties` or Dockerfiles.

Each developer should configure their own environment variables before running the application.

