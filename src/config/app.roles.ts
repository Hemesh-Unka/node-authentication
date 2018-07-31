import { AccessControl } from 'accesscontrol'
import { Request, Response, NextFunction } from 'express';

export class RoleMiddleware {
  private grants: object = {
    // General public / API
    guest: {
      account: {
        'create:own': ['*']
      }
    },

    // User from Client (Employee)
    member: {
      account: {
        'read:own': ['*'],
        'update:own': ['*'],
        'delete:own': ['*']
      }
    },

    // Client - CMS Owner
    admin: {
      account: {
        'create:any': ['*'],
        'read:any': ['*'],
        'update:any': ['*'],
        'delete:any': ['*']
      }

      // Holition - Owner
    },
    superadmin: {
      account: {
        'create:any': ['*'],
        'read:any': ['*'],
        'update:any': ['*'],
        'delete:any': ['*']
      }
    }
  }

  private ac: AccessControl = new AccessControl(this.grants);

  public permit(permitted) {
    return async (request: Request, response: Response, next: NextFunction) => {
      try {
        // Get the current user
        const user = request.user

        // Can the current user access this route
        if (!permitted.includes(request.user.role)) { throw ({ error: 'Unauthorized request' }) };

        // Compare the user role vs. route roles
        const permission = this.ac.can(user.role).readAny('account')

        // If user does not have permission
        if (!permission.granted) {
          throw { error: 'Unauthorized request' }
        };

        next();
      } catch (e) {
        response
          .status(403)
          .send(e)
      }
    }
  }
}