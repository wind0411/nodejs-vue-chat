<template>
  <div class="chat-history">
    <v-container ref="messages" class="chat-top__fixed white">
      <v-row>
        <v-col cols="auto" class="flex-grow-1 px-0">
          <v-responsive class="overflow-hidden">
            <v-card flat class="d-flex flex-column">
              <v-card-text class="flex-grow-1 overflow-y-auto">
                <template v-for="(item, index) in messages">
                  <chat-line :message="item" :key="index" />
                </template>
                <div id="last_bottom" ref="chat" />
              </v-card-text>
            </v-card>
          </v-responsive>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
// components
import ChatLine from '@/components/molecules/ChatLine.vue'
// interfaces
import { IMessage } from '@/types/interfaces'

/**
 * チャットの履歴用コンポーネント
 */
@Component({
  components: {
    ChatLine,
  },
})
export default class ChatHistory extends Vue {
  /**
   * Prop
   * @property { Array<IMessage> } messages - メッセージ一覧
   */
  @Prop({ default: () => [] })
  messages?: Array<IMessage>

  /**
   * 履歴の一番下の吹き出しまでスクロールします。
   * @todo
   *  メッセージを受け取っている間、ブラウザ（タブ）が非フォーカスの場合
   *  フォーカス（アクティブ）になった瞬間に受信した数だけ本メソッドが呼ばれてしまう
   *  調査中
   */
  scrollToEnd(): void {
    this.$nextTick(function() {
      // @ts-ignore
      this.$scrollTo(this.$refs.chat, 300, {
        container: this.$refs.messages,
        force: false,
      })
    })
  }
}
</script>
<style lang="scss" scoped>
.chat-top__fixed {
  padding: 60px;
  position: fixed;
  width: 100%;
  max-width: 100%;
  overflow-y: auto;
  height: calc(100% - 215px);
}
.container {
  .row {
    .v-card__text.overflow-y-auto {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .v-card__text.overflow-y-auto::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
