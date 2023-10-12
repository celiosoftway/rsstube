const { Telegraf, Scenes, session } = require('telegraf');

const rss = require('./rss.js');
const users = require('./db/user');
const canais = require('./db/canais');
const videos = require('./db/videos');
const api = require('./db/api');

const CRAWLER_INTERVAL = 21600000;
// 1 segundo = 1000
// 1 minuto = 60000
// 1 Horas = 3600000 
// 6 horas 21600000

require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// exibe o atalho dos comandos no Telegran
bot.telegram.setMyCommands([
    { command: 'start', description: 'inicia conversa com o bot' },
    { command: 'help', description: 'Exibe uma lista de comandos' },
    { command: 'addcanal', description: 'Adicina um novo canal' },
    { command: 'lista', description: 'lista os canais cadastrados' },
    { command: 'find', description: 'Busca por videos novos manualmente' },
]);

//constante para os comandos do help
const helpmessage = `
  Comandos do bot:
  /start - inicia a conversa com o bot
  /addcanal - Adicina um novo canal
  /lista - lista os canais cadastrados
  /find - Busca por videos novos manualmente
`;

// scenes para adicionar canais
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

const addapi = new Scenes.WizardScene(
    'add-api',
    ctx => {
        ctx.reply("Digite o TOKEN da API do Youtube");
        ctx.wizard.state.data = {};
        return ctx.wizard.next();
    },
    ctx => {
        api.insereApi(ctx.chat.id, ctx.message.text)
            .then((data) => {
                ctx.reply("TOKEN cadastrado");
                return ctx.scene.leave()
            })
            .catch((error) => {
                console.log(error)
                ctx.reply("Erro ao cadastrar o token");
                ctx.reply("Tente novamente");
                return ctx.scene.leave()
            })
        return ctx.scene.leave()
    }
);

const st = new Scenes.Stage([adcanal, addapi]);
bot.use(session());
bot.use(st.middleware());

bot.command('start', (ctx) => {
    start(ctx);
})

bot.action('addcanal', (ctx) => {
    // validar adm
    ctx.scene.enter('add-canal');
})

bot.action('delete', (ctx) => {
    // validar adm
    ctx.reply("Em construção ");
})

bot.action('api', (ctx) => {
    ctx.reply("Em construção ");
    // validar adm
    ctx.scene.enter('add-api');
})

bot.help((ctx) => {
    ctx.reply(helpmessage);
})

bot.command('lista', (ctx) => {
    var idchat = ctx.chat.id;
    console.log(`/lista ${idchat}`)
    lista(idchat);
})

bot.command('find', (ctx) => {
    var idchat = ctx.chat.id;
    find(idchat);
})

bot.command('addcanal', ctx => {
    validaaddcanal(ctx)
    //ctx.scene.enter('add-canal');
});

bot.command('chatid', (ctx) => {
    bot.telegram.sendMessage(ctx.chat.id, `O ID deste chat é: ${ctx.chat.id}`);
    console.log(ctx.message.from.id);
});


// comando start, envia uma mensagem em privado
async function start(ctx) {
    let tipo = ctx.chat.type;
    let continua = await validaadm(ctx);

    if (continua == 'S') {

        const banner = "Bem - vindo! ";
        const padding = ''.repeat(Math.floor((process.stdout.columns - banner.length) / 2));
        const centeredbanner = padding + banner;
        const message = `${ctx.message.from.first_name}  \nUse o comando /help para ver a lista de comandos ^^`;
        const imgPath = './assets/img/001.jpg';
        const menu = {
            inline_keyboard: [
                [{ text: "Configurar API", callback_data: 'api' },
                { text: "Adicionar Canais", callback_data: 'addcanal' }
                ],
                [{ text: "Excluir Canais", callback_data: 'delete' }]
            ]
        };
        ctx.replyWithPhoto({ source: imgPath }, { caption: centeredbanner + message, reply_markup: menu });

        if (tipo == 'private') {
            users.insereUser(ctx.from.first_name, ctx.from.username, ctx.from.id, tipo);
        } else {
            users.insereUser(ctx.from.first_name, ctx.from.username, ctx.chat.id, tipo);
        }

    } else {
        ctx.reply("Disponível apenas para administradores");
    }
    return true;
};

