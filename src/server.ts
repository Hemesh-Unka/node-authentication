import app from "./app";
import { createConnection } from "typeorm";

const PORT: number = 3000;

createConnection(process.env.NODE_ENV).then(async connection => {
  console.log(`TypeORM connection created on port ${process.env.DB_PORT}.`);

  app.listen(PORT, () => {
    console.log(`Express server has started on port ${PORT}.`);
  });

}).catch(e => console.log(e));

export default app;