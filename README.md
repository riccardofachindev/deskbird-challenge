# Deskbird Senior Full-Stack Challenge

A full-stack application featuring user authentication and management with role-based access control.

## Tech Stack

### Backend
- **NestJS** - Node.js framework
- **PostgreSQL** - Database (or SQLite if Docker not available)
- **TypeORM** - ORM for database management
- **JWT** - Authentication
- **Passport.js** - Authentication middleware
- **bcrypt** - Password hashing

### Frontend
- **Angular 20** - Frontend framework
- **PrimeNG** - UI component library
- **NgRx 19** - State management (Store & Effects)
- **RxJS** - Reactive programming

## Prerequisites

- Node.js (v18 or higher)
- npm
- Docker & Docker Compose (for PostgreSQL)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/riccardofachindev/deskbird-challenge.git
cd deskbird-challenge
```

### 2. Database Setup

#### Option A: Using PostgreSQL with Docker (Recommended)

Start PostgreSQL using Docker Compose:

```bash
docker-compose up -d
```

This will start a PostgreSQL instance on port 5432 with:
- Database: `deskbird_db`
- Username: `deskbird`
- Password: `deskbird123`

#### Option B: Using SQLite (No Docker Required)

If you don't have Docker installed, you can use SQLite:

1. Skip the `docker-compose` step
2. In the backend `.env` file, uncomment the SQLite configuration:
   ```
   DATABASE_TYPE=sqlite
   DATABASE_NAME=deskbird.sqlite
   ```
3. Comment out the PostgreSQL configuration lines

### 3. Backend Setup

```bash
cd backend
npm install

# Create .env file from example
cp .env.example .env

# Start the backend
npm run start:dev
```

The backend will start on `http://localhost:3000`

The database will be automatically seeded with an admin user:
- Email: `admin@deskbird.com`
- Password: `admin123`

**Note:** Demo passwords (admin123, password123) will trigger browser security warnings. This is expected for a demo application.

### 4. Frontend Setup

In a new terminal:

```bash
cd frontend
npm install
npm start
```

The frontend will start on `http://localhost:4200`

## API Endpoints

### Authentication
- `POST /auth/login` - Log in with email and password

### Users (Protected - Requires Authentication)
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user (Admin only)
- `PATCH /users/:id` - Update user (Admin only)
- `DELETE /users/:id` - Delete user (Admin only)
- `POST /users/seed-test-data` - Seed 25 test users (Admin only)

## Application Architecture

### Backend Structure
```
backend/
├── src/
│   ├── auth/          # Authentication module
│   ├── users/         # Users module
│   ├── database/      # Database seeding
│   └── main.ts        # Application entry point
```

### Frontend Structure
```
frontend/
├── src/
│   ├── app/
│   │   ├── auth/      # Authentication features
│   │   ├── users/     # User management features
│   │   ├── store/     # NgRx store configuration
│   │   └── shared/    # Shared components and services
```

## Usage of AI during development

I built this full-stack application leveraging AI as a development tool similarly to how I normally use Stack Overflow to ask and look for questions. My own work included initial brainstorming and research, architectural decision-making, development of the backend's core business logic, implementation of authentication and authorization flows, database system setup, user experience design, component structure planning, and state management introduction. I utilized AI to acquire new technological knowledge (ie. PostgreSQL), accelerate development, generate backend boilerplate code, produce database queries, generate configuration files, establish the design system (inspired by Deskbird's official website), and produce documentation.

## Key Implementation Details

### Authentication Flow
1. User logs in with email/password
2. Backend validates credentials and returns JWT token
3. Frontend stores token and user info in NgRx store
4. JWT token is automatically attached to all API requests
5. Protected routes check authentication status

### Role-Based Permissions
- **Regular Users**: Can view user list (read-only)
- **Admins**: Can view, create, edit, delete, and seed users

### State Management
- NgRx store manages authentication and user data
- Effects handle async operations (API calls)
- Selectors provide derived state
- Actions trigger state changes

### Security
- Passwords are hashed using bcrypt
- JWT tokens have configurable expiration
- Role-based guards protect admin-only operations
- CORS is enabled for development

## Production Improvements

There are several improvements that would be beneficial for a production-ready application that I couldn't implement due to time constraints, some of which are:

### Form Error Handling Enhancement
Currently, when submitting the Add/Edit user forms, if an error occurs (e.g., duplicate email), the modal closes and displays an error toast. A better user experience would be:
- Keep the modal open when errors occur
- Display the error message within the modal
- Preserve all form data so users can correct errors without re-entering information
- Only close the modal upon successful submission

### Custom Error Messages
The application currently returns generic error messages or backend exception messages directly. For production, implement user-friendly error messages for common scenarios, such as duplicate email, validation errors, network errors, and permission errors.

### Performance Optimizations
- Implement lazy loading
- Add virtual scrolling for large user lists
- Implement server-side pagination and filtering
- Add response caching strategies
- Optimize bundle size with tree shaking

### Testing
- I added a few front-end unit tests, but for a production release I would write comprehensive unit tests on the whole app (aiming for >80% coverage)