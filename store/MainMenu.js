export default {
    state: {
        ItemsList: [],
    },
    mutations: {
        setItemsList(state, serverInfo) {
            serverInfo = JSON.parse(serverInfo);
            state.ItemsList = serverInfo.Items;
        },
    },
}