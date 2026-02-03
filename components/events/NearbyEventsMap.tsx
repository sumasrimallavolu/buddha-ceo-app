'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Users, Navigation, Loader2 } from 'lucide-react';

interface Event {
  _id: string;
  title: string;
  description: string;
  type: string;
  startDate: string;
  endDate: string;
  timings: string;
  location?: {
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    venue?: string;
    latitude?: number;
    longitude?: number;
  };
  maxParticipants?: number;
  currentRegistrations: number;
  status: string;
}

interface NearbyEventsMapProps {
  userLocation?: {
    latitude: number;
    longitude: number;
  };
}

export function NearbyEventsMap({ userLocation }: NearbyEventsMapProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPosition, setUserPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(userLocation || null);
  const [error, setError] = useState<string | null>(null);
  const [radius, setRadius] = useState(50); // km

  useEffect(() => {
    fetchEvents();
    if (!userPosition) {
      getCurrentLocation();
    }
  }, []);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setUserPosition(location);
        loadMap(location);
      },
      (error) => {
        setError('Unable to retrieve your location. Please enable location services.');
        setLoading(false);
      }
    );
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events/public');
      if (response.ok) {
        const data = await response.json();
        // Filter events that have location and are upcoming/ongoing
        const eventsWithLocation = data.filter(
          (event: Event) =>
            event.location?.latitude &&
            event.location?.longitude &&
            (event.status === 'upcoming' || event.status === 'ongoing')
        );
        setEvents(eventsWithLocation);
      }
    } catch (err) {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const loadMap = (location: { latitude: number; longitude: number }) => {
    // Leaflet will be loaded dynamically
    if (typeof window !== 'undefined') {
      loadLeafletAndRenderMap(location);
    }
  };

  const loadLeafletAndRenderMap = (location: { latitude: number; longitude: number }) => {
    // Load Leaflet CSS and JS dynamically
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
      renderMap(location);
    };
    document.head.appendChild(script);
  };

  const renderMap = (location: { latitude: number; longitude: number }) => {
    // @ts-ignore - Leaflet loaded dynamically
    const map = (window as any).L.map('map').setView([location.latitude, location.longitude], 10);

    // @ts-ignore
    (window as any).L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add user marker
    // @ts-ignore
    const userIcon = (window as any).L.divIcon({
      className: 'user-marker',
      html: '<div class="bg-blue-500 w-4 h-4 rounded-full border-2 border-white shadow-lg"></div>',
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });

    // @ts-ignore
    (window as any).L.marker([location.latitude, location.longitude], { icon: userIcon })
      .addTo(map)
      .bindPopup('<strong class="text-blue-600">You are here</strong>');

    // Add event markers
    events.forEach((event) => {
      if (event.location?.latitude && event.location?.longitude) {
        const distance = calculateDistance(
          location.latitude,
          location.longitude,
          event.location.latitude,
          event.location.longitude
        );

        // Only show events within radius
        if (distance <= radius) {
          // @ts-ignore
          const eventIcon = (window as any).L.divIcon({
            className: 'event-marker',
            html: `<div class="bg-purple-600 w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
              <span class="text-white text-xs">🧘</span>
            </div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });

          // @ts-ignore
          (window as any).L.marker(
            [event.location.latitude, event.location.longitude],
            { icon: eventIcon }
          )
            .addTo(map)
            .bindPopup(`
              <div class="p-2">
                <strong class="text-purple-600">${event.title}</strong><br/>
                <small>${event.location.city || ''}${event.location.state ? ', ' + event.location.state : ''}</small><br/>
                <small class="text-gray-600">${distance.toFixed(1)} km away</small>
              </div>
            `);
        }
      }
    });
  };

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = (degrees: number): number => {
    return degrees * (Math.PI / 180);
  };

  const nearbyEvents = userPosition
    ? events
        .map((event) => ({
          ...event,
          distance: event.location?.latitude && event.location?.longitude
            ? calculateDistance(
                userPosition.latitude,
                userPosition.longitude,
                event.location.latitude,
                event.location.longitude
              )
            : Infinity,
        }))
        .filter((event) => event.distance <= radius)
        .sort((a, b) => a.distance - b.distance)
    : [];

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-purple-600" />
              Nearby Events
            </CardTitle>
            <CardDescription>
              Find meditation events happening near you
            </CardDescription>
          </div>
          {!userPosition && (
            <Button
              onClick={getCurrentLocation}
              className="bg-gradient-to-r from-purple-600 to-blue-600"
            >
              <Navigation className="mr-2 h-4 w-4" />
              Use My Location
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            <span className="ml-3 text-muted-foreground">Loading events...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
            <Button
              onClick={getCurrentLocation}
              variant="outline"
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        ) : !userPosition ? (
          <div className="text-center py-12 bg-purple-50 rounded-lg">
            <MapPin className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Enable location services to find events near you
            </p>
            <Button
              onClick={getCurrentLocation}
              className="bg-gradient-to-r from-purple-600 to-blue-600"
            >
              <Navigation className="mr-2 h-4 w-4" />
              Enable Location
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Map container */}
            <div id="map" className="w-full h-80 rounded-lg border-2 border-purple-200 z-0"></div>

            {/* Nearby events list */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">
                  Events within {radius} km
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Radius:</span>
                  {[25, 50, 100, 200].map((r) => (
                    <Button
                      key={r}
                      variant={radius === r ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setRadius(r)}
                    >
                      {r}km
                    </Button>
                  ))}
                </div>
              </div>

              {nearbyEvents.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No events found within {radius} km of your location
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Try increasing the search radius
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {nearbyEvents.map((event) => (
                    <div
                      key={event._id}
                      className="flex items-start gap-4 p-4 border rounded-lg hover:border-purple-300 hover:shadow-md transition-all"
                    >
                      <div className="bg-purple-100 p-3 rounded-full">
                        <Calendar className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-base mb-1 truncate">
                          {event.title}
                        </h4>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {event.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {event.location?.city}
                            {event.location?.state && `, ${event.location.state}`}
                          </span>
                          <span className="flex items-center">
                            {event.distance && `${event.distance.toFixed(1)} km away`}
                          </span>
                          {event.maxParticipants && (
                            <span className="flex items-center">
                              <Users className="h-3 w-3 mr-1" />
                              {event.currentRegistrations}/{event.maxParticipants}
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge
                        variant={event.status === 'upcoming' ? 'default' : 'secondary'}
                        className="shrink-0"
                      >
                        {event.status === 'upcoming' ? 'Upcoming' : 'Ongoing'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
