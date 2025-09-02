export type BuyerBidDetailResponse = {
  id: string;
  job_id: string;
  contractor_id: string;
  title: string;
  price_min: string;
  price_max: string;
  timeline_estimate: string;
  work_description: string;
  additional_notes?: string;
  status: string;
  is_selected: boolean;
  created_at: string;
  updated_at: string;
  // Job context info
  job_title: string;
  job_type: string;
  job_budget: string;
  job_city: string;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export async function getBidDetailForSpecificJob(jobId: string, bidId: string, clerkJwt: string): Promise<BuyerBidDetailResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/jobs/${jobId}/bids/${bidId}`, {
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

// // -----------------------------------------------------------------------------------------------------------------------------

// export async function selectBid(jobId: string, bidId: string, clerkJwt: string): Promise<boolean> {
//   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/jobs/${jobId}/bids/${bidId}/select`, {
//     method: 'POST',
//     headers: {
//       Authorization: `Bearer ${clerkJwt}`,
//     },
//   });

//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.detail || 'Failed to select bid');
//   }

//   return await response.json();
// }

// // ------------------------------------------------------------------------------------------------------------------------------

// export async function cancelBidSelection(jobId: string, clerkJwt: string): Promise<boolean> {
//   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/jobs/${jobId}/selection`, {
//     method: 'DELETE',
//     headers: {
//       Authorization: `Bearer ${clerkJwt}`,
//     },
//   });

//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.detail || 'Failed to cancel bid selection');
//   }

//   return await response.json();
// }
