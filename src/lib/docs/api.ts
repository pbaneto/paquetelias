/**
 * @title Shipping API Documentation
 * @description API documentation for the peer-to-peer shipping platform
 * @version 1.0.0
 */

/**
 * Authentication Endpoints
 * ----------------------
 * 
 * @endpoint POST /auth/signup
 * @description Register a new user account
 * @body {
 *   email: string - User's email address
 *   password: string - User's password (min 8 characters)
 *   fullName: string - User's full name
 *   phone: string - User's phone number
 * }
 * @returns {
 *   user: { id: string, email: string }
 *   session: { access_token: string }
 * }
 * @throws 400 - Invalid input data
 * @throws 409 - Email already exists
 * 
 * @endpoint POST /auth/signin
 * @description Sign in to an existing account
 * @body {
 *   email: string - User's email address
 *   password: string - User's password
 * }
 * @returns {
 *   user: { id: string, email: string }
 *   session: { access_token: string }
 * }
 * @throws 400 - Invalid credentials
 * 
 * @endpoint POST /auth/signout
 * @description Sign out the current user
 * @security Bearer token
 * @returns 200 - Success
 * @throws 401 - Unauthorized
 */

/**
 * Profile Endpoints
 * ----------------
 * 
 * @endpoint GET /profiles/:id
 * @description Get a user's profile
 * @param id string - User ID
 * @returns {
 *   id: string
 *   fullName: string
 *   phone: string
 *   rating: number
 *   createdAt: string
 *   updatedAt: string
 * }
 * @throws 404 - Profile not found
 * 
 * @endpoint PATCH /profiles/:id
 * @description Update a user's profile
 * @security Bearer token
 * @param id string - User ID
 * @body {
 *   fullName?: string - New full name
 *   phone?: string - New phone number
 * }
 * @returns Updated profile object
 * @throws 401 - Unauthorized
 * @throws 403 - Forbidden (not own profile)
 */

/**
 * Routes Endpoints
 * ---------------
 * 
 * @endpoint GET /routes
 * @description Search available shipping routes
 * @query {
 *   origin?: string - Origin location
 *   destination?: string - Destination location
 *   fromDate?: string - Earliest departure date (YYYY-MM-DD)
 *   toDate?: string - Latest departure date (YYYY-MM-DD)
 * }
 * @returns Array of routes matching the criteria
 * 
 * @endpoint POST /routes
 * @description Create a new shipping route
 * @security Bearer token
 * @body {
 *   origin: string - Starting location
 *   destination: string - End location
 *   departureDate: string - Departure date (YYYY-MM-DD)
 *   arrivalDate: string - Arrival date (YYYY-MM-DD)
 *   maxWeight: number - Maximum weight capacity in kg
 *   pricePerKg: number - Price per kilogram
 * }
 * @returns Created route object
 * @throws 400 - Invalid input data
 * @throws 401 - Unauthorized
 * 
 * @endpoint PATCH /routes/:id
 * @description Update a route's details
 * @security Bearer token
 * @param id string - Route ID
 * @body {
 *   status?: 'active' | 'completed' | 'cancelled'
 *   arrivalDate?: string
 *   pricePerKg?: number
 * }
 * @returns Updated route object
 * @throws 401 - Unauthorized
 * @throws 403 - Forbidden (not route owner)
 * @throws 404 - Route not found
 */

/**
 * Shipments Endpoints
 * ------------------
 * 
 * @endpoint GET /shipments
 * @description List user's shipments (as sender or carrier)
 * @security Bearer token
 * @query {
 *   status?: 'pending' | 'accepted' | 'in_transit' | 'delivered' | 'cancelled'
 * }
 * @returns Array of shipments
 * @throws 401 - Unauthorized
 * 
 * @endpoint POST /shipments
 * @description Request a new shipment on a route
 * @security Bearer token
 * @body {
 *   routeId: string - ID of the route
 *   packageDescription: string - Description of the package
 *   weight: number - Weight in kg
 * }
 * @returns Created shipment object
 * @throws 400 - Invalid input / Insufficient capacity
 * @throws 401 - Unauthorized
 * @throws 404 - Route not found
 * 
 * @endpoint PATCH /shipments/:id/status
 * @description Update a shipment's status
 * @security Bearer token
 * @param id string - Shipment ID
 * @body {
 *   status: 'accepted' | 'in_transit' | 'delivered' | 'cancelled'
 * }
 * @returns Updated shipment object
 * @throws 400 - Invalid status transition
 * @throws 401 - Unauthorized
 * @throws 403 - Forbidden (not sender/carrier)
 * @throws 404 - Shipment not found
 */

/**
 * Error Responses
 * --------------
 * 
 * @error 400 Bad Request
 * @description Invalid input data or business rule violation
 * @returns {
 *   error: {
 *     message: string
 *     details?: Record<string, string>
 *   }
 * }
 * 
 * @error 401 Unauthorized
 * @description Missing or invalid authentication token
 * @returns {
 *   error: {
 *     message: "Authentication required"
 *   }
 * }
 * 
 * @error 403 Forbidden
 * @description Authenticated but not authorized for the action
 * @returns {
 *   error: {
 *     message: "Access denied"
 *   }
 * }
 * 
 * @error 404 Not Found
 * @description Requested resource does not exist
 * @returns {
 *   error: {
 *     message: "Resource not found"
 *     resource: string
 *   }
 * }
 * 
 * @error 409 Conflict
 * @description Resource already exists or state conflict
 * @returns {
 *   error: {
 *     message: string
 *     details?: Record<string, string>
 *   }
 * }
 * 
 * @error 500 Internal Server Error
 * @description Unexpected server error
 * @returns {
 *   error: {
 *     message: "Internal server error"
 *     id: string // Error tracking ID
 *   }
 * }
 */

/**
 * Data Types
 * ----------
 */
export interface Profile {
  id: string;
  fullName: string | null;
  phone: string | null;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface Route {
  id: string;
  carrierId: string;
  origin: string;
  destination: string;
  departureDate: string;
  arrivalDate: string;
  maxWeight: number;
  pricePerKg: number;
  availableCapacity: number;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  carrier?: Profile;
}

export interface Shipment {
  id: string;
  routeId: string;
  senderId: string;
  packageDescription: string;
  weight: number;
  status: 'pending' | 'accepted' | 'in_transit' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  route?: Route;
  sender?: Profile;
}

/**
 * Example Usage
 * ------------
 * 
 * ```typescript
 * // Sign up
 * const { user, session } = await authService.signUp({
 *   email: 'user@example.com',
 *   password: 'password123',
 *   fullName: 'John Doe',
 *   phone: '+1234567890'
 * });
 * 
 * // Create a route
 * const route = await shippingService.createRoute(user.id, {
 *   origin: 'New York',
 *   destination: 'Los Angeles',
 *   departureDate: '2025-03-01',
 *   arrivalDate: '2025-03-03',
 *   maxWeight: 1000,
 *   pricePerKg: 2.5
 * });
 * 
 * // Request a shipment
 * const shipment = await shippingService.requestShipment(user.id, route.id, {
 *   packageDescription: 'Electronics',
 *   weight: 50
 * });
 * ```
 */