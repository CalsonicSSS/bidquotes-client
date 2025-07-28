'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Send, Plus, X } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createJob, saveJobDraft, getJobDetail, updateJob, type JobFormData } from '@/lib/apis/jobs';
import { SuccessModal } from '@/components/SuccessModal';

const JOB_TYPES = ['Plumbing', 'Painting', 'Landscaping', 'Roofing', 'Indoor', 'Backyard', 'Fencing & Decking', 'Design'] as const;

export default function PostJobPage() {
  const [errors, setErrors] = useState<Partial<Record<keyof JobFormData, string>>>({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const draftId = searchParams.get('draft');
  const isEditingDraft = !!draftId;

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successType, setSuccessType] = useState<'job' | 'draft'>('job');
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);

  // Address autocomplete refs and state
  const addressInputRef = useRef<HTMLInputElement>(null);
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const hasPushed = useRef(false);
  const blockPop = useRef(true);

  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    job_type: '',
    description: '',
    location_address: '',
    city: '',
    other_requirements: '',
    images: [],
  });

  // Load Google Maps script manually
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

  // Fetch draft data if editing
  const { data: draftData, isLoading: isDraftLoading } = useQuery({
    queryKey: ['job-detail', draftId],
    queryFn: async () => {
      const token = await getToken();
      if (!token || !draftId) throw new Error('No token or draft ID available');
      return getJobDetail(draftId, token);
    },
    enabled: !!draftId && !!getToken,
  });

  // Pre-populate form when draft data loads
  useEffect(() => {
    if (draftData && isEditingDraft) {
      setFormData({
        title: draftData.title || '',
        job_type: draftData.job_type || '',
        description: draftData.description || '',
        location_address: draftData.location_address || '',
        city: draftData.city || '',
        other_requirements: draftData.other_requirements || '',
        images: [],
      });
    }
  }, [draftData, isEditingDraft]);

  // Browser navigation protection
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    if (!hasPushed.current) {
      window.history.pushState(null, '', window.location.href);
      hasPushed.current = true;
    }

    const handlePopState = (event: PopStateEvent) => {
      if (blockPop.current && hasUnsavedChanges) {
        const confirmed = window.confirm('You have unsaved changes. Are you sure you want to leave?');
        if (confirmed) {
          blockPop.current = false;
          router.back();
        } else {
          window.history.pushState(null, '', window.location.href);
        }
      } else {
        router.back();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [hasUnsavedChanges, router]);

  const handleFormInputChange = (field: keyof JobFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    // Handle address autocomplete
    if (field === 'location_address' && value.length > 2 && autocompleteServiceRef.current) {
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
    } else if (field === 'location_address' && value.length <= 2) {
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

          setFormData((prev) => ({
            ...prev,
            location_address: place.formatted_address || suggestion.description,
          }));

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
            setFormData((prev) => ({
              ...prev,
              city: cityName,
            }));
          }

          setHasUnsavedChanges(true);
          setSuggestions([]);
          setShowSuggestions(false);
        }
      }
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (formData.images.length + files.length > 6) {
      alert('Maximum 6 images allowed per job');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
    setHasUnsavedChanges(true);
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setHasUnsavedChanges(true);
  };

  const validateRequiredFields = (): boolean => {
    const newErrors: Partial<Record<keyof JobFormData, string>> = {};

    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!formData.job_type) newErrors.job_type = 'Please select a job type';
    if (!formData.description.trim()) newErrors.description = 'Job description is required';
    if (!formData.location_address.trim()) newErrors.location_address = 'Job address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createJobMutation = useMutation({
    mutationFn: async (jobData: JobFormData) => {
      const token = await getToken();
      if (!token) throw new Error('Unable to get authentication token');

      if (isEditingDraft && draftId) {
        return updateJob(draftId, jobData, token);
      } else {
        return createJob(jobData, token);
      }
    },
    onSuccess: () => {
      setFormData({
        title: '',
        job_type: '',
        description: '',
        location_address: '',
        city: '',
        other_requirements: '',
        images: [],
      });
      queryClient.invalidateQueries({ queryKey: ['buyer-jobs'] });
      setHasUnsavedChanges(false);
      setSuccessType('job');
      setShowSuccessModal(true);
    },
    onError: (error) => {
      console.error('Error posting job:', error);
      alert(error instanceof Error ? error.message : 'Failed to post job. Please try again.');
    },
  });

  const saveDraftMutation = useMutation({
    mutationFn: async (draftData: JobFormData) => {
      const token = await getToken();
      if (!token) throw new Error('Unable to get authentication token');

      if (isEditingDraft && draftId) {
        return updateJob(draftId, draftData, token);
      } else {
        return saveJobDraft(draftData, token);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buyer-jobs'] });
      setHasUnsavedChanges(false);
      setSuccessType('draft');
      setShowSuccessModal(true);
    },
    onError: (error) => {
      console.error('Error saving draft:', error);
      alert(error instanceof Error ? error.message : 'Failed to save draft. Please try again.');
    },
  });

  const handleSaveDraft = async () => {
    saveDraftMutation.mutate(formData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRequiredFields()) return;
    createJobMutation.mutate(formData);
  };

  const handleBackNavigation = () => {
    if (hasUnsavedChanges) {
      const confirm = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirm) return;
    }
    router.push('/buyer-dashboard');
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.push('/buyer-dashboard');
  };

  // Show loading while fetching draft or loading Google Maps
  if (isEditingDraft && isDraftLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='font-inter text-gray-600'>Loading draft...</p>
        </div>
      </div>
    );
  }

  if (!isGoogleMapsLoaded) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='font-inter text-gray-600'>Loading Google Maps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <SuccessModal
        isOpen={showSuccessModal}
        title={successType === 'job' ? 'Job Posted Successfully!' : 'Draft Saved Successfully!'}
        message={
          successType === 'job'
            ? 'Your job posting is now live and contractors can start submitting bids.'
            : 'Your job draft has been saved. You can continue editing it anytime from your dashboard.'
        }
        buttonText={successType === 'job' ? 'View Dashboard' : 'Back to Dashboard'}
        onClose={handleSuccessModalClose}
      />

      {/* Mobile Header */}
      <div className='lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-10'>
        <button onClick={handleBackNavigation} className='p-2 rounded-md hover:bg-gray-100'>
          <ArrowLeft className='h-5 w-5' />
        </button>
        <h1 className='font-roboto font-semibold text-gray-900'>{isEditingDraft ? 'Edit Draft' : 'Post New Job'}</h1>
        <div className='w-9' />
      </div>

      <div className='container mx-auto px-4 py-6 max-w-4xl'>
        {/* Desktop Header */}
        <div className='hidden lg:block mb-8'>
          <div className='flex justify-between items-center'>
            <h1 className='font-roboto text-3xl font-bold text-gray-900'>{isEditingDraft ? 'Edit Draft' : 'Post New Job'}</h1>
            <Button onClick={handleBackNavigation}>Back to Dashboard</Button>
          </div>
          <p className='font-inter text-gray-600 mt-4'>
            {isEditingDraft ? 'Continue editing your job draft below.' : 'Fill out the details below to get competitive bids from qualified contractors.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Basic Job Information */}
          <Card>
            <CardHeader>
              <CardTitle className='font-roboto'>Job Details</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* Job Title */}
              <div className='space-y-2'>
                <Label htmlFor='title' className='font-roboto'>
                  Job Title <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='title'
                  value={formData.title}
                  onChange={(e) => handleFormInputChange('title', e.target.value)}
                  placeholder='e.g., Kitchen Plumbing Repair Needed'
                  className={`font-inter ${errors.title ? 'border-red-500' : ''}`}
                />
                {errors.title && <p className='font-inter text-sm text-red-600'>{errors.title}</p>}
              </div>

              {/* Job Type */}
              <div className='space-y-2'>
                <Label htmlFor='job_type' className='font-roboto'>
                  Job Type <span className='text-red-500'>*</span>
                </Label>
                <select
                  id='job_type'
                  value={formData.job_type}
                  onChange={(e) => handleFormInputChange('job_type', e.target.value)}
                  className={`w-full h-9 px-3 py-1 text-sm border rounded-md font-inter ${errors.job_type ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value=''>Select a job type...</option>
                  {JOB_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.job_type && <p className='font-inter text-sm text-red-600'>{errors.job_type}</p>}
              </div>

              {/* Job Description */}
              <div className='space-y-2'>
                <Label htmlFor='description' className='font-roboto'>
                  Job Description <span className='text-red-500'>*</span>
                </Label>
                <textarea
                  id='description'
                  value={formData.description}
                  onChange={(e) => handleFormInputChange('description', e.target.value)}
                  placeholder='Describe your project in detail. Include what needs to be done, current issues, timeline preferences, and any specific requirements...'
                  className={`w-full min-h-32 px-3 py-2 text-sm border rounded-md font-inter resize-y ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.description && <p className='font-inter text-sm text-red-600'>{errors.description}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
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
                  value={formData.location_address}
                  onChange={(e) => handleFormInputChange('location_address', e.target.value)}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder='Start typing your address...'
                  className={`font-inter ${errors.location_address ? 'border-red-500' : ''}`}
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

                {errors.location_address && <p className='font-inter text-sm text-red-600'>{errors.location_address}</p>}
                <p className='font-inter text-xs text-gray-500'>This address will be shared with selected contractors only</p>
              </div>

              {/* City */}
              <div className='space-y-2'>
                <Label htmlFor='city' className='font-roboto'>
                  City <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='city'
                  value={formData.city}
                  onChange={(e) => handleFormInputChange('city', e.target.value)}
                  placeholder='City name'
                  className={`font-inter ${errors.city ? 'border-red-500' : ''}`}
                />
                {errors.city && <p className='font-inter text-sm text-red-600'>{errors.city}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle className='font-roboto'>Additional Details</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* Other Requirements */}
              <div className='space-y-2'>
                <Label htmlFor='other_requirements' className='font-roboto'>
                  Other Requirements
                  <span className='font-inter text-sm text-gray-500 ml-2'>(Optional)</span>
                </Label>
                <textarea
                  id='other_requirements'
                  value={formData.other_requirements}
                  onChange={(e) => handleFormInputChange('other_requirements', e.target.value)}
                  placeholder='Any special requirements, preferred timing, budget considerations, or other important details...'
                  className='w-full min-h-24 px-3 py-2 text-sm border border-gray-300 rounded-md font-inter resize-y'
                />
              </div>

              {/* Image Upload */}
              <div className='space-y-3'>
                <Label className='font-roboto'>
                  Job Photos
                  <span className='font-inter text-sm text-gray-500 ml-2'>(Optional, max 6 images)</span>
                </Label>

                <div className='flex items-center gap-4'>
                  <input type='file' accept='image/*' multiple onChange={handleImageUpload} className='hidden' id='image-upload' disabled={formData.images.length >= 6} />
                  <label
                    htmlFor='image-upload'
                    className={`inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-inter cursor-pointer hover:bg-gray-50 ${
                      formData.images.length >= 6 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <Plus className='h-4 w-4' />
                    Add Photos
                  </label>
                  <p className='font-inter text-xs text-gray-500'>{formData.images.length}/6 images</p>
                </div>

                {formData.images.length > 0 && (
                  <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                    {formData.images.map((file, index) => (
                      <div key={index} className='relative group'>
                        <img src={URL.createObjectURL(file)} alt={`Upload ${index + 1}`} className='w-full h-24 object-cover rounded-lg border' />
                        <button
                          type='button'
                          onClick={() => removeImage(index)}
                          className='absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity'
                        >
                          <X className='h-3 w-3' />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className='flex flex-col sm:flex-row gap-3 pt-6'>
            <Button
              type='button'
              variant='outline'
              onClick={handleSaveDraft}
              disabled={saveDraftMutation.isPending || createJobMutation.isPending}
              className='font-roboto flex items-center gap-2'
            >
              <Save className='h-4 w-4' />
              {saveDraftMutation.isPending ? 'Saving...' : isEditingDraft ? 'Save Changes' : 'Save as Draft'}
            </Button>

            <Button
              type='submit'
              disabled={createJobMutation.isPending || saveDraftMutation.isPending}
              className='font-roboto flex items-center gap-2 bg-blue-600 hover:bg-blue-700'
            >
              <Send className='h-4 w-4' />
              {createJobMutation.isPending ? 'Posting Job...' : 'Post Job'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
