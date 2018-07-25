import { NextFunction, Request, Response } from "express";

export class LogoutController {
  async logout(request: Request, response: Response, next: NextFunction) {
    return {
      auth: false,
      token: null
    }
  }
}