import express, { Response } from "express";
import "dotenv-flow/config";
import cors from "cors";
import AppRoutes from "./src/Routes/RoutesConfig";
import HandleResponse, { ApiResponse } from "./src/Utility/ResponseHandle";
import cookieParser from "cookie-parser";

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.defaultConfiguration();
    this.routesConfig();
    this.handleUnknownRoutes();
  }

  defaultConfiguration(): void {
    this.app.use(
      cors({
        origin: (origin, callback) => {
          const allowedOrigins = process.env.CORS_ORIGIN_URLS!.split(",");
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error("Not allowed by CORS"));
          }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );
    this.app.options("*", cors());
    this.app.use(cookieParser());
    this.app.use(express.json());

    this.app.use(express.urlencoded({ extended: true }));
    this.app.use((_, res, next) => {
      res.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate"
      );
      res.set("Pragma", "no-cache");
      res.set("Expires", "0");
      next();
    });
    this.app.route("/").get((_, res: Response) => {
      res.send("server is running sucessfully");
    });
  }

  private routesConfig(): void {
    this.app.use("/api", AppRoutes);
  }
  private handleUnknownRoutes(): void {
    this.app.use((_, res: Response) => {
      let result: ApiResponse = HandleResponse.handleResponse(
        false,
        500,
        "Route (or) Method not found"
      );

      res.send(result);
    });
  }
}

export default new App().app;
