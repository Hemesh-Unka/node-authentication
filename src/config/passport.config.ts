import * as passport from 'passport';
import * as passportJWT from 'passport-jwt';
import { User } from '../entity/User';
import { getRepository } from '../../node_modules/typeorm';

export default class PassportConfig {
  public static init() {
    passport.use(new passportJWT.Strategy({
      jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeader(),
      secretOrKey: process.env.SECRET
    }, async (payload: any, done: any) => {
      try {
        // Find the user specified in the token
        const user = await getRepository(User).findOne({ uuid: payload.sub });

        //If user does not exist
        if (!user) {
          return done(null, false);
        };

        // Return the user
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }))
  }
}

