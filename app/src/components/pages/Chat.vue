<template>
  <div class="chat">
    <chat-history :messages="messages" ref="history" />
    <div class="chat-bottom__fixed px-4">
      <v-text-field
        v-model="content"
        label="入力してください。"
        type="text"
        no-details
        append-outer-icon="mdi-send"
        hide-details
        :rules="[limitLength]"
        @keyup.enter="sendMessage(content)"
        @click:append-outer="sendMessage(content)"
        :disabled="!enabled"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
// components
import ChatHistory from '@/components/organisms/ChatHistory.vue'
// libraries
import VueScrollTo from 'vue-scrollto'
import filter from 'lodash/filter'
// interfaces
import { IMessage } from '@/types/interfaces'
import { IEventBind } from '@/lib/external/pusher'
// store
import { chatModule } from '@/store/modules/chat'
import { secureStorage } from '@/store/storage'
import { ChannelType } from '@/lib/external/pusher'

Vue.use(VueScrollTo)

/**
 * チャット画面用のメインコンポーネント
 */
@Component({
  components: {
    ChatHistory,
  },
})
export default class Chat extends Vue {
  /**
   * @property { boolean } enabled - 処理中の操作ロック
   */
  private enabled: boolean = false
  /**
   * @property { string } content - 送信（入力）テキスト
   */
  private content?: string = ''
  /**
   * @prop { Array<IMessage> } messages - メッセージ情報一覧
   */
  private messages: Array<IMessage> = []
  /**
   * バリデーション処理: required
   * 値が入力されていない場合に必須である旨を通知します。
   */
  private required = (value: string): any => !!value || '必ず入力してください。'
  /**
   * バリデーション処理: limitLength
   * 文字数が100文字を超えた場合に範囲外である旨を通知します。
   */
  private limitLength = (value: string): any =>
    value.length <= 100 || '100文字以内で入力してください。'

  /**
   * マウント完了後の処理
   */
  mounted(): void {
    this.initialize()
  }

  /**
   * Pusherの設定を行います。
   */
  initialize(): void {
    // localstorageのキー名: vuexChatに格納された値をモジュールに反映する
    if (secureStorage.get('vuexChat')) {
      const data = JSON.parse(secureStorage.get('vuexChat') ?? '{}')
      // if (chatModule) {
      if (chatModule.user != null && data.chat && data.chat.userName)
        chatModule.SET_USER_NAME(data.chat.userName)
      if (data.chat.channel) chatModule.SET_CHANNEL(data.chat.channel)
      if (data.chat.channelType)
        chatModule.SET_CHANNEL_TYPE(data.chat.channelType as ChannelType)
      // }
    }

    console.log('initialized')
    this.messages = chatModule.messageList
    // 受信接続
    chatModule.subscribe('test')
    // トリガー時の処理
    chatModule.bind({
      event: 'client-message',
      callback: this.receiveMessage,
    } as IEventBind)
    this.enabled = true
  }
  /**
   * メッセージをPusher経由で受信した際のコールバック
   * @param { IMessage } message - メッセージ情報
   */
  receiveMessage(message: IMessage): void {
    // すでに存在するidの場合は追加しない
    if (filter(chatModule.messageList, v => v.id === message.id).length === 0) {
      chatModule.SET_MESSAGE(message)
    }
    // 受信後にスクロール
    // @ts-ignore
    this.$refs.history.scrollToEnd()
  }
  /**
   * メッセージをPusher経由で送信します。
   * @param { string } content - 送信テキスト情報
   */
  sendMessage(content: string): void {
    this.enabled = false
    if (content) {
      chatModule.send(content)
      // @ts-ignore
      this.$refs.history.scrollToEnd()
      this.content = ''
    }
    this.enabled = true
  }
}
</script>
<style lang="scss" scoped>
.chat-bottom__fixed {
  position: fixed;
  margin-bottom: 25px;
  height: 75px;
  bottom: 0;
  width: 100%;
}
</style>
