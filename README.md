# Node API Authentication

A small express app to research and test out implementing some Node API security techniques.

Steps to run this project:

1. Run `npm i` command
2. Ensure you have `postgress` installed locally
2. Add a .env file in the home directory with the following (DB_HOST, DB_PORT, DB_USERNAME, DB_Password) and JWT_SECRET (JWT JWT_SECRET string).
3. Run `npm run dev` command
4. Visit `localhost:3000/users` with postman

# Good resources
- https://www.youtube.com/watch?v=zx6jnaLuB9Q (Video tutorial)
- https://medium.freecodecamp.org/securing-node-js-restful-apis-with-json-web-tokens-9f811a92bb52 (General overview with JWT)
- https://itnext.io/building-restful-web-apis-with-node-js-express-mongodb-and-typescript-part-1-2-195bdaf129cf - (A nice architectural style for a express app)
- https://blog.nodeswat.com/implement-access-control-in-node-js-8567e7b484d1 (Access control in Node)

# Known bugs
- Throw an error if a rule already exists under the role

# Handover
- Having issues to mock an http request. What I Would like to acheive is a mock request in the Role controller to to return an error. I could do this two ways: arry this out by deleting all roles (key contraints) or mock the request out using sinon (harder than it should be).