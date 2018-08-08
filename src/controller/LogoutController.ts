import { NextFunction, Request, Response } from "express";
import { EndPoint } from "../utils/endpoint";

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

  public readonly logout: EndPoint = {
    authorize: null,
    method: this.logoutInterface.logout
  };
}