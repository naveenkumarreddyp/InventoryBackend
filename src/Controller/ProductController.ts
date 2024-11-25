import { Request, Response } from "express";
import HandleResponse, { ApiResponse } from "../Utility/ResponseHandle";
import { IGetUserAuthInfoRequest } from "../Utility/RequestModifier";
import ProductService from "../Services/ProductService";

class ProductController {
  private productService: ProductService = new ProductService();
  constructor() {
    // this.createProduct = this.createProduct.bind(this);
    // this.getProduct = this.getProduct.bind(this);
  }
  public async createProduct(
    req: IGetUserAuthInfoRequest,
    res: Response
  ): Promise<any> {
    let result: ApiResponse;
    try {
      const serviceInfo = await this.productService.addProduct(req.body);
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

  public async getProduct(_: any, res: Response): Promise<any> {
    try {
      const serviceInfo = await this.productService.fetchProduct();
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
        "failed to fetch product"
      );
      res.status(500).send(result);
    }
  }

  public async updateProduct(
    req: IGetUserAuthInfoRequest,
    res: Response
  ): Promise<any> {
    try {
      const serviceInfo = await this.productService.editProduct(req.body);
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
        "failed to update product"
      );
      res.status(500).send(result);
    }
  }
  public async deleteProduct(
    req: IGetUserAuthInfoRequest,
    res: Response
  ): Promise<any> {
    try {
      const serviceInfo = await this.productService.removeProduct(
        req.params.productId
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
        "failed to delete product"
      );
      res.status(500).send(result);
    }
  }
}

export default ProductController;
