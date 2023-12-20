import { createStore } from 'vuex'
import MainMenu from './MainMenu';

const store = createStore({
    state: {
        loggedUser: null,
    },
    mutations: {
        setLoggedUser(state, loggedUser) {
            state.loggedUser = loggedUser;
        },
        setLoggedUserCartItems(state, cartItems) {
            state.loggedUser.CartItems = cartItems;
        }
    },
    getters: {
        getCartUser(state) {
            return state.loggedUser?.CartItems;
        },
        getLoggedUser(state) {
            return state.loggedUser;
        }
    },
    modules: {
        MainMenu,
    }
});

export default store;