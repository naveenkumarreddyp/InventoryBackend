import Repository from "../Repository/BaseRepository";
import "dotenv-flow/config";
import UniqueIDGenerator from "../Utility/RandomUniqueIdGenerator";
import { CategoryDTO } from "../DTO/CategoryDTO";
import { CategoryEntity } from "../Entity/CategoryEntity";

export interface ICategoryServiceInterface {
  addCategory(data: CategoryDTO): Promise<any>;
  fetchCategory(): Promise<any>;
  editCategory(data: CategoryDTO): Promise<any>;
  removeCategory(categoryId: string): Promise<any>;
}

class CategoryService {
  private uniqueId: UniqueIDGenerator;
  constructor() {
    // Constructor code goes here
    // Initialize any required services or libraries here and configure them
    // Example:
    // this.categoryService = new categoryService(new categoryRepository());
    // this.authService = new AuthService();
    this.uniqueId = new UniqueIDGenerator();
  }

  public async addCategory(data: CategoryDTO): Promise<any> {
    let categoryRepository = new Repository(process.env.Category_INFO!);

    // Generate a unique ID for the category
    let uid = this.uniqueId.generate();

    let Category: CategoryEntity = {
      categoryId: uid,
      categoryName: data?.categoryName,
      categoryDescription: data?.categoryDescription,
      createdAt: new Date(),
      updatedAt: null,
      createdBy: "Admin",
      updatedBy: null,
      categoryTags: data?.categoryTags,
      isActive: 1,
    };
    await categoryRepository.insert(Category);

    return Category;
  }

  public async fetchCategory(): Promise<any> {
    // Example response, modify as needed
    let categoryRepository = new Repository(process.env.Category_INFO!);
    let result = await categoryRepository.findMany({ isActive: 1 });

    return result;
  }

  public async editCategory(data: any): Promise<any> {
    let categoryRepository = new Repository(process.env.Category_INFO!);

    let Category = {
      categoryName: data?.categoryName,
      updatedAt: new Date(),
      updatedBy: "admin",
      categoryDescription: data?.categoryDescription,
    };

    await categoryRepository.update({ categoryId: data?.categoryId }, Category);

    return { message: "Category updated successfully" };
  }

  public async removeCategory(categoryid: string): Promise<any> {
    let categoryRepository = new Repository(process.env.Category_INFO!);

    await categoryRepository.update(
      { categoryId: categoryid },
      { isActive: 0 }
    );

    return { message: "Category deleted successfully" };
  }
}

export default CategoryService;
