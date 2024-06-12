const MySQL = require("../MySQL/MySQL");

class FeedBack {
    constructor(text, userID) {
        this.Text = text;
        this.UserID = userID;
    }
    async create() {
        const now = new Date();
        const formattedDate = now.getFullYear() + '-' 
            + ('0' + (now.getMonth() + 1)).slice(-2) + '-' 
            + ('0' + now.getDate()).slice(-2) + ' ' 
            + ('0' + now.getHours()).slice(-2) + ':' 
            + ('0' + now.getMinutes()).slice(-2) + ':' 
            + ('0' + now.getSeconds()).slice(-2);
        MySQL.query(`INSERT INTO feedbacks (text, idUser, time) `
            + `VALUES ('${this.Text}', ${this.UserID}, '${formattedDate}');`);
    }
}
module.exports = FeedBack;