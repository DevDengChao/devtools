import type { VueInspectorClient } from 'vite-plugin-vue-inspector'
import { createApp, markRaw } from 'vue'
import { setupHooksDebug } from '../shared/hooks'
import type { NuxtAppClient, NuxtDevtoolsGlobal } from '../../types'
import Container from './view/Container.vue'
import { defineNuxtPlugin } from '#app'

declare global {
  interface Window {
    __NUXT_DEVTOOLS__?: NuxtDevtoolsGlobal
    __VUE_INSPECTOR__?: VueInspectorClient
  }
}

export default defineNuxtPlugin((nuxt) => {
  // TODO: Stackblitz support?
  if (typeof document === 'undefined' || typeof window === 'undefined' || window.self !== window.top)
    return

  const clientHooks = setupHooksDebug(nuxt.hooks)

  const client: NuxtAppClient = {
    nuxt: markRaw(nuxt as any),
    enableComponentInspector: () => {},
    getHooksMetrics: () => Object.values(clientHooks),
  }

  const holder = document.createElement('div')
  holder.setAttribute('data-v-inspector-ignore', 'true')
  document.body.appendChild(holder)

  const app = createApp(Container, { client })
  app.mount(holder)
})
