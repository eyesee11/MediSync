"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MapPin,
  DollarSign,
  Brain,
  Bone,
  Heart,
  Stethoscope,
  Search as SearchIcon,
  X,
  CalendarDays,
  Filter,
  Loader2,
  LocateFixed,
  Navigation,
  GraduationCap,
  Clock,
  Languages,
  Star,
  User,
  Calendar,
  Map,
  MessageSquare,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { DoctorSearch } from "@/components/search/doctor-search";
import { LocationChatbot } from "@/components/search/location-chatbot";

const specialties = [
  { value: "physician", label: "Physician", icon: Stethoscope },
  { value: "cardiologist", label: "Cardiologist", icon: Heart },
  { value: "dermatologist", label: "Dermatologist", icon: null },
  { value: "pediatrician", label: "Pediatrician", icon: null },
  { value: "neurologist", label: "Neurologist", icon: Brain },
  { value: "orthopedist", label: "Orthopedist", icon: Bone },
];

const initialDoctors = [
  {
    id: "dr_ananya_reddy_001",
    name: "Dr. Ananya Reddy",
    specialty: "Physician",
    avatar: "https://placehold.co/80x80.png",
    avatarFallback: "AR",
    aiHint: "doctor portrait",
    experience: "8 years",
    qualification: "MBBS, MD (Internal Medicine)",
    description:
      "Dr. Ananya Reddy is a dedicated physician with extensive experience in internal medicine. She specializes in preventive care, chronic disease management, and patient education. Known for her compassionate approach and thorough diagnostic skills.",
    languages: ["English", "Hindi", "Telugu"],
    location: {
      address: "Apollo Hospital, Jubilee Hills, Hyderabad, Telangana",
      lat: 17.4239,
      lng: 78.4738,
    },
    fee: 800,
    availableNow: true,
  },
  {
    id: "dr_vikram_rao_002",
    name: "Dr. Vikram Rao",
    specialty: "Cardiologist",
    avatar: "https://placehold.co/80x80.png",
    avatarFallback: "VR",
    aiHint: "doctor smiling",
    experience: "12 years",
    qualification: "MBBS, MD, DM (Cardiology)",
    description:
      "Dr. Vikram Rao is a renowned cardiologist with expertise in interventional cardiology and heart disease prevention. He has performed over 2000 successful cardiac procedures and is known for his patient-centric approach to heart care.",
    languages: ["English", "Hindi", "Marathi"],
    location: {
      address: "Fortis Hospital, Mulund, Mumbai, Maharashtra",
      lat: 19.1647,
      lng: 72.956,
    },
    fee: 1200,
    availableNow: false,
  },
  {
    id: "dr_sunita_patel_003",
    name: "Dr. Sunita Patel",
    specialty: "Pediatrician",
    avatar: "https://placehold.co/80x80.png",
    avatarFallback: "SP",
    aiHint: "female doctor",
    experience: "10 years",
    qualification: "MBBS, MD (Pediatrics)",
    description:
      "Dr. Sunita Patel is a compassionate pediatrician who specializes in child health and development. She has extensive experience in treating childhood diseases, vaccinations, and providing guidance to parents on child care and nutrition.",
    languages: ["English", "Hindi", "Gujarati"],
    location: {
      address:
        "Rainbow Children's Hospital, Banjara Hills, Hyderabad, Telangana",
      lat: 17.4126,
      lng: 78.4484,
    },
    fee: 600,
    availableNow: true,
  },
  {
    id: "dr_rajesh_gupta_004",
    name: "Dr. Rajesh Gupta",
    specialty: "Dermatologist",
    avatar: "https://placehold.co/80x80.png",
    avatarFallback: "RG",
    aiHint: "male doctor",
    experience: "15 years",
    qualification: "MBBS, MD (Dermatology), DDVL",
    description:
      "Dr. Rajesh Gupta is a highly experienced dermatologist specializing in skin disorders, cosmetic dermatology, and dermatosurgery. He has treated thousands of patients with various skin conditions and is known for his expertise in advanced dermatological procedures.",
    languages: ["English", "Hindi", "Punjabi"],
    location: {
      address: "Max Super Specialty Hospital, Saket, New Delhi",
      lat: 28.5244,
      lng: 77.2066,
    },
    fee: 1000,
    availableNow: false,
  },
  {
    id: "dr_priya_sharma_005",
    name: "Dr. Priya Sharma",
    specialty: "Neurologist",
    avatar: "https://placehold.co/80x80.png",
    avatarFallback: "PS",
    aiHint: "indian female doctor",
    experience: "14 years",
    qualification: "MBBS, MD, DM (Neurology)",
    description:
      "Dr. Priya Sharma is a distinguished neurologist with expertise in treating neurological disorders including epilepsy, stroke, and movement disorders. She is known for her thorough diagnostic approach and personalized treatment plans for complex neurological conditions.",
    languages: ["English", "Hindi", "Bengali"],
    location: {
      address: "AIIMS, Ansari Nagar, New Delhi",
      lat: 28.5672,
      lng: 77.21,
    },
    fee: 1500,
    availableNow: true,
  },
  {
    id: "dr_rohan_mehta_006",
    name: "Dr. Rohan Mehta",
    specialty: "Orthopedist",
    avatar: "https://placehold.co/80x80.png",
    avatarFallback: "RM",
    aiHint: "indian male doctor",
    experience: "11 years",
    qualification: "MBBS, MS (Orthopedics)",
    description:
      "Dr. Rohan Mehta is an accomplished orthopedic surgeon specializing in joint replacement, sports injuries, and trauma surgery. He has successfully performed numerous complex orthopedic procedures and is dedicated to helping patients regain mobility and lead active lives.",
    languages: ["English", "Hindi", "Gujarati"],
    location: {
      address:
        "Kokilaben Dhirubhai Ambani Hospital, Andheri West, Mumbai, Maharashtra",
      lat: 19.1368,
      lng: 72.8269,
    },
    fee: 900,
    availableNow: false,
  },
  {
    id: "dr_test_payment_007",
    name: "Dr. Sarah Johnson",
    specialty: "Physician",
    avatar: "https://placehold.co/80x80.png",
    avatarFallback: "SJ",
    aiHint: "female doctor smiling",
    experience: "7 years",
    qualification: "MBBS, MD (Internal Medicine)",
    description:
      "Dr. Sarah Johnson is a compassionate physician specializing in family medicine and preventive care. She offers comprehensive health services including routine check-ups, health screenings, and management of chronic conditions. Perfect for testing our payment portal with reasonable consultation fees.",
    languages: ["English"],
    location: {
      address: "MediSync Test Clinic, Downtown Medical Center, Your City",
      lat: 40.7128,
      lng: -74.006,
    },
    fee: 150,
    availableNow: true,
  },
];

