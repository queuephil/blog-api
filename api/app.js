import express from 'express'
import cors from 'cors'
import passport from './config/passport.js'
import router_posts from './routes/router_posts.js'
import router_auth from './routes/router_auth.js'

const app = express()

app.use(express.urlencoded({ extended: true })) // for req.body
app.use(express.json())
app.use(cors())
app.use(passport.initialize())

app.use('/posts', router_posts)
app.use('/auth', router_auth)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server listening on port ${PORT}!`))
