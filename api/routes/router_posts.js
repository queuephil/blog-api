import express from 'express'
import passport from 'passport'
import controller from '../controllers/controller_posts.js'

const router = express.Router()

router.get('/', controller.get)

router.use(passport.authenticate('jwt', { session: false })) // below is protected

router.post('/', controller.post)
router.put('/:postId', controller.put)
router.delete('/:postId', controller.delete)

export default router
