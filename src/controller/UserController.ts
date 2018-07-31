import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/User";

export class UserController {

    async all(request: Request, response: Response, next: NextFunction) {
        try {
            const userRepository = getRepository(User);
            const users = await userRepository.find();
            response
                .send(users)
        } catch (e) {
            response
                .status(400)
                .send(e)
        }
    }

    async edit(request: Request, response: Response, next: NextFunction) {

        try {
            // Find the user
            let userToUpdate = await getRepository(User).findOne({ email: request.body.email });

            // If the user does not exists
            if (!userToUpdate) throw ({ error: 'Email does not exist.' });

            // If the requested user to edit is not able to edit (This maybe fixed by access control lists)            
            // Need to go over this to check it out once again
            if (userToUpdate.uuid !== request.user.uuid) throw ({ error: 'Unable to edit another user' });

            // Edit the user
            userToUpdate.email = request.body.email;
            userToUpdate.password = request.body.password;

            // Save the new user
            let savedUser = await getRepository(User).save(userToUpdate);
            response
                .send(savedUser)
        } catch (e) {
            response
                .status(400)
                .send(e)
        }
    };

    // async one(request: Request, response: Response, next: NextFunction) {
    //     return this.userRepository.findOne(request.params.id);
    // }

    // async save(request: Request, response: Response, next: NextFunction) {
    //     // these models should be extracted into a model class
    //     // ISSUE: when password was saved in another route - ie '/' route - password would be stored in plain-text
    //     // const hashedPassword = await bcrypt.hash(request.body.password, 10);
    //     // request.body.password = hashedPassword;
    //     // FIX: Needed to create user/then save

    //     let user = this.userRepository.create(request.body);
    //     return await this.userRepository.save(user);
    // }

    // async remove(request: Request, response: Response, next: NextFunction) {
    //     let userToRemove = await this.userRepository.findOne(request.params.id);
    //     await this.userRepository.remove(userToRemove);
    // }

    // async findByToken(token) {
    //     console.log(jwt.verify(token, process.env.SECRET));
    // }
}