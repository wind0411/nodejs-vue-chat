import api from '@/api/api'
import { AxiosResponse, AxiosError } from 'axios'
import protect, { Result } from 'await-protect'
// 共通url
const resource = '/user/pusher'

/**
 * Pusher(バックエンド)への通信を行うAPIモジュール
 * messages: メッセージの送受信（WebSockert）を行います。
 * auth: 認証処理を行います。この機能は「private」「presence」チャンネルで機能します。
 */
export default {
  messages: {
    /**
     * WebSocketで接続されたチャンネルからのデータを受信する
     */
    async get(): Promise<Result<AxiosResponse, AxiosError>> {
      return protect(api.get(`${resource}/messages`))
    },
    /**
     * WebSocketで接続されたチャンネルに対してデータを送信する
     * @param { any } data - メッセージ情報
     */
    async post(data: any): Promise<Result<AxiosResponse, AxiosError>> {
      return protect(api.post(`${resource}/messages`, data))
    },
  },
  auth: {
    /**
     * Pusherへの認証を行う
     * @param { any } data - 認証情報
     */
    async post(data: any): Promise<Result<AxiosResponse, AxiosError>> {
      return protect(api.post(`${resource}/auth`, data))
    },
  },
}
