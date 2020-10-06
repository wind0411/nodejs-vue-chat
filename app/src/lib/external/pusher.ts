/* eslint-disable no-console */
import Pusher, { Channel } from 'pusher-js/with-encryption'
import PusherRepository from '@/api/resource/pusher'
import {
  AuthorizerOptions,
  AuthorizerCallback,
  Authorizer,
} from 'pusher-js/types/src/core/auth/options'
import get from 'lodash/get'

/**
 * チャンネル接頭辞リスト
 * Pusherでのチャンネル名に必要な接頭辞を自動で付与するために使用します。
 */
export const ChannelPrefix = {
  public: 'public-',
  private: 'private-',
  encrypted: 'private-encrypted-',
  presence: 'presence-',
} as const
/**
 * チャンネルタイプ
 * ChannelPrefixのキー名をtypeとして定義します
 */
export type ChannelType = keyof typeof ChannelPrefix
// タイプガード
export const isChannelType = (val: any): val is ChannelType => {
  return true
}

/**
 * PusherのBind処理に必要な設定インターフェース
 * @property { string } event - イベント名
 * @property { Function } callback - 発火するイベントのコールバック関数
 */
export interface IEventBind {
  event: string
  callback: Function
}

/**
 * チャンネルテーマ用インターフェース
 * @property { string } textColor - 文字色
 * @property { string } color - 背景色
 * @property { string } label - 表示ラベル
 */
export interface IChannelTheme {
  textColor: string
  color: string
  label: string
}

/**
 * チャンネルタイプに適するテーマ取得
 * @param { ChannelType } data - チャンネルタイプ
 */
export const channelTheme = (data: ChannelType): IChannelTheme => {
  if (data === 'private')
    return { textColor: 'black', color: 'grey lighten-1', label: '非公開' }
  if (data === 'encrypted')
    return { textColor: 'white', color: 'black', label: '暗号化' }
  // if (data === 'presence')
  //   return { textColor: 'white', color: 'green darken-1', label: 'プレゼンス' }
  return { textColor: 'white', color: 'info', label: '公開' }
}

/**
 * @todo presence用ですが、未実装です。
 */
export interface IPusherUser {
  id: string
  userName: string
}
/**
 * Pusherのクライアント用class
 */
export default class PusherClient {
  /**
   * @property { Pusher } app - Pusherアプリケーションインスタンス
   */
  app?: Pusher
  /**
   * @property { Channel } channel - Pusherで定義されたChannelクラス
   */
  channel?: Channel

  /**
   * コンストラクタ
   */
  constructor() {
    this.create()
  }

  /**
   * インスタン生成
   */
  create(): void {
    /**
     * @todo
     * 一旦は固定
     */
    this.app = new Pusher(process.env.VUE_APP_PUSHER_APP_KEY, {
      /** アプリケーションが作成されたクラスター */
      cluster: process.env.VUE_APP_PUSHER_APP_CLUSTER,
      /** TLS経由で接続するかどうか */
      //forceTLS: true,
      /**
       * プライベートチャネル、プレゼンスチャネルに必要な認証署名を返す
       * サーバ上のエンドポイント
       * */
      authEndpoint: `http://localhost:${process.env.VUE_APP_SERVER_PORT}/api/user/pusher/auth`,
      /**
       * 認証エンドポイントの呼び出し方法
       * - ajax (default)
       * - jsop
       * */
      // authTransport: 'ajax'
      /**
       * auth オブジェクト
       * - params
       *  認証エンドポイントに対する送信パラメータ
       * - headers
       *  ajax認証のみ。
       *  追加でHTTPヘッダーを付与するパラメータ
       *  認証用のAPIで使用するようなトークンなどもheaderに設定しておく
       */
      // auth: {
      //   params: {
      //     // CSRFToken: 'token'
      //   },
      //   // headers: {
      //   //   'X-CSRF-Token' : 'token'
      //   // }
      // },
      //authorizer: this.authorizer,
      /** 統計収集を無効にする */
      // disableStats: true
      /** 接続を確立するためにチャネルが使用するトランスポート指定 */
      enabledTransports: ['ws', 'wss'],
      /** 使用できないトランスポート指定 */
      // disabledTransports: []
    })
    // this.app.connection.bind('error', (err: any) => {
    //   if (err.error.data.code === 4004) console.error('over limit...')
    // })
    Pusher.log = function(message): void {
      console.log(message)
    }
  }
  /**
   * 認証処理
   * @param { Channel } channel - チャンネル情報
   * @param { AuthorizerOptions } options - 認証オプション情報
   */
  authorizer(channel: Channel, options: AuthorizerOptions): Authorizer {
    return {
      authorize: async (
        socketId: string,
        callback: AuthorizerCallback,
      ): Promise<void> => {
        const result = await PusherRepository.auth.post({
          socket_id: socketId,
          channel_name: channel.name,
          options: options,
        })
        if (!result.ok) {
          // 失敗
          callback(true, {
            auth: '',
          })
        } else {
          // 成功
          callback(false, result.ok.data)
        }
      },
    }
  }
  /**
   * 接続の解除
   */
  disconnect(): void {
    console.log('disconnect')
    this.app?.disconnect()
  }

  /**
   * チャンネル登録
   * @param { string } channel - チャンネル名
   * @param { ChannelType } type - チャンネル種別
   */
  subscribe(channel: string, type: string): void {
    console.log(`channel-name:${ChannelPrefix[type]}${channel}`)
    this.channel = this.app?.subscribe(`${ChannelPrefix[type]}${channel}`)
  }

  /**
   * チャンネル解除
   * @param { string } channel - チャンネル名
   */
  unsubscribe(): void {
    if (this.channel) this.app?.unsubscribe(this.channel?.name)
  }

  /**
   * イベントの購読
   * 指定されたイベント名が受信された場合に実行される
   * @param { string } event - イベント名
   * @param { Function } callback - コールバックメソッド
   */
  bind(event: string, callback: Function): void {
    this.channel?.bind(event, callback)
  }

  /**
   * イベントの購読解除
   *
   * @param { string } event - イベント名
   * @param { string } handler - コールバック
   * @param { any? } context - コンテキスト
   */
  unbind(event: string, handler?: Function, context?: any): void {
    const param: Array<any> = [event]
    if (handler) param.push(handler)
    if (context) param.push(context)
    this.channel?.unbind(...param)
  }
}
