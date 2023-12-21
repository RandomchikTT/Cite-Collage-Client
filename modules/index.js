import store from "../store/index.js";

const functions = {
    getItemForCartToReal(item) {
        return store.state.MainMenu.ItemsList.find(_ => _.Cattegory == item.CategoryType && _.UUID == item.UUID);
    },
    getItemPrice(item) {
        switch (item.Cattegory) {
            case "Pizza":
                if (!item.Price || !Array.isArray(item.Price)) {
                    return null;
                }
                let minPrice = Number.MAX_VALUE;
                for (const pizza of item.Price) {
                    if (pizza && pizza.TypeDough && pizza.TypeDough.Default && pizza.TypeDough.Default.Price) {
                        const price = pizza.TypeDough.Default.Price;
                        if (price < minPrice) {
                            minPrice = price;
                        }
                    }
                }
                return `от ${minPrice} руб.`;
            case "Snack":
            case "Drink":
            case "Coctail":
            case "Coffee":
            case "Dessert":
            case "Souse":
                return `${item.Price} руб.`;
        }
    },
    getPiceItemInCart(item) {
        switch (item.CategoryType) {
            case "Pizza":
                if (!item.Settings || typeof item.Settings != 'object') {
                    return 0;
                }
                const pizzaPrice = functions.getItemForCartToReal(item).Price.find(_ => _.Size == item.Settings.Size);
                return pizzaPrice.TypeDough[item.Settings.TypeDough].Price;
            case "Snack":
            case "Drink":
            case "Coctail":
            case "Coffee":
            case "Dessert":
            case "Souse":
                return functions.getItemForCartToReal(item).Price * item.Count;
        }
    },
    getOrderCoins() {
        if (functions.getItemsInCarts().Price < 15) {
            return 0;
        }
        return (functions.getItemsInCarts().Price / 15).toFixed(2);
    },
    getItemForCartToReal(item) {
        return store.state.MainMenu.ItemsList.find(_ => _.Cattegory == item.CategoryType && _.UUID == item.UUID);
    },
    getItemsInCarts() {
        const obj = {
            Length: 0,
            Price: 0
        }
        if (!store.state.loggedUser) {
            return 0;
        }
        store.state.loggedUser.CartItems.forEach(cartItem => {
            obj.Length += cartItem.Count;
            obj.Price += functions.getPiceItemInCart(cartItem);
        });
        return obj;
    }
}

export default functions;