import { Request, Response, NextFunction } from "express";
import { AuthorizeMiddleware } from "../middleware/accesscontrol.middleware";

import { EndPoint } from "../utils/endpoint";

class ItemInterface {
  async all(request: Request, response: Response, next: NextFunction) {
    try {
      response
        .send([
          {
            item_id: 1,
            item_name: "Some Item Name",
            sku: 12345
          }
        ]);
    } catch (e) {
      response
        .status(400)
        .send(e);
    }
  }

  async create(request: Request, response: Response, next: NextFunction) {
    try {
      response
        .send(request.body);
    } catch (e) {
      response
        .status(400)
        .send(e);
    }
  }
}

export class ItemController {
  private itemInterface: ItemInterface = new ItemInterface();
  private authorize: AuthorizeMiddleware = new AuthorizeMiddleware();

  public readonly all: EndPoint = {
    authorize: this.authorize.authorize("read", "items"),
    method: this.itemInterface.all
  };

  public readonly create: EndPoint = {
    authorize: this.authorize.authorize("create", "items"),
    method: this.itemInterface.create
  };
}
