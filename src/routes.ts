import { LoginController } from "./controller/LoginController";
import { LogoutController } from "./controller/LogoutController";
import { RegisterController } from "./controller/RegisterController";
import { UserController } from "./controller/UserController";
import { RoleController } from "./controller/RoleController";
import { ItemController } from "./controller/ItemController";
import { RuleController } from "./controller/RuleController";
import { AuthorizeController } from "./controller/AuthorizeController";
import { EndPoint } from "./utils/endpoint";
import * as passport from "passport";
import "./config/passport.config";

export class Routes {

    private loginController: LoginController = new LoginController();
    private logoutController: LogoutController = new LogoutController();
    private registerController: RegisterController = new RegisterController();
    private ruleController: RuleController = new RuleController();
    private roleController: RoleController = new RoleController();
    private userController: UserController = new UserController();
    private itemController: ItemController = new ItemController();
    private authorizeController: AuthorizeController = new AuthorizeController();

    public routes(app): void {
        const authorizationWithJWT = (endpoint: EndPoint) => [passport.authenticate("jwt", { session: false }), endpoint.authorize, endpoint.method];
        const withJWT = (endpoint: EndPoint) => [passport.authenticate("jwt", { session: false }), endpoint.method];

        app.route("/login")
            .post(passport.authenticate("local", { session: false }), this.loginController.login);

        app.route("/logout")
            .get(...withJWT(this.logoutController.logout));

        app.route("/register")
            .post(this.registerController.register);

        app.route("/users")
            .get(...authorizationWithJWT(this.userController.all))
            .put(...authorizationWithJWT(this.userController.update))
            .post(...authorizationWithJWT(this.userController.one));

        app.route("/roles")
            .get(...authorizationWithJWT(this.roleController.all))
            .post(...authorizationWithJWT(this.roleController.create));

        app.route("/rules")
            .get(...authorizationWithJWT(this.ruleController.all))
            .post(...authorizationWithJWT(this.ruleController.create));

        app.route("/items")
            .get(...authorizationWithJWT(this.itemController.all))
            .post(...authorizationWithJWT(this.itemController.create));

        app.route("/authorise")
            .post(...authorizationWithJWT(this.authorizeController.grant));
    }
}