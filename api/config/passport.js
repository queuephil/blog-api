import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import dotenv from 'dotenv'
dotenv.config()

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
}

passport.use(
  new JwtStrategy(options, (jwt_payload, done) => {
    if (jwt_payload.email === process.env.JWT_PAYLOAD) {
      return done(null, true)
    }
    return done(null, false)
  })
)

export default passport