// Haversine formula to calculate distance between two lat/lng points
const getDistanceInMiles = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 3959; // Radius of the Earth in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
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
  const [searchLocation, setSearchLocation] = React.useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isLocating, setIsLocating] = React.useState(false);
  const [selectedDoctor, setSelectedDoctor] = React.useState<
    ((typeof initialDoctors)[0] & { distance?: number }) | null
  >(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false);

  const handleViewProfile = (
    doctor: (typeof initialDoctors)[0] & { distance?: number }
  ) => {
    setSelectedDoctor(doctor);
    setIsProfileModalOpen(true);
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
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
            description: "Showing doctors near you.",
          });
        },
        (error) => {
          toast({
            variant: "destructive",
            title: "Location Access Denied",
            description:
              "Please enable location permissions in your browser to find doctors near you.",
          });
          setIsLocating(false);
        }
      );
    } else {
      toast({
        variant: "destructive",
        title: "Geolocation Not Supported",
        description: "Your browser does not support geolocation.",
      });
    }
  };

  const filteredDoctors = React.useMemo(() => {
    let doctorsWithDistance = initialDoctors.map((doctor) => ({
      ...doctor,
      distance: searchLocation
        ? getDistanceInMiles(
            searchLocation.lat,
            searchLocation.lng,
            doctor.location.lat,
            doctor.location.lng
          )
        : undefined,
    }));

    if (searchLocation) {
      doctorsWithDistance.sort(
        (a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity)
      );
    }

    return doctorsWithDistance.filter((doctor) => {
      const nameMatch = doctor.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const specialtyMatch =
        filters.specialty === "all" ||
        doctor.specialty.toLowerCase() === filters.specialty;
      const feeMatch = doctor.fee <= filters.maxFee;
      const availabilityMatch = !filters.availableNow || doctor.availableNow;

      return nameMatch && specialtyMatch && feeMatch && availabilityMatch;
    });
  }, [searchTerm, filters, searchLocation]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Find Healthcare Providers</h1>
          <p className="text-muted-foreground">
            Search for doctors using our advanced search, local directory, or ask our AI assistant.
          </p>
        </div>
      </div>

      <Tabs defaultValue="google-search" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="google-search" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            Google Search
          </TabsTrigger>
          <TabsTrigger value="local-directory" className="flex items-center gap-2">
            <SearchIcon className="h-4 w-4" />
            Local Directory
          </TabsTrigger>
          <TabsTrigger value="ai-assistant" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            AI Assistant
          </TabsTrigger>
        </TabsList>

        <TabsContent value="google-search" className="space-y-6">
          <DoctorSearch onDoctorSelect={(doctor) => {
            console.log('Selected doctor:', doctor);
            // You can add additional logic here, like navigation or state updates
          }} />
        </TabsContent>

        <TabsContent value="local-directory" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <SearchIcon /> Search & Filter Local Directory
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="mr-2" /> {showFilters ? "Hide" : "Show"}{" "}
                  Filters
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
                      <Select
                        value={filters.specialty}
                        onValueChange={(val) =>
                          handleFilterChange("specialty", val)
                        }
                      >
                        <SelectTrigger id="specialty">
                          <SelectValue placeholder="Select a specialty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Specialties</SelectItem>
                          {specialties.map((spec) => (
                            <SelectItem key={spec.value} value={spec.value}>
                              <div className="flex items-center gap-2">
                                {spec.icon && (
                                  <spec.icon className="h-4 w-4 text-muted-foreground" />
                                )}
                                <span>{spec.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fee-range">
                        Consultation Fee (Max: ₹{filters.maxFee})
                      </Label>
                      <div className="flex items-center gap-4">
                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                        <Slider
                          id="fee-range"
                          min={50}
                          max={500}
                          step={10}
                          value={[filters.maxFee]}
                          onValueChange={(val) =>
                            handleFilterChange("maxFee", val[0])
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Availability</Label>
                      <div className="flex items-center space-x-2 pt-2">
                        <Switch
                          id="available-now"
                          checked={filters.availableNow}
                          onCheckedChange={(val) =>
                            handleFilterChange("availableNow", val)
                          }
                        />
                        <Label htmlFor="available-now">Available Now</Label>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Label>Location</Label>
                    <div className="flex items-center space-x-2 pt-2">
                      <Button
                        onClick={handleFindNearMe}
                        disabled={isLocating}
                        variant="outline"
                      >
                        {isLocating ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <LocateFixed className="mr-2 h-4 w-4" />
                        )}
                        {isLocating ? "Locating..." : "Use My Current Location"}
                      </Button>
                      {searchLocation && (
                        <Button
                          onClick={() => setSearchLocation(null)}
                          variant="ghost"
                          size="sm"
                        >
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
              {filteredDoctors.length}{" "}
              {filteredDoctors.length === 1 ? "Doctor" : "Doctors"} Found
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => (
                  <Card key={doctor.name} className="flex flex-col">
                    <CardHeader className="flex flex-row items-start gap-4">
                      <Avatar className="w-20 h-20 border">
                        <AvatarImage
                          src={doctor.avatar}
                          alt={doctor.name}
                          data-ai-hint={doctor.aiHint}
                        />
                        <AvatarFallback>{doctor.avatarFallback}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg">{doctor.name}</h3>
                            <p className="text-primary font-medium">
                              {doctor.specialty}
                            </p>
                          </div>
                          <Badge
                            variant={doctor.availableNow ? "default" : "secondary"}
                            className={
                              doctor.availableNow
                                ? "bg-green-100 text-green-800"
                                : ""
                            }
                          >
                            {doctor.availableNow ? "Available Now" : "Unavailable"}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-2 space-y-1">
                          <p className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" /> {doctor.location.address}
                          </p>
                          <p className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" /> ₹{doctor.fee}{" "}
                            Consultation Fee
                          </p>
                          {searchLocation &&
                            typeof doctor.distance === "number" && (
                              <p className="font-semibold flex items-center gap-2">
                                {doctor.distance.toFixed(1)} miles away
                              </p>
                            )}
                        </div>
                      </div>
                    </CardHeader>

                    <CardFooter className="flex justify-between items-center mt-auto pt-4 border-t">
                      <div className="flex items-center gap-2">
                        {searchLocation && (
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${doctor.location.lat},${doctor.location.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="outline" size="sm">
                              <Navigation className="mr-2 h-4 w-4" /> Directions
                            </Button>
                          </a>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewProfile(doctor)}
                        >
                          <User className="mr-2 h-4 w-4" /> View Profile
                        </Button>
                      </div>
                      <Link href="/payment">
                        <Button>Book Appointment</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">
                    No doctors match your criteria. Try adjusting your filters.
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai-assistant" className="space-y-6">
          <LocationChatbot />
        </TabsContent>
      </Tabs>

      {/* Doctor Profile Modal */}
      <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedDoctor && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {selectedDoctor.name}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Doctor Header */}
                <div className="flex items-start gap-4">
                  <Avatar className="w-24 h-24 border">
                    <AvatarImage
                      src={selectedDoctor.avatar}
                      alt={selectedDoctor.name}
                      data-ai-hint={selectedDoctor.aiHint}
                    />
                    <AvatarFallback className="text-lg">
                      {selectedDoctor.avatarFallback}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{selectedDoctor.name}</h3>
                    <p className="text-primary font-medium text-lg">
                      {selectedDoctor.specialty}
                    </p>
                    <p className="text-muted-foreground mt-1">
                      {selectedDoctor.experience} years of experience
                    </p>
                    <Badge
                      variant={
                        selectedDoctor.availableNow ? "default" : "secondary"
                      }
                      className={
                        selectedDoctor.availableNow
                          ? "bg-green-100 text-green-800 mt-2"
                          : "mt-2"
                      }
                    >
                      {selectedDoctor.availableNow
                        ? "Available Now"
                        : "Unavailable"}
                    </Badge>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="font-semibold mb-2">About</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedDoctor.description}
                  </p>
                </div>

                {/* Qualifications */}
                <div>
                  <h4 className="font-semibold mb-2">Qualifications</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDoctor.qualification.split(',').map(
                      (qualification, index) => (
                        <Badge key={index} variant="outline">
                          {qualification.trim()}
                        </Badge>
                      )
                    )}
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <h4 className="font-semibold mb-2">Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDoctor.languages.map((language, index) => (
                      <Badge key={index} variant="secondary">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Location & Fee */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Location</h4>
                    <p className="text-muted-foreground flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                      <span>{selectedDoctor.location.address}</span>
                    </p>
                    {selectedDoctor.distance && (
                      <p className="text-sm font-medium mt-1 text-primary">
                        {selectedDoctor.distance.toFixed(1)} miles away
                      </p>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Consultation Fee</h4>
                    <p className="text-2xl font-bold text-primary">
                      ₹{selectedDoctor.fee}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex gap-2">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${selectedDoctor.location.lat},${selectedDoctor.location.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline">
                        <Navigation className="mr-2 h-4 w-4" /> Get Directions
                      </Button>
                    </a>
                  </div>
                  <Link href="/payment">
                    <Button size="lg" className="px-8">
                      <Calendar className="mr-2 h-4 w-4" />
                      Book Appointment
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
