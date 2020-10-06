import { Request, Response } from 'express'
import Pusher from 'pusher'
import merge from 'lodash/merge'
import get from 'lodash/get'
export const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID ?? '',
  key: process.env.PUSHER_APP_KEY ?? '',
  secret: process.env.PUSHER_APP_SECRET ?? '',
  cluster: process.env.PUSHER_APP_CLUSTER ?? '',
  useTLS: true,
  encryptionMasterKeyBase64: process.env.PUSHER_APP_ENCRYPTED_MASTER_KEY,
})

/**
 * Pusher用処理のコントローラー
 */
export default {
  /**
   * Pusherに対してメッセージを送信
   * /user/pusher/messages
   * @param { Request } req - リクエスト
   * @param { Response } res - レスポンス
   * @return { Response } - 返却データ
   */
  postMessage(req: Request, res: Response): Response {
    try {
      /** @todo ログをdbに保存 */
      pusher.trigger(
        req.body.channel ?? '',
        req.body.event ?? '',
        merge(req.body.message, { isMyself: false })
      )
      return res.status(200).json('success')
    } catch (e) {
      if (e.message) {
        return res.status(400).json(e.message)
      } else {
        return res.status(400).json('システムエラー発生')
      }
    }
  },
  /**
   * Pusherの認証機能
   * @param { Request } req - リクエスト
   * @param { Response } res - レスポンス
   * @return { Response } - 返却データ
   */
  authenticate(req: Request, res: Response): Response {
    try {
      /**
       * @todo
       * 本来はここでユーザ認証を行う
      */
      const socketId = req.body.socket_id
      const channel = req.body.channel_name
      console.log(req)
      /**@todo presenseにも適用させる */
      const auth = pusher.authenticate(socketId, channel)
      return res.send(auth)
    } catch (e) {
      if (e.message) return res.status(403).json(e.message)
      return res.status(403).json('システムエラー発生')
    }
  }
}