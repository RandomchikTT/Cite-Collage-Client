const MySQL = require("../MySQL/MySQL.js");
const Cart = require("../Cart/Cart.js");
const { getHashByData } = require("../../utils/getHashByLogin.js");
const HashFunctions = require("../../utils/HashFunctions.js");
class User {
    static SignedUsers = [];
    constructor(name, login, uuid, uuidCart, phoneNumber, coins, address, password) {
        this.Name = name;
        this.Login = login;
        this.UUID = uuid;
        this.PhoneNumber = phoneNumber;
        this.CartUUID = uuidCart;
        this.Coins = coins;
        this.Address = address;
        this.Password = password;
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
        const newUser = new User(login, name, userUID, cartUserUUID, phoneNumber, 0, address, passWord);
        const hashUser = getHashByData(login.toLowerCase(), passWord, userUID);
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
        const userBase = result[0][0];
        const UUID = userBase["UUID"];
        const findedIndex = User.SignedUsers.findIndex(_ => _.UUID == UUID);
        let user;
        if (findedIndex !== -1) {
            user = User.SignedUsers[findedIndex];
            console.log("[LoggedIn] Нашло человека в списке авторизованных !")
        }
        else {
            user = new User(
                userBase["name"],
                userBase["login"],
                UUID,
                userBase["cartUUID"],
                userBase["phoneNumber"],
                userBase["coins"],
                userBase["address"],
                userBase["password"]
            );
        }
        const hash = getHashByData(user.Login, user.Password, user.UUID);
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
    static async GetDataAccountByCookie(login, hash) {
        const result = await MySQL.query(`SELECT * FROM users WHERE login='${login}'`);
        if (result[0].length <= 0) {
            return null;
        }
        const userBase = result[0][0];
        const hashUser = getHashByData(userBase["login"], userBase["password"], userBase["UUID"]);
        if (hash != hashUser) {
            return null;
        }
        return result;
    }
    static async LoggedInWithCookie(login, hash) {
        const findedIndexLoggedUser = User.SignedUsers.findIndex(_ => _.Login == login);
        let user;
        if (findedIndexLoggedUser !== -1) {
            const signedUser = User.SignedUsers[findedIndexLoggedUser];
            const hashUser = getHashByData(signedUser.Login, signedUser.Password, signedUser.UUID);
            if (hash != hashUser) {
                console.log("[LoggedInWithCookie] Нашло пользователя в списке авторизованных !");
                user = signedUser;
            }
        }
        else {
            const result = await this.GetDataAccountByCookie(login, hash);
            if (result == null) {
                return;
            }
            console.log("[LoggedInWithCookie] Нашло пользователя в базе по куки клиента !");
            const userBase = result[0][0];
            user = new User(
                userBase["name"],
                userBase["login"],
                userBase["UUID"],
                userBase["cartUUID"],
                userBase["phoneNumber"],
                userBase["coins"],
                userBase["address"],
            );
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