import 'dotenv/config';
import * as passport from 'passport';
import * as passportJWT from 'passport-jwt';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';

passport.use(new passportJWT.Strategy({
  jwtFromRequest: passportJWT.ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.SECRET
}, async (payload: any, next: any) => {
  try {
    // Find the user specified in the token
    const user = await getRepository(User).findOne({ uuid: payload.sub });

    //If user does not exist
    if (!user) {
      return next(null, false);
    };

    // Return the user
    next(null, user);
  } catch (error) {
    next(error, null);
  }
}))