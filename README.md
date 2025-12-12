# Todo Application

Full-stack todo application with React frontend and Express backend.

## Features

- Create, read, update, and delete todo items
- Organize todos with categories
- Filter by completion status (all, active, completed)
- Sort by due date or creation date (global then within category group)
- Mark todos as complete/incomplete
- Category management

## Tech Stack

### Backend

- Node.js with Express.js
- TypeScript
- Zod for validation
- In-memory data store

### Frontend

- React with Vite
- Redux Toolkit for state management
- Material-UI (MUI) for components
- TypeScript

## Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

## Installation

```bash
# Install dependencies
pnpm install

# Copy environment files
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

## Development

```bash
# Start API server (http://localhost:3001)
pnpm --filter api dev

# Start web application (http://localhost:5173)
pnpm --filter web dev

# Run both concurrently
pnpm dev
```

## Testing

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run specific package tests
pnpm --filter api test
pnpm --filter web test
```

## Building

```bash
# Build all packages
pnpm build
```

## Project Structure

```
/
├── apps/
│   ├── api/          # Express.js backend API
│   └── web/          # React SPA frontend
├── libs/
│   ├── contracts/    # Shared TypeScript types and API contracts
│   └── guards/       # Zod schemas for runtime validation
├── testing/          # Shared test utilities and fixtures
└── docs/             # Documentation
```

## API Endpoints

### Categories

- `GET /api/v1/categories` - List all categories
- `GET /api/v1/categories/:id` - Get category by ID
- `POST /api/v1/categories` - Create category
- `PUT /api/v1/categories/:id` - Update category
- `DELETE /api/v1/categories/:id` - Delete category
  - Query params: `cascade=true` (optional) - Also deletes all associated todos

### Todos

- `GET /api/v1/todos` - List todos with optional filters
  - Query params: `status`, `sort`, `order`, `categoryId`
- `GET /api/v1/todos/:id` - Get todo by ID
- `POST /api/v1/todos` - Create todo
- `PUT /api/v1/todos/:id` - Full update todo
- `PATCH /api/v1/todos/:id` - Partial update todo
- `DELETE /api/v1/todos/:id` - Delete todo

### Health

- `GET /api/v1/health` - Health check endpoint

## License

MIT
