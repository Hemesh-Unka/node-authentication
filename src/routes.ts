import { UserController } from "./controller/UserController";
import { LoginController } from "./controller/LoginController";
import { LogoutController } from "./controller/LogoutController";
import { RegisterController } from "./controller/RegisterController";


export const Routes = [{
    method: "get",
    route: "/users",
    controller: UserController,
    action: "all"
}, {
    method: "get",
    route: "/users/:id",
    controller: UserController,
    action: "one"
}, {
    method: "post",
    route: "/users",
    controller: UserController,
    action: "save"
}, {
    method: "delete",
    route: "/users",
    controller: UserController,
    action: "remove"
}, {
    method: "post",
    route: "/login",
    controller: LoginController,
    action: "login"
}, {
    method: "get",
    route: "/logout",
    controller: LogoutController,
    action: "logout"
}, {
    method: "post",
    route: "/register",
    controller: RegisterController,
    action: "register"
}];