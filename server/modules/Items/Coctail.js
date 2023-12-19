const MySQL = require("../MySQL/MySQL");
const Item = require("./Item");

class Coctail extends Item {
    static CoctailList = []
    constructor(name, image, description, price, uuid) {
        super(name, "Coctail", image, description, uuid);
        this.Price = price;
        Coctail.CoctailList.push(this);
    }
    static async LoadCoctailBase() {
        const [rows, field] = await MySQL.query("SELECT * FROM coctail");
        rows.forEach(el => {
            new Coctail(el.name, el.image, el.description, el.price, el.idkey);
        });
        console.log("Список коктелей был успешно загружен.");
    }
}
module.exports = Coctail;