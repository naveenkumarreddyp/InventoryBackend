export interface CategoryEntity {
  categoryName: string;
  categoryId: string;
  categoryTags: string[];
  categoryDescription: string;
  createdAt: Date;
  updatedAt: Date | null;
  createdBy: string;
  updatedBy: string | null;
  isActive: number; // new field added for user status
}
