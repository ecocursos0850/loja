export class DirectBillingModel {
  discount_cents: string;
  months: string;
  invoice_id: string;
  infoCard: InfoCardModel;
}

export class InfoCardModel {
  number: string;
  verification_value: string;
  first_name: string;
  last_name: string;
  month: string;
  year: string;
}