async function defineapi(chatid) {
    var tokenapi = await api.listaChatApi(chatid);

    if (tokenapi == null) {
        console.log('Sem chave de api definida')
    } else {
        console.log(tokenapi)
    }
    return tokenapi;
}

async function validaaddcanal(ctx, pid) {
    const continua = await validaadm(ctx);
    if (continua == 'S') {
        ctx.scene.enter('add-canal');
    } else {
        bot.telegram.sendMessage(ctx.chat.id, `Disponível apenas para ADM`);
    }
};

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

//verifica status do usuario
async function isAdmin(idOfChat, IdOfUser, ctx) {
    const member = await ctx.telegram.getChatMember(idOfChat, IdOfUser)
    var admin;

    if (member.status == 'creator' || member.status == 'administrator') {
        admin = 'S'
    } else {
        admin = 'N'
    }

    return admin;
}

// para grupos, valida se o usuario tem permissão para usar o comando
async function validaadm(ctx) {
    const adm = await isAdmin(ctx.chat.id, ctx.from.id, ctx);
    let tipo = ctx.chat.type;

    console.log(adm);
    console.log(tipo);
    console.log(ctx);

    if ((tipo == 'private') || ((tipo == 'group' || tipo == 'supergroup') && adm == 'S')) {
        var continua = 'S';
    } else {
        var continua = 'N';
    }

    return continua;
}

// lista os canais cadastrados
async function lista(idchat) {
    console.log(idchat)
    var dados = await canais.listchatall(idchat);

    console.log(dados)

    var canal = dados.map(function (item) {
        return {
            status: 1,
            id: item.id,
            nome: item.nome,
            cid: item.cid,
            chatid: item.chatid
        }
    });

    var lista = '';
    for (i = 0; i < canal.length; i++) {
        lista = `${lista}ID: ${canal[i].id} Nome: ${canal[i].nome} \n`;
    }

    console.log(lista)
    bot.telegram.sendMessage(idchat, lista);
    return canal;
}

async function listafind(idchat) {

    if (idchat == 0 ){
        var dados = await canais.listall(idchat);
    } else {
        var dados = await canais.listchatall(idchat);
    }
    
    var canal = dados.map(function (item) {
        return {
            status: 1,
            id: item.id,
            nome: item.nome,
            cid: item.cid,
            chatid: item.chatid
        }
    });

    var lista = '';
    for (i = 0; i < canal.length; i++) {
        lista = `${lista}ID: ${canal[i].id} Nome: ${canal[i].nome} \n`;
    }

    console.log(lista)

    return canal;
}

async function find(idchat) {
    var msg = '';
    var canais = await listafind(idchat);

    for (i = 0; i < canais.length; i++) {
        var verifica = await rss.getrss(canais[i].cid, 1);
        console.log(verifica);
        console.log(verifica[0].canal);

        var cnome = canais[i].nome;
        var idvideo = verifica[0].idvideo;
        var urlvideo = verifica[0].urlvideo;
        var idcanal = canais[i].id;
        var codcanal = verifica[0].canalid;
        var dtvideo = verifica[0].dtvideo;
        var idchat = canais[i].chatid;
        var chave = `${idchat}${idcanal}${idvideo}`;

        console.log(idvideo + ' - ' + urlvideo + ' - ' + idcanal + ' - ' + codcanal + ' - ' + dtvideo + ' - ' + idchat + ' - ' + chave);

        var inserir = await videos.listavideo(codcanal, idvideo);

        console.log(`inserir = ${inserir}`)

        if (inserir == 0) {
            videos.inserevideo(idvideo, urlvideo, idcanal, codcanal, dtvideo, idchat, chave)
            msg = `Video novo no canal ${cnome}!! Veja o video: \n \n` + urlvideo
            bot.telegram.sendMessage(idchat, msg);
        }
    }
}

setInterval(async () => { 
    find(0);
  }, CRAWLER_INTERVAL)

bot.launch();