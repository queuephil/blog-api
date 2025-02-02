import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()
const controller = {}

controller.get = async (req, res) => {
  try {
    const posts = await prisma.post.findMany()
    return res.json(posts)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch posts' })
  }
}

controller.post = async (req, res) => {
  try {
    const { text } = req.body
    const postingUser = await prisma.user.findUnique({
      where: { username: process.env.SUPERUSER_USERNAME },
    })
    const userId = postingUser.id
    const post = await prisma.post.create({
      data: {
        text,
        userId,
      },
    })
    return res.json(post)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create post' })
  }
}

controller.put = async (req, res) => {
  try {
    const { postId } = req.params
    const { text } = req.body
    const post = await prisma.post.update({
      where: { id: parseInt(postId) },
      data: { text },
    })
    return res.json(post)
  } catch (error) {
    return res.status(404).json({ error: 'Post not found' })
  }
}

controller.delete = async (req, res) => {
  try {
    const { postId } = req.params
    const post = await prisma.post.delete({
      where: { id: parseInt(postId) },
    })
    return res.json(post)
  } catch (error) {
    return res.status(404).json({ error: 'Post not found' })
  }
}

export default controller
