const MySQL = require("../MySQL/MySQL");
const Item = require("./Item");

class Dessert extends Item {
    static DessertList = []
    constructor(name, image, description, price, uuid) {
        super(name, "Dessert", image, description, uuid);
        this.Price = price;
        Dessert.DessertList.push(this);
    }
    static async LoadDessertBase() {
        const [rows, field] = await MySQL.query("SELECT * FROM dessert");
        rows.forEach(el => {
            new Dessert(el.name, el.image, el.description, el.price, el.idkey);
        });
        console.log("Список десертов был успешно загружен.");
    }
}

module.exports = Dessert;