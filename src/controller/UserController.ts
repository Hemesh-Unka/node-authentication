import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";

export class UserController {

    private userRepository = getRepository(User);

    async all(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.find();
    }

    async one(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.findOne(request.params.id);
    }

    async save(request: Request, response: Response, next: NextFunction) {
        // these models should be extracted into a model class
        // ISSUE: when password was saved in another route - ie '/' route - password would be stored in plain-text
        // const hashedPassword = await bcrypt.hash(request.body.password, 10);
        // request.body.password = hashedPassword;
        // FIX: Needed to create user/then save

        const user = this.userRepository.create(request.body);
        return this.userRepository.save(user);
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        let userToRemove = await this.userRepository.findOne(request.params.id);
        await this.userRepository.remove(userToRemove);
    }

}