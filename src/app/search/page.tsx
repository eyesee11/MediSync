
"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MapPin, DollarSign, Brain, Bone, Heart, Stethoscope, Search as SearchIcon, X, CalendarDays, Filter, Loader2, LocateFixed, Navigation } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

const specialties = [
    { value: "physician", label: "Physician", icon: Stethoscope },
    { value: "cardiologist", label: "Cardiologist", icon: Heart },
    { value: "dermatologist", label: "Dermatologist", icon: null },
    { value: "pediatrician", label: "Pediatrician", icon: null },
    { value: "neurologist", label: "Neurologist", icon: Brain },
    { value: "orthopedist", label: "Orthopedist", icon: Bone },
]

const initialDoctors = [
  {
    name: "Dr. Ananya Reddy",
    specialty: "Physician",
    avatar: "https://placehold.co/80x80.png",
    avatarFallback: "AR",
    aiHint: "doctor portrait",
    location: { address: "123 Health St, San Francisco, CA", lat: 37.7749, lng: -122.4194 },
    fee: 150,
    availableNow: true,
  },
  {
    name: "Dr. Vikram Rao",
    specialty: "Cardiologist",
    avatar: "https://placehold.co/80x80.png",
    avatarFallback: "VR",
    aiHint: "doctor smiling",
    location: { address: "456 Wellness Ave, New York, NY", lat: 40.7128, lng: -74.0060 },
    fee: 250,
    availableNow: false,
  },
  {
    name: "Dr. Sunita Patel",
    specialty: "Pediatrician",
    avatar: "https://placehold.co/80x80.png",
    avatarFallback: "SP",
    aiHint: "female doctor",
    location: { address: "789 Cure Blvd, Chicago, IL", lat: 41.8781, lng: -87.6298 },
    fee: 120,
    availableNow: true,
  },
  {
    name: "Dr. Rajesh Gupta",
    specialty: "Dermatologist",
    avatar: "https://placehold.co/80x80.png",
    avatarFallback: "RG",
    aiHint: "male doctor",
    location: { address: "101 Skin Way, Los Angeles, CA", lat: 34.0522, lng: -118.2437 },
    fee: 200,
    availableNow: false,
  },
  {
    name: "Dr. Priya Sharma",
    specialty: "Neurologist",
    avatar: "https://placehold.co/80x80.png",
    avatarFallback: "PS",
    aiHint: "indian female doctor",
    location: { address: "21 Medical Dr, Boston, MA", lat: 42.3601, lng: -71.0589 },
    fee: 275,
    availableNow: true,
  },
  {
    name: "Dr. Rohan Mehta",
    specialty: "Orthopedist",
    avatar: "https://placehold.co/80x80.png",
    avatarFallback: "RM",
    aiHint: "indian male doctor",
    location: { address: "55 Bone St, Houston, TX", lat: 29.7604, lng: -95.3698 },
    fee: 180,
    availableNow: false,
  },
];

// Haversine formula to calculate distance between two lat/lng points
const getDistanceInMiles = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 3959; // Radius of the Earth in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};


