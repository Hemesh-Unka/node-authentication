import { createTypeormConn } from "./utils/createTypeormConn.utils";
import { App } from "./app";

const PORT = process.env.PORT || 3000;

export const startServer = async () => {
  const server = new App();
  await createTypeormConn();
  const app = await server.app.listen(PORT);
  console.log(`Express server has started on port ${PORT}.`);

  return app;
};
