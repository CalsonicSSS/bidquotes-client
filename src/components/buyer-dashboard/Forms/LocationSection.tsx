'use client';

import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type LocationData = {
  location_address: string;
  city: string;
};

type LocationSectionProps = {
  locationData: LocationData;
  onLocationChange: (data: Partial<LocationData>) => void;
  errors?: {
    location_address?: string;
    city?: string;
  };
  isLoading?: boolean;
};

export function LocationSection({ locationData, onLocationChange, errors, isLoading }: LocationSectionProps) {
  // Google Maps state
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);

  // Address autocomplete refs and state
  const addressInputRef = useRef<HTMLInputElement>(null);
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        setIsGoogleMapsLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsGoogleMapsLoaded(true);
      };
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  // Initialize Google Places services when loaded
  useEffect(() => {
    if (isGoogleMapsLoaded && window.google) {
      autocompleteServiceRef.current = new google.maps.places.AutocompleteService();

      // Create a hidden map for PlacesService (requirement for Places API)
      const mapDiv = document.createElement('div');
      const map = new google.maps.Map(mapDiv);
      placesServiceRef.current = new google.maps.places.PlacesService(map);
    }
  }, [isGoogleMapsLoaded]);

  const handleAddressChange = (value: string) => {
    onLocationChange({ location_address: value });

    // Handle address autocomplete
    if (value.length > 2 && autocompleteServiceRef.current) {
      autocompleteServiceRef.current.getPlacePredictions(
        {
          input: value,
          componentRestrictions: { country: 'ca' },
          types: ['address'],
        },
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions);
            setShowSuggestions(true);
          } else {
            setSuggestions([]);
            setShowSuggestions(false);
          }
        }
      );
    } else if (value.length <= 2) {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: google.maps.places.AutocompletePrediction) => {
    if (!placesServiceRef.current) return;

    // Get place details
    placesServiceRef.current.getDetails(
      {
        placeId: suggestion.place_id,
        fields: ['formatted_address', 'address_components', 'geometry'],
      },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          console.log('Place details:', place);
          console.log('Address components:', place.address_components);

          // Update address
          onLocationChange({
            location_address: place.formatted_address || suggestion.description,
          });

          // Extract city from address components - Enhanced for Canadian addresses
          let cityName = '';

          if (place.address_components) {
            // Log all components for debugging
            place.address_components.forEach((component, index) => {
              console.log(`Component ${index}:`, component.long_name, component.types);
            });

            // Priority order for Canadian addresses:
            // 1. sublocality_level_1 (neighborhoods like North York, Scarborough)
            // 2. neighborhood (smaller areas)
            // 3. locality (main city)
            // 4. administrative_area_level_2 (broader region)

            const sublocalityComponent = place.address_components.find((component) => component.types.includes('sublocality_level_1') || component.types.includes('sublocality'));

            const neighborhoodComponent = place.address_components.find((component) => component.types.includes('neighborhood'));

            const localityComponent = place.address_components.find((component) => component.types.includes('locality'));

            const adminLevel2Component = place.address_components.find((component) => component.types.includes('administrative_area_level_2'));

            // Use the most specific available (prioritizing sublocality for Toronto area)
            if (sublocalityComponent && sublocalityComponent.long_name !== 'Toronto') {
              cityName = sublocalityComponent.long_name;
              console.log('Using sublocality:', cityName);
            } else if (neighborhoodComponent) {
              cityName = neighborhoodComponent.long_name;
              console.log('Using neighborhood:', cityName);
            } else if (localityComponent) {
              cityName = localityComponent.long_name;
              console.log('Using locality:', cityName);
            } else if (adminLevel2Component) {
              cityName = adminLevel2Component.long_name;
              console.log('Using admin level 2:', cityName);
            }
          }

          console.log('Final city name:', cityName);

          if (cityName) {
            onLocationChange({ city: cityName });
          }

          setSuggestions([]);
          setShowSuggestions(false);
        }
      }
    );
  };

  const handleCityChange = (value: string) => {
    onLocationChange({ city: value });
  };

  // Show loading state while Google Maps is loading
  if (!isGoogleMapsLoaded || isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='font-roboto'>Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-center py-8'>
            <div className='text-center'>
              <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2'></div>
              <p className='font-inter text-sm text-gray-600'>Loading location services...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='font-roboto'>Location</CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Address with Autocomplete */}
        <div className='space-y-2 relative'>
          <Label htmlFor='location_address' className='font-roboto'>
            Job Address <span className='text-red-500'>*</span>
          </Label>
          <Input
            ref={addressInputRef}
            id='location_address'
            value={locationData.location_address}
            onChange={(e) => handleAddressChange(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder='Start typing your address...'
            className={`font-inter ${errors?.location_address ? 'border-red-500' : ''}`}
          />

          {/* Autocomplete Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className='absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto'>
              {suggestions.map((suggestion, index) => (
                <div
                  key={suggestion.place_id}
                  className='px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm font-inter border-b border-gray-100 last:border-b-0'
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className='font-medium'>{suggestion.structured_formatting.main_text}</div>
                  <div className='text-gray-500 text-xs'>{suggestion.structured_formatting.secondary_text}</div>
                </div>
              ))}
            </div>
          )}

          {errors?.location_address && <p className='font-inter text-sm text-red-600'>{errors.location_address}</p>}
          <p className='font-inter text-xs text-gray-500'>This address will be shared with selected contractors only</p>
        </div>

        {/* City */}
        <div className='space-y-2'>
          <Label htmlFor='city' className='font-roboto'>
            City & Region <span className='text-red-500'>*</span>
          </Label>
          <Input
            id='city'
            value={locationData.city}
            onChange={(e) => handleCityChange(e.target.value)}
            placeholder='City name'
            className={`font-inter ${errors?.city ? 'border-red-500' : ''}`}
          />
          {errors?.city && <p className='font-inter text-sm text-red-600'>{errors.city}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
