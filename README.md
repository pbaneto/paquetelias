# Shipping API

A peer-to-peer shipping platform that enables users to publish routes and request package shipments.

## 🛠 Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: TailwindCSS
- **Backend**: Node.js
- **Database**: Supabase (PostgreSQL)
- **API Documentation**: Supabase Studio
- **Authentication**: Supabase Auth

## 📁 Project Structure

```
├── src/
│   ├── components/         # React components
│   ├── lib/               # Core application logic
│   │   ├── types/         # Core domain entities and types
│   │   ├── repositories/  # Data access layer
│   │   ├── services/      # Business logic layer
│   │   └── api/          # API endpoints and controllers
│   ├── App.tsx           # Main React component
│   └── main.tsx          # Application entry point
├── server.js             # Development HTTP server
├── index.html           # HTML entry point
└── vite.config.ts       # Vite configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account for database
- Supabase CLI (optional, for local development)
  ```bash
  npm install -g supabase
  ```

### Supabase Setup

#### Option 1: Using Supabase Cloud (Recommended for getting started)

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. Get your project credentials from Project Settings > API:
   - Project URL (VITE_SUPABASE_URL)
   - Project API Key (VITE_SUPABASE_ANON_KEY)
4. Access your database:
   - Go to Table Editor in Supabase Dashboard
   - View and manage data in your tables
   - Run SQL queries in the SQL Editor
   - Monitor realtime changes
   - Manage user authentication

#### Option 2: Running Supabase Locally

1. Install Docker Desktop
2. Start Supabase locally:
   ```bash
   # Initialize Supabase
   supabase init

   # Start the local development stack
   supabase start

   # This will output your local credentials:
   # API URL: http://localhost:54321
   # DB URL: postgresql://postgres:postgres@localhost:54322/postgres
   # Studio URL: http://localhost:54323
   # Inbucket URL: http://localhost:54324
   # JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
   # anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   # service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. Access your local database:
   - Supabase Studio: http://localhost:54323
   - Database URL: postgresql://postgres:postgres@localhost:54322/postgres
   - API URL: http://localhost:54321

#### Viewing and Managing Data

1. Through Supabase Dashboard:
   - Navigate to Table Editor
   - Click on any table to view/edit records
   - Use filters and sorting
   - Export data as CSV

2. Using SQL Editor:
   ```sql
   -- View all profiles
   SELECT * FROM profiles;

   -- View active routes
   SELECT * FROM routes WHERE status = 'active';

   -- View pending shipments
   SELECT * FROM shipments WHERE status = 'pending';
   ```

3. Database Backups:
   - Cloud: Automatic daily backups
   - Local: Use pg_dump
     ```bash
     pg_dump -h localhost -p 54322 -U postgres postgres > backup.sql
     ```

