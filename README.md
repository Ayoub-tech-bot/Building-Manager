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

