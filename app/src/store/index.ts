import Vue from 'vue'
import Vuex from 'vuex'
import { IChatState } from '@/store/modules/chat'
import createPersistedState from 'vuex-persistedstate'
import { secureStorage } from '@/store/storage'
export interface IState {
  chat: IChatState
}
Vue.use(Vuex)
export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {},
  plugins: [
    createPersistedState({
      key: 'vuexChat',
      paths: [
        'chat.userName',
        'chat.channel',
        'chat.channelType',
        'chat.isOpen',
      ],
      storage: {
        getItem: key => secureStorage.get(key),
        setItem: (key, value) => secureStorage.set(key, value),
        removeItem: key => secureStorage.remove(key),
      },
    }),
  ],
})
