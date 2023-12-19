const MySQL = require("../MySQL/MySQL");
const Item = require("./Item");

class Coffee extends Item {
    static CoffeelList = []
    constructor(name, image, description, price, uuid) {
        super(name, "Coffee", image, description, uuid);
        this.Price = price;
        Coffee.CoffeelList.push(this);
    }
    static async LoadCoffeeBase() {
        const [rows, field] = await MySQL.query("SELECT * FROM coffee");
        rows.forEach(el => {
            new Coffee(el.name, el.image, el.description, el.price, el.idkey);
        });
        console.log("Список кофе был успешно загружен.");
    }
}
module.exports = Coffee;