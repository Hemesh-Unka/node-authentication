import { LoginController } from './controller/LoginController';
import { LogoutController } from './controller/LogoutController';
import { RegisterController } from "./controller/RegisterController";
import { UserController } from './controller/UserController';

import * as passport from 'passport';
import './config/passport.config';
import { RoleMiddleware } from './config/app.roles';

export class Routes {

    private roleMiddleware: RoleMiddleware = new RoleMiddleware();
    private loginController: LoginController = new LoginController();
    private logoutController: LogoutController = new LogoutController();
    private registerController: RegisterController = new RegisterController();
    private userController: UserController = new UserController();

    public routes(app): void {
        app.route('/login')
            .post(passport.authenticate('local', { session: false }), this.loginController.login);

        app.route('/logout')
            .get(passport.authenticate('jwt', { session: false }), this.logoutController.logout);

        app.route('/register')
            .post(this.registerController.register);

        app.route('/users')
            // admin, superadmin
            .get(passport.authenticate('jwt', { session: false }), this.roleMiddleware.permit(['admin', 'superadmin']), this.userController.all)

            // admin, superadmin, member
            .put(passport.authenticate('jwt', { session: false }), this.roleMiddleware.permit(['superadmin', 'admin', 'member']),this.userController.edit)
    }
}