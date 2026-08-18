export interface DemoPaymentRecord {
  id: string;
  reservationId: string;
  idempotencyKey: string;
  amount: number;
  currency: "INR";
  status: "APPROVED" | "DECLINED";
  provider: "DEMO_PAYMENT";
  providerReference: string;
  sourceMode: "DEMO";
  isSimulated: true;
  createdAt: string;
  disclaimer: string;
}
