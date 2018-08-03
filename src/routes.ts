import { LoginController } from './controller/LoginController';
import { LogoutController } from './controller/LogoutController';
import { RegisterController } from "./controller/RegisterController";
import { UserController } from './controller/UserController';
import { RoleMiddleware } from './config/app.roles';
import { RoleController } from './controller/RoleController';
import { ItemController } from './controller/ItemController';

import * as passport from 'passport';
import './config/passport.config';


export class Routes {

    private roleMiddleware: RoleMiddleware = new RoleMiddleware();
    private loginController: LoginController = new LoginController();
    private logoutController: LogoutController = new LogoutController();
    private registerController: RegisterController = new RegisterController();
    private roleController: RoleController = new RoleController();
    private userController: UserController = new UserController();
    private itemController: ItemController = new ItemController();

    public routes(app): void {
        app.route('/login')
            .post(passport.authenticate('local', { session: false }), this.loginController.login);

        app.route('/logout')
            .get(passport.authenticate('jwt', { session: false }), this.logoutController.logout);

        app.route('/register')
            .post(this.registerController.register);

        app.route('/users')
            .get(passport.authenticate('jwt', { session: false }), this.roleMiddleware.permit(['admin', 'superadmin']), this.userController.all)
            .put(passport.authenticate('jwt', { session: false }), this.roleMiddleware.permit(['superadmin', 'admin', 'member']), this.userController.edit);
    
        app.route('/roles')
            .get(passport.authenticate('jwt', {session: false}), this.roleController.all)
            .post(passport.authenticate('jwt', { session: false }), this.roleController.add);
        
        app.route('/items')
            .get(passport.authenticate('jwt', { session: false}), this.itemController.all, this.roleMiddleware.permit(['superadmin', 'client', 'user', 'guest']));
        }
}