<template>
  <div class="base-page">
    <v-main class="pt-15">
      <page-header
        :headerButton="homeButton"
        @headerButtonClick="showHome"
        :headerColor="headerColor"
      />
      <router-view @headerButtonEnableChanged="headerButtonEnableChanged" />
      <page-footer />
    </v-main>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
// components
import PageHeader, {
  IHeaderButton,
} from '@/components/organisms/PageHeader.vue'
import PageFooter from '@/components/organisms/PageFooter.vue'

/**
 * 共通のベースページコンポーネント
 * ヘッダー、フッターが共通で定義されている
 */
@Component({
  components: {
    PageHeader,
    PageFooter,
  },
})
export default class BasePage extends Vue {
  /**
   * @property { IHeaderButton } homeButton - ホームに戻るボタン設定
   */
  private homeButton: IHeaderButton = { title: 'HOME', enabled: true }
  /**
   * @property { string } headerColor - ヘッダーの背景色
   */
  private headerColor: string = 'primary'
  /**
   * ホーム画面へ遷移します。
   * このとき、「戻る」ボタンによる処理を制御します。
   */
  public showHome(): void {
    if (this.$route.path !== '/') this.$router.replace({ path: '/' })
  }
  /**
   * 子コンポーネントからのヘッダー利用ボタン可否制御を行います。
   */
  public headerButtonEnableChanged(value: boolean): void {
    this.homeButton.enabled = value
  }
}
</script>
<style lang="scss">
.container {
  height: calc(100% - 30px);
}
</style>
