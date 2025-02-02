import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

dotenv.config()

// create superuser
const prisma = new PrismaClient()
const createSuperuser = async () => {
  const foundUser = await prisma.user.findUnique({
    where: { username: process.env.SUPERUSER_USERNAME },
  })
  if (foundUser) return

  const hashedPassword = await bcrypt.hash(process.env.SUPERUSER_PASSWORD, 10)
  await prisma.user.create({
    data: {
      username: process.env.SUPERUSER_USERNAME,
      password: hashedPassword,
    },
  })
}
createSuperuser()

// setup JWT
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
}
passport.use(
  new JwtStrategy(options, (jwt_payload, done) => {
    if (jwt_payload.username === process.env.SUPERUSER_USERNAME) {
      return done(null, true)
    }
    return done(null, false)
  })
)

export default passport
