const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var moment = require('moment-timezone');

const UsersSchema = new Schema(
    {
        email: {
            type: String,
            trim: true,
            lowercase: true,
            default: "0"
        },
        password: {
            type: String,
            default: "0"
        },
        createdDate: {
            type: String,
            default: () => moment().tz("Europe/Athens").format("YYYY-MM-DD HH:mm:ss")
        }
    }
);

let User = mongoose.model("User", UsersSchema);

module.exports = User;
