<template>
  <div class="page-header">
    <v-app-bar app :color="headerColor" dark height="60">
      <div class="d-flex align-center">
        <v-btn
          @click="buttonClick"
          tile
          class="ps-0"
          color="transparent"
          depressed
          large
          :disabled="!headerButton.enabled"
        >
          <v-icon v-if="headerButton.isVisibledIcon" large>{{
            headerButton.icon
          }}</v-icon>
          <span large class="mr-0">{{ headerButton.title }}</span>
        </v-btn>
      </div>
      <v-spacer></v-spacer>
    </v-app-bar>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Emit, Prop } from 'vue-property-decorator'
/**
 * 左端のボタン設定
 * @property { string } title - ボタンのラベル
 * @property { string } icon - icon名(vuetifyで利用できるicon名)
 * @property { boolean } isVisibledIcon - アイコンを表示するかどうか
 * @property { boolean } enabled - ボタンの利用可否
 */
export interface IHeaderButton {
  title?: string
  icon?: string
  isVisibledIcon?: boolean
  enabled?: boolean
}
/**
 * 共通ヘッダー用コンポーネント
 */
@Component
export default class PageHeader extends Vue {
  /**
   * Prop
   * @property { IHeaderButton } headerButton - ヘッダーボタン情報
   */
  @Prop({
    default: () => ({
      title: 'HOME',
      icon: 'mdi-vuetify',
      isVisibledIcon: false,
      enabled: true,
    }),
  })
  headerButton?: IHeaderButton
  /**
   * Prop
   * @property { string } headerColor - ヘッダーの背景色
   */
  @Prop({ default: 'primary' })
  headerColor?: string

  /**
   * Emit
   * 親コンポーネントの「headerButtonClick」イベントに処理を伝搬します。
   */
  @Emit('headerButtonClick')
  headerButtonClick(): void {}

  /**
   * ヘッダーボタン処理
   * 親コンポーネントに処理を伝搬します。
   */
  buttonClick(): void {
    this.headerButtonClick()
  }
}
</script>
<style lang="scss" scoped></style>
