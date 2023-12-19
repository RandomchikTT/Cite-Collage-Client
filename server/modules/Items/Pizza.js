const Item = require("./Item");
const MySQL = require('../MySQL/MySQL.js')
class Pizza extends Item {
    static PizzaList = []
    constructor(name, description, price, image, uuid) {
        super(name, "Pizza", image, description, uuid);
        this.Price = price;
        Pizza.PizzaList.push(this);
    }
    static async LoadPizzaBase() {
        const [rows, field] = await MySQL.query("SELECT * FROM pizza");
        rows.forEach(el => {
            new Pizza(el.name, el.description, JSON.parse(el.price), el.image, el.idkey);
        });
        console.log("Список пиц был успешно загружен.");
    }
}
module.exports = Pizza;