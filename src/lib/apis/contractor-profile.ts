export type ContractorProfileData = {
  contractor_name: string;
  main_service_areas: string;
  years_of_experience: number;
  contractor_type: 'individual' | 'business';
  team_size: number;
  company_website: string;
  additional_information: string;
  images: File[];
};

export type ContractorProfileImageResponse = {
  id: string;
  contractor_profile_id: string;
  image_url: string;
  storage_path: string;
  image_order: number;
  created_at: string;
};

export type ContractorProfileResponse = {
  id: string;
  user_id: string;
  contractor_name: string;
  main_service_areas: string;
  years_of_experience: number;
  contractor_type: 'individual' | 'business';
  team_size: number;
  company_website?: string;
  additional_information?: string;
  created_at: string;
  updated_at: string;
  images: ContractorProfileImageResponse[];
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export async function saveContractorProfile(data: ContractorProfileData, clerkJwt: string): Promise<ContractorProfileResponse> {
  const formData = new FormData();

  // Add all profile fields
  formData.append('contractor_name', data.contractor_name);
  formData.append('main_service_areas', data.main_service_areas);
  formData.append('years_of_experience', data.years_of_experience.toString());
  formData.append('contractor_type', data.contractor_type);
  formData.append('team_size', data.team_size.toString());
  formData.append('company_website', data.company_website);
  formData.append('additional_information', data.additional_information);

  // Add images if provided
  // The FormData object allows multiple values under the same key.
  if (data.images) {
    data.images.forEach((image) => {
      formData.append('images', image);
    });
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/contractors/profile`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${clerkJwt}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to save contractor profile');
  }

  return await response.json();
}

// -------------------------------------------------------------------------------------------------------------------------------------

export async function updateContractorProfile(data: Partial<ContractorProfileData>, clerkJwt: string): Promise<ContractorProfileResponse> {
  const formData = new FormData();

  // Add only provided fields
  if (data.contractor_name !== undefined) formData.append('contractor_name', data.contractor_name);
  if (data.main_service_areas !== undefined) formData.append('main_service_areas', data.main_service_areas);
  if (data.years_of_experience !== undefined) formData.append('years_of_experience', data.years_of_experience.toString());
  if (data.contractor_type !== undefined) formData.append('contractor_type', data.contractor_type);
  if (data.team_size !== undefined) formData.append('team_size', data.team_size.toString());
  if (data.company_website !== undefined) formData.append('company_website', data.company_website);
  if (data.additional_information !== undefined) formData.append('additional_information', data.additional_information);

  // Add images if provided
  if (data.images) {
    data.images.forEach((image) => {
      formData.append('images', image);
    });
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/contractors/profile`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${clerkJwt}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to update contractor profile');
  }

  return await response.json();
}

// -------------------------------------------------------------------------------------------------------------------------------------

export async function getContractorProfile(clerkJwt: string): Promise<ContractorProfileResponse | null> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/contractors/profile`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${clerkJwt}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to get contractor profile');
  }

  return await response.json();
}

// -------------------------------------------------------------------------------------------------------------------------------------

export async function checkContractorProfileCompletion(clerkJwt: string): Promise<boolean> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/contractors/profile/completion-status`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${clerkJwt}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to check profile completion');
  }

  return await response.json();
}
