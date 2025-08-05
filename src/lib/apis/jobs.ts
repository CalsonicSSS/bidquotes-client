// Job API Types
export type JobFormData = {
  title: string;
  job_type: string;
  job_budget: string;
  description: string;
  location_address: string;
  city: string;
  other_requirements: string;
  images: File[];
};

export type JobResponse = {
  id: string;
  buyer_id: string;
  title: string;
  job_type: string;
  job_budget: string;
  description: string;
  location_address: string;
  city: string;
  other_requirements?: string;
  status: 'draft' | 'open' | 'full_bid' | 'waiting_confirmation' | 'confirmed';
  selection_count: number;
  max_selections: number;
  created_at: string;
  updated_at: string;
};

export type JobCardResponse = {
  id: string;
  title: string;
  job_type: string;
  status: string;
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

export type JobDetailResponse = {
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

export async function createJob(data: JobFormData, clerkJwt: string): Promise<JobResponse> {
  const formData = new FormData();

  // use append to build the formData class object
  formData.append('title', data.title);
  formData.append('job_type', data.job_type);
  formData.append('job_budget', data.job_budget);
  formData.append('description', data.description);
  formData.append('location_address', data.location_address);
  formData.append('city', data.city);
  formData.append('other_requirements', data.other_requirements);

  // Add images if provided
  if (data.images) {
    data.images.forEach((image) => {
      formData.append('images', image);
    });
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/jobs`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${clerkJwt}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to create job');
  }

  return await response.json();
}

// -------------------------------------------------------------------------------------------------------------------------------------

export async function saveJobDraft(data: JobFormData, clerkJwt: string): Promise<JobResponse> {
  const formData = new FormData();

  // Add text fields (all optional for drafts)
  formData.append('title', data.title);
  formData.append('job_type', data.job_type);
  formData.append('job_budget', data.job_budget);
  formData.append('description', data.description);
  formData.append('location_address', data.location_address);
  formData.append('city', data.city);
  formData.append('other_requirements', data.other_requirements);

  // Add images if provided
  if (data.images) {
    data.images.forEach((image) => {
      formData.append('images', image);
    });
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/jobs/drafts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${clerkJwt}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to save draft');
  }

  return await response.json();
}

// -------------------------------------------------------------------------------------------------------------------------------------

export async function updateJob(jobId: string, data: Partial<JobFormData>, clerkJwt: string, isDraftPost: boolean): Promise<JobResponse> {
  const formData = new FormData();

  // Add only provided fields
  if (data.title !== undefined) formData.append('title', data.title);
  if (data.job_type !== undefined) formData.append('job_type', data.job_type);
  if (data.job_budget !== undefined) formData.append('job_budget', data.job_budget);
  if (data.description !== undefined) formData.append('description', data.description);
  if (data.location_address !== undefined) formData.append('location_address', data.location_address);
  if (data.city !== undefined) formData.append('city', data.city);
  if (data.other_requirements !== undefined) formData.append('other_requirements', data.other_requirements);

  // Add images if provided
  if (data.images) {
    data.images.forEach((image) => {
      formData.append('images', image);
    });
  }

  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/jobs/${jobId}`;
  const url = isDraftPost ? `${baseUrl}?is-draft-post=true` : baseUrl;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${clerkJwt}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to update job');
  }

  return await response.json();
}

// -------------------------------------------------------------------------------------------------------------------------------------

export async function deleteJob(jobId: string, clerkJwt: string): Promise<void> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/jobs/${jobId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${clerkJwt}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to delete job');
  }
}

// -------------------------------------------------------------------------------------------------------------------------------------

export async function getBuyerJobs(clerkJwt: string, status?: string): Promise<JobCardResponse[]> {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/jobs`);
  if (status) {
    url.searchParams.append('status', status);
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${clerkJwt}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to get jobs');
  }

  return await response.json();
}

// -------------------------------------------------------------------------------------------------------------------------------------

export async function getJobDrafts(clerkJwt: string): Promise<JobCardResponse[]> {
  return await getBuyerJobs(clerkJwt, 'draft');
}

// -------------------------------------------------------------------------------------------------------------------------------------

export async function getJobDetail(jobId: string, clerkJwt: string): Promise<JobDetailResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/jobs/${jobId}`, {
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
