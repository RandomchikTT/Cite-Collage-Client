
const crypto = require('crypto');
const HashFunctions = {
    HashString(string) {
        const hash = crypto.createHash('sha256');
        hash.update(string);
        const hashedString = hash.digest('hex');
        return hashedString;
    }
}
module.exports = HashFunctions;