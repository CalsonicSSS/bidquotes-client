export type ContractorJobCardResponse = {
  id: string;
  title: string;
  job_type: string;
  city: string;
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

export type PreBidJobDetailResponse = {
  id: string;
  buyer_id: string;
  title: string;
  job_type: string;
  job_budget: string;
  city: string;
  created_at: string;
  images: JobImageResponse[];
  bid_count: number;
};

export type ContractorFullJobDetailResponse = {
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

export async function getPreBidJobDetail(jobId: string, clerkJwt: string): Promise<PreBidJobDetailResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/contractors/pre-bid-job/${jobId}`, {
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

// -------------------------------------------------------------------------------------------------------------------------------------

// get full job details for contractor (after bid is placed)
export async function getContractorFullJobDetail(jobId: string, clerkJwt: string): Promise<ContractorFullJobDetailResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/contractors/full-job/${jobId}`, {
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
