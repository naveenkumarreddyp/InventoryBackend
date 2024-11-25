import { Request, Response } from "express";
import HandleResponse, { ApiResponse } from "../Utility/ResponseHandle";
import { IGetUserAuthInfoRequest } from "../Utility/RequestModifier";
import ReportsSerivce from "../Services/ReportsService";

class ReportsController {
  private reportsSerivce: ReportsSerivce = new ReportsSerivce();
  constructor() {
    // this.createProduct = this.createProduct.bind(this);
    // this.getProduct = this.getProduct.bind(this);
  }
  public async fetchTopCustomer(_: any, res: Response): Promise<any> {
    let result: ApiResponse;
    try {
      const serviceInfo = await this.reportsSerivce.topCustomer();
      result = HandleResponse.handleResponse(true, 200, serviceInfo);
      return res.send(result);
    } catch (err) {
      console.log(err);
      result = HandleResponse.handleResponse(
        false,
        500,
        "failed to add product"
      );
      res.status(500).send(result);
    }
  }

  public async fetchPaidviaReports(_: any, res: Response): Promise<any> {
    let result: ApiResponse;
    try {
      const serviceInfo = await this.reportsSerivce.paymentMethodReport();
      result = HandleResponse.handleResponse(true, 200, serviceInfo);
      return res.send(result);
    } catch (err) {
      console.log(err);
      result = HandleResponse.handleResponse(
        false,
        500,
        "failed to add product"
      );
      res.status(500).send(result);
    }
  }

  public async fetchPreviousThreeMonthsReport(
    _: any,
    res: Response
  ): Promise<any> {
    let result: ApiResponse;
    try {
      const serviceInfo = await this.reportsSerivce.lastThreeMonthsReport();
      result = HandleResponse.handleResponse(true, 200, serviceInfo);
      return res.send(result);
    } catch (err) {
      console.log(err);
      result = HandleResponse.handleResponse(
        false,
        500,
        "failed to add product"
      );
      res.status(500).send(result);
    }
  }
}

export default ReportsController;
