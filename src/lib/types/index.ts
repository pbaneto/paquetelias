/**
 * Core domain types representing the business entities
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
  status: RouteStatus;
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
  status: ShipmentStatus;
  createdAt: string;
  updatedAt: string;
  route?: Route;
  sender?: Profile;
}

export type RouteStatus = 'active' | 'completed' | 'cancelled';
export type ShipmentStatus = 'pending' | 'accepted' | 'in_transit' | 'delivered' | 'cancelled';