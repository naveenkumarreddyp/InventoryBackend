import Repository from "../Repository/BaseRepository";
import "dotenv-flow/config";
import UniqueIDGenerator from "../Utility/RandomUniqueIdGenerator";
import { BillingEntity } from "../Entity/BillingsEntity";
import { DateUtility } from "../Utility/DateUtlity";

class ReportsSerivce {
  private uniqueId: UniqueIDGenerator;
  constructor() {
    // Constructor code goes here
    // Initialize any required services or libraries here and configure them
    // Example:
    // this.userService = new UserService(new billingRepository());
    // this.authService = new AuthService();
    this.uniqueId = new UniqueIDGenerator();
  }

  public async topCustomer(): Promise<any> {
    let billingRepository = new Repository(process.env.BILLINGS_INFO!);
    let aggregatePipeline = [];

    let matchQuery = {
      isActive: 1,
    };
    let groupQuery = {
      _id: "$customerMobile",
      totalAmount: { $sum: "$finalPrice" },
      totalBillings: { $sum: 1 },
      customerName: { $first: "$customerName" },
    };

    let projectQuery = {
      _id: 0,
      totalBillings: 1,
      totalAmount: 1,
      customerName: 1,
    };
    let sortQuery = {
      totalAmount: -1,
    };
    let limitNumber = 1;
    aggregatePipeline.push({ $match: matchQuery });
    aggregatePipeline.push({ $group: groupQuery });
    aggregatePipeline.push({ $project: projectQuery });
    aggregatePipeline.push({ $sort: sortQuery });
    aggregatePipeline.push({ $limit: limitNumber });
    let result = await billingRepository.aggregate(aggregatePipeline);

    return result;
  }

  public async paymentMethodReport(): Promise<any> {
    let billingRepository = new Repository(process.env.BILLINGS_INFO!);
    let aggregatePipeline = [];

    let matchQuery = {
      isActive: 1,
    };
    let groupQuery = {
      _id: "$paidVia",
      totalAmount: { $sum: "$finalPrice" },
    };

    let projectQuery = {
      method: { $ifNull: ["$_id", "Others"] },
      amount: "$totalAmount",
    };

    aggregatePipeline.push({ $match: matchQuery });
    aggregatePipeline.push({ $group: groupQuery });
    aggregatePipeline.push({ $project: projectQuery });
    let result = await billingRepository.aggregate(aggregatePipeline);

    return result;
  }

  public async lastThreeMonthsReport(): Promise<any> {
    let billingRepository = new Repository(process.env.BILLINGS_INFO!);

    let prevmonth = new Date().getMonth(); // since it gives index of current month number
    let monthsNumbers = [prevmonth - 1, prevmonth, prevmonth + 1];

    let aggregatePipeline = [];

    let matchQuery = {
      isActive: 1,
    };
    let groupQuery = {
      _id: { $month: "$createdAt" },
      totalAmount: { $sum: "$finalPrice" },
    };
    // { month: "January", amount: 45000 },
    let projectQuery = {
      monthnumber: "$_id",
      amount: "$totalAmount",
    };

    aggregatePipeline.push({ $match: matchQuery });
    aggregatePipeline.push({ $group: groupQuery });
    aggregatePipeline.push({ $project: projectQuery });
    let aggregateResult = await billingRepository.aggregate(aggregatePipeline);
    let result: { month: string; amount: number }[] = [];

    monthsNumbers.map((Numbermonth) => {
      let monthName = DateUtility.getMonthName(Numbermonth);
      let monthObj = aggregateResult.find(
        (ele) => ele.monthnumber === Numbermonth
      );
      result.push({
        month: monthName,
        amount: monthObj?.amount ?? 0,
      });
    });

    return result;
  }
}

export default ReportsSerivce;
