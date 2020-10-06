import Express, { Router } from 'express'
import { userPusherRouter } from '@/routes/user/pusher'
const router: Router = Express.Router()

router.use('/api', userPusherRouter)
export default router
