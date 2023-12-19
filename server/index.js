const { Router } = require("express");
const express = require("express")
const cors = require('cors');
const cookieParser = require('cookie-parser');
const Pizza = require("./modules/Items/Pizza.js");
const Snack = require("./modules/Items/Snack.js");
const Cart = require("./modules/Cart/Cart.js");
const Coctail = require('./modules/Items/Coctail.js')
const Drink = require('./modules/Items/Drink.js');
const User = require('./modules/User/User.js');
const Coffee = require("./modules/Items/Coffee.js");
const Dessert = require("./modules/Items/Dessert.js");
const Souse = require("./modules/Items/Souse.js");

const ServerData = {
    MainMenuItems: []
};

(async function LoadDataBase() {
    await Pizza.LoadPizzaBase();
    await Snack.LoadSnackBase();
    await Drink.LoadDrinkBase();
    await Coctail.LoadCoctailBase();
    await Coffee.LoadCoffeeBase();
    await Dessert.LoadDessertBase();
    await Souse.LoadSouseBase();
    await Cart.LoadCartBase();
    ServerData.MainMenuItems = [     
        ...Pizza.PizzaList,
        ...Snack.SnackList,
        ...Drink.DrinkList,
        ...Coctail.CoctailList,
        ...Coffee.CoffeelList,
        ...Dessert.DessertList,
        ...Souse.SouseList
    ]
}())

const router = Router();
const app = express();
const port = 3030;

app.use(cors());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', `http://127.0.0.1:5173`);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(cookieParser('sv3314gds34bastet43gs745kgh'));
app.use(router);

app.listen(port, () => {
    console.log(`Порт ${port} прослушивается.`)
});


app.get("/MainMenu", async (req, res) => {
    try {
        const result = {
            Items: ServerData.MainMenuItems,
            User: null
        }
        if (req.query.Cookie && req.query.Cookie.toString().includes(";")) {
            const cookiesObject = req.query.Cookie.split(';').reduce((acc, cookie) => {
                const [key, value] = cookie.trim().split('=');
                acc[key] = value;
                return acc;
            }, {});
            result.User = await User.LoggedInWithCookie(cookiesObject.login, cookiesObject.hash);
        }
        console.log("Подключился пользователь.");
        return res.send(result);
    }
    catch (e) {
        console.log("Ошибка.MainMenu: " + e);
    }
});

app.get("/ExitAccount", async (req, res) => {
    if (req.query.Cookie && req.query.Cookie.toString().includes(";")) {
        const cookiesObject = req.query.Cookie.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            acc[key] = value;
            return acc;
        }, {});
        const hashUser = await getHashByLogin(cookiesObject.login);
        if (cookiesObject.hash == hashUser) {
            const findedIndex = User.SignedUsers.findIndex(_ => _.Login == cookiesObject.login);
            if (findedIndex !== -1) {
                User.SignedUsers.splice(findedIndex, 0);
                res.clearCookie("hash");
                res.clearCookie("login");
                console.log("Пользователь вышел из сайта, и обьект был удален !");
                return res.send(JSON.stringify({
                    Result: "Success",
                    Notify: "Вы успешно вышли из аккаунта !",
                }));
            }
        }
    }
});

app.get("/Authorization", async (req, res) => {
    try {
        const query = req.query;
        if (query.length < 2) {
            res.send({
                Result: "Error",
                Notify: "Вы не указали данные !",
            })
            return;
        }
        const { Login, Password } = req.query;
        const result = await User.LoggedIn(req, res, Login, Password);
        return res.send(result);
    }
    catch (e) {
        console.log("Ошибка.Authorization: " + e);
    }
});

app.get("/Registration", async (req, res) => {
    try {
        const query = req.query;
        if (query.length < 3) {
            res.send({
                Result: "Error",
                Notify: "Вы не указали данные !",
            })
            return;
        }
        const { Login, Password, PhoneNumber, Name } = req.query;
        const result = await User.Register(Login, Name, PhoneNumber, Password, req.ip);
        return res.send(result);
    }
    catch (e) {
        console.log("Ошибка.Registration: " + e);
    }
});

app.get("/AddItemInCart", async (req, res) => {
    try {
        const query = req.query;
        if (query.length < 4) {
            res.send({
                Result: "Error",
                Notify: "Вы не указали данные !",
            })
            return;
        }
        const { CattegoryType, ItemUUID, Login, PhoneNumber } = req.query;
        if (!CattegoryType || !ItemUUID || !Login || !PhoneNumber || Number.isNaN(Number(ItemUUID)) || Number.isNaN(Number(PhoneNumber))) {
            res.send({
                Result: "Error",
                Notify: "Ошибка входных данных !",
            })
            return;
        }
        const user = User.SignedUsers.find(_ => _.Login == Login && _.PhoneNumber == PhoneNumber);
        if (!user) {
            res.send({
                Result: "Error",
                Notify: "Вы не авторизованы !",
            })
            return;
        }
        const cart = Cart.UserCarts.find(_ => _.UUID == user.CartUUID);
        if (!cart) {
            res.send({
                Result: "Error",
                Notify: "Ваша корзина не была найдена в списке !",
            })
            return;
        }
        const result = await cart.addItemInCart(CattegoryType, ItemUUID);
        return res.send(result);
    }
    catch (e) {
        console.log("Ошибка.AddItemInCart: " + e);
    }
});

