# Shipping API

A peer-to-peer shipping platform that enables users to publish routes and request package shipments.

## 🚀 Features

- **User Authentication**: Secure email/password authentication
- **Route Management**: Publish and manage shipping routes
- **Shipment Handling**: Request and track shipments
- **Profile System**: User profiles with ratings
- **Clean Architecture**: Organized in layers with clear separation of concerns

## 🏗 Architecture

The project follows Clean Architecture principles with the following layers:

```
src/lib/
├── types/          # Core domain entities and types
├── repositories/   # Data access layer
├── services/      # Business logic layer
└── api/           # API endpoints and controllers
```

### Key Components

- **Domain Entities**: `Profile`, `Route`, `Shipment`
- **Repositories**: Handle data persistence with Supabase
- **Services**: Implement business logic and validation
- **API Layer**: RESTful endpoints with TypeScript types

## 📚 API Documentation

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

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_key
   ```
4. Start the development server: `npm run dev`

## 📝 License

MIT