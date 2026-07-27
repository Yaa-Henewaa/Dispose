/**
 * Server-side Paystack helpers.
 * IMPORTANT: PAYSTACK_SECRET_KEY must never be exposed to the client.
 * Only import this file from server components, server actions, or API routes.
 */

const PAYSTACK_BASE_URL = "https://api.paystack.co";

function getSecretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) {
    throw new Error("PAYSTACK_SECRET_KEY environment variable is not set");
  }
  return key;
}

export interface InitializeTransactionParams {
  email: string;
  amountInGHS: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}

export interface InitializeTransactionResult {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
}

/** Initialize a Paystack transaction. Amount is converted from GHS to pesewas (subunit). */
export async function initializeTransaction(
  params: InitializeTransactionParams,
): Promise<InitializeTransactionResult> {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      amount: Math.round(params.amountInGHS * 100),
      currency: "GHS",
      reference: params.reference,
      callback_url: params.callbackUrl,
      metadata: params.metadata ?? {},
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.status) {
    throw new Error(
      data.message || "Failed to initialize Paystack transaction",
    );
  }

  return {
    authorizationUrl: data.data.authorization_url,
    accessCode: data.data.access_code,
    reference: data.data.reference,
  };
}

export interface VerifyTransactionResult {
  success: boolean;
  status: string;
  reference: string;
  amountInGHS: number;
  paidAt: string | null;
}

/** Verify a Paystack transaction by reference. */
export async function verifyTransaction(
  reference: string,
): Promise<VerifyTransactionResult> {
  const response = await fetch(
    `${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${getSecretKey()}`,
      },
      cache: "no-store",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to verify Paystack transaction");
  }

  return {
    success: data.status === true && data.data?.status === "success",
    status: data.data?.status ?? "unknown",
    reference: data.data?.reference ?? reference,
    amountInGHS: (data.data?.amount ?? 0) / 100,
    paidAt: data.data?.paid_at ?? null,
  };
}

/** Verify a webhook signature sent by Paystack (x-paystack-signature header). */
export async function verifyWebhookSignature(
  rawBody: string,
  signature: string | null,
): Promise<boolean> {
  if (!signature) return false;
  const crypto = await import("node:crypto");
  const hash = crypto
    .createHmac("sha512", getSecretKey())
    .update(rawBody)
    .digest("hex");
  return hash === signature;
}
