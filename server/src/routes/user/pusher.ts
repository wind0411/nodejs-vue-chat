import Express, { Router } from 'express'
import PusherController from '@/controllers/user/pusher'
const resource = '/user/pusher'
const userPusherRouter: Router = Express.Router()

userPusherRouter.post(`${resource}/messages`, PusherController.postMessage)
userPusherRouter.post(`${resource}/auth`, PusherController.authenticate)
export { userPusherRouter }
