/**
 * Data mappers to transform between domain entities and database models
 */
import { Database } from '../../database.types';
import { Profile, Route, Shipment } from '../../types';

type DBProfile = Database['public']['Tables']['profiles']['Row'];
type DBRoute = Database['public']['Tables']['routes']['Row'];
type DBShipment = Database['public']['Tables']['shipments']['Row'];

export const profileMapper = {
  toDomain(db: DBProfile): Profile {
    return {
      id: db.id,
      fullName: db.full_name,
      phone: db.phone,
      rating: db.rating,
      createdAt: db.created_at,
      updatedAt: db.updated_at
    };
  },

  toDB(domain: Partial<Profile>): Partial<DBProfile> {
    return {
      id: domain.id,
      full_name: domain.fullName,
      phone: domain.phone,
      rating: domain.rating,
      created_at: domain.createdAt,
      updated_at: domain.updatedAt
    };
  }
};

export const routeMapper = {
  toDomain(db: DBRoute & { carrier?: DBProfile }): Route {
    return {
      id: db.id,
      carrierId: db.carrier_id,
      origin: db.origin,
      destination: db.destination,
      departureDate: db.departure_date,
      arrivalDate: db.arrival_date,
      maxWeight: db.max_weight,
      pricePerKg: db.price_per_kg,
      availableCapacity: db.available_capacity,
      status: db.status as Route['status'],
      createdAt: db.created_at,
      updatedAt: db.updated_at,
      carrier: db.carrier ? profileMapper.toDomain(db.carrier) : undefined
    };
  },

  toDB(domain: Partial<Route>): Partial<DBRoute> {
    return {
      id: domain.id,
      carrier_id: domain.carrierId,
      origin: domain.origin,
      destination: domain.destination,
      departure_date: domain.departureDate,
      arrival_date: domain.arrivalDate,
      max_weight: domain.maxWeight,
      price_per_kg: domain.pricePerKg,
      available_capacity: domain.availableCapacity,
      status: domain.status,
      created_at: domain.createdAt,
      updated_at: domain.updatedAt
    };
  }
};

export const shipmentMapper = {
  toDomain(db: DBShipment & { route?: DBRoute, sender?: DBProfile }): Shipment {
    return {
      id: db.id,
      routeId: db.route_id,
      senderId: db.sender_id,
      packageDescription: db.package_description,
      weight: db.weight,
      status: db.status as Shipment['status'],
      createdAt: db.created_at,
      updatedAt: db.updated_at,
      route: db.route ? routeMapper.toDomain(db.route) : undefined,
      sender: db.sender ? profileMapper.toDomain(db.sender) : undefined
    };
  },

  toDB(domain: Partial<Shipment>): Partial<DBShipment> {
    return {
      id: domain.id,
      route_id: domain.routeId,
      sender_id: domain.senderId,
      package_description: domain.packageDescription,
      weight: domain.weight,
      status: domain.status,
      created_at: domain.createdAt,
      updated_at: domain.updatedAt
    };
  }
};