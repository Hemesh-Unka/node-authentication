// Joi is a helper to validate objects from the body side

// import * as Joi from 'joi';

// export class RouteHelpers {
//   authSchema = {
//     email: Joi.string().email().required(),
//     password: Joi.string().required()
//   };

//   validateBody(schema) {
//     return (req, res, next) => {
//       const result = Joi.validate(req.body, this.authSchema);

//       if (result.error) {
//         return res.status(400).json(result.error);
//       };

//       if(!req.value) { req.value = {}; };
//       req.value['body'] = result.value;
//       next();
//     }
//   }
// }