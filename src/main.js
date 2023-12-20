import { createApp } from 'vue'
import App from './App.vue'

import router from '../router/router.js'
import mitt from 'mitt'
import host from './AxiosMethods'
import store from '../store/index.js'
import functions from '../modules/index.js'

const AppCreated = createApp(App);
const emitter = mitt()

AppCreated.use(router);
AppCreated.use(store);

AppCreated.config.globalProperties.$methods = functions;
AppCreated.config.globalProperties.emitter = emitter;

AppCreated.mount('#app')
window.emitter = emitter;

emitter.on("RouterPush", (page) => {
    if (page == router.currentRoute._value.path) {
        return;
    }
    router.push(page);
});

emitter.on("GetMainPageInfo", async () => {
    const result = await host.get("MainMenu", {
        params: {
            Cookie: document.cookie
        }
    });
    if (result.data) {
        store.commit("setItemsList", result.data.Items);
        store.commit("setLoggedUser", result.data.User) 
    }
});