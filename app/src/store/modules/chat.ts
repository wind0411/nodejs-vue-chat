import store from '@/store'
import merge from 'lodash/merge'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import { IMessage } from '@/types/interfaces'
import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule,
} from 'vuex-module-decorators'
//apis
import PusherRepository from '@/api/resource/pusher'
// libaries
import PusherClient, {
  ChannelType,
  IEventBind,
  ChannelPrefix,
} from '@/lib/external/pusher'
import { initialStorage } from '@/store/storage'

/**
 * チャットモジュールの状態インターフェース
 */
export interface IChatState {
  userName: string
  channel: string
  channelType: ChannelType
  event: string
  messages: Array<IMessage>
}

/**
 * チャットに使用するデータの状態管理
 * vuex-persistedstateライブラリにより一部の情報をlocalstorageに保持し、
 * チャット画面(子ウィンドウ)に値を渡しています。
 */
@Module({
  dynamic: true,
  name: 'chat',
  namespaced: true,
  store,
  // preserveState: Boolean(initialStorage['vuxChat']),
  preserveState: false,
})
export default class ChatModule extends VuexModule implements IChatState {
  /**
   * @property { string } userName - チャット時に使用するユーザ名
   */
  userName: string = ''
  /**
   * @property { string } channel - チャンネル名
   */
  channel: string = ''
  /**
   * @property { ChannelType } channelType - チャンネル種別名
   */
  channelType: ChannelType = 'public' as ChannelType
  /**
   * @property { string } event - イベント名
   */
  event: string = ''
  /**
   * @property { Array<IMessage> } messages - チャットメッセージ履歴
   */
  messages: Array<IMessage> = [] as Array<IMessage>
  /**
   * @property { Function } callback - メッセージ受信時のコールバックメソッド
   */
  callback: Function | null = null
  /**
   * @property { PusherClient } pusher - Pusherのクライアントモジュール管理用
   */
  // pusher: PusherClient | null = null
  pusher?: PusherClient

  /**
   * ストアへのチャンネル名保存
   * @param { string } channel - チャンネル名
   */
  @Mutation
  public SET_CHANNEL(channel: string): void {
    this.channel = channel
  }
  /**
   * ストアへのチャンネル種別保存
   * @param { ChannelType } channelType - チャンネル種別
   */
  @Mutation
  public SET_CHANNEL_TYPE(channelType: ChannelType): void {
    this.channelType = channelType
  }
  /**
   * ストアへのイベント名保存
   * @param { string } event - イベント名
   */
  @Mutation
  public SET_EVENT_NAME(event: string): void {
    this.event = event
  }
  /**
   * ストアへのイベントコールバック関数保存
   * @param { Function } callback - コールバック関数
   */
  @Mutation
  public SET_EVENT_CALLBACK(callback: Function): void {
    this.callback = callback
  }
  /**
   * ストアへのメッセージ保存
   * @param { IMessage } message - メッセージ情報
   */
  @Mutation
  public SET_MESSAGE(message: IMessage): void {
    this.messages.push(message)
  }
  /**
   * ストアへのメッセージ履歴一覧保存
   * @param { Array<IMessage> } messages - メッセージ履歴
   */
  @Mutation
  public SET_MESSAGES(messages: Array<IMessage>): void {
    this.messages = messages
  }
  /**
   * ストアへのユーザ名保存
   * @param { string } userName - ユーザ名
   */
  @Mutation
  public SET_USER_NAME(userName: string): void {
    this.userName = userName
  }
  /**
   * メッセージ一覧
   * @returns { Array<IMessage> } メッセージ情報一覧
   */
  get messageList(): Array<IMessage> {
    return this.messages
  }
  /**
   * ユーザ名
   * @returns { string } ユーザ名
   */
  get user(): string {
    return this.userName
  }
  /**
   * メッセージを送信
   * @param { string } content - 送信内容テキスト
   */
  @Action({ rawError: true })
  public async send(content: string): Promise<void> {
    const uuid = uuidv4()
    const message = (myself: boolean): IMessage => {
      return {
        id: uuid, // IDは動的に付与
        sendUserName: this.user,
        isMyself: myself,
        createdAt: dayjs().format('HH:mm'),
        message: content,
      } as IMessage
    }
    // 自分のメッセージ
    this.SET_MESSAGE(message(true))
    // apiコール(メッセージ送信)
    await PusherRepository.messages.post(
      merge(
        { message: message(false) },
        {
          channel: `${ChannelPrefix[this.channelType]}${this.channel}`,
          event: this.event,
          channelType: this.channelType,
        },
      ),
    )
  }

  /**
   * メッセージの購読
   * @param { string } data - チャンネル名
   */
  @Action({ rawError: true })
  public subscribe(data: string): void {
    if (!this.pusher) this.pusher = new PusherClient()
    this.SET_CHANNEL(data)
    this.pusher?.subscribe(data, this.channelType)
  }

  /**
   * イベントにコールバック関数をバインド
   * @param { IEventBind } data - イベントバインド用設定
   */
  @Action({ rawError: true })
  public bind(data: IEventBind): void {
    this.SET_EVENT_NAME(data.event)
    this.SET_EVENT_CALLBACK(data.callback)
    // メッセージを受信したときのコールバック
    this.pusher?.bind(data.event, data.callback)
  }

  /**
   * 接続の解除
   */
  @Action({ rawError: true })
  public disconnect(): void {
    if (this.pusher) {
      this.pusher.unbind(this.event)
      this.pusher.unsubscribe()
      this.pusher.disconnect()
    }
    this.SET_EVENT_NAME('')
    this.SET_EVENT_CALLBACK({} as Function)
    this.SET_CHANNEL('')
    this.SET_MESSAGES([])
  }

  /**
   * ユーザ設定
   * @param { string } name - ユーザ名
   */
  @Action({ rawError: true })
  public setUser(name: string): void {
    this.SET_USER_NAME(name)
  }
}
export const chatModule = getModule(ChatModule)
