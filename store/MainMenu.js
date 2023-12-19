export default {
    state: {
        ItemsList: [],
    },
    mutations: {
        setItemsList(state, serverInfo) {
            state.ItemsList = serverInfo;
        },
    }
}