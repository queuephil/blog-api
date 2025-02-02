import express from 'express'
import cors from 'cors'
import passport from './config/passport.js'
import router_posts from './routes/router_posts.js'

const app = express()

app.use(cors())

app.use(express.urlencoded({ extended: true })) // for req.body
app.use(express.json()) // for JSON

app.use(passport.initialize())

// extract to router / controller
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
app.post('/login', (req, res) => {
  const payload = { email: process.env.JWT_PAYLOAD }
  const secretKey = process.env.JWT_SECRET
  const options = { expiresIn: '7d' }
  const token = jwt.sign(payload, secretKey, options)
  return res.json({ token })
})

app.use('/posts', router_posts)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server listening on port ${PORT}!`))
