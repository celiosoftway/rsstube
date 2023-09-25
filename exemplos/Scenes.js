const { Telegraf, Scenes, session } = require('telegraf');
require("dotenv").config();
const rss = require('./rss.js');
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
                    addcanal(ctx, data[0].canal);
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


async function addcanal(ctx, pid) {
    var data = await rss.getrss(pid, 1);
    var status = data[0].status;

    if (status == 1) {
        var nomecanal = data[0].canal;
        var urlvideo = data[0].urlvideo;
        var idchat = ctx.update.message.chat.id;
        var chave = `${pid}${idchat}`
    }

    if (status == 1) {
        console.log(`Canal encontrado ${nomecanal}`);
        canais.insereCanal(nomecanal, pid, idchat, chave);

        ctx.reply(`Canal ${nomecanal} adicionado!! Veja o ultimo video \n \n` + urlvideo);
    } else {
        console.log(`Deu ruim, o canal não foi encontrado ou cota API atingido`);
        ctx.reply(`Deu ruim, o canal não foi encontrado ou cota API atingido`);
    }
}

bot.launch();