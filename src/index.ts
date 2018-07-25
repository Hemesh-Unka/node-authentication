import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as morgran from "morgan";
import { Request, Response } from "express";
import { Routes } from "./routes";
import { User } from "./entity/User";

createConnection().then(async connection => {

    // create express app
    const app = express();
    app.use(bodyParser.json());
    app.use(morgran('dev'));

    // register express routes from defined application routes
    Routes.forEach(route => {
        (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next);
            if (result instanceof Promise) {
                result.then((result) => {
                    if (result !== null && result !== undefined) {
                        // A promise, but does not have a error
                        res
                            .header('X-auth', result.access_token)
                            .status(200)
                            .send(result);
                    } else {
                        // A promise, but does have a error
                        undefined;
                    }
                }).catch((e) => {
                    // Is a promise, but it is an error
                    res
                        .status(400)
                        .send(e)
                })
            } else if (result !== null && result !== undefined) {
                // Not a promise
                res
                    .header('X-auth', 'result')
                    .status(200)
                    .json(result);
            }
        });
    });

    // start express server
    app.listen(3000);

    // insert new users for test
    await connection.manager.save(connection.manager.create(User, {
        email: "timbersaw@isemail.com",
        password: "timbersaw123"
    }));

    await connection.manager.save(connection.manager.create(User, {
        email: "phantomassassin",
        password: "phantomassaasin123"
    }));

    console.log("Express server has started on port 3000. Open http://localhost:3000/users to see results");

}).catch(error => console.log(error));
