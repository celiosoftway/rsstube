// exemplos de botoes inline

const { Telegraf, Scenes, session } = require('telegraf');
require("dotenv").config();
const bot = new Telegraf(process.env.BOT_TOKEN_TEST);

bot.command('start', (ctx) => {
    ctx.reply("Ola, bot iniciado")
})

bot.command('mywallet', (ctx) => {
    const chatId = ctx.chat.id;
    const msg = "Escolha a opção desejada para prosseguir:";
    const menu = {
      inline_keyboard: [[
        { text: 'Ver meu saldo', callback_data: 'saldo' },
        { text: 'Ver cotação', callback_data: 'cotacao' }],
      [{ text: 'Fazer um pix', callback_data: 'pix' }
      ]]
    }
  
    bot.telegram.sendMessage(chatId, msg, { reply_markup: menu });
  });

  bot.command('vip', async (ctx) => {
    const chatId = ctx.chat.id;
    await bot.telegram.sendMessage(ctx.chat.id, 'Assine o VIP para scessar nossa consultoria');
    const msg = "Escolha a opção desejada para prosseguir:";

    const menu = {
        inline_keyboard: [
            [{ text: 'Assinar VIP - 7 dias', callback_data: 'vip7' }],
            [{ text: 'Assinar VIP - 15 dias', callback_data: 'vip15' }],
            [{ text: 'Assinar VIP - 30 dias', callback_data: 'vip30' }]]
    }

    await bot.telegram.sendMessage(chatId, msg, { reply_markup: menu });
});

bot.launch();