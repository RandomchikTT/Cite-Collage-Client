const MySQL = require('../modules/MySQL/MySQL.js');
const HashFunctions = require('./HashFunctions.js');

module.exports = getHashByLogin = (loginUser) => {
    return new Promise(async (resolve, reject) => {
        const result = await MySQL.query(`SELECT login, password, UUID FROM users WHERE login = '${loginUser}' LIMIT 1`);
        if (result[0].length <= 0) {
            return;
        }
        const userLogin = result[0][0]["login"];
        const userPassword = result[0][0]["password"];
        const userUUID = result[0][0]["UUID"];
        const realHash = HashFunctions.HashString(userLogin + userPassword + userUUID);
        resolve(realHash);
    })
}