export type ContractorJobCardResponse = {
  id: string;
  title: string;
  job_type: string;
  status: string;
  city: string; // Add city field for contractors
  bid_count: number;
  created_at: string;
  thumbnail_image?: string;
};

export type JobImageResponse = {
  id: string;
  job_id: string;
  image_url: string;
  storage_path: string;
  image_order: number;
  created_at: string;
};

export type ContractorJobDetailResponse = {
  id: string;
  buyer_id: string;
  title: string;
  job_type: string;
  job_budget: string;
  description: string;
  location_address: string;
  city: string;
  other_requirements?: string;
  status: string;
  selection_count: number;
  max_selections: number;
  created_at: string;
  updated_at: string;
  images: JobImageResponse[];
  bid_count: number;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export async function getAvailableJobs(clerkJwt: string, cityFilter?: string, jobTypeFilter?: string): Promise<ContractorJobCardResponse[]> {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/contractors/available-jobs`);

  if (cityFilter) {
    url.searchParams.append('city', cityFilter);
  }
  if (jobTypeFilter) {
    url.searchParams.append('job_type', jobTypeFilter);
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${clerkJwt}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to get available jobs');
  }

  return await response.json();
}

// -------------------------------------------------------------------------------------------------------------------------------------

export async function getJobCities(clerkJwt: string): Promise<string[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/contractors/job-cities`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${clerkJwt}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to get job cities');
  }

  return await response.json();
}

// -------------------------------------------------------------------------------------------------------------------------------------

export async function getContractorJobDetail(jobId: string, clerkJwt: string): Promise<ContractorJobDetailResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/contractors/jobs/${jobId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${clerkJwt}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to get job details');
  }

  return await response.json();
}
