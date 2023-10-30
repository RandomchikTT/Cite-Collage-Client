export default {
    state: {
        ItemsList: [],
        Cart: [],
    },
    mutations: {
        setItemsList(state, serverInfo) {
            serverInfo = JSON.parse(serverInfo);
            state.ItemsList = serverInfo.Items;
        },
        setCartList(state, cartItems) {
            state.Cart = JSON.parse(cartItems);
        }
    },
    getters: {
        getItemList(state) {
            return state.ItemsList;
        }
    },
}