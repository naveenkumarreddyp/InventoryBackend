import { Request, Response } from "express";
import HandleResponse, { ApiResponse } from "../Utility/ResponseHandle";
import LoginService, { ISignInServiceInterface } from "../Services/LoginService";
import { IGetUserAuthInfoRequest } from "../Utility/RequestModifier";

export interface ILoginControllerInterface {
  login(req: Request, res: Response): Promise<any>;
  mobileLogin(req: Request, res: Response): Promise<any>;
  register(req: Request, res: Response): Promise<any>;
  getuser(req: Request, res: Response): Promise<any>;
  logout(req: Request, res: Response): Promise<any>;
  forgotPassword(req: Request, res: Response): Promise<any>;
  resetPassword(req: Request, res: Response): Promise<any>;
  getUserInfoByResetToken(req: Request, res: Response): Promise<any>;
}

class LoginController implements ILoginControllerInterface {
  constructor(private loginService: ISignInServiceInterface) {}

  public async login(req: Request, res: Response): Promise<any> {
    try {
      const serviceInfo = await this.loginService.signIn(req.body);

      let result;
      if (serviceInfo?.message) {
        let accessoptions = {
          maxAge: 1000 * 60 * 60 * 24, // would expire after 15 minutes
          httpOnly: true, // The cookie only accessible by the web server
          secure: true, // Set to true if your site is served via HTTPS
          //sameSite: "strict", // Enforce strict SameSite mode
          sameSite: "None",
        } as any;
        let options = {
          maxAge: 1000 * 60 * 60 * 24 * 30, // would expire after 15 minutes
          httpOnly: true, // The cookie only accessible by the web server
          secure: true, // Set to true if your site is served via HTTPS
          // sameSite: "strict", // Enforce strict SameSite mode
          sameSite: "None",
        } as any;

        // Set cookie
        res.cookie("access", serviceInfo.acessToken, accessoptions);
        res.cookie("refresh", serviceInfo.refreshToken, options);
        result = HandleResponse.handleResponse(true, 200, serviceInfo.message);
        return res.send(result);
      } else {
        result = HandleResponse.handleResponse(false, 400, serviceInfo.error);
        return res.status(400).send(result);
      }
    } catch (err) {
      console.log(err);
      const result: ApiResponse = HandleResponse.handleResponse(false, 500, "Login failed");
      return res.send(result);
    }
  }
  public async mobileLogin(req: Request, res: Response): Promise<any> {
    try {
      const serviceInfo = await this.loginService.signIn(req.body);
      let result;
      if (serviceInfo?.message) {
        result = HandleResponse.handleResponse(true, 200, serviceInfo.acessToken);
        return res.send(result);
      } else {
        result = HandleResponse.handleResponse(false, 400, serviceInfo.error);
        return res.status(400).send(result);
      }
    } catch (err) {
      console.log(err);
      const result: ApiResponse = HandleResponse.handleResponse(false, 500, "Login failed");
      return res.send(result);
    }
  }
  public async register(req: Request, res: Response): Promise<any> {
    try {
      const serviceInfo = await this.loginService.signUp(req.body);
      let result: ApiResponse;

      if (serviceInfo?.message) {
        result = HandleResponse.handleResponse(true, 200, serviceInfo.message);
        return res.send(result);
      } else {
        result = HandleResponse.handleResponse(false, 409, serviceInfo.error);
        return res.status(400).send(result);
      }
    } catch (err) {
      const result: ApiResponse = HandleResponse.handleResponse(false, 500, "Register failed");
      return res.send(result);
    }
  }

  public async getuser(req: IGetUserAuthInfoRequest, res: Response): Promise<any> {
    try {
      const serviceInfo = await this.loginService.getuserInfo(req.userDetails);

      const result: ApiResponse = HandleResponse.handleResponse(true, 200, serviceInfo);
      return res.send(result);
    } catch (err) {
      const result: ApiResponse = HandleResponse.handleResponse(false, 500, "fetch user failed");
      return res.send(result);
    }
  }

  public async logout(req: IGetUserAuthInfoRequest, res: Response): Promise<any> {
    try {
      const serviceInfo = await this.loginService.signOut(req.userDetails);
      let result: ApiResponse;

      if (serviceInfo?.message) {
        // res.clearCookie("access");
        res.clearCookie("access", {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          path: "/",
          // domain: "localhost", // or your API domain
          domain: process.env.DOMAIN_URL!,
        });
        // res.clearCookie("refresh");
        res.clearCookie("refresh", {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          path: "/",
          // domain: "localhost", // or your API domain
          domain: process.env.DOMAIN_URL!,
        });
        result = HandleResponse.handleResponse(true, 200, serviceInfo.message);
        return res.send(result);
      } else {
        result = HandleResponse.handleResponse(false, 400, "couldn't signout user");
        return res.status(500).send(result);
      }
    } catch (err) {
      const result: ApiResponse = HandleResponse.handleResponse(false, 500, "couldn't logout user");
      return res.send(result);
    }
  }
  public async forgotPassword(req: IGetUserAuthInfoRequest, res: Response): Promise<any> {
    try {
      const serviceInfo = await this.loginService.forgotPassword(req.body);
      let result: ApiResponse;

      if (serviceInfo?.message) {
        result = HandleResponse.handleResponse(true, 200, serviceInfo.message);
        return res.send(result);
      } else {
        result = HandleResponse.handleResponse(false, 500, "fail to sent forgot password email");
        return res.status(500).send(result);
      }
    } catch (err) {
      const result: ApiResponse = HandleResponse.handleResponse(false, 500, "user not found");
      return res.send(result);
    }
  }
  public async resetPassword(req: IGetUserAuthInfoRequest, res: Response): Promise<any> {
    try {
      const serviceInfo = await this.loginService.resetPassword(req.body);
      let result: ApiResponse;

      if (serviceInfo?.message) {
        result = HandleResponse.handleResponse(true, 200, serviceInfo.message);
        return res.send(result);
      } else {
        result = HandleResponse.handleResponse(false, 500, "reset password failed");
        return res.status(500).send(result);
      }
    } catch (err) {
      const result: ApiResponse = HandleResponse.handleResponse(false, 500, "reset password failed");
      return res.send(result);
    }
  }
  public async getUserInfoByResetToken(req: Request, res: Response): Promise<any> {
    try {
      if (req?.query?.resettoken) {
        const serviceInfo = await this.loginService.getUserInfoByResetToken(req?.query?.resettoken);
        const result: ApiResponse = HandleResponse.handleResponse(true, 200, serviceInfo);
        return res.send(result);
      }
      const result: ApiResponse = HandleResponse.handleResponse(false, 400, "user not found");
      return res.send(result);
    } catch (err) {
      const result: ApiResponse = HandleResponse.handleResponse(false, 500, "fetch user failed");
      return res.send(result);
    }
  }
}

export default LoginController;
