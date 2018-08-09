import { NextFunction, Request, Response } from "express";
import { EndPoint } from "../utils/endpoint";
import { AuthorizeMiddleware } from "../middleware/accesscontrol.middleware";

class LogoutInterface {
  async logout(request: Request, response: Response, next: NextFunction) {
    response
      .status(200)
      .send({
        auth: false,
        token: null
      });
  }
}

export class LogoutController {
  private logoutInterface: LogoutInterface = new LogoutInterface();
  private authorize: AuthorizeMiddleware = new AuthorizeMiddleware();

  public readonly logout: EndPoint = {
    authorize: this.authorize.allowAll,
    method: this.logoutInterface.logout
  };
}