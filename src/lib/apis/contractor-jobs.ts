// Create src/lib/apis/contractor-jobs.ts

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
