import { Request, Response, NextFunction } from "express";
import { LoginController } from './controller/LoginController';
import { LogoutController } from './controller/LogoutController';
import { RegisterController } from "./controller/RegisterController";

export class Routes {

    private loginController: LoginController = new LoginController();
    private logoutController: LogoutController = new LogoutController();
    private registerController: RegisterController = new RegisterController();

    public routes(app): void {
        app.route('/login')
            .post(this.loginController.login);

        app.route('/logout')
            .get(this.logoutController.logout);

        app.route('/register')
            .post(this.registerController.register);
    }
}