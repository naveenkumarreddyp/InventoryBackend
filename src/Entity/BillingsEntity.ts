export interface BillingEntity {
  billingId: string;
  customerName: string;
  customerMobile: string;
  customerEmail: string;
  paidVia: string;
  productsList: BillingProductEntity[];
  createdAt: Date;
  updatedAt: Date | null;
  createdBy: string;
  updatedBy: string | null;
  isActive: number;
  paymentStatusId: number;
  paymentStatus: string;
  totalItems: number;
  finalPrice: number;
}

interface BillingProductEntity {
  productId: string;
  productName: string;
  productPrice: number;
  productRemainingQty: number;
  billingQty: number;
  totalPrice: number;
}
