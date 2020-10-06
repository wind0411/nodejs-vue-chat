/**
 * https://expressjs.com/ja/
 */

import express, { Express, Request, Response, NextFunction } from 'express'
import router from '@/routes/router'
import cookieParser from 'cookie-parser'
import logger from 'morgan'

const app: Express = express()

/**
 * consoleにログを出力する
 */
// app.use(logger('dev'))
/**
 * CORSの設定（許可）
 * ローカル以外からAPIを実行した場合のアクセスを許可する
 * https://yamory.io/blog/about-cors/
 */
app.use((request: Request, response: Response, next: NextFunction) => {
  response.header('Access-Control-Allow-Origin', '*')
  response.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  )
  next()
})

/**
 * クライアント経由でデータを取得する場合はbody-parserが必要
 * この機能を搭載しているメソッド
 * req.body 経由で取得可能
 */
app.use(express.json())
/**
 * urlエンコードを行う
 * extended: true (qsライブラリを使用してクエリストリングをJSON形式で取得)
 */
app.use(express.urlencoded({ extended: true }))
/**  ルーティング */
app.use(router)
app.use(cookieParser())
app.listen(process.env.PORT || 3000, () => {
  console.log('vue-chat-server start...')
})

export default app
