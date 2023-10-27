const { Telegraf, Scenes, session } = require('telegraf');
require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN_TEST);

function session() {
    bot.use(session());
}

module.exports = { bot, session } 