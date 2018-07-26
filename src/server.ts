import app from './app';
import { createConnection } from "typeorm";
import { User } from "./entity/User"

const PORT: number = 3000;

createConnection().then(async connection => {
  console.log('TypeORM connection created.')
  app.listen(PORT, () => {
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
