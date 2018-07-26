import "reflect-metadata";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as morgan from "morgan";

import { Routes } from "./routes";

class App {
    public app: express.Application;
    public routePrv: Routes = new Routes();

    constructor() {
        this.app = express();
        this.config();
        this.routePrv.routes(this.app);
    }

    private config(): void {
        this.app.use(bodyParser.json());
        this.app.use(morgan('dev'));
    }
}

export default new App().app;