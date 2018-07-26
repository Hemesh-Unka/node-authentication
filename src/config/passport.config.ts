import 'dotenv/config';
import * as passport from 'passport';
import * as passportJWT from 'passport-jwt';
import * as passportLocal from 'passport-local';
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
}));

passport.use(new passportLocal.Strategy({
  usernameField: 'email'
}, async (email, password, done) => {
  try {
    // Find the user from the email
    const user = await getRepository(User).findOne({ email })

    // If user does not exist
    if (!user) {
      return done(null, false);
    };

    // Check if password is correct
    const isMatch = await user.validatePassword(password);

    // If not correct password
    if (!isMatch) {
      return done(null, false);
    }

    // Return the user
    done(null, user);

  } catch (error) {
    done(error, null);
  }
}));