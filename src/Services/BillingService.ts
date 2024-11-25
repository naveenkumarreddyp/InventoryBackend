import Repository from "../Repository/BaseRepository";
import "dotenv-flow/config";
import UniqueIDGenerator from "../Utility/RandomUniqueIdGenerator";
import { ProductDTO } from "../DTO/ProductDTO";
import { ProductEntity } from "../Entity/ProductEntity";
import { BillingEntity } from "../Entity/BillingsEntity";
import { DateUtility } from "../Utility/DateUtlity";

class BillingSerivce {
  private uniqueId: UniqueIDGenerator;
  constructor() {
    // Constructor code goes here
    // Initialize any required services or libraries here and configure them
    // Example:
    // this.userService = new UserService(new billingRepository());
    // this.authService = new AuthService();
    this.uniqueId = new UniqueIDGenerator();
  }

  public async addBilling(data: any): Promise<any> {
    let productRepository = new Repository(process.env.PRODUCT_INFO!);
    let billingRepository = new Repository(process.env.BILLINGS_INFO!);

    // Generate a unique ID for the user
    let uid = this.uniqueId.generate();

    let billing: BillingEntity = {
      billingId: uid,
      customerName: data?.customerName,
      createdAt: new Date(),
      updatedAt: null,
      createdBy: "Admin",
      updatedBy: null,
      customerMobile: data?.customerMobile,
      customerEmail: data?.customerEmail,
      paidVia: data?.paymentMethod,
      productsList: data?.productsList,
      isActive: 1,
      paymentStatus: data?.paymentStatus,
      paymentStatusId: data?.paymentStatusId,
      totalItems: data?.totalItems,
      finalPrice: Number(data?.finalPrice),
    };
    console.log(data);
    await billingRepository.insert(billing);
    for (let product of data?.productsList) {
      let productData = await productRepository.getOne({
        productId: product.productId,
        isActive: 1,
      });
      let RemainingQty = productData.productRemainingQty - product.quantity;

      await productRepository.update(
        { productId: product.productId },
        { productRemainingQty: RemainingQty }
      );
    }
    return billing;
  }

  public async fetchBillings(): Promise<any> {
    // Example response, modify as needed
    let billingRepository = new Repository(process.env.BILLINGS_INFO!);
    let result = await billingRepository.findMany(
      { isActive: 1 },
      {},
      { _id: -1 }
    );
    return result;
  }

  public async searchProductForBiling(searchTerm: string): Promise<any> {
    // Example response, modify as needed
    let productRepository = new Repository(process.env.PRODUCT_INFO!);
    let result = await productRepository.findMany(
      {
        isActive: 1,
        productName: { $regex: searchTerm, $options: "i" },
      },
      {
        _id: 0,
        productId: 1,
        productName: 1,
        productPrice: 1,
        productRemainingQty: 1,
      }
    );

    return result;
  }

  public async fetchRecentBillings(): Promise<any> {
    let billingRepository = new Repository(process.env.BILLINGS_INFO!);

    let result = await billingRepository.findMany(
      { isActive: 1 },
      {},
      { _id: -1 },
      5
    );

    return result;
  }

  public async fetchBillingsAmountDuration(duration: string): Promise<any> {
    let billingRepository = new Repository(process.env.BILLINGS_INFO!);
    let aggregatePipeline = [];

    let startDate: Date;
    let endDate: Date = new Date();
    switch (duration) {
      case "today":
        startDate = DateUtility.getTodayStartDate();
        break;
      case "monthly":
        startDate = DateUtility.getMonthStartDate();
        break;
      case "yearly":
        startDate = DateUtility.getYearStartDate();
        break;
      default:
        throw new Error("Invalid duration specified");
    }

    let matchQuery = {
      isActive: 1,
      createdAt: { $gte: startDate, $lte: endDate },
    };
    let groupQuery = {
      _id: null,
      totalAmount: { $sum: "$finalPrice" },
      totalBillings: { $sum: 1 },
    };

    let projectQuery = {
      _id: 0,
      totalBillings: 1,
      totalAmount: 1,
    };
    aggregatePipeline.push({ $match: matchQuery });
    aggregatePipeline.push({ $group: groupQuery });
    aggregatePipeline.push({ $project: projectQuery });
    let result = await billingRepository.aggregate(aggregatePipeline);

    return result;
  }
}

export default BillingSerivce;