export default function SearchPage() {
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = React.useState("");
    const [filters, setFilters] = React.useState({
        specialty: "all",
        maxFee: 500,
        availableNow: false,
    });
    const [showFilters, setShowFilters] = React.useState(true);
    const [searchLocation, setSearchLocation] = React.useState<{lat: number, lng: number} | null>(null);
    const [isLocating, setIsLocating] = React.useState(false);

    const handleFilterChange = (key: string, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleFindNearMe = () => {
        if (navigator.geolocation) {
            setIsLocating(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setSearchLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                    setIsLocating(false);
                    toast({
                      title: "Location Found",
                      description: "Showing doctors near you."
                    })
                },
                (error) => {
                    toast({
                        variant: "destructive",
                        title: "Location Access Denied",
                        description: "Please enable location permissions in your browser to find doctors near you."
                    });
                    setIsLocating(false);
                }
            );
        } else {
             toast({
                variant: "destructive",
                title: "Geolocation Not Supported",
                description: "Your browser does not support geolocation."
            });
        }
    }

    const filteredDoctors = React.useMemo(() => {
        let doctorsWithDistance = initialDoctors.map(doctor => ({
            ...doctor,
            distance: searchLocation ? getDistanceInMiles(searchLocation.lat, searchLocation.lng, doctor.location.lat, doctor.location.lng) : undefined
        }));

        if (searchLocation) {
            doctorsWithDistance.sort((a,b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
        }

        return doctorsWithDistance.filter(doctor => {
            const nameMatch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase());
            const specialtyMatch = filters.specialty === "all" || doctor.specialty.toLowerCase() === filters.specialty;
            const feeMatch = doctor.fee <= filters.maxFee;
            const availabilityMatch = !filters.availableNow || doctor.availableNow;
            
            return nameMatch && specialtyMatch && feeMatch && availabilityMatch;
        });
    }, [searchTerm, filters, searchLocation]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Advanced Search</h1>
                <p className="text-muted-foreground">
                    Find the right doctor with detailed filters and location search.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center gap-2"><SearchIcon /> Search & Filter</CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)}>
                            <Filter className="mr-2" /> {showFilters ? "Hide" : "Show"} Filters
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input 
                            placeholder="Search by doctor's name..."
                            className="pl-10 text-base"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    {showFilters && (
                       <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t">
                            <div className="space-y-2">
                                <Label htmlFor="specialty">Specialty / Problem</Label>
                                <Select value={filters.specialty} onValueChange={(val) => handleFilterChange('specialty', val)}>
                                    <SelectTrigger id="specialty">
                                        <SelectValue placeholder="Select a specialty" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Specialties</SelectItem>
                                        {specialties.map(spec => (
                                            <SelectItem key={spec.value} value={spec.value}>
                                                <div className="flex items-center gap-2">
                                                    {spec.icon && <spec.icon className="h-4 w-4 text-muted-foreground" />}
                                                    <span>{spec.label}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fee-range">Consultation Fee (Max: ${filters.maxFee})</Label>
                                <div className="flex items-center gap-4">
                                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                                    <Slider
                                        id="fee-range"
                                        min={50}
                                        max={500}
                                        step={10}
                                        value={[filters.maxFee]}
                                        onValueChange={(val) => handleFilterChange('maxFee', val[0])}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Availability</Label>
                                <div className="flex items-center space-x-2 pt-2">
                                    <Switch 
                                        id="available-now"
                                        checked={filters.availableNow}
                                        onCheckedChange={(val) => handleFilterChange('availableNow', val)}
                                    />
                                    <Label htmlFor="available-now">Available Now</Label>
                                </div>
                            </div>
                        </div>

                         <div className="pt-4 border-t">
                            <Label>Location</Label>
                            <div className="flex items-center space-x-2 pt-2">
                                <Button onClick={handleFindNearMe} disabled={isLocating} variant="outline">
                                    {isLocating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LocateFixed className="mr-2 h-4 w-4" />}
                                    {isLocating ? 'Locating...' : 'Use My Current Location'}
                                </Button>
                                {searchLocation && (
                                    <Button onClick={() => setSearchLocation(null)} variant="ghost" size="sm">
                                        <X className="mr-2 h-4 w-4" /> Clear Location
                                    </Button>
                                )}
                            </div>
                        </div>
                       </>
                    )}
                </CardContent>
            </Card>

            <div>
                <h2 className="text-xl font-semibold mb-4">
                    {filteredDoctors.length} {filteredDoctors.length === 1 ? 'Doctor' : 'Doctors'} Found
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                    {filteredDoctors.length > 0 ? filteredDoctors.map((doctor) => (
                        <Card key={doctor.name} className="flex flex-col">
                            <CardHeader className="flex flex-row items-start gap-4">
                                <Avatar className="w-20 h-20 border">
                                    <AvatarImage src={doctor.avatar} alt={doctor.name} data-ai-hint={doctor.aiHint} />
                                    <AvatarFallback>{doctor.avatarFallback}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-lg">{doctor.name}</h3>
                                            <p className="text-primary font-medium">{doctor.specialty}</p>
                                        </div>
                                         <Badge variant={doctor.availableNow ? "default" : "secondary"} className={doctor.availableNow ? "bg-green-100 text-green-800" : ""}>
                                            {doctor.availableNow ? "Available Now" : "Unavailable"}
                                        </Badge>
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-2 space-y-1">
                                        <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {doctor.location.address}</p>
                                        <p className="flex items-center gap-2"><DollarSign className="h-4 w-4" /> ${doctor.fee} Consultation Fee</p>
                                        {searchLocation && typeof doctor.distance === 'number' && (
                                            <p className="font-semibold flex items-center gap-2">{doctor.distance.toFixed(1)} miles away</p>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                           
                            <CardFooter className="flex justify-end items-center mt-auto pt-4 border-t">
                                {searchLocation && (
                                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${doctor.location.lat},${doctor.location.lng}`} target="_blank" rel="noopener noreferrer" className="mr-2">
                                        <Button variant="outline"><Navigation className="mr-2" /> Directions</Button>
                                    </a>
                                )}
                                <Button>Book Appointment</Button>
                            </CardFooter>
                        </Card>
                    )) : (
                         <div className="col-span-full text-center py-12">
                            <p className="text-muted-foreground">No doctors match your criteria. Try adjusting your filters.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
