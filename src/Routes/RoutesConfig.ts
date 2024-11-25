import { Router } from "express";
import loginRoutes from "./loginRoutes";
import uploadFIleRoutes from "./FIleUploadRoutes";
import ProductRoutes from "./productRoutes";
import categoryRoutes from "./categoryRoutes";
// import BillingsRoutes from "./billingsRoute";
import Authentication from "../Middlewares/Authentication";
import BillingsRoutes from "./billingsRoute";
import ReportsRoutes from "./reportsRoutes";

class AppRoutes {
  private readonly approuter: Router;

  constructor() {
    this.approuter = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.approuter.use("/auth", loginRoutes);
    this.approuter.use("/category", Authentication, categoryRoutes);
    this.approuter.use("/file", uploadFIleRoutes);
    this.approuter.use(
      "/product",
      Authentication,
      new ProductRoutes().getRoutes()
    );
    this.approuter.use(
      "/billing",
      Authentication,
      new BillingsRoutes().getRoutes()
    );
    this.approuter.use(
      "/report",
      Authentication,
      new ReportsRoutes().getRoutes()
    );
  }

  public getRoutes(): Router {
    return this.approuter;
  }
}

export default new AppRoutes().getRoutes();
