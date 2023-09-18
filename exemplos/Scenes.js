const { Telegraf, Scenes, session} = require('telegraf');
 
require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);

const addcanal = new Scenes.WizardScene(
    'add-canal',
    ctx => {
        ctx.reply("Qual o seu nome?");
        ctx.wizard.state.data = {};
        return ctx.wizard.next();
    },
    ctx => {
        ctx.wizard.state.data.nome = ctx.message.text;
        ctx.reply("Qual a sua idade?");
        return ctx.wizard.next();
    },
    ctx => {
        ctx.wizard.state.data.idade = ctx.message.text;
        ctx.reply(`Seu nome é ${ctx.wizard.state.data.nome} \nSua idade é ${ctx.wizard.state.data.idade}`)
        return ctx.scene.leave()
    }
);

const st = new Scenes.Stage([addcanal]);
bot.use(session());
bot.use(st.middleware());

bot.command('stage', ctx => {
    ctx.scene.enter('add-canal');
});

bot.launch();