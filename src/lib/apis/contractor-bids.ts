export type BidCreate = {
  job_id: string;
  title: string;
  price_min: string;
  price_max: string;
  timeline_estimate: string;
};

export type BidResponse = {
  id: string;
  job_id: string;
  contractor_id: string;
  title: string;
  price_min: string;
  price_max: string;
  timeline_estimate: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export type BidDetailResponse = {
  id: string;
  job_id: string;
  contractor_id: string;
  title: string;
  price_min: string;
  price_max: string;
  timeline_estimate: string;
  status: string;
  created_at: string;
  updated_at: string;
  // Include job info for context
  job_title: string;
  job_type: string;
  job_budget: string;
  job_city: string;
};

export type ContractorBidCardResponse = {
  id: string;
  job_id: string;
  title: string;
  status: string;
  created_at: string;
  updated_at: string;
  // Job context info
  job_title: string;
  job_type: string;
  job_city: string;
};

// --------------------------------------------------------

export type BidCreationStatus = 'submitted' | 'draft_payment_required';

export type BidCreationResponse = {
  status: BidCreationStatus;
  bid: BidResponse;
  payment_required: boolean;
  message: string;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export async function createBid(data: BidCreate, clerkJwt: string): Promise<BidCreationResponse> {
  const formData = new FormData();

  // Add all bid fields
  formData.append('job_id', data.job_id);
  formData.append('title', data.title);
  formData.append('price_min', data.price_min);
  formData.append('price_max', data.price_max);
  formData.append('timeline_estimate', data.timeline_estimate);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/bids`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${clerkJwt}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to create bid');
  }

  return await response.json();
}

// -------------------------------------------------------------------------------------------------------------------------------------

export async function updateBid(bidId: string, data: Partial<BidCreate>, clerkJwt: string, isDraftSubmit: boolean): Promise<BidCreationResponse> {
  const formData = new FormData();

  // Add only provided fields
  if (data.title !== undefined) formData.append('title', data.title);
  if (data.price_min !== undefined) formData.append('price_min', data.price_min);
  if (data.price_max !== undefined) formData.append('price_max', data.price_max);
  if (data.timeline_estimate !== undefined) formData.append('timeline_estimate', data.timeline_estimate);
  if (data.job_id !== undefined) formData.append('job_id', data.job_id);

  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/bids/${bidId}`;
  const url = isDraftSubmit ? `${baseUrl}?is-draft-submit=true` : baseUrl;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${clerkJwt}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to update bid');
  }

  return await response.json();
}

// -------------------------------------------------------------------------------------------------------------------------------------

export async function saveBidDraft(data: BidCreate, clerkJwt: string): Promise<BidResponse> {
  const formData = new FormData();

  // Add all bid fields (all optional for drafts)
  formData.append('job_id', data.job_id);
  formData.append('title', data.title);
  formData.append('price_min', data.price_min);
  formData.append('price_max', data.price_max);
  formData.append('timeline_estimate', data.timeline_estimate);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/bids/drafts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${clerkJwt}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to save bid draft');
  }

  return await response.json();
}

// -------------------------------------------------------------------------------------------------------------------------------------

export async function deleteBid(bidId: string, clerkJwt: string): Promise<void> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/bids/${bidId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${clerkJwt}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to delete bid');
  }
}

// -------------------------------------------------------------------------------------------------------------------------------------

export async function getBidDetail(bidId: string, clerkJwt: string): Promise<BidDetailResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/bids/${bidId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${clerkJwt}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to get bid details');
  }

  return await response.json();
}

// -------------------------------------------------------------------------------------------------------------------------------------

export async function getContractorBidCards(clerkJwt: string, status?: string): Promise<ContractorBidCardResponse[]> {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/bids/contractor-bids`);
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
    throw new Error(errorData.detail || 'Failed to get contractor bids');
  }

  return await response.json();
}
