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
    modules: {
        MainMenu,
    }
});

export default store;