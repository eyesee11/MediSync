/**
 * Chatbot location service for finding healthcare facilities
 * Integrates with Google Maps RapidAPI for location-based queries
 */

import { GoogleMapsService } from './google-maps-service';

export interface LocationSearchResult {
  type: 'hospitals' | 'clinics' | 'emergency' | 'doctors' | 'pharmacies';
  location: string;
  results: Array<{
    name: string;
    address: string;
    rating?: number;
    isOpen?: boolean;
    placeId?: string;
  }>;
  message: string;
  suggestions?: string[];
}

export class ChatbotLocationService {
  /**
   * Process chatbot messages for location-based queries
   */
  static async processLocationQuery(message: string): Promise<LocationSearchResult | null> {
    const lowerMessage = message.toLowerCase();
    
    // Extract location from message
    const location = this.extractLocation(message);
    if (!location) {
      return null;
    }

    // Determine search type and execute search
    if (this.isHospitalQuery(lowerMessage)) {
      return this.searchHospitals(location);
    } else if (this.isClinicQuery(lowerMessage)) {
      return this.searchClinics(location);
    } else if (this.isEmergencyQuery(lowerMessage)) {
      return this.searchEmergency(location);
    } else if (this.isDoctorQuery(lowerMessage)) {
      return this.searchDoctors(location, message);
    } else if (this.isPharmacyQuery(lowerMessage)) {
      return this.searchPharmacies(location);
    }
    
    return null;
  }

  /**
   * Check if message contains location-related queries
   */
  static isLocationQuery(message: string): boolean {
    const locationKeywords = [
      'near', 'nearby', 'close', 'around', 'in', 'at',
      'hospital', 'clinic', 'doctor', 'emergency', 'medical center', 'pharmacy'
    ];
    
    const lowerMessage = message.toLowerCase();
    return locationKeywords.some(keyword => lowerMessage.includes(keyword));
  }

  /**
   * Generate helpful suggestions based on query type
   */
  static generateSuggestions(type: string, location: string): string[] {
    const suggestions = {
      hospitals: [
        `Find emergency rooms near ${location}`,
        `Show me specialist hospitals in ${location}`,
        `What are the ratings for hospitals near ${location}?`
      ],
      clinics: [
        `Find walk-in clinics near ${location}`,
        `Show me family medicine clinics in ${location}`,
        `What are urgent care options near ${location}?`
      ],
      doctors: [
        `Find cardiologists near ${location}`,
        `Show me pediatricians in ${location}`,
        `What are the best rated doctors near ${location}?`
      ],
      emergency: [
        `Find the nearest trauma center to ${location}`,
        `Show me 24-hour emergency services near ${location}`,
        `What hospitals have emergency rooms near ${location}?`
      ],
      pharmacies: [
        `Find 24-hour pharmacies near ${location}`,
        `Show me CVS or Walgreens near ${location}`,
        `What pharmacies are open now near ${location}?`
      ]
    };

    return suggestions[type as keyof typeof suggestions] || [];
  }

  private static extractLocation(message: string): string | null {
    // Enhanced location extraction patterns
    const locationPatterns = [
      /(?:near|in|at|around|close to)\s+(.+?)(?:\s+(?:hospital|clinic|doctor|pharmacy)|[.!?]|$)/i,
      /find\s+.+?\s+(?:near|in|at)\s+(.+?)(?:\s+(?:hospital|clinic|doctor|pharmacy)|[.!?]|$)/i,
      /(.+?)\s+(?:area|vicinity|neighborhood)/i,
      /(?:located in|based in|situated in)\s+(.+?)(?:[.!?]|$)/i
    ];

    for (const pattern of locationPatterns) {
      const match = message.match(pattern);
      if (match && match[1] && match[1].trim().length > 1) {
        return match[1].trim();
      }
    }

    // Fallback: extract potential location words
    const words = message.split(' ');
    const stopWords = ['the', 'and', 'or', 'near', 'in', 'at', 'hospital', 'clinic', 'doctor', 'pharmacy', 'find', 'show', 'me'];
    const locationWords = words.filter(word => 
      word.length > 2 && 
      !stopWords.includes(word.toLowerCase()) &&
      !/^\d+$/.test(word) // Exclude pure numbers
    );

    return locationWords.length > 0 ? locationWords.slice(0, 3).join(' ') : null;
  }

  private static isHospitalQuery(message: string): boolean {
    return /hospital|medical center|health center/i.test(message);
  }

  private static isClinicQuery(message: string): boolean {
    return /clinic|urgent care|walk.?in/i.test(message);
  }

  private static isEmergencyQuery(message: string): boolean {
    return /emergency|urgent|trauma|er\b|911|critical/i.test(message);
  }

