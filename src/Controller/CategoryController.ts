import { Request, Response } from "express";
import HandleResponse, { ApiResponse } from "../Utility/ResponseHandle";
import { CategoryDTO } from "../DTO/CategoryDTO";
import { IGetUserAuthInfoRequest } from "../Utility/RequestModifier";
import { ICategoryServiceInterface } from "../Services/CategoryService";

export interface ICategoryControllerInterface {
  createCategory(
    req: IGetUserAuthInfoRequest,
    res: Response
  ): Promise<ApiResponse>;
  getCategory(_: any, res: Response): Promise<ApiResponse>;
  updateCategory(
    req: IGetUserAuthInfoRequest,
    res: Response
  ): Promise<ApiResponse>;
  deleteCategory(
    req: IGetUserAuthInfoRequest,
    res: Response
  ): Promise<ApiResponse>;
}

class CategoryController implements ICategoryControllerInterface {
  constructor(private CategoryService: ICategoryServiceInterface) {}
  public async createCategory(
    req: IGetUserAuthInfoRequest,
    res: Response
  ): Promise<any> {
    let result: ApiResponse;
    try {
      const serviceInfo = await this.CategoryService.addCategory(req.body);
      result = HandleResponse.handleResponse(true, 200, serviceInfo);
      return res.send(result);
    } catch (err) {
      console.log(err);
      result = HandleResponse.handleResponse(false, 500, "login failed");
      res.status(500).send(result);
    }
  }

  public async getCategory(_: any, res: Response): Promise<any> {
    try {
      const serviceInfo = await this.CategoryService.fetchCategory();
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
        "failed to fetch Category" + err
      );
      res.status(500).send(result);
    }
  }
  public async updateCategory(
    req: IGetUserAuthInfoRequest,
    res: Response
  ): Promise<any> {
    try {
      const serviceInfo = await this.CategoryService.editCategory(req.body);
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
  public async deleteCategory(
    req: IGetUserAuthInfoRequest,
    res: Response
  ): Promise<any> {
    try {
      const serviceInfo = await this.CategoryService.removeCategory(
        req.params.categoryId
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
        "failed to fetch user" + err
      );
      res.status(500).send(result);
    }
  }
}

export default CategoryController;
