import Repository from "../Repository/BaseRepository";
import "dotenv-flow/config";
import UniqueIDGenerator from "../Utility/RandomUniqueIdGenerator";
import { ProductDTO } from "../DTO/ProductDTO";
import { ProductEntity } from "../Entity/ProductEntity";

class ProductService {
  private uniqueId: UniqueIDGenerator;
  constructor() {
    // Constructor code goes here
    // Initialize any required services or libraries here and configure them
    // Example:
    // this.userService = new UserService(new UserRepository());
    // this.authService = new AuthService();
    this.uniqueId = new UniqueIDGenerator();
  }

  public async addProduct(data: ProductDTO): Promise<any> {
    let productRepository = new Repository(process.env.PRODUCT_INFO!);

    // Generate a unique ID for the user
    let uid = this.uniqueId.generate();

    let product: ProductEntity = {
      productId: uid,
      productName: data?.productName,
      createdAt: new Date(),
      updatedAt: null,
      createdBy: "Admin",
      updatedBy: null,
      productCategory: data?.productCategory,
      productDescription: data?.productDescription,
      productPrice: data?.productPrice,
      productRemainingQty: data?.productRemainingQty,
      isActive: 1,
    };
    console.log(data);
    await productRepository.insert(product);

    return product;
  }

  public async fetchProduct(): Promise<any> {
    // Example response, modify as needed
    let productRepository = new Repository(process.env.PRODUCT_INFO!);
    let result = await productRepository.findMany({ isActive: 1 });

    return result;
  }


  public async editProduct(data: any): Promise<any> {
    let productRepository = new Repository(process.env.PRODUCT_INFO!);

    let product = {
      productName: data?.productName,
      updatedAt: new Date(),
      updatedBy: "admin",
      productCategory: data?.productCategory,
      productDescription: data?.productDescription,
      productPrice: data?.productPrice,
      productRemainingQty: data?.productRemainingQty,
    };

    await productRepository.update({ productId: data.productId }, product);

    return { message: "Product updated successfully" };
  }

  public async removeProduct(productid: string): Promise<any> {
    let productRepository = new Repository(process.env.PRODUCT_INFO!);

    await productRepository.update({ productId: productid }, { isActive: 0 });

    return { message: "Product updated successfully" };
  }
}

export default ProductService;
