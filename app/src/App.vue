<template>
  <v-app class="application-height-wrap">
    <router-view />
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
// components
import BasePage from '@/components/pages/BasePage.vue'

/**
 * 本アプリのメインコンポーネント
 */
@Component({
  components: {
    BasePage,
  },
})
export default class App extends Vue {}
</script>
<style lang="scss">
html,
body {
  -ms-overflow-style: none;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
  height: 100%;
  .application-height-wrap {
    .v-application--wrap {
      min-height: 100% !important;
      height: 100% !important;
    }
  }
}
</style>
