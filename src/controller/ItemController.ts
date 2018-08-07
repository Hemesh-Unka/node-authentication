import { Request, Response, NextFunction } from "express";
import { RoleMiddleware } from '../middleware/accesscontrol.middleware'

import { AccessControl } from 'accesscontrol';
import { EndPoint } from "../utils/endpoint";




export class ItemController {
  public readonly all: EndPoint = {
    authorize: async (request: Request, response: Response, next: NextFunction) => {},
    method: this._all
  };

  private async _all(request: Request, response: Response, next: NextFunction) {
    try {
      // Begin dirty code
      const grants = await RoleMiddleware.permit();
      const ac = new AccessControl(grants);

      const permission = ac.can(request.user.role.role_name).readAny('items');

      // Debugging
      console.log('resource: ', permission.resource)
      console.log('roles:', permission.roles)
      console.log('attributes: ', permission.attributes)

      if (!permission.granted) { throw ({ error: 'Permission denied.' }) }

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

  public readonly create: EndPoint = {
    authorize: async (request: Request, response: Response, next: NextFunction) => {},
    method: this._create
  };

  async _create(request: Request, response: Response, next: NextFunction) {
    try {
      response
        .send(request.body)
    } catch (e) {
      response
        .status(400)
        .send(e)
    }
  }
}


