const MySQL = require("../MySQL/MySQL.js");
const Cart = require("../Cart/Cart.js");
const getHashByLogin = require("../../utils/getHashByLogin.js");
const HashFunctions = require("../../utils/HashFunctions.js");
class User {
    static SignedUsers = [];
    constructor(name, login, uuid, uuidCart, phoneNumber, coins, address) {
        this.Name = name;
        this.Login = login;
        this.UUID = uuid;
        this.PhoneNumber = phoneNumber;
        this.CartUUID = uuidCart;
        this.Coins = coins;
        this.Address = address;
        User.SignedUsers.push(this);
    }
    static async Register(login, name, phoneNumber, passWord, address) {
        login = login.toLowerCase();
        if (User.SignedUsers.findIndex(_ => _.Login == login) !== -1) {
            return JSON.stringify({
                Result: "Error",
                Notify: "На такой логин уже есть авторизованный пользователь !"
            });
        }
        if (User.SignedUsers.findIndex(_ => _.PhoneNumber == phoneNumber) !== -1) {
            return JSON.stringify({
                Result: "Error",
                Notify: "На такой телефон уже есть авторизованный пользователь !"
            });
        }
        const result = await MySQL.query(`SELECT * FROM users WHERE login='${login}' OR phoneNumber=${phoneNumber}`);
        if (result[0].length > 0) {
            return JSON.stringify({
                Result: "Error",
                Notify: result[0][0]["login"] == login ? "На такой логин уже создан пользователь !" : "На такой телефон уже создан пользователь !"
            });
        }
        const cartUserUUID = await Cart.createCart();
        const userUID = await MySQL.query(`INSERT INTO users (name, login, password, phoneNumber, cartUUID, coins, address) `
            + `VALUES ('${name}','${login.toLowerCase()}','${HashFunctions.HashString(passWord)}','${phoneNumber}',${cartUserUUID},0,'${address}');`).insertId;
        const newUser = new User(login, name, userUID, cartUserUUID, phoneNumber, 0, address);
        const hashUser = await getHashByLogin(newUser.Login);
        return JSON.stringify({
            Result: "Success",
            Notify: "Вы успешно зарегистрировались !",
            Hash: hashUser,
            Login: newUser.Login
        });
    }
    static async LoggedIn(req, res, login, password) {
        if (login == null || login.length <= 3) {
            return JSON.stringify({
                Result: "Error",
                Notify: "Вы не указали логин !"
            });
        }
        if (password == null || password.length <= 3) {
            return JSON.stringify({
                Result: "Error",
                Notify: "Вы не указали пароль !"
            });
        }
        const checkLogin = await MySQL.query(`SELECT * FROM users WHERE login='${login.toLowerCase()}'`);
        if (checkLogin[0].length <= 0) {
            return JSON.stringify({
                Result: "Error",
                Notify: "Пользователь с таким логином не был найден !"
            });
        }
        const result = await MySQL.query(`SELECT * FROM users WHERE login='${login.toLowerCase()}' AND password='${HashFunctions.HashString(password)}'`);
        if (result[0].length <= 0) {
            return JSON.stringify({
                Result: "Error",
                Notify: "Вы указали не верный пароль !"
            });
        }
        const findedIndex = User.SignedUsers.findIndex(_ => _.Login == userLogin && _.Name == userName && _.UUID == userUUID);
        if (findedIndex !== -1) {
            User.SignedUsers.splice(findedIndex, 0);
        }
        const userBase = result[0][0];
        const user = new User(
            userBase["name"],
            userBase["login"],
            userBase["UUID"],
            userBase["cartUUID"],
            userBase["phoneNumber"],
            userBase["coins"],
            userBase["address"],
        );
        const hash = HashFunctions.HashString(user.Login + userBase["password"] + user.UUID);
        res.cookie("login", user.Login, {
            httpOnly: false,
            maxAge: 31104000000,
            secure: false
        });
        res.cookie("hash", hash, {
            httpOnly: true,
            maxAge: 31104000000,
            secure: true
        });
        return JSON.stringify({
            Result: "Success",
            Notify: "Вы успешно авторизовались !",
            User: {
                Name: user.Name,
                CartItems: Cart.UserCarts.find(_ => _.UUID == user.CartUUID).CartItems,
                PhoneNumber: user.PhoneNumber,
                Coins: user.Coins,
                Login: user.Login,
            },
            Hash: hash,
            Login: user.Login
        });
    }
    static async LoggedInWithCookie(login, hash) {
        const result = await MySQL.query(`SELECT * FROM users WHERE login='${login}'`);
        if (result[0].length <= 0) {
            return null;
        }
        const userBase = result[0][0];
        const userLogin = userBase["login"];
        const userName = userBase["name"];
        const userUUID = userBase["UUID"];
        const findedIndex = User.SignedUsers.findIndex(_ => _.Login == userLogin && _.Name == userName && _.UUID == userUUID);
        if (findedIndex !== -1) {
            User.SignedUsers.splice(findedIndex, 0);
        }
        const user = new User(
            userName,
            userLogin,
            userUUID,
            userBase["cartUUID"],
            userBase["phoneNumber"],
            userBase["coins"],
            userBase["address"],
        );
        const hashUser = await getHashByLogin(user.Login);
        if (hash != hashUser) {
            return null;
        }
        return {
            Name: user.Name,
            CartItems: Cart.UserCarts.find(_ => _.UUID == user.CartUUID).CartItems,
            PhoneNumber: user.PhoneNumber,
            Coins: user.Coins,
            Login: user.Login,
        };
    }
}
module.exports = User;