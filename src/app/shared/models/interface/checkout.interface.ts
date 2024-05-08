export interface CheckoutType {
  discount_cents: string;
  months: 2;
  invoice_id: string;
  infoCard: InforCardType;
}

interface InforCardType {
  number: string;
  verification_value: number;
  first_name: string;
  last_name: string;
  month: number;
  year: number;
}
