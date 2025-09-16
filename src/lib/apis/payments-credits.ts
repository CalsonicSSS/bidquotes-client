export type ItemType = 'bid_payment' | 'credit_purchase';

export type CheckoutSessionResponse = {
  session_id: string;
  session_url: string;
};

export type PaymentTransactionResponse = {
  id: string;
  contractor_id: string;
  stripe_session_id: string;
  item_type: ItemType;
  amount_cad: number;
  status: string;
  job_id?: string;
  bid_id?: string;
  credits_purchased: number;
  created_at: string;
};

export type CreditTransactionResponse = {
  id: string;
  contractor_id: string;
  transaction_type: 'purchase' | 'usage' | 'refund';
  credits_change: number;
  credits_balance_after: number;
  description: string;
  created_at: string;
};

// ################################################################################################################################################

export async function createDraftBidPayment(draftBidId: string, clerkJwt: string): Promise<CheckoutSessionResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/payments/create-draft-bid-payment`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${clerkJwt}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      draft_bid_id: draftBidId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to create payment session');
  }

  return await response.json();
}

// ------------------------------------------------------------------------------------------------------------------------------

export async function getContractorCredits(clerkJwt: string): Promise<number> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/payments/credits`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${clerkJwt}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to get credits');
  }

  const data = await response.json();
  return data.credits; // get only the credits number
}

// ------------------------------------------------------------------------------------------------------------------------------

export async function createCreditPurchase(clerkJwt: string): Promise<CheckoutSessionResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/payments/create-credit-purchase`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${clerkJwt}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to create credit purchase session');
  }

  return await response.json();
}
