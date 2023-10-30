import { createApp } from 'vue'
import App from './App.vue'

import router from '../router/router.js'
import mitt from 'mitt'
import host from './AxiosMethods'
import store from '../store/index.js'

const AppCreated = createApp(App);
const emitter = mitt()

AppCreated.use(router);
AppCreated.use(store);
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
    const result = await host.get("MainMenu");
    if (result.data) {
        store.commit("setItemsList", JSON.stringify(result.data));
    }
});


emitter.emit("RouterPush", '/MainMenu');

async function GetResult() {
    const storedData = localStorage.getItem('PizzaMargarita.Cite.LoginData');
    if (storedData == null) {
        return;
    }
    const result = await host.get("Authorization", {
        params: {
            Login: storedData.Login,
            Password: storedData.Password,
        }
    });
    if (result && result.data) {
        
    }
}
GetResult();