/**
 * Google Maps service using RapidAPI for location search
 * Replaces Mapbox integration with Google Maps API
 */

interface GoogleMapsSearchParams {
  text: string;
  place?: string;
  street?: string;
  city?: string;
  country?: string;
  state?: string;
  postalcode?: string;
  latitude?: string;
  longitude?: string;
  radius?: string;
}

interface GoogleMapsResult {
  name: string;
  vicinity?: string;
  types?: string[];
  rating?: number;
  place_id?: string;
  opening_hours?: {
    open_now: boolean;
  };
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

interface GoogleMapsResponse {
  success: boolean;
  data?: {
    results: GoogleMapsResult[];
    status: string;
  };
  error?: string;
}

export class GoogleMapsService {
  private static readonly API_URL = 'https://google-api31.p.rapidapi.com/map';
  private static readonly API_KEY = process.env.RAPIDAPI_KEY || process.env.NEXT_PUBLIC_RAPIDAPI_KEY || 'c92a8ee81cmsh32da64c2c6b94f3p195216jsn262d567bed45';

  /**
   * Search for locations using RapidAPI Google Maps
   */
  static async searchLocation(params: GoogleMapsSearchParams): Promise<GoogleMapsResponse> {
    try {
      const options = {
        method: 'POST',
        headers: {
          'x-rapidapi-key': this.API_KEY,
          'x-rapidapi-host': 'google-api31.p.rapidapi.com',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: params.text || '',
          place: params.place || '',
          street: params.street || '',
          city: params.city || '',
          country: params.country || '',
          state: params.state || '',
          postalcode: params.postalcode || '',
          latitude: params.latitude || '',
          longitude: params.longitude || '',
          radius: params.radius || ''
        })
      };

      const response = await fetch(this.API_URL, options);
      const result = await response.text();
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      let parsedResult;
      try {
        parsedResult = JSON.parse(result);
      } catch (parseError) {
        // If parsing fails, try to extract JSON from text
        console.warn('Failed to parse API response:', result);
        return {
          success: false,
          error: 'Invalid response format from API'
        };
      }

      return {
        success: true,
        data: parsedResult
      };
    } catch (error) {
      console.error('Google Maps API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Search for doctors near a location
   */
  static async searchDoctorsNearby(location: string, specialization?: string): Promise<GoogleMapsResponse> {
    const searchText = specialization 
      ? `${specialization} doctor near ${location}`
      : `doctors near ${location}`;

    return this.searchLocation({
      text: searchText,
      place: location,
      radius: '10000' // 10km radius
    });
  }

  /**
   * Search for hospitals near a location
   */
  static async searchHospitalsNearby(location: string): Promise<GoogleMapsResponse> {
    return this.searchLocation({
      text: `hospitals near ${location}`,
      place: location,
      radius: '15000' // 15km radius
    });
  }

  /**
   * Search for clinics near a location
   */
  static async searchClinicsNearby(location: string): Promise<GoogleMapsResponse> {
    return this.searchLocation({
      text: `medical clinics near ${location}`,
      place: location,
      radius: '10000' // 10km radius
    });
  }

  /**
   * Search for emergency services near a location
   */
  static async searchEmergencyServices(location: string): Promise<GoogleMapsResponse> {
    return this.searchLocation({
      text: `emergency hospitals near ${location}`,
      place: location,
      radius: '20000' // 20km radius
    });
  }

  /**
   * Search for pharmacies near a location
   */
  static async searchPharmaciesNearby(location: string): Promise<GoogleMapsResponse> {
    return this.searchLocation({
      text: `pharmacies near ${location}`,
      place: location,
      radius: '5000' // 5km radius
    });
  }

  /**
   * Get user's current location (browser geolocation)
   */
  static async getCurrentLocation(): Promise<{latitude: number, longitude: number} | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.warn('Geolocation is not supported by this browser');
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Error getting location:', error);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  /**
   * Search using coordinates
   */
  static async searchNearCoordinates(
    latitude: number, 
    longitude: number, 
    searchType: 'doctors' | 'hospitals' | 'clinics' | 'emergency' | 'pharmacies'
  ): Promise<GoogleMapsResponse> {
    const searchTexts = {
      doctors: 'doctors near me',
      hospitals: 'hospitals near me',
      clinics: 'medical clinics near me',
      emergency: 'emergency hospitals near me',
      pharmacies: 'pharmacies near me'
    };

    const radiusMap = {
      doctors: '10000',
      hospitals: '15000',
      clinics: '10000',
      emergency: '20000',
      pharmacies: '5000'
    };

    return this.searchLocation({
      text: searchTexts[searchType],
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      radius: radiusMap[searchType]
    });
  }

  /**
   * Parse results into a standardized format
   */
  static parseResults(response: GoogleMapsResponse): Array<{
    name: string;
    address: string;
    distance?: string;
    rating?: number;
    isOpen?: boolean;
    placeId?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  }> {
    if (!response.success || !response.data?.results) {
      return [];
    }

    return response.data.results.map(result => ({
      name: result.name || 'Unknown',
      address: result.vicinity || 'Address not available',
      rating: result.rating,
      isOpen: result.opening_hours?.open_now,
      placeId: result.place_id,
      coordinates: result.geometry?.location ? {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng
      } : undefined
    }));
  }
}
