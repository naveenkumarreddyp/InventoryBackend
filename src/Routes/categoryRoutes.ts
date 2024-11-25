import { Router } from "express";

import Authentication from "../Middlewares/Authentication";
import MulterService from "../Utility/MulterConfig";
import { UploadFiletoDbService } from "../Services/DBUploadFileService";
import CategoryController, {
  ICategoryControllerInterface,
} from "../Controller/CategoryController";
import CategoryService from "../Services/CategoryService";

class CategoryRoutes {
  private router: Router;

  constructor(private CategoryController: ICategoryControllerInterface) {
    this.router = Router();

    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router
      .route("/getCategory")
      .get(
        Authentication,
        this.CategoryController.getCategory.bind(this.CategoryController)
      );
    this.router
      .route("/createCategory")
      .post(
        Authentication,
        this.CategoryController.createCategory.bind(this.CategoryController)
      );

      this.router
      .route("/editCategory")
      .post(this.CategoryController.updateCategory.bind(this.CategoryController));
    this.router
      .route("/deleteCategory/:categoryId")
      .get(this.CategoryController.deleteCategory.bind(this.CategoryController));
  }

  public getRoutes(): Router {
    return this.router;
  }
}

// Initialize dependencies outside the class

const categoryService = new CategoryService();
const categoryController = new CategoryController(categoryService);
export default new CategoryRoutes(categoryController).getRoutes();
