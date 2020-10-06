<template>
  <div class="home">
    <v-container>
      <v-row class="text-center">
        <v-col cols="12">
          <v-img
            :src="require('@/assets/pusher.jpg')"
            class="my-3"
            contain
            height="200"
          />
        </v-col>
        <v-flex xs>
          <h1 class="display-2 font-weight-bold mb-3">Demo Page</h1>
          <p class="subheading font-weight-regular my-6">
            - 下記ボタンより入室 -
          </p>
          <v-btn class="primary mx-2" @click="showRoomSession('public')">
            <span class="mr-2">公開チャンネル</span>
            <v-icon>mdi-chat</v-icon>
          </v-btn>
          <v-btn
            class="mx-2 grey lighten-1 white--text"
            @click="showRoomSession('private')"
          >
            <span class="mr-2">非公開チャンネル</span>
            <v-icon>mdi-chat</v-icon>
          </v-btn>
          <v-btn
            class="mx-2 black lighten-1 white--text"
            @click="showRoomSession('encrypted')"
          >
            <span class="mr-2">暗号化チャンネル</span>
            <v-icon>mdi-chat</v-icon>
          </v-btn>
          <!-- @todo 未実装 -->
          <!-- <v-btn
            class="mx-2 green darken-1 white--text"
            @click="showRoomSession('presence')"
          >
            <span class="mr-2">プレゼンスチャンネル</span>
            <v-icon>mdi-chat</v-icon>
          </v-btn> -->
        </v-flex>
      </v-row>
    </v-container>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
// types
import { ChannelType } from '@/lib/external/pusher'

/**
 * ホーム画面用コンポーネント
 */
@Component
export default class Home extends Vue {
  /**
   * 各チャンネル入室画面へ遷移
   */
  private showRoomSession(type: ChannelType): void {
    this.$router.push({ name: 'RoomSession', params: { type: type } })
  }
}
</script>
<style lang="scss"></style>
