/** Format a number (or Decimal-like string) as Ghanaian Cedi currency, e.g. GHS 45.00 */
export function formatGHS(amount: number | string): string {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 2,
  }).format(value);
}

/** Generate a human-friendly order number, e.g. DSP-20260727-4821 */
export function generateOrderNumber(): string {
  const now = new Date();
  const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(
    2,
    "0",
  )}${String(now.getDate()).padStart(2, "0")}`;
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `DSP-${datePart}-${randomPart}`;
}

/** Generate a unique payment reference for Paystack. */
export function generatePaymentReference(): string {
  return `dsp_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}
