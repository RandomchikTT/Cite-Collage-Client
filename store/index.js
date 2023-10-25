import { createStore } from 'vuex'
import MainMenu from './MainMenu';

const store = createStore({
    modules: {
        MainMenu,
    }
});

export default store;