const { Telegraf, Scenes, session } = require('telegraf');
require("dotenv").config();
const bot = new Telegraf(process.env.BOT_TOKEN_TEST);

bot.command('start', (ctx) => {
    ctx.reply("Ola, bot iniciado")
})

bot.command('chatlink', async (ctx) => {
    const date = new Date();
    const idchat = '-838388391';
    const ops = {
        expire_date: date + 1,
        member_limit: 1,
        name: "Grupo VIP"
    }

    const link = await bot.telegram.createChatInviteLink(idchat, ops);

    console.log(link);

    bot.telegram.sendMessage(ctx.chat.id, link.invite_link);
});


async function quitMember(memberId) {
    await ctx.telegram.leaveChat(memberId);
};

bot.launch();