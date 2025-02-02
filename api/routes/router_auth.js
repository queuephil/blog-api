import express from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const prisma = new PrismaClient()
const router = express.Router()

router.post('/login', async (req, res) => {
  const { username, password } = req.body
  try {
    const user = await prisma.user.findUnique({ where: { username } })
    if (!user) return res.status(401).json({ error: 'Invalid username' })

    const validPw = await bcrypt.compare(password, user.password)
    if (!validPw) return res.status(401).json({ error: 'Invalid password' })

    const payload = { username: user.username }
    const secretKey = process.env.JWT_SECRET
    const options = { expiresIn: '7d' }
    const token = jwt.sign(payload, secretKey, options)
    return res.json({ token })
  } catch (error) {
    return res.status(500).json({ error: 'Login failed' })
  }
})

export default router
