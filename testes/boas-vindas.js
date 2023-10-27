// função para mandar mensagem no chat quando um novo menbro entrar no grupo
// a função é executada ao disparar o evento new_chat_members

const { Telegraf, Scenes, session } = require('telegraf');
require("dotenv").config();
const bot = new Telegraf(process.env.BOT_TOKEN_TEST);

bot.command('start', (ctx) => {
    ctx.reply("Ola, bot iniciado")
})

//Mensagem para quem entrar no grupo
bot.on('new_chat_members', (ctx) => {
    const chatId = ctx.chat.id;
    const userId = ctx.from.id;

    const banner = "Bem - vindo! ";
    const padding = ''.repeat(Math.floor((process.stdout.columns - banner.length) / 2));
    const centeredbanner = padding + banner;
    const message = `${ctx.message.from.first_name}  \nUse o comando /start para iniciar ^^`;
    const imgPath = './assets/img/capa1.jpg';
    const menu = {
        inline_keyboard: [
            [{ text: "Leia as regras", callback_data: 'rules' },
            { text: "Meus links", callback_data: 'links' }
            ],
            [{ text: "Meus produtos e serviços", callback_data: 'works' }]
        ]
    };
    ctx.replyWithPhoto({ source: imgPath }, { caption: centeredbanner + message, reply_markup: menu });
});

bot.launch();
