// scenes é uma forma de interagir com o usuario
// é utilizado sessão

const { Telegraf, Scenes, session } = require('telegraf');
require("dotenv").config();
const rss = require('./rss.js');
const fun = require('./fun.js');
const canais = require('../db/canais');

const bot = new Telegraf(process.env.BOT_TOKEN_TEST);

const adcanal = new Scenes.WizardScene(
    'add-canal',
    ctx => {
        ctx.reply("Digite a url de algum video do canal desejado");
        ctx.wizard.state.data = {};
        return ctx.wizard.next();
    },
    ctx => {
        rss.getVideoData(ctx.message.text)
            .then((data) => {
                if (data[0].status == 1) {
                    fun.addcanal(ctx, data[0].canal);
                } else {
                    ctx.reply("Erro ao recuperar o id do canal");
                    ctx.reply("Tente novamente");
                    return ctx.scene.leave()
                }
            })
            .catch((error) => {
                console.log(error)
                ctx.reply("Erro ao recuperar o id do canal");
                ctx.reply("Tente novamente");
                return ctx.scene.leave()
            })
            return ctx.scene.leave()
    }
);

const st = new Scenes.Stage([adcanal]);
bot.use(session());
bot.use(st.middleware());

bot.command('stage', ctx => {
    ctx.scene.enter('add-canal');
});

bot.command('start', (ctx) => {
    ctx.reply("Ola, bot iniciado")
})

bot.launch();