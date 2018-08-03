import { AccessControl } from 'accesscontrol'
import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { Role } from '../entity/Role'

export class RoleMiddleware {
  
  private async getRoles() {    
    // Get roles from DB
    const rolesRepository = getRepository(Role);
    const roles = await rolesRepository.find()

    // There must be a better way to do this/hack!
    return JSON.parse(JSON.stringify(roles));
  }

  public permit(permitted: Array<string>) {
    return async (request: Request, response: Response, next: NextFunction) => {
      try {         
        // Get all roles from the DB
        const roles = this.getRoles();

        // Create a new access control object
        const ac: AccessControl = new AccessControl(roles);
        
        // Get the current user
        const user = request.user

        // Can the current user access this route
        if (!permitted.includes(request.user.role)) { throw ({ error: 'Unauthorized request' }) };

        // Compare the user role vs. route roles
        // const permission = ac.can(user.role)('account')

        // If user does not have permission
        // if (!permission.granted) {
        //   throw { error: 'Unauthorized request' }
        // };

        next();
      } catch (e) {
        response
          .status(403)
          .send(e)
      }
    }
  }
}