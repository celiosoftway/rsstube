const { Telegraf, Scenes, session } = require('telegraf');
require("dotenv").config();
const rss = require('./rss.js');
const fun = require('./fun.js');
const canais = require('../db/canais');

const bot = new Telegraf(process.env.BOT_TOKEN_TEST);
bot.use(session());

bot.command('start', (ctx) => {
    ctx.reply("Ola, bot iniciado")
})

bot.command('msg', (ctx) => {
    //var idchat = ctx.chat.id;
   fun.msg(ctx);
})

async function sendmessage(id, msg){
    bot.telegram.sendMessage(id, msg);
}

//catch error
bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof GrammyError) {
        console.error("Error in request:", e.description);
    } else if (e instanceof HttpError) {
        console.error("Could not contact Telegram:", e);
    } else {
        console.error("Unknown error:", e);
    }
});

bot.launch();

module.exports = {
    sendmessage,
}