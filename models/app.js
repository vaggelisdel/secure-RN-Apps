const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var moment = require('moment-timezone');

const AppsSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            default: "0"
        },
        userId: {
            type: String,
            default: "0"
        },
        active: {
          type: Boolean,
          default: false
        },
        message: {
            type: String,
            default: "-"
        },
        createdDate: {
            type: String,
            default: () => moment().tz("Europe/Athens").format("YYYY-MM-DD HH:mm:ss")
        }
    }
);

let Apps = mongoose.model("Apps", AppsSchema);

module.exports = Apps;