### Development Setup

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd paquetelias
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   Create a `.env` file in the root directory:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_key
   ```

4. Start the development server
   ```bash
   # Start the Vite development server
   npm run dev
   ```

5. Access the application
   - Frontend: http://localhost:5173 (Vite dev server)
   - Static Server: http://localhost:3001 (Node.js server)
   - API Documentation: http://localhost:54323 (Supabase Studio)
   - API Server: http://localhost:54321 (Supabase API)

### Development Workflow

- The project uses Vite for fast development and building
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Tailwind CSS for styling

## 📚 API Documentation

The API is documented and can be explored through Supabase Studio, which provides:

- Interactive API documentation
- Built-in API explorer
- Table editor for data management
- SQL editor for custom queries
- Real-time API logs

### Accessing the Documentation

1. Start your local Supabase instance:
   ```bash
   supabase start
   ```

2. Access Supabase Studio:
   - URL: http://localhost:54323
   - Navigate to "API Docs" section
   - Each table has auto-generated API documentation
   - Try out endpoints directly from the interface

### API Structure

The API follows RESTful principles and includes:

- **Authentication** (`/auth/*`)
  - Sign up, sign in, sign out
  - JWT-based authentication
  - Row Level Security (RLS) policies

- **Profile Management** (`/profiles/*`)
  - User profiles and ratings
  - Profile updates
  - Secure access control

- **Route Management** (`/routes/*`)
  - Create and list shipping routes
  - Update route status
  - Capacity management

- **Shipment Handling** (`/shipments/*`)
  - Request shipments
  - Track status
  - Manage deliveries

### Testing the API

Use Supabase Studio to:
1. Browse tables and data
2. Execute direct database queries
3. Test API endpoints
4. Monitor real-time changes
5. View request/response logs

## 🏗 Architecture

The project follows Clean Architecture principles with clear separation of concerns:

### Frontend Architecture

- **Components**: Reusable UI components
- **Services**: Business logic and API communication
- **Types**: TypeScript interfaces and types
- **Utilities**: Helper functions and constants

### Backend Architecture

- **Domain Entities**: `Profile`, `Route`, `Shipment`
- **Repositories**: Handle data persistence with Supabase
- **Services**: Implement business logic and validation
- **API Layer**: RESTful endpoints with TypeScript types

## 🔒 Security

- Row Level Security (RLS) enabled for all tables
- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- Secure password hashing

## 📦 Database Schema

### Tables

- `profiles`: User profiles and ratings
- `routes`: Available shipping routes
- `shipments`: Package shipments and tracking

Each table includes:
- Primary keys (UUID)
- Foreign key constraints
- Created/updated timestamps
- Status tracking
- RLS policies

## 🚀 Features

- **User Authentication**: Secure email/password authentication
- **Route Management**: Publish and manage shipping routes
- **Shipment Handling**: Request and track shipments
- **Profile System**: User profiles with ratings
- **Clean Architecture**: Organized in layers with clear separation of concerns

## 📝 API Reference

### Authentication Endpoints

#### `POST /auth/signup`
Register a new user account.

**Request Body:**
```json
{
  "email": "string",     // User's email address
  "password": "string",  // Min 8 characters
  "fullName": "string",  // User's full name
  "phone": "string"      // Phone number
}
```

**Response:**
```json
{
  "user": {
    "id": "string",
    "email": "string"
  },
  "session": {
    "access_token": "string"
  }
}
```

#### `POST /auth/signin`
Sign in to an existing account.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

#### `POST /auth/signout`
Sign out the current user.

### Profile Endpoints

#### `GET /profiles/:id`
Get a user's profile.

**Response:**
```json
{
  "id": "string",
  "fullName": "string",
  "phone": "string",
  "rating": "number",
  "createdAt": "string",
  "updatedAt": "string"
}
```

#### `PATCH /profiles/:id`
Update a user's profile.

**Request Body:**
```json
{
  "fullName": "string",  // optional
  "phone": "string"      // optional
}
```

### Routes Endpoints

#### `GET /routes`
Search available shipping routes.

**Query Parameters:**
- `origin`: Origin location
- `destination`: Destination location
- `fromDate`: Earliest departure date (YYYY-MM-DD)
- `toDate`: Latest departure date (YYYY-MM-DD)

#### `POST /routes`
Create a new shipping route.

**Request Body:**
```json
{
  "origin": "string",
  "destination": "string",
  "departureDate": "string",    // YYYY-MM-DD
  "arrivalDate": "string",      // YYYY-MM-DD
  "maxWeight": "number",        // kg
  "pricePerKg": "number"
}
```

#### `PATCH /routes/:id`
Update a route's details.

**Request Body:**
```json
{
  "status": "active" | "completed" | "cancelled",
  "arrivalDate": "string",
  "pricePerKg": "number"
}
```

### Shipments Endpoints

#### `GET /shipments`
List user's shipments (as sender or carrier).

**Query Parameters:**
- `status`: Filter by status (`pending`, `accepted`, `in_transit`, `delivered`, `cancelled`)

#### `POST /shipments`
Request a new shipment on a route.

**Request Body:**
```json
{
  "routeId": "string",
  "packageDescription": "string",
  "weight": "number"            // kg
}
```

#### `PATCH /shipments/:id/status`
Update a shipment's status.

**Request Body:**
```json
{
  "status": "accepted" | "in_transit" | "delivered" | "cancelled"
}
```

## 🔧 Error Handling

All endpoints return standard error responses in the following format:

```json
{
  "error": {
    "message": "string",
    "details": {}              // optional
  }
}
```

### Status Codes

- `400` Bad Request - Invalid input data
- `401` Unauthorized - Missing/invalid authentication
- `403` Forbidden - Insufficient permissions
- `404` Not Found - Resource doesn't exist
- `409` Conflict - Resource conflict
- `500` Internal Server Error

## 💻 Example Usage

```typescript
// Sign up
const { user, session } = await authService.signUp({
  email: 'user@example.com',
  password: 'password123',
  fullName: 'John Doe',
  phone: '+1234567890'
});

// Create a route
const route = await shippingService.createRoute(user.id, {
  origin: 'New York',
  destination: 'Los Angeles',
  departureDate: '2025-03-01',
  arrivalDate: '2025-03-03',
  maxWeight: 1000,
  pricePerKg: 2.5
});

// Request a shipment
const shipment = await shippingService.requestShipment(user.id, route.id, {
  packageDescription: 'Electronics',
  weight: 50
});
```

## 📝 License

MIT
