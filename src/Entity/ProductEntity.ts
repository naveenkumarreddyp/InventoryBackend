export interface ProductEntity {
  productId: string;
  productName: string;
  productCategory: string;
  productDescription: string;
  productPrice: number;
  productRemainingQty: number;
  createdAt: Date;
  updatedAt: Date | null;
  createdBy: string;
  updatedBy: string | null;
  isActive: number; // new field added for user status
}
