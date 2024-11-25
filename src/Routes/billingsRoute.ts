import { Router } from "express";
import BillingsController from "../Controller/BillingController";

class BillingsRoutes {
  private router: Router;
  private billingsController: BillingsController = new BillingsController();

  constructor() {
    this.router = Router();

    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router
      .route("/getbillings")
      .get(this.billingsController.getBillings.bind(this.billingsController));
    this.router
      .route("/createBilling")
      .post(
        this.billingsController.generateBilling.bind(this.billingsController)
      );
    this.router
      .route("/recentbillings")
      .get(
        this.billingsController.getRecentBillings.bind(this.billingsController)
      );

    this.router
      .route("/searchproductforbilling")
      .get(
        this.billingsController.getProductForBilling.bind(
          this.billingsController
        )
      );
    this.router
      .route("/fetchbillings/:duration")
      .get(
        this.billingsController.getBillingsAmount.bind(this.billingsController)
      );
  }

  public getRoutes(): Router {
    return this.router;
  }
}

export default BillingsRoutes;
