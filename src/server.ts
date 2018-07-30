import app from './app';
import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';
import { createConnection } from "typeorm";

const PORT: number = 3000;

const httpsOptions: object = {
  key: fs.readFileSync(path.join(__dirname, './config/key.pem')),
  cert: fs.readFileSync(path.join(__dirname, './config/cert.pem'))
};

createConnection().then(async connection => {
  console.log('TypeORM connection created.')
  https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(`Express server has started on port ${PORT}.`);
  });

  // // Set up some test users
  // await connection.manager.save(connection.manager.create(User, {
  //   email: "timbersaw@isemail.com",
  //   password: "timbersaw123"
  // }));

  // await connection.manager.save(connection.manager.create(User, {
  //   email: "phantomassassin",
  //   password: "phantomassaasin123"
  // }));

}).catch(e => console.log(e));
