const Item = require("./Item");
const MySQL = require('../MySQL/MySQL.js')
class Snack extends Item {
    static SnackList = []
    constructor(name, image, description, price, uuid, weight) {
        super(name, "Snack", image, description, uuid, weight);
        this.Price = price;
        Snack.SnackList.push(this);
    }
    static async LoadSnackBase() {
        const [rows, field] = await MySQL.query("SELECT * FROM snacks");
        rows.forEach(el => {
            new Snack(el.name, el.image, el.description, el.price, el.idkey, el.weight);
        });
        console.log("Список снеков был успешно загружен.");
    }
}
module.exports = Snack;
