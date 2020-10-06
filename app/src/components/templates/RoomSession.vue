<template>
  <div class="room-session">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="10" md="8" lg="4" xl="3">
          <v-card>
            <v-form ref="enterform" @submit.prevent>
              <v-alert type="info" :color="theme.color">
                {{ `${theme.label}チャンネル` }}
              </v-alert>
              <v-text-field
                :disabled="!enabled"
                v-model="username"
                label="ユーザ名を入力(ex:テスト太郎)"
                :rules="[required, limitLength]"
                counter="10"
                class="mx-10"
              />
              <v-card-actions class="justify-center">
                <v-btn @click.stop="showChat" :disabled="!enabled">入室</v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch, Emit } from 'vue-property-decorator'
// components
import Chat from '@/components/pages/Chat.vue'
// stores
import { chatModule } from '@/store/modules/chat'
// liraries
import {
  ChannelType,
  isChannelType,
  channelTheme,
  IChannelTheme,
} from '@/lib/external/pusher'
// routes
import { Route } from 'vue-router'
Component.registerHooks(['beforeRouteEnter'])

/**
 * チャンネル接続用コンポーネント
 */
@Component({
  components: {
    Chat,
  },
})
export default class RoomSession extends Vue {
  /**
   * @property { boolean } enabled - コンポーネント全体の利用可否
   */
  private enabled: boolean = true
  /**
   * @property { string } username - ユーザ名
   */
  private username: string = ''
  /**
   * @property { Window } chatWindow - チャット画面
   */
  private chatWindow?: Window
  /**
   * @property { IChannelTheme } theme - 画面テーマ設定(public/private/encrypt)
   */
  private theme: IChannelTheme = { textColor: '', color: '', label: '' }
  /**
   * @property { ChannelType } channelType - チャンネル種別
   */
  private channelType: ChannelType = 'public' as ChannelType
  /**
   * バリデーション処理: required
   * 値が入力されていない場合に必須である旨を通知します。
   */
  private required = (value: string): any => !!value || '必ず入力してください。'
  /**
   * バリデーション処理: limitLength
   * 文字数が10文字を超えた場合に範囲外である旨を通知します。
   */
  private limitLength = (value: string): any =>
    value.length <= 10 || '10文字以内で入力してください。'

  /**
   * Emit
   * ヘッダーボタンに対して制御をかける
   */
  @Emit('headerButtonEnableChanged')
  enableChanged(value: boolean): void {}

  /**
   * Watch [enabled]
   * 利用可否変更時に親コンポーネントに制御を伝搬する
   */
  @Watch('enabled')
  enabledChanged(value: boolean): void {
    this.enableChanged(value)
  }

  /**
   * マウント完了後
   */
  mounted(): void {
    if (this.$route.params.type && isChannelType(this.$route.params.type)) {
      chatModule.SET_CHANNEL_TYPE(this.$route.params.type as ChannelType)
      this.channelType = this.$route.params.type as ChannelType
    }

    // リロード前にコネクション解除
    window.addEventListener('beforeunload', e => {
      this.chatWindow?.close()
    })
    this.theme = channelTheme(this.channelType)
  }
  /**
   * ルーティング遷移前の処理
   */
  beforeRouteEnter(to: Route, from: Route, next: any): void {
    next(vm => {
      if (!from.matched.length) {
        vm.$router.replace({ path: '/' })
      }
    })
  }

  /**
   * チャット画面を表示します。
   * 子ウィンドウを開き、親ウィンドウの状態と連動した動作を設定します。
   */
  private async showChat(): Promise<void> {
    // @ts-ignore
    if (!this.$refs.enterform.validate()) return
    chatModule.setUser(this.username)
    this.chatWindow =
      window.open('/chat', '_blank', 'width=600,height=800') ?? undefined
    // 親ウィンドウ側でイベント制御を行い、子ウィンドウの表示状態を管理する
    this.chatWindow?.addEventListener('beforeunload', e => {
      chatModule.disconnect()
      this.enabled = true
    })
    this.enabled = false
  }
}
</script>
<style lang="scss"></style>
