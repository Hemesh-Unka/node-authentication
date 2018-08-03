import { Request, Response, NextFunction } from "express";

export class ItemController {
  async all(request: Request, response: Response, next: NextFunction) {
    try {
      response
        .send([
          {
            item_id: 1,
            item_name: 'Some Item Name',
            sku: 12345
          }
        ])
    } catch (e) {
      response
        .status(400)
        .send(e)
    }
  }
}