import { users, posts } from '../db.js' // replace with db

const controller = {}

controller.get = (req, res) => {
  return res.json(Object.values(posts))
}

controller.post = (req, res) => {
  const id = crypto.randomUUID()
  const { text } = req.body
  const userId = users[1] // replace with username / id
  const post = {
    id,
    text,
    userId,
  }
  posts[id] = post
  return res.json(post)
}

controller.put = (req, res) => {
  const { postId } = req.params
  const { text } = req.body
  if (!posts[postId]) return res.status(404).json('404 Not Found')
  posts[postId].text = text
  return res.json(posts[postId])
}

controller.delete = (req, res) => {
  const { postId } = req.params
  if (!posts[postId]) return res.status(404).json('404 Not Found')
  const post = posts[postId]
  delete posts[postId]
  return res.json(post)
}

export default controller
