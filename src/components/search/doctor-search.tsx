'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MapPin, Search, Loader2, User, Phone, Clock, Star, ExternalLink } from 'lucide-react';
import { GoogleMapsService } from '@/lib/google-maps-service';
import { useToast } from '@/hooks/use-toast';

interface DoctorSearchProps {
  onDoctorSelect?: (doctor: any) => void;
}

export const DoctorSearch: React.FC<DoctorSearchProps> = ({ onDoctorSelect }) => {
  const [location, setLocation] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!location.trim()) {
      toast({
        title: "Location Required",
        description: "Please enter a location to search for doctors",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await GoogleMapsService.searchDoctorsNearby(location, specialization);
      
      if (result.success && result.data) {
        const parsedResults = GoogleMapsService.parseResults(result);
        setSearchResults(parsedResults);
        toast({
          title: "Search Complete",
          description: `Found ${parsedResults.length} doctors near ${location}`,
        });
      } else {
        toast({
          title: "Search Failed",
          description: result.error || "Unable to find doctors in this area",
          variant: "destructive"
        });
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Doctor search error:', error);
      toast({
        title: "Search Error",
        description: "An error occurred while searching for doctors",
        variant: "destructive"
      });
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetCurrentLocation = async () => {
    setIsGettingLocation(true);
    try {
      const coords = await GoogleMapsService.getCurrentLocation();
      if (coords) {
        // Use coordinates to search directly
        const result = await GoogleMapsService.searchNearCoordinates(
          coords.latitude, 
          coords.longitude, 
          'doctors'
        );
        
        if (result.success && result.data) {
          const parsedResults = GoogleMapsService.parseResults(result);
          setSearchResults(parsedResults);
          setLocation(`${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`);
          toast({
            title: "Location Found",
            description: `Found ${parsedResults.length} doctors near your location`,
          });
        }
      } else {
        toast({
          title: "Location Access Denied",
          description: "Please allow location access or enter a location manually",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Location error:', error);
      toast({
        title: "Location Error",
        description: "Unable to get your current location",
        variant: "destructive"
      });
    } finally {
      setIsGettingLocation(false);
    }
  };

  const specializations = [
    'General Practitioner',
    'Family Medicine',
    'Internal Medicine',
    'Cardiologist',
    'Dermatologist',
    'Neurologist',
    'Pediatrician',
    'Orthopedic',
    'Gynecologist',
    'Psychiatrist',
    'Dentist',
    'Ophthalmologist'
  ];

  const openInGoogleMaps = (result: any) => {
    if (result.placeId) {
      window.open(`https://www.google.com/maps/place/?q=place_id:${result.placeId}`, '_blank');
    } else if (result.coordinates) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${result.coordinates.lat},${result.coordinates.lng}`, '_blank');
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(result.name + ' ' + result.address)}`, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Find Doctors Near You
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter city, address, or postal code"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleGetCurrentLocation}
                  disabled={isGettingLocation}
                  title="Use current location"
                >
                  {isGettingLocation ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Specialization (Optional)</label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
              >
                <option value="">All Doctors</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
          </div>
          
          <Button 
            onClick={handleSearch} 
            disabled={isLoading || !location.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Search Doctors
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Search Results ({searchResults.length})</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {searchResults.map((doctor, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        <h4 className="font-semibold text-sm">{doctor.name}</h4>
                      </div>
                      {doctor.rating && (
                        <div className="flex items-center gap-1 text-xs bg-primary/10 px-2 py-1 rounded">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          {doctor.rating}
                        </div>
                      )}
                    </div>
                    
                    {doctor.address && (
                      <p className="text-xs text-muted-foreground flex items-start gap-1">
                        <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        {doctor.address}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 text-xs">
                      {doctor.isOpen !== undefined && (
                        <span className={`flex items-center gap-1 ${doctor.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                          <Clock className="h-3 w-3" />
                          {doctor.isOpen ? 'Open Now' : 'Closed'}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {onDoctorSelect && (
                        <Button
                          size="sm"
                          onClick={() => onDoctorSelect(doctor)}
                          className="flex-1"
                        >
                          Select
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openInGoogleMaps(doctor)}
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Directions
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {searchResults.length === 0 && location && !isLoading && (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No doctors found in this area.</p>
            <p className="text-sm">Try searching in a different location or with different criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