app.get("/SetValueItemInCart", async (req, res) => {
    try {
        const query = req.query;
        if (query.length < 4) {
            res.send({
                Result: "Error",
                Notify: "Вы не указали данные !",
            })
            return;
        }
        const { CattegoryType, ItemUUID, Login, PhoneNumber, Value } = req.query;
        if (!CattegoryType || !ItemUUID || !Login || !PhoneNumber || !Value || Number.isNaN(Number(ItemUUID))
            || Number.isNaN(Number(PhoneNumber)) || Number.isNaN(Number(Value))) {
            res.send({
                Result: "Error",
                Notify: "Ошибка входных данных !",
            })
            return;
        }
        const user = User.SignedUsers.find(_ => _.Login == Login && _.PhoneNumber == PhoneNumber);
        if (!user) {
            res.send({
                Result: "Error",
                Notify: "Вы не авторизованы !",
            })
            return;
        }
        const cart = Cart.UserCarts.find(_ => _.UUID == user.CartUUID);
        if (!cart) {
            res.send({
                Result: "Error",
                Notify: "Ваша корзина не была найдена в списке !",
            })
            return;
        }
        const result = await cart.setValueItemInCart(CattegoryType, Number(ItemUUID), Number(Value));
        return res.send(result);
    }
    catch (e) {
        console.log("Ошибка.SetValueItemInCart: " + e);
    }
});

// const NewPizza = new Pizza("Маргарита 🌱", 
//     "Итальянские травы, томатный соус, томаты, моцарелла", [
//     {
//         Size: 25,
//         TypeDough: {
//             Default: { 
//                 Price: 11.99,
//                 Weight: 405
//             },
//         },
//     },
//     {
//         Size: 30,
//         TypeDough: {
//             Default: {
//                 Price: 20.99,
//                 Weight: 640
//             },
//             Thin: {
//                 Price: 20.99,
//                 Weight: 530
//             }
//         },
//     },
//     {
//         Size: 35,
//         TypeDough: {
//             Default: { 
//                 Price: 26.99,
//                 Weight: 860
//             },
//             Thin: {
//                 Price: 26.99,
//                 Weight: 760
//             }
//         },
//     },
// ], "Margarita");
// PoolQuerys.query(`INSERT INTO pizza (name, description, price, image) VALUES ('${NewPizza.Name}','${NewPizza.Description}','${JSON.stringify(NewPizza.Price)}','${NewPizza.Image}')`)







// const DrinkNew = new Drink("Чай Lipton зеленый", "GreenTeaLeapton", 
//     "", 1.79);
// PoolQuerys.query(`INSERT INTO drinks (name, description, price, image) `
// + `VALUES ('${DrinkNew.Name}','${DrinkNew.Description}',${DrinkNew.Price},'${DrinkNew.Image}')`)





// const CoctailNew = new Coctail(
//     "Шоколадный молочный коктейль",
//     "IceCoctailChocolate",
//     "Очаровательная шоколадная нежность. Попробуйте молочный коктейль с какао и мороженым",
//     7.49
// );
// PoolQuerys.query(`INSERT INTO coctail (name, description, price, image) `
// + `VALUES ('${CoctailNew.Name}','${CoctailNew.Description}',${CoctailNew.Price},'${CoctailNew.Image}')`)


// const snack = new Snack(
//     "Сырные палочки с песто",
//     "SirniePalochkiPesto", 
//     "Сытный перекус для компании. На пышном тесте только моцарелла и соус песто. В комплекте дополнительный чесночный соус — так вкуснее",
//     8.99
// );
// PoolQuerys.query(`INSERT INTO snacks (name, description, price, image) `
// + `VALUES ('${snack.Name}','${snack.Description}',${snack.Price},'${snack.Image}')`)


// const coffee = new Coffee(
//     "Кофе Ореховый латте",
//     "OrehoviyLatte",
//     "Много молока и фундука. Уютный ореховый латте на основе эспрессо",
//     5.59
// );
// PoolQuerys.query(`INSERT INTO coffee (name, description, price, image) `
// + `VALUES ('${coffee.Name}','${coffee.Description}',${coffee.Price},'${coffee.Image}')`)


// const desser = new Dessert(
//     "Мороженое Юкки Пломбир на сливках",
//     "IceCreamYukkiPlombir",    
//     "Классический пломбир, приготовленный на свежих сливках",
//     4.29
// );
// PoolQuerys.query(`INSERT INTO dessert (name, description, price, image) `
// + `VALUES ('${desser.Name}','${desser.Description}',${desser.Price},'${desser.Image}')`)

// const souse = new Souse(
//     "Сырный Соус",
//     "Sirniy",
//     "Нежный соус со вкусом расплавленного сыра для бортиков пиццы и горячих закусок, 25 г г",
//     1.19
// )
// PoolQuerys.query(`INSERT INTO souses (name, description, price, image) `
// + `VALUES ('${souse.Name}','${souse.Description}',${souse.Price},'${souse.Image}')`)