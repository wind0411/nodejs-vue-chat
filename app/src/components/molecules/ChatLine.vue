<template>
  <div class="chat-line">
    <div
      class="message__Item d-flex"
      :class="{ 'flex-row-reverse': message.isMyself }"
    >
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-avatar
            size="48"
            v-on="on"
            :class="`pa-2 my-2 ${getBackColorClass(message.isMyself)}`"
          >
            <span
              class="white-text headline"
              :class="getTextColorClass(message.isMyself)"
              >{{ message.sendUserName.substring(0, 1) }}</span
            >
          </v-avatar>
        </template>
        <span>{{ message.sendUserName }}</span>
      </v-tooltip>
      <v-chip
        align="right"
        :class="
          `pa-4 ma-2 message__text ${getBackColorClass(
            message.isMyself,
          )} ${getTextColorClass(message.isMyself)}`
        "
        ><div align="left">
          {{ message.message }}
        </div>
        <sub class="message__datetime ml-2">
          {{ message.createdAt }}
        </sub>
      </v-chip>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
// interfaces
import { IMessage } from '@/types/interfaces'

/**
 * Chatの吹き出し用コンポーネント
 * @todo
 *  本クラスで定義しているようなメソッドは、本来organismsからProp経由で伝搬されるべき内容です。
 *
 */
@Component
export default class ChatLine extends Vue {
  /**
   * Prop
   * @property { IMessage } messages - メッセージ情報
   */
  @Prop({
    default: {
      id: '',
      message: '',
      sendUserName: '',
      isMyself: true,
      createdAt: '',
    },
  })
  message?: IMessage

  /**
   * 吹き出しのテキスト色クラスを返却します。
   * @param { boolean } myself - 自身の入力かどうか
   */
  private getTextColorClass(myself: boolean): string {
    return myself ? 'white--text' : 'black--text'
  }
  /**
   * 吹き出しの背景色クラスを返却します。
   * @param { boolean } myself - 自身の入力かどうか
   */
  private getBackColorClass(myself: boolean): string {
    return myself ? 'primary' : 'grey lighten-3'
  }
}
</script>
<style lang="scss" scoped>
.message__text {
  height: auto !important;
  white-space: normal;
  max-width: 45%;
  ::v-deep .v-chip__content {
    word-break: break-all !important;
    // width: 100%;
    .message__datetime {
      font-size: 0.5rem;
      min-width: 30px;
    }
  }
}
</style>
