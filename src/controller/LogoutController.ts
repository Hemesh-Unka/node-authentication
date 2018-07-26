import { NextFunction, Request, Response } from "express";

export class LogoutController {
  async logout(request: Request, response: Response, next: NextFunction) {
    response
      .status(200)
      .send({
        auth: false,
        token: null
      })
  }
}