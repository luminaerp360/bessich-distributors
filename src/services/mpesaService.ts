import { apiRequest } from './apiClient';

export interface StkPushPayload {
  phoneNumber: string;
  amount: number;
  accountReference: string;
  transactionDesc: string;
}

export interface StkPushResponse {
  MerchantRequestID?: string;
  CheckoutRequestID?: string;
  ResponseCode?: string;
  ResponseDescription?: string;
  CustomerMessage?: string;
  [key: string]: unknown;
}

export interface MpesaTransaction {
  OriginatorConversationID?: string;
  ConversationID?: string;
  ResponseCode?: string;
  ResponseDescription?: string;
  [key: string]: unknown;
}

export interface FindTransactionResponse {
  success?: boolean;
  message?: string;
  transaction?: MpesaTransaction;
  [key: string]: unknown;
}

/**
 * Normalizes a Kenyan phone number to the 254XXXXXXXXX format required by M-PESA.
 */
export function normalizeMpesaPhone(input: string): string {
  const digits = (input || '').replace(/\D/g, '');
  if (digits.startsWith('254')) return digits;
  if (digits.startsWith('0')) return `254${digits.slice(1)}`;
  if (digits.length === 9) return `254${digits}`;
  return digits;
}

export async function initiateStkPush(
  payload: StkPushPayload,
  token?: string | null
): Promise<StkPushResponse> {
  return apiRequest<StkPushResponse>('/mpesa/stk-push', {
    method: 'POST',
    body: {
      ...payload,
      phoneNumber: normalizeMpesaPhone(payload.phoneNumber),
    },
    token,
  });
}

export async function checkMpesaTransaction(
  transactionId: string,
  token?: string | null
): Promise<MpesaTransaction> {
  return apiRequest<MpesaTransaction>(`/mpesa/check/${encodeURIComponent(transactionId)}`, {
    token,
  });
}

export async function findMpesaTransaction(
  phoneNumber: string,
  amount: number,
  token?: string | null
): Promise<FindTransactionResponse> {
  const phone = normalizeMpesaPhone(phoneNumber);
  return apiRequest<FindTransactionResponse>(
    `/mpesa/find-transaction?phoneNumber=${encodeURIComponent(phone)}&amount=${encodeURIComponent(
      String(amount)
    )}`,
    { token }
  );
}

/**
 * Polls M-PESA for a completed transaction matching the phone number and amount.
 * Resolves true when a transaction is found, false when the timeout elapses.
 */
export async function pollMpesaPayment(
  phoneNumber: string,
  amount: number,
  options: { attempts?: number; intervalMs?: number; token?: string | null; onAttempt?: (attempt: number) => void } = {}
): Promise<boolean> {
  const { attempts = 20, intervalMs = 3000, token, onAttempt } = options;
  for (let i = 0; i < attempts; i += 1) {
    if (onAttempt) onAttempt(i + 1);
    try {
      const result = await findMpesaTransaction(phoneNumber, amount, token);
      if (result.success && result.transaction) {
        return true;
      }
    } catch {
      // transient error — keep polling
    }
    if (i < attempts - 1) {
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
  }
  return false;
}