  private static isDoctorQuery(message: string): boolean {
    return /doctor|physician|specialist|md\b|dr\./i.test(message);
  }

  private static isPharmacyQuery(message: string): boolean {
    return /pharmacy|drugstore|cvs|walgreens|medication|prescription/i.test(message);
  }

  private static async searchHospitals(location: string): Promise<LocationSearchResult> {
    const result = await GoogleMapsService.searchHospitalsNearby(location);
    const parsedResults = GoogleMapsService.parseResults(result);
    
    return {
      type: 'hospitals',
      location,
      results: parsedResults,
      message: result.success 
        ? `🏥 I found ${parsedResults.length} hospitals near ${location}:`
        : `Sorry, I couldn't find hospitals near ${location}. Please try a different location.`,
      suggestions: this.generateSuggestions('hospitals', location)
    };
  }

  private static async searchClinics(location: string): Promise<LocationSearchResult> {
    const result = await GoogleMapsService.searchClinicsNearby(location);
    const parsedResults = GoogleMapsService.parseResults(result);
    
    return {
      type: 'clinics',
      location,
      results: parsedResults,
      message: result.success 
        ? `🏥 I found ${parsedResults.length} medical clinics near ${location}:`
        : `Sorry, I couldn't find clinics near ${location}. Please try a different location.`,
      suggestions: this.generateSuggestions('clinics', location)
    };
  }

  private static async searchEmergency(location: string): Promise<LocationSearchResult> {
    const result = await GoogleMapsService.searchEmergencyServices(location);
    const parsedResults = GoogleMapsService.parseResults(result);
    
    return {
      type: 'emergency',
      location,
      results: parsedResults,
      message: result.success 
        ? `🚨 I found ${parsedResults.length} emergency hospitals near ${location}:`
        : `Sorry, I couldn't find emergency services near ${location}. Please call 911 for immediate help.`,
      suggestions: this.generateSuggestions('emergency', location)
    };
  }

  private static async searchPharmacies(location: string): Promise<LocationSearchResult> {
    const result = await GoogleMapsService.searchPharmaciesNearby(location);
    const parsedResults = GoogleMapsService.parseResults(result);
    
    return {
      type: 'pharmacies',
      location,
      results: parsedResults,
      message: result.success 
        ? `💊 I found ${parsedResults.length} pharmacies near ${location}:`
        : `Sorry, I couldn't find pharmacies near ${location}. Please try a different location.`,
      suggestions: this.generateSuggestions('pharmacies', location)
    };
  }

  private static async searchDoctors(location: string, originalMessage: string): Promise<LocationSearchResult> {
    // Extract specialization if mentioned
    const specializations = [
      'cardiologist', 'dermatologist', 'neurologist', 'pediatrician',
      'orthopedic', 'gynecologist', 'psychiatrist', 'dentist', 'ophthalmologist',
      'family medicine', 'internal medicine', 'general practitioner'
    ];
    
    const specialization = specializations.find(spec => 
      originalMessage.toLowerCase().includes(spec)
    );
    
    const result = await GoogleMapsService.searchDoctorsNearby(location, specialization);
    const parsedResults = GoogleMapsService.parseResults(result);
    
    const specializationText = specialization ? ` ${specialization}` : '';
    
    return {
      type: 'doctors',
      location,
      results: parsedResults,
      message: result.success 
        ? `👨‍⚕️ I found ${parsedResults.length}${specializationText} doctors near ${location}:`
        : `Sorry, I couldn't find${specializationText} doctors near ${location}. Please try a different location.`,
      suggestions: this.generateSuggestions('doctors', location)
    };
  }

  /**
   * Format results for display in chatbot
   */
  static formatResultsForChat(searchResult: LocationSearchResult): string {
    if (searchResult.results.length === 0) {
      return searchResult.message;
    }

    let response = searchResult.message + '\n\n';
    
    searchResult.results.slice(0, 5).forEach((result, index) => {
      response += `${index + 1}. **${result.name}**\n`;
      response += `   📍 ${result.address}\n`;
      
      if (result.rating) {
        response += `   ⭐ Rating: ${result.rating}/5\n`;
      }
      
      if (result.isOpen !== undefined) {
        response += `   ${result.isOpen ? '🟢 Open Now' : '🔴 Closed'}\n`;
      }
      
      response += '\n';
    });

    if (searchResult.results.length > 5) {
      response += `... and ${searchResult.results.length - 5} more results\n\n`;
    }

    if (searchResult.suggestions && searchResult.suggestions.length > 0) {
      response += '💡 **You might also ask:**\n';
      searchResult.suggestions.forEach(suggestion => {
        response += `• ${suggestion}\n`;
      });
    }

    return response;
  }
}
