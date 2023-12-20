const MySQL = require("../MySQL/MySQL");
const Item = require("./Item");

class Souse extends Item {
    static SouseList = []
    constructor(name, image, description, price, uuid, weight) {
        super(name, "Souse", image, description, uuid, weight);
        this.Price = price;
        Souse.SouseList.push(this);
    }
    static async LoadSouseBase() {
        const [rows, field] = await MySQL.query("SELECT * FROM souses");
        rows.forEach(el => {
            new Souse(el.name, el.image, el.description, el.price, el.idkey, el.weight);
        });
        console.log("Список соусов был успешно загружен.");
    }
}
module.exports = Souse;