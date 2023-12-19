const Item = require("./Item");
const MySQL = require('../MySQL/MySQL.js')
class Drink extends Item {
    static DrinkList = []
    constructor(name, image, description, price, uuid) {
        super(name, "Drink", image, description, uuid);
        this.Price = price;
        Drink.DrinkList.push(this);
    }
    static async LoadDrinkBase() {
        const [rows, field] = await MySQL.query("SELECT * FROM drinks");
        rows.forEach(el => {
            new Drink(el.name, el.image, el.description, el.price, el.idkey);
        });
        console.log("Список напитков был успешно загружен.");
    }
}
module.exports = Drink;