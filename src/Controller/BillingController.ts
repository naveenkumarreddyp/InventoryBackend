import { Request, Response } from "express";
import HandleResponse, { ApiResponse } from "../Utility/ResponseHandle";
// import { IUserServiceInterface } from "../Services/UserService";
// import { UserDTO } from "../DTO/ProductDTO";
import { IGetUserAuthInfoRequest } from "../Utility/RequestModifier";
import ProductService from "../Services/ProductService";
import BillingSerivce from "../Services/BillingService";

class BillingsController {
  private billingSerivce: BillingSerivce = new BillingSerivce();
  constructor() {
    // this.createProduct = this.createProduct.bind(this);
    // this.getProduct = this.getProduct.bind(this);
  }
  public async generateBilling(
    req: IGetUserAuthInfoRequest,
    res: Response
  ): Promise<any> {
    let result: ApiResponse;
    try {
      const serviceInfo = await this.billingSerivce.addBilling(req.body);
      result = HandleResponse.handleResponse(true, 200, serviceInfo);
      return res.send(result);
    } catch (err) {
      console.log(err);
      result = HandleResponse.handleResponse(false, 500, "product failed");
      res.status(500).send(result);
    }
  }

  public async getBillings(_: any, res: Response): Promise<any> {
    try {
      const serviceInfo = await this.billingSerivce.fetchBillings();
      const result: ApiResponse = HandleResponse.handleResponse(
        true,
        200,
        serviceInfo
      );
      return res.send(result);
    } catch (err) {
      const result: ApiResponse = HandleResponse.handleResponse(
        false,
        500,
        "failed to fetch user" + err
      );
      res.status(500).send(result);
    }
  }

  public async getRecentBillings(_: any, res: Response): Promise<any> {
    try {
      const serviceInfo = await this.billingSerivce.fetchRecentBillings();
      const result: ApiResponse = HandleResponse.handleResponse(
        true,
        200,
        serviceInfo
      );
      return res.send(result);
    } catch (err) {
      const result: ApiResponse = HandleResponse.handleResponse(
        false,
        500,
        "failed to fetch user" + err
      );
      res.status(500).send(result);
    }
  }

  public async getProductForBilling(req: Request, res: Response): Promise<any> {
    try {
      const productName = Array.isArray(req?.query?.productName)
        ? req?.query?.productName[0]
        : req?.query?.productName;
      if (productName) {
        const serviceInfo = await this.billingSerivce.searchProductForBiling(
          productName as string
        );
        var result: ApiResponse = HandleResponse.handleResponse(
          true,
          200,
          serviceInfo
        );
      } else {
        result = HandleResponse.handleResponse(true, 200, []);
      }
      return res.send(result);
    } catch (err) {
      const result: ApiResponse = HandleResponse.handleResponse(
        false,
        500,
        "failed to fetch user" + err
      );
      res.status(500).send(result);
    }
  }

  public async getBillingsAmount(req: Request, res: Response): Promise<any> {
    try {
      const serviceInfo = await this.billingSerivce.fetchBillingsAmountDuration(
        req.params.duration
      );
      const result: ApiResponse = HandleResponse.handleResponse(
        true,
        200,
        serviceInfo
      );
      return res.send(result);
    } catch (err) {
      const result: ApiResponse = HandleResponse.handleResponse(
        false,
        500,
        "failed to fetch billlings duration"
      );
      res.status(500).send(result);
    }
  }
}

export default BillingsController;
