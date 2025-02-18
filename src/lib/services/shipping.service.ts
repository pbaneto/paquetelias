/**
 * Shipping service implementing core business logic
 */
import { Route, Shipment, ShipmentStatus } from '../types';
import { RouteRepository } from '../repositories/supabase/route.repository';
import { ShipmentRepository } from '../repositories/supabase/shipment.repository';

export class ShippingService {
  private routeRepo: RouteRepository;
  private shipmentRepo: ShipmentRepository;

  constructor() {
    this.routeRepo = new RouteRepository();
    this.shipmentRepo = new ShipmentRepository();
  }

  async searchRoutes(filters: {
    origin?: string;
    destination?: string;
    fromDate?: string;
    toDate?: string;
  }): Promise<Route[]> {
    return this.routeRepo.findAll({ ...filters, status: 'active' });
  }

  async createRoute(carrierId: string, routeData: Partial<Route>): Promise<Route> {
    // Validate route data
    if (!routeData.origin || !routeData.destination) {
      throw new Error('Origin and destination are required');
    }
    if (!routeData.departureDate || !routeData.arrivalDate) {
      throw new Error('Departure and arrival dates are required');
    }
    if (!routeData.maxWeight || !routeData.pricePerKg) {
      throw new Error('Max weight and price per kg are required');
    }

    return this.routeRepo.create({
      ...routeData,
      carrierId,
      status: 'active',
      availableCapacity: routeData.maxWeight
    });
  }

  async requestShipment(
    senderId: string,
    routeId: string,
    shipmentData: Partial<Shipment>
  ): Promise<Shipment> {
    const route = await this.routeRepo.findById(routeId);
    if (!route) {
      throw new Error('Route not found');
    }

    if (route.status !== 'active') {
      throw new Error('Route is not active');
    }

    if (!shipmentData.weight || shipmentData.weight > route.availableCapacity) {
      throw new Error('Invalid shipment weight');
    }

    // Create shipment
    const shipment = await this.shipmentRepo.create({
      ...shipmentData,
      senderId,
      routeId,
      status: 'pending'
    });

    // Update route capacity
    await this.routeRepo.update(routeId, {
      availableCapacity: route.availableCapacity - shipmentData.weight
    });

    return shipment;
  }

  async updateShipmentStatus(
    shipmentId: string,
    status: ShipmentStatus
  ): Promise<Shipment> {
    const shipment = await this.shipmentRepo.findById(shipmentId);
    if (!shipment) {
      throw new Error('Shipment not found');
    }

    // Validate status transition
    const validTransitions: Record<ShipmentStatus, ShipmentStatus[]> = {
      pending: ['accepted', 'cancelled'],
      accepted: ['in_transit'],
      in_transit: ['delivered'],
      delivered: [],
      cancelled: []
    };

    if (!validTransitions[shipment.status].includes(status)) {
      throw new Error(`Invalid status transition from ${shipment.status} to ${status}`);
    }

    return this.shipmentRepo.update(shipmentId, { status });
  }
}