import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/auth';
import { Route, RouteStatus } from '../lib/types';
import { ShippingService } from '../lib/services/shipping.service';

interface Profile {
  id: string;
  fullName: string;
  phone: string;
}

type TabType = 'profile' | 'create-route' | 'create-shipment';

interface RouteFormData {
  origin: string;
  destination: string;
  departureDate: string;
  arrivalDate: string;
  maxWeight: number;
  pricePerKg: number;
}

interface ShipmentFormData {
  routeId: string;
  packageDescription: string;
  weight: number;
}

export function Profile() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  // New state for tabs and forms
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formMessage, setFormMessage] = useState<string | null>(null);

  // Route form state
  const [routeForm, setRouteForm] = useState<RouteFormData>({
    origin: '',
    destination: '',
    departureDate: '',
    arrivalDate: '',
    maxWeight: 0,
    pricePerKg: 0
  });

  // Shipment form state
  const [shipmentForm, setShipmentForm] = useState<ShipmentFormData>({
    routeId: '',
    packageDescription: '',
    weight: 0
  });

  // Available routes for shipment creation
  const [availableRoutes, setAvailableRoutes] = useState<Route[]>([]);

  // Initialize shipping service
  const shippingService = new ShippingService();



  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await auth.getCurrentUser();
        if (!currentUser) {
          navigate('/signin');
          return;
        }
        setUser(currentUser);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
        navigate('/signin');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // Fetch available routes when shipment tab is active
  useEffect(() => {
    if (activeTab === 'create-shipment' && user) {
      const fetchRoutes = async () => {
        try {
          const routes = await shippingService.searchRoutes({});
          setAvailableRoutes(routes);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load routes');
        }
      };

      fetchRoutes();
    }
  }, [activeTab, user]);


  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/signin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign out');
    }
  };

  // Handle route form input changes
  const handleRouteInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setRouteForm(prev => ({
      ...prev,
      [name]: name === 'maxWeight' || name === 'pricePerKg' ? parseFloat(value) : value
    }));
  };

  // Handle shipment form input changes
  const handleShipmentInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setShipmentForm(prev => ({
      ...prev,
      [name]: name === 'weight' ? parseFloat(value) : value
    }));
  };

  // Handle route form submission
  const handleCreateRoute = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    setFormStatus('loading');
    setFormMessage(null);

    try {
      await shippingService.createRoute(user.id, {
        ...routeForm,
        status: 'active' as RouteStatus
      });

      setFormStatus('success');
      setFormMessage('Route created successfully!');

      // Reset form
      setRouteForm({
        origin: '',
        destination: '',
        departureDate: '',
        arrivalDate: '',
        maxWeight: 0,
        pricePerKg: 0
      });
    } catch (err) {
      setFormStatus('error');
      setFormMessage(err instanceof Error ? err.message : 'Failed to create route');
    }
  };

  // Handle shipment form submission
  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    setFormStatus('loading');
    setFormMessage(null);

    try {
      await shippingService.requestShipment(
        user.id,
        shipmentForm.routeId,
        {
          packageDescription: shipmentForm.packageDescription,
          weight: shipmentForm.weight
        }
      );

      setFormStatus('success');
      setFormMessage('Shipment created successfully!');

      // Reset form
      setShipmentForm({
        routeId: '',
        packageDescription: '',
        weight: 0
      });
    } catch (err) {
      setFormStatus('error');
      setFormMessage(err instanceof Error ? err.message : 'Failed to create shipment');
    }
  };

  // Reset form status when changing tabs
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setFormStatus('idle');
    setFormMessage(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => handleTabChange('profile')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => handleTabChange('create-route')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'create-route'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Create Route
            </button>
            <button
              onClick={() => handleTabChange('create-shipment')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'create-shipment'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Create Shipment
            </button>
          </nav>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Profile</h2>
              <p className="mt-2 text-gray-600">{user.email}</p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Account Details</h3>
                <div className="mt-2 text-sm text-gray-600">
                  <p>User ID: {user.id}</p>
                  <p>Email: {user.email}</p>
                  <p>Last Sign In: {new Date(user.last_sign_in_at).toLocaleString()}</p>
                </div>
              </div>

              <button
                onClick={handleSignOut}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Create Route Tab */}
        {activeTab === 'create-route' && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Create Route</h2>
              <p className="mt-2 text-gray-600">Publish a new shipping route</p>
            </div>

            {formStatus === 'success' && (
              <div className="mb-4 p-4 bg-green-50 text-green-800 rounded-md">
                {formMessage}
              </div>
            )}

            {formStatus === 'error' && (
              <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-md">
                {formMessage}
              </div>
            )}

            <form onSubmit={handleCreateRoute} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="origin" className="block text-sm font-medium text-gray-700">
                    Origin
                  </label>
                  <input
                    type="text"
                    name="origin"
                    id="origin"
                    required
                    value={routeForm.origin}
                    onChange={handleRouteInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
                    Destination
                  </label>
                  <input
                    type="text"
                    name="destination"
                    id="destination"
                    required
                    value={routeForm.destination}
                    onChange={handleRouteInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="departureDate" className="block text-sm font-medium text-gray-700">
                    Departure Date
                  </label>
                  <input
                    type="date"
                    name="departureDate"
                    id="departureDate"
                    required
                    value={routeForm.departureDate}
                    onChange={handleRouteInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="arrivalDate" className="block text-sm font-medium text-gray-700">
                    Arrival Date
                  </label>
                  <input
                    type="date"
                    name="arrivalDate"
                    id="arrivalDate"
                    required
                    value={routeForm.arrivalDate}
                    onChange={handleRouteInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="maxWeight" className="block text-sm font-medium text-gray-700">
                    Maximum Weight (kg)
                  </label>
                  <input
                    type="number"
                    name="maxWeight"
                    id="maxWeight"
                    required
                    min="0.1"
                    step="0.1"
                    value={routeForm.maxWeight || ''}
                    onChange={handleRouteInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="pricePerKg" className="block text-sm font-medium text-gray-700">
                    Price per kg ($)
                  </label>
                  <input
                    type="number"
                    name="pricePerKg"
                    id="pricePerKg"
                    required
                    min="0.01"
                    step="0.01"
                    value={routeForm.pricePerKg || ''}
                    onChange={handleRouteInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={formStatus === 'loading'}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {formStatus === 'loading' ? 'Creating...' : 'Create Route'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Create Shipment Tab */}
        {activeTab === 'create-shipment' && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Create Shipment</h2>
              <p className="mt-2 text-gray-600">Request to ship a package</p>
            </div>

            {formStatus === 'success' && (
              <div className="mb-4 p-4 bg-green-50 text-green-800 rounded-md">
                {formMessage}
              </div>
            )}

            {formStatus === 'error' && (
              <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-md">
                {formMessage}
              </div>
            )}

            {availableRoutes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No active routes available. Please check back later.</p>
              </div>
            ) : (
              <form onSubmit={handleCreateShipment} className="space-y-6">
                <div>
                  <label htmlFor="routeId" className="block text-sm font-medium text-gray-700">
                    Select Route
                  </label>
                  <select
                    name="routeId"
                    id="routeId"
                    required
                    value={shipmentForm.routeId}
                    onChange={handleShipmentInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">-- Select a route --</option>
                    {availableRoutes.map(route => (
                      <option key={route.id} value={route.id}>
                        {route.origin} to {route.destination} ({new Date(route.departureDate).toLocaleDateString()})
                        - ${route.pricePerKg}/kg, {route.availableCapacity}kg available
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="packageDescription" className="block text-sm font-medium text-gray-700">
                    Package Description
                  </label>
                  <textarea
                    name="packageDescription"
                    id="packageDescription"
                    required
                    rows={3}
                    value={shipmentForm.packageDescription}
                    onChange={handleShipmentInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Describe your package contents and dimensions"
                  />
                </div>

                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    id="weight"
                    required
                    min="0.1"
                    step="0.1"
                    value={shipmentForm.weight || ''}
                    onChange={handleShipmentInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={formStatus === 'loading'}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {formStatus === 'loading' ? 'Creating...' : 'Create Shipment'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
