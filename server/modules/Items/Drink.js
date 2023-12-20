const Item = require("./Item");
const MySQL = require('../MySQL/MySQL.js')
class Drink extends Item {
    static DrinkList = []
    constructor(name, image, description, price, uuid, weight) {
        super(name, "Drink", image, description, uuid, weight);
        this.Price = price;
        Drink.DrinkList.push(this);
    }
    static async LoadDrinkBase() {
        const [rows, field] = await MySQL.query("SELECT * FROM drinks");
        rows.forEach(el => {
            new Drink(el.name, el.image, el.description, el.price, el.idkey, el.weight);
        });
        console.log("Список напитков был успешно загружен.");
    }
}
module.exports = Drink;