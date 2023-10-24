import { createApp } from 'vue'
import App from './App.vue'

import router from '../router/router.js'
import mitt from 'mitt'
import host from './AxiosMethods'

const AppCreated = createApp(App);
const emitter = mitt()

AppCreated.use(router);
AppCreated.config.globalProperties.emitter = emitter;

AppCreated.mount('#app')
window.emitter = emitter;

emitter.on("RouterPush", (page) => {
    router.push(page);
});

const Items = {
    Pizza: [],
    Others: [],
}


emitter.on("GetMainPageInfo", async () => {
    const result = await host.get("MainMenu");
    if (result) {
        console.log("GetMainPageInfo")
        emitter.emit("RouterPush", '/MainMenu')
    }
});

emitter.emit("RouterPush", '/MainMenu')

async function GetResult() {
    const result = await host.get("MainMenu");
    console.log(result)
    if (result) {
        console.log("RESULT: " + result.data);
    }
}
GetResult();