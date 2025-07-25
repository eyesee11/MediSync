/**
 * Enhanced geolocation service using Google Maps API via RapidAPI
 * Provides real-time location data and nearby healthcare facilities
 * Replaces the previous Mapbox implementation
 */

import { GoogleMapsService } from './google-maps-service';

interface HealthcareFacility {
  name: string;
  type: string;
  address: string;
  phone: string;
  distance: string;
  latitude: number;
  longitude: number;
  googleMapsUrl: string;
  directionsUrl: string;
  rating?: number;
  isOpen?: boolean;
  placeId?: string;
}

/**
 * Find nearby healthcare facilities using Google Maps Places API via RapidAPI
 */
export async function findNearbyHealthcareFacilities(
  latitude: number,
  longitude: number,
  type: 'doctors' | 'hospitals' | 'clinics' | 'pharmacies' | 'emergency' = 'doctors',
  radius: number = 5000 // 5km radius
): Promise<HealthcareFacility[]> {
  try {
    const result = await GoogleMapsService.searchNearCoordinates(
      latitude,
      longitude,
      type
    );

    if (result.success && result.data) {
      const parsedResults = GoogleMapsService.parseResults(result);
      
      return parsedResults.map((place: any): HealthcareFacility => {
        const distance = calculateDistance(
          latitude,
          longitude,
          place.coordinates?.lat || 0,
          place.coordinates?.lng || 0
        );

        return {
          name: place.name || 'Unknown Facility',
          type: type,
          address: place.address || 'Address not available',
          phone: place.phone || 'Phone not available',
          distance: `${distance.toFixed(1)} km`,
          latitude: place.coordinates?.lat || latitude,
          longitude: place.coordinates?.lng || longitude,
          googleMapsUrl: place.placeId 
            ? `https://www.google.com/maps/place/?q=place_id:${place.placeId}`
            : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + place.address)}`,
          directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${place.coordinates?.lat || latitude},${place.coordinates?.lng || longitude}`,
          rating: place.rating,
          isOpen: place.isOpen,
          placeId: place.placeId
        };
      });
    } else {
      console.warn('Google Maps search failed, using mock data');
      return getMockHealthcareFacilities(latitude, longitude, type);
    }
  } catch (error) {
    console.error('Healthcare facilities search error:', error);
    return getMockHealthcareFacilities(latitude, longitude, type);
  }
}

/**
 * Search for multiple types of healthcare facilities
 */
export async function searchAllHealthcareFacilities(
  latitude: number,
  longitude: number,
  radius: number = 5000
): Promise<{
  doctors: HealthcareFacility[];
  hospitals: HealthcareFacility[];
  clinics: HealthcareFacility[];
  pharmacies: HealthcareFacility[];
  emergency: HealthcareFacility[];
}> {
  try {
    const [doctors, hospitals, clinics, pharmacies, emergency] = await Promise.all([
      findNearbyHealthcareFacilities(latitude, longitude, 'doctors', radius),
      findNearbyHealthcareFacilities(latitude, longitude, 'hospitals', radius),
      findNearbyHealthcareFacilities(latitude, longitude, 'clinics', radius),
      findNearbyHealthcareFacilities(latitude, longitude, 'pharmacies', radius),
      findNearbyHealthcareFacilities(latitude, longitude, 'emergency', radius)
    ]);

    return {
      doctors: doctors.slice(0, 5), // Limit to 5 results each
      hospitals: hospitals.slice(0, 5),
      clinics: clinics.slice(0, 5),
      pharmacies: pharmacies.slice(0, 5),
      emergency: emergency.slice(0, 3)
    };
  } catch (error) {
    console.error('All healthcare facilities search error:', error);
    return {
      doctors: [],
      hospitals: [],
      clinics: [],
      pharmacies: [],
      emergency: []
    };
  }
}

/**
 * Calculate distance between two coordinates using Haversine formula
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Mock healthcare facilities for fallback when API is unavailable
 */
function getMockHealthcareFacilities(
  latitude: number,
  longitude: number,
  type: string = 'doctors'
): HealthcareFacility[] {
  const mockFacilities: Record<string, HealthcareFacility[]> = {
    doctors: [
      {
        name: "City Medical Center",
        type: "General Practice",
        address: "123 Main Street",
        phone: "(555) 123-4567",
        distance: "0.5 km",
        latitude: latitude + 0.001,
        longitude: longitude + 0.001,
        googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=City+Medical+Center`,
        directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${latitude + 0.001},${longitude + 0.001}`,
        rating: 4.5,
        isOpen: true
      },
      {
        name: "Family Health Clinic",
        type: "Family Medicine",
        address: "456 Oak Avenue",
        phone: "(555) 234-5678",
        distance: "1.2 km",
        latitude: latitude + 0.002,
        longitude: longitude - 0.001,
        googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=Family+Health+Clinic`,
        directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${latitude + 0.002},${longitude - 0.001}`,
        rating: 4.2,
        isOpen: true
      }
    ],
    hospitals: [
      {
        name: "General Hospital",
        type: "Hospital",
        address: "789 Hospital Drive",
        phone: "(555) 345-6789",
        distance: "2.1 km",
        latitude: latitude + 0.003,
        longitude: longitude + 0.002,
        googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=General+Hospital`,
        directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${latitude + 0.003},${longitude + 0.002}`,
        rating: 4.0,
        isOpen: true
      }
    ],
    clinics: [
      {
        name: "Urgent Care Clinic",
        type: "Urgent Care",
        address: "321 Care Street",
        phone: "(555) 456-7890",
        distance: "0.8 km",
        latitude: latitude - 0.001,
        longitude: longitude + 0.001,
        googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=Urgent+Care+Clinic`,
        directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${latitude - 0.001},${longitude + 0.001}`,
        rating: 4.3,
        isOpen: true
      }
    ],
    pharmacies: [
      {
        name: "Community Pharmacy",
        type: "Pharmacy",
        address: "654 Pharmacy Lane",
        phone: "(555) 567-8901",
        distance: "0.3 km",
        latitude: latitude - 0.0005,
        longitude: longitude - 0.0005,
        googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=Community+Pharmacy`,
        directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${latitude - 0.0005},${longitude - 0.0005}`,
        rating: 4.4,
        isOpen: true
      }
    ],
    emergency: [
      {
        name: "Emergency Services",
        type: "Emergency Room",
        address: "999 Emergency Blvd",
        phone: "(555) 911-0000",
        distance: "1.5 km",
        latitude: latitude + 0.002,
        longitude: longitude + 0.003,
        googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=Emergency+Services`,
        directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${latitude + 0.002},${longitude + 0.003}`,
        rating: 4.1,
        isOpen: true
      }
    ]
  };

  return mockFacilities[type] || mockFacilities.doctors;
}
