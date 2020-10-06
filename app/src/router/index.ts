import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Chat from '@/components/pages/Chat.vue'
import BasePage from '@/components/pages/BasePage.vue'
import RoomSession from '@/components/templates/RoomSession.vue'
import Home from '@/components/templates/Home.vue'
Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/chat',
    name: 'chat',
    component: Chat,
    // component: () =>
    //   import(/* webpackChunkName: "chat" */ '@/components/pages/Chat.vue'),
  },
  {
    path: '/',
    name: 'BasePage',
    // component: BasePage,
    component: () =>
      import(
        /* webpackChunkName: "basepage" */ '@/components/pages/BasePage.vue'
      ),
    children: [
      {
        path: '/room/session',
        name: 'RoomSession',
        // component: RoomSession,
        component: () =>
          import(
            /* webpackChunkName: "roomsession" */ '@/components/templates/RoomSession.vue'
          ),
      },
      {
        path: '*',
        name: 'Home',
        component: Home,
        // component: () =>
        //   import(
        //     /* webpackChunkName: "home" */ '@/components/templates/Home.vue'
        //   ),
      },
    ],
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
