import { LoginController } from './controller/LoginController';
import { LogoutController } from './controller/LogoutController';
import { RegisterController } from "./controller/RegisterController";
import { UserController } from './controller/UserController';
import { RoleController } from './controller/RoleController';
import { ItemController } from './controller/ItemController';
import { RuleController } from './controller/RuleController';
import { AuthoriseController } from './controller/AuthoriseController';

import * as passport from 'passport';
import './config/passport.config';
import { runInThisContext } from 'vm';
import { TreeChildren } from '../node_modules/typeorm';
import { EndPoint } from './utils/endpoint';

export class Routes {

    private loginController: LoginController = new LoginController();
    private logoutController: LogoutController = new LogoutController();
    private registerController: RegisterController = new RegisterController();
    private ruleController: RuleController = new RuleController();
    private roleController: RoleController = new RoleController();
    private userController: UserController = new UserController();
    private itemController: ItemController = new ItemController();
    private authoriseController: AuthoriseController = new AuthoriseController();

    public routes(app): void {
        app.route('/login')
            .post(passport.authenticate('local', { session: false }), this.loginController.login);

        app.route('/logout')
            .get(passport.authenticate('jwt', { session: false }), this.logoutController.logout);

        app.route('/register')
            .post(this.registerController.register);

        app.route('/users')
            .get(passport.authenticate('jwt', { session: false }), this.userController.all)
            .put(passport.authenticate('jwt', { session: false }), this.userController.edit);

        app.route('/roles')
            .get(passport.authenticate('jwt', { session: false }), this.roleController.all)
            .post(passport.authenticate('jwt', { session: false }), this.roleController.create);

        app.route('/rules')
            .get(passport.authenticate('jwt', { session: false }), this.ruleController.all)
            .post(passport.authenticate('jwt', { session: false }), this.ruleController.create);


        const authWithJWT = (endpoint: EndPoint) => [passport.authenticate('jwt', { session: false }), endpoint.authorize, endpoint.method];

        app.route('/items')
            .get(passport.authenticate('jwt', { session: false }), authorize('read:any', 'items'), this.itemController.all)
            .get(passport.authenticate('jwt', { session: false }), this.itemController.all.authorize, this.itemController.all.method)
            .get(...[passport.authenticate('jwt', { session: false }), this.itemController.all.authorize, this.itemController.all.method])
            .get(...authWithJWT(this.itemController.all));
            //.post(passport.authenticate('jwt', { session: false }), this.itemController.create);
            
            app.route('/authorise')
            .post(passport.authenticate('jwt', { session: false }), this.authoriseController.grant)
            
        // app.route('/items')
        //     .get(passport.authenticate('jwt', { session: false }), authorize('read:any', 'items'), this.itemController.all)
        //     .post(passport.authenticate('jwt', { session: false }), this.itemController.create);
        // app.route('/items/:item_id')
        //     .get(passport.authenticate('jwt', { session: false }), authorize('read:any', 'items'), this.itemController.all)
        //     .post(passport.authenticate('jwt', { session: false }), this.itemController.create);
        // app.route('/items/:item_id/region')
        //     .get(passport.authenticate('jwt', { session: false }), authorize('read:any', 'items'), this.itemController.all)
        //     .post(passport.authenticate('jwt', { session: false }), this.itemController.create);
        // app.route('/items/:item_id/region/:region_id')
        //     .get(passport.authenticate('jwt', { session: false }), authorize('read:any', 'items'), this.itemController.all)
        //     .post(passport.authenticate('jwt', { session: false }), this.itemController.create);

    }
}