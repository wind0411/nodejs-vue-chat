<template>
  <v-footer :color="footerColor" dark app height="30"></v-footer>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

/**
 * 共通フッター用コンポーネント
 * 現在は表示のみ行っており、なにかの処理に使用しているということはありません。
 */
@Component
export default class PageFooter extends Vue {
  /**
   * Prop
   * @property { string } footerColor - 表示する背景色名
   */
  @Prop({ default: 'primary' })
  footerColor?: string
}
</script>
