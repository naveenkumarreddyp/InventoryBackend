import { Router } from "express";
import ReportsController from "../Controller/ReportsController";

class ReportsRoutes {
  private router: Router;
  private reportsController: ReportsController = new ReportsController();

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router
      .route("/topcustomer")
      .get(
        this.reportsController.fetchTopCustomer.bind(this.reportsController)
      );

    this.router
      .route("/paymentmethodreports")
      .get(
        this.reportsController.fetchPaidviaReports.bind(this.reportsController)
      );

    this.router
      .route("/lastthreemonthsreports")
      .get(
        this.reportsController.fetchPreviousThreeMonthsReport.bind(
          this.reportsController
        )
      );
  }

  public getRoutes(): Router {
    return this.router;
  }
}

export default ReportsRoutes;
