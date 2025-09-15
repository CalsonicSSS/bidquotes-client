export type ItemType = 'bid_payment' | 'credit_purchase';

export type CreateCheckoutRequest = {
  item_type: ItemType; // 'bid_payment' or 'credit_purchase'
  job_id?: string; // Only required for bid payments
  bid_id?: string; // Only required for bid payments
};

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

// API Functions (we'll implement these in later steps)
export async function createCheckoutSession(data: CreateCheckoutRequest, clerkJwt: string): Promise<CheckoutSessionResponse> {
  // Implementation coming in next steps
  throw new Error('Not implemented yet');
}

export async function getContractorCredits(clerkJwt: string): Promise<number> {
  // Implementation coming in next steps
  throw new Error('Not implemented yet');
}

export async function getPaymentHistory(clerkJwt: string): Promise<PaymentTransactionResponse[]> {
  // Implementation coming in next steps
  throw new Error('Not implemented yet');
}
