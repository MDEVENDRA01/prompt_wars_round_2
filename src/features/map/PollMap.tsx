/**
 * @file PollMap.tsx
 * @description Interactive polling station locator with Google Maps integration, weather data, and trip estimations.
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Loader, Library } from '@googlemaps/js-api-loader';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useAnalytics } from '@/hooks/useAnalytics';
import { fetchWeather } from '@/services/weatherService';
import { reverseGeocode } from '@/services/geocodeService';
import { buildPollingStations } from '@/services/pollingStationsService';
import { MAPS_API_KEY, MAPS_CONFIGURED, MAP_STYLES } from '@/constants';
import { formatDistance } from '@/utils/geo';
import { WeatherCard } from './components/WeatherCard';
import { StationList } from './components/StationList';
import { TripCard } from './components/TripCard';
import { MapPlaceholder } from './components/MapPlaceholder';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { WeatherData, PollingStation } from './types';

/**
 * Interactive polling station map section.
 * Locates the user, retrieves local weather, identifies nearby stations, 
 * and provides interactive Google Maps navigation data.
 * 
 * @returns {JSX.Element} The rendered polling station map section.
 */
export const PollMap = () => {
  const { 
    status: locationRequestStatus, 
    userPosition: currentUserCoordinates, 
    startLocating: initiateLocationDetection 
  } = useGeolocation();
  
  const { trackEvent } = useAnalytics();

  const containerSectionRef = useRef<HTMLElement>(null);
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const googleMapsInstanceRef = useRef<google.maps.Map | null>(null);
  const activeMapMarkersRef = useRef<google.maps.Marker[]>([]);
  const directionsOverlayRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

  const [currentWeatherData, setCurrentWeatherData] = useState<WeatherData | null>(null);
  const [currentLocationDisplayName, setCurrentLocationDisplayName] = useState<string>('');
  const [nearbyPollingStations, setNearbyPollingStations] = useState<PollingStation[]>([]);
  const [activePollingStation, setActivePollingStation] = useState<PollingStation | null>(null);
  const [isMapComponentVisible, setIsMapComponentVisible] = useState<boolean>(false);

  /**
   * ── Intersection Observer to defer Google Maps loading ──────────────────────────────
   * This improves initial page load performance by only loading the heavy Maps JS
   * when the user scrolls near the map section.
   */
  useEffect(() => {
    if (!containerSectionRef.current) {
      return;
    }

    const visibilityObserver = new IntersectionObserver(
      ([intersectionEntry]) => {
        if (intersectionEntry.isIntersecting) {
          setIsMapComponentVisible(true);
          visibilityObserver.disconnect();
        }
      },
      { rootMargin: '200px' } // Load map 200px before it enters the viewport
    );

    visibilityObserver.observe(containerSectionRef.current);
    
    return () => visibilityObserver.disconnect();
  }, []);

  /**
   * ── Fetch location-specific data (Weather, Place Name, Stations) ──────────────────────
   */
  useEffect(() => {
    if (!currentUserCoordinates) {
      return;
    }

    const { latitude, longitude } = currentUserCoordinates;

    // 1. Fetch current weather for the user's geographic coordinates
    fetchWeather(latitude, longitude)
      .then(setCurrentWeatherData)
      .catch((weatherFetchError) => {
        console.error('[PollMap] Failed to fetch weather data:', weatherFetchError);
      });

    // 2. Resolve coordinates to a human-readable city or town name
    reverseGeocode(latitude, longitude)
      .then(setCurrentLocationDisplayName)
      .catch(() => setCurrentLocationDisplayName('Your Location'));

    // 3. Generate mock polling stations relative to the user's current position
    const generatedStations = buildPollingStations(currentUserCoordinates) as PollingStation[];
    setNearbyPollingStations(generatedStations);
    
    // Automatically select the geographically nearest station initially
    setActivePollingStation(generatedStations[0] ?? null);
  }, [currentUserCoordinates]);

  /**
   * ── Initialize Google Maps API and Instance ──────────────────────────────────────────
   */
  useEffect(() => {
    if (
      !mapElementRef.current || 
      !MAPS_CONFIGURED || 
      !currentUserCoordinates || 
      !isMapComponentVisible
    ) {
      return;
    }

    const mapsApiLoader = new Loader({
      apiKey: MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places', 'directions'] as Library[],
    });

    mapsApiLoader.load().then((googleMapsLibraryInstances) => {
      if (!googleMapsInstanceRef.current && mapElementRef.current) {
        // Initialize the core Map Instance
        googleMapsInstanceRef.current = new googleMapsLibraryInstances.maps.Map(mapElementRef.current, {
          center: { 
            lat: currentUserCoordinates.latitude, 
            lng: currentUserCoordinates.longitude 
          },
          zoom: 13,
          mapTypeId: 'roadmap',
          styles: MAP_STYLES,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
          gestureHandling: 'cooperative',
        });

        // Initialize the Directions Renderer overlay
        directionsOverlayRendererRef.current = new googleMapsLibraryInstances.maps.DirectionsRenderer({
          suppressMarkers: true,
          polylineOptions: { 
            strokeColor: '#9a7322', 
            strokeWeight: 4, 
            strokeOpacity: 0.8 
          },
        });
        directionsOverlayRendererRef.current.setMap(googleMapsInstanceRef.current);
      }
    });
  }, [isMapComponentVisible, currentUserCoordinates]);

  /**
   * ── Update Map Markers (User Location + Polling Stations) ──────────────────────────
   */
  useEffect(() => {
    if (!googleMapsInstanceRef.current || !currentUserCoordinates) {
      return;
    }

    // Clear existing markers from the map before adding new ones
    activeMapMarkersRef.current.forEach((markerInstance) => markerInstance.setMap(null));
    activeMapMarkersRef.current = [];

    const googleMapsNamespace = (window as any).google;
    if (!googleMapsNamespace) {
      return;
    }

    const currentUserPositionOnMap = { 
      lat: currentUserCoordinates.latitude, 
      lng: currentUserCoordinates.longitude 
    };

    // 1. Add User's Current Location Marker
    const userLocationMarker = new googleMapsNamespace.maps.Marker({
      position: currentUserPositionOnMap,
      map: googleMapsInstanceRef.current,
      title: 'Your Location',
      icon: {
        path: googleMapsNamespace.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#9a7322',
        fillOpacity: 1,
        strokeColor: '#fff',
        strokeWeight: 3,
      },
      zIndex: 999,
    });
    activeMapMarkersRef.current.push(userLocationMarker);

    // 2. Add Nearby Polling Station Markers
    nearbyPollingStations.forEach((stationItem, stationIndex) => {
      const stationMarker = new googleMapsNamespace.maps.Marker({
        position: { lat: stationItem.latitude, lng: stationItem.longitude },
        map: googleMapsInstanceRef.current,
        title: stationItem.stationName,
        icon: {
          path: googleMapsNamespace.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          scale: 7,
          fillColor: stationIndex === 0 ? '#1a7a3f' : '#2563eb',
          fillOpacity: 0.9,
          strokeColor: '#fff',
          strokeWeight: 2,
        },
        label: { 
          text: String(stationIndex + 1), 
          color: '#fff', 
          fontSize: '10px', 
          fontWeight: '700' 
        },
      });

      const stationDetailsInfoWindow = new googleMapsNamespace.maps.InfoWindow({
        content: `
          <div style="font-family:'Inter',sans-serif;padding:4px 0">
            <strong style="color:#1a1611">${stationItem.stationName}</strong><br>
            <span style="color:#6b6252;font-size:12px">${stationItem.stationType}</span><br>
            <span style="color:#9a7322;font-size:12px">
              🚗 ${stationItem.estimatedDriveMinutes} min · 🚶 ${stationItem.estimatedWalkMinutes} min · ${formatDistance(stationItem.distanceInKilometers)}
            </span>
          </div>`,
      });

      stationMarker.addListener('click', () => {
        if (googleMapsInstanceRef.current) {
          stationDetailsInfoWindow.open(googleMapsInstanceRef.current, stationMarker);
          setActivePollingStation(stationItem);
          trackEvent('map_marker_click', { station_name: stationItem.stationName });
        }
      });

      activeMapMarkersRef.current.push(stationMarker);
    });

    // Smoothly pan the map to center on the user's location
    googleMapsInstanceRef.current.panTo(currentUserPositionOnMap);
  }, [currentUserCoordinates, nearbyPollingStations, trackEvent]);

  /**
   * ── Calculate and Display Directions Overlay ────────────────────────────────────────
   */
  useEffect(() => {
    if (
      !activePollingStation || 
      !googleMapsInstanceRef.current || 
      !MAPS_CONFIGURED || 
      !currentUserCoordinates
    ) {
      return;
    }

    const googleMapsNamespace = (window as any).google;
    if (!googleMapsNamespace) {
      return;
    }

    const directionsRoutingService = new googleMapsNamespace.maps.DirectionsService();
    
    directionsRoutingService.route(
      {
        origin: { 
          lat: currentUserCoordinates.latitude, 
          lng: currentUserCoordinates.longitude 
        },
        destination: { 
          lat: activePollingStation.latitude, 
          lng: activePollingStation.longitude 
        },
        travelMode: googleMapsNamespace.maps.TravelMode.DRIVING,
      },
      (directionsRouteResult: google.maps.DirectionsResult | null, googleMapsApiRequestStatus: any) => {
        if (googleMapsApiRequestStatus === 'OK' && directionsRouteResult) {
          directionsOverlayRendererRef.current?.setDirections(directionsRouteResult);
        }
      }
    );
  }, [activePollingStation, currentUserCoordinates]);

  /**
   * Selection handler for when a user interacts with the station list sidebar.
   * Pans the map to the selected station and updates active state.
   * 
   * @param {PollingStation} selectedStation - The station chosen from the list.
   */
  const selectPollingStationFromSidebar = useCallback((selectedStation: PollingStation) => {
    setActivePollingStation(selectedStation);
    
    if (googleMapsInstanceRef.current) {
      googleMapsInstanceRef.current.panTo({ 
        lat: selectedStation.latitude, 
        lng: selectedStation.longitude 
      });
      googleMapsInstanceRef.current.setZoom(14);
    }
  }, []);

  /**
   * Accessible text summarizing the number of nearby stations found.
   */
  const nearbyStationsSummaryText = useMemo(
    () => `${nearbyPollingStations.length} polling station${nearbyPollingStations.length !== 1 ? 's' : ''} found nearby`,
    [nearbyPollingStations.length]
  );

  return (
    <section id="pollmap" aria-labelledby="pollmap-heading" ref={containerSectionRef}>
      <div className="section-inner">
        <p className="section-label reveal">Live Civic Tools</p>
        <h2 className="section-title reveal" id="pollmap-heading">
          Find Your <em>Polling Station</em>
        </h2>
        <p className="section-desc reveal">
          Get real-time weather at your location and find the nearest polling stations with
          estimated travel times — powered by Google Maps.
        </p>

        {locationRequestStatus === 'idle' && (
          <div className="pollmap-cta reveal">
            <div className="pollmap-cta-icon" aria-hidden="true">🗺️</div>
            <h3>Locate Polling Stations Near You</h3>
            <p>
              We'll use your device location to find polling stations and show live weather
              conditions. Your location is never stored or shared.
            </p>
            <button
              id="locate-polling-station-btn"
              className="btn-primary"
              style={{ marginTop: '1.5rem' }}
              onClick={() => {
                initiateLocationDetection();
                trackEvent('map_locate_start');
              }}
            >
              📍 Find My Polling Station
            </button>
            {!MAPS_CONFIGURED && (
              <div className="pollmap-notice" role="note">
                ⚠️ Google Maps API key not configured.
              </div>
            )}
          </div>
        )}

        {locationRequestStatus === 'locating' && (
          <div className="pollmap-cta reveal" aria-live="polite" aria-busy="true">
            <div className="pollmap-spinner" aria-hidden="true" />
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
              Detecting your current location…
            </p>
          </div>
        )}

        {locationRequestStatus === 'ready' && (
          <div className="pollmap-grid reveal">
            <div className="pollmap-sidebar">
              <WeatherCard 
                currentWeatherData={currentWeatherData} 
                locationDisplayName={currentLocationDisplayName} 
              />
              {nearbyPollingStations.length > 0 && (
                <>
                  <p className="sr-only" aria-live="polite">
                    {nearbyStationsSummaryText}
                  </p>
                  <StationList
                    pollingStations={nearbyPollingStations}
                    activeStationId={activePollingStation?.id ?? null}
                    onStationSelection={selectPollingStationFromSidebar}
                  />
                </>
              )}
              {activePollingStation && (
                <TripCard targetStation={activePollingStation} />
              )}
            </div>

            <div className="pollmap-map-wrap">
              <ErrorBoundary 
                errorFallbackUI={
                  <div className="pollmap-map-placeholder">
                    Google Maps failed to load. Please check your connection or refresh.
                  </div>
                }
                targetComponentName="GoogleMap"
              >
                {MAPS_CONFIGURED ? (
                  <div
                    ref={mapElementRef}
                    className="pollmap-map"
                    aria-label="Interactive Google Map showing nearby polling stations"
                    role="application"
                    style={{ width: '100%', height: '480px' }} // CLS prevention
                  />
                ) : (
                  <MapPlaceholder currentUserCoordinates={currentUserCoordinates} />
                )}
              </ErrorBoundary>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};



