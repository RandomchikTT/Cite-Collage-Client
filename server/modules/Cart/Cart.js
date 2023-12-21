const MySQL = require("../MySQL/MySQL.js");
const CartItem = require("./CartItem.js");

class Cart {
    static UserCarts = [];
    constructor(cartItems, uuid) {
        try {
            this.UUID = uuid;
            this.CartItems = cartItems;
            Cart.UserCarts.push(this);
        }
        catch (e) {
            console.log("ERROR.constructor.Cart: " + e.toString());
        }
    }
    static async createCart() {
        const result = await MySQL.query(`INSERT INTO carts (items) VALUES ('${JSON.stringify([])}');`);
        const cartCreate = new Cart([], result[0].insertId);
        return cartCreate.UUID;
    }
    static async LoadCartBase() {
        const [rows, field] = await MySQL.query("SELECT * FROM carts");
        rows.forEach(el => {
            new Cart(JSON.parse(el.items), el.uuid);
        });
        console.log("Список корзин пользователей был успешно загружен.");
    }
    async setValueItemInCart(cattegoryType, itemUUID, value, settings = null) {
        switch (cattegoryType) {
            case "Snack":
            case "Drink":
            case "Coctail":
            case "Coffee":
            case "Dessert":
            case "Souse":
            case "Pizza":
                break;
            default:
                return JSON.stringify({
                    Result: "Error",
                    Notify: "Такого типа предмета не существует !"
                });
        }
        const findIndex = this.CartItems.findIndex(_ => _.CategoryType == cattegoryType && _.UUID == itemUUID); 
        if (findIndex !== -1) {
            if (cattegoryType == "Pizza") {
                if (this.CartItems[findIndex].Settings != settings) {
                    return;
                }
            }
            if (this.CartItems[findIndex].Count + value <= 0 || value == 0) {
                this.CartItems.splice(findIndex, 1);
            }
            else {
                this.CartItems[findIndex].Count += value;
            }
        }
        await MySQL.query(`UPDATE carts SET items='${JSON.stringify(this.CartItems)}' WHERE uuid=${this.UUID}`);
        return JSON.stringify({
            Result: "Success",
            Notify: value > 0 ? "Вы успешно добавили предмет в корзину" : "Вы успешно удалили предмет из корзины",
            CartList: this.CartItems,
        });
    }
    async addPizzaInCart(itemUUID, itemData) {
        const findIndex = this.CartItems.findIndex(_ => _.CategoryType == 'Pizza' && _.UUID == itemUUID && _.Settings == itemData); 
        if (findIndex !== -1) {
            this.CartItems[findIndex].Count += 1;
        }
        else {
            this.CartItems.push(new CartItem(itemUUID, "Pizza", 1, itemData));
        }
        await MySQL.query(`UPDATE carts SET items='${JSON.stringify(this.CartItems)}' WHERE uuid=${this.UUID}`);
        return JSON.stringify({
            Result: "Success",
            Notify: "Вы успешно добавили предмет в корзину !",
            CartList: this.CartItems,
        });
    }
    async addItemInCart(cattegoryType, itemUUID) {
        switch (cattegoryType) {
            case "Snack":
            case "Drink":
            case "Coctail":
            case "Coffee":
            case "Dessert":
            case "Souse":
                break;
            default:
                return JSON.stringify({
                    Result: "Error",
                    Notify: "Такого типа предмета не существует !"
                });
        }
        const findIndex = this.CartItems.findIndex(_ => _.CategoryType == cattegoryType && _.UUID == itemUUID); 
        if (findIndex !== -1) {
            this.CartItems[findIndex].Count += 1;
        }
        else {
            this.CartItems.push(new CartItem(itemUUID, cattegoryType, 1));
        }
        await MySQL.query(`UPDATE carts SET items='${JSON.stringify(this.CartItems)}' WHERE uuid=${this.UUID}`);
        return JSON.stringify({
            Result: "Success",
            Notify: "Вы успешно добавили предмет в корзину !",
            CartList: this.CartItems,
        });
    }
}
module.exports = Cart;