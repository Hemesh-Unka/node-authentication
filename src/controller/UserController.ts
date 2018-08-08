import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";

import { User } from "../entity/User";
import { AuthorizeMiddleware } from "../middleware/accesscontrol.middleware";
import { EndPoint } from "../utils/endpoint";

class UserInterface {

    async all(request: Request, response: Response, next: NextFunction) {
        try {
            const userRepository = getRepository(User);
            const users = await userRepository.find();
            response
                .send(users);
        } catch (e) {
            response
                .status(400)
                .send(e);
        }
    }

    async one(request: Request, response: Response, next: NextFunction) {
        try {
            const userRepository = getRepository(User);
            const user = await userRepository.findOne({ email: request.body.email });
            response
                .send(user);
        } catch (e) {
            response
                .status(400)
                .send(e);
        }
    }

    async update(request: Request, response: Response, next: NextFunction) {
        try {
            // Find the user
            let userToUpdate = await getRepository(User).findOne({ email: request.body.email });

            // If the user does not exists
            if (!userToUpdate) throw ({ error: "Email does not exist." });

            // If the requested user to edit is not able to edit (This maybe fixed by access control lists)
            // Need to go over this to check it out once again
            if (userToUpdate.uuid !== request.user.uuid) throw ({ error: "Unable to edit another user" });

            // Edit the user
            userToUpdate.email = request.body.email;
            userToUpdate.password = request.body.password;

            // Save the new user
            let savedUser = await getRepository(User).save(userToUpdate);
            response
                .send(savedUser);
        } catch (e) {
            response
                .status(400)
                .send(e);
        }
    }
}

export class UserController {
    private userInterface: UserInterface = new UserInterface();
    private authorize: AuthorizeMiddleware = new AuthorizeMiddleware();

    public readonly all: EndPoint = {
        authorize: this.authorize.authorize("read", "user"),
        method: this.userInterface.all
    };

    public readonly update: EndPoint = {
        authorize: this.authorize.authorize("update", "user"),
        method: this.userInterface.update
    };

    public readonly one: EndPoint = {
        authorize: this.authorize.authorize("read", "user"),
        method: this.userInterface.one
    };
}