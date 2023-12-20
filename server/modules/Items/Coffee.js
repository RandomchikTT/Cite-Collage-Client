const MySQL = require("../MySQL/MySQL");
const Item = require("./Item");

class Coffee extends Item {
    static CoffeelList = []
    constructor(name, image, description, price, uuid, weight) {
        super(name, "Coffee", image, description, uuid, weight);
        this.Price = price;
        Coffee.CoffeelList.push(this);
    }
    static async LoadCoffeeBase() {
        const [rows, field] = await MySQL.query("SELECT * FROM coffee");
        rows.forEach(el => {
            new Coffee(el.name, el.image, el.description, el.price, el.idkey, el.weight);
        });
        console.log("Список кофе был успешно загружен.");
    }
}
module.exports = Coffee;