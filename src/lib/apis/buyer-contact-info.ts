export type BuyerContactInfoData = {
  contact_email: string;
  phone_number: string;
};

type BuyerContactInfoResponse = {
  id: string;
  user_id: string;
  contact_email: string;
  phone_number: string;
  created_at: string;
  updated_at: string;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export async function saveBuyerContactInfo(data: BuyerContactInfoData, clerkJwt: string): Promise<BuyerContactInfoResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/buyer-contact-info`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${clerkJwt}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to save contact information');
  }

  return await response.json();
}

// -------------------------------------------------------------------------------------------------------------------------------------

export async function getBuyerContactInfo(clerkJwt: string): Promise<BuyerContactInfoResponse | null> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/buyer-contact-info`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${clerkJwt}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to get contact information');
  }

  return await response.json();
}

export async function getBuyerContactInfoByBuyerId(buyerId: string): Promise<BuyerContactInfoResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/buyer-contact-info/${buyerId}`, {
    method: 'GET',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to get contact information');
  }

  return await response.json();
}
