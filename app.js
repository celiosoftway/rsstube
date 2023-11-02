//Scenes      : adcanal, addapi, deletacanal
//Bot commnad : start, help, addcanal, delete, api, lista, find, chatid
//function    : start, defineapi, validaaddcanal, addcanal, isAdmin, validaadm, lista, find, listafind

const { Telegraf, Scenes, session } = require('telegraf');

// rss.js contem as function para interagir com a API do Youtube
const rss = require('./rss.js');

// BD com sequelize trabalhando com 3 arquivos por tabela ( EX TCANAIS, DCANAIS, CANAIS)
// Arquivo para DDL, Arquivo para conexão, Arquivo para DML
const users = require('./db/user');
const canais = require('./db/canais');
const videos = require('./db/videos');
const api = require('./db/api');

// por enquanto esta intervalo fixo, posteriormente criar configuração por usuário
// 1 segundo = 1000 1 minuto = 60000 1 Horas = 3600000  6 horas 21600000
const CRAWLER_INTERVAL = 10800000;  // 3 horas

require("dotenv").config();
const bot = new Telegraf(process.env.BOT_TOKEN);
//const bot = new Telegraf(process.env.BOT_TOKEN_TEST);

// cria um menu com os comandos no chat do telegran
bot.telegram.setMyCommands([
    { command: 'start', description: 'inicia conversa com o bot' },
    { command: 'add', description: 'Adicina um novo canal' },
    { command: 'del', description: 'Deletar um canal' },
    { command: 'help', description: 'Exibe uma lista de comandos' },
    { command: 'list', description: 'lista os canais cadastrados' },
    { command: 'find', description: 'Busca por videos novos manualmente' },

]);

//constante para o comando do help com a lista de comandos slash
const helpmessage = `
  Comandos do bot:
  /start - inicia a conversa com o bot
  /add - Adicina um novo canal
  /del - Deletar um canal
  /list - lista os canais cadastrados
  /find - Busca por videos novos manualmente
`;

// scenes para adicionar canais
// scenes é uma instancia dentro da sessão do usuario, para interagir e capturar dados digitados
const adcanal = new Scenes.WizardScene(
    'add-canal',
    ctx => {
        ctx.reply("Digite a url de algum video do canal desejado\nCopie a URL da barra do navegador, não use a URL gerada na opção de compartilhar");
        ctx.wizard.state.data = {};
        return ctx.wizard.next();
    },
    ctx => {
        // uso o ID do video e executo a API para retornar os dados do video 
        // dos dados do video uso o channelId para cadastrar o canal
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

// Atualmente esta sendo usado a API cadastrada no arquivo .env
// posteriormente todas as chamadas da API serão feitas com o TOKEN cadastrado de cada usuario
// Isso é necessario pq existe um limite diario de utilização da API.

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

// scene para deletar um canal
const deletacanal = new Scenes.WizardScene(
    'dell-canal',
    ctx => {
        ctx.reply("Digite o ID do canal que deseja deletar");
        lista(ctx.chat.id)
        ctx.wizard.state.id = {};
        return ctx.wizard.next();
    },
    ctx => {
        ctx.wizard.state.id = ctx.message.text

        canais.listchatone(ctx.chat.id, ctx.wizard.state.id)
            .then((data) => {
                if (data.length == 0) {
                    ctx.reply(`O canal ID ${ctx.wizard.state.id} não pertence a esse chat`);
                    return ctx.scene.leave();
                } else {
                    ctx.reply(`Deseja deletar o canal de ID ${ctx.wizard.state.id} (S, N)`);
                }
            })
            .catch((error) => {
                ctx.reply("Canal não pertence a este chat");
                return ctx.scene.leave();
            })

        return ctx.wizard.next();
    },
    ctx => {
        if ((ctx.message.text == 'S') || (ctx.message.text == 's')) {
            ctx.reply("Deletar canal");

            canais.deleteone(ctx.wizard.state.id, ctx.chat.id)
                .then((data) => {
                    ctx.reply(`Canal deletado. Clique em /lista para conferir.`);
                })
                .catch((error) => {
                    ctx.reply("Eyta... Erro ao deletar canal");
                })

        } else if ((ctx.message.text == 'N') || (ctx.message.text == 'n')) {
            ctx.reply("Tudo certo, o canal não sera deletado");
        } else {
            ctx.reply("Não entendi sua resposta");
        }

        return ctx.scene.leave()
    }
);

// instruções necessarias para utilizar scenes
// crio um stage com as scenes e uso em um middleware
const st = new Scenes.Stage([adcanal, addapi, deletacanal]);
bot.use(session());
bot.use(st.middleware());

// abaixo os comandos slash e as actions dos botões
// comando que inicia a conversa com o bot
bot.command('start', (ctx) => {
    start(ctx);
})

// exibe as opções de comandos do bot
bot.help((ctx) => {
    ctx.reply(helpmessage);
})

// comando e action para adicionar um canal para o feed
bot.action('add', (ctx) => {
    validaaddcanal(ctx);
})

bot.command('add', ctx => {
    validaaddcanal(ctx);
});

//comando para deletar um canal do feed
bot.action('del', (ctx) => {
    // validar adm
    validaadm(ctx)
        .then((data) => {
            if (data == 'S') {
                ctx.scene.enter('dell-canal');
            } else {
                bot.telegram.sendMessage(ctx.chat.id, `Disponível apenas para ADM`);
            }
        })
        .catch((error) => {
            ctx.reply("Erro ao validar permissão");
        })
})

bot.command('del', (ctx) => {
    // validar adm
    validaadm(ctx)
        .then((data) => {
            if (data == 'S') {
                ctx.scene.enter('dell-canal');
            } else {
                bot.telegram.sendMessage(ctx.chat.id, `Disponível apenas para ADM`);
            }
        })
        .catch((error) => {
            ctx.reply("Erro ao validar permissão");
        })
})

// action para cadastrar API
bot.action('api', (ctx) => {
    ctx.reply("Em construção ");
    // validar adm
    // ctx.scene.enter('add-api');
})

//comando para listar os canais cadastrados no feed
bot.command('list', (ctx) => {
    var idchat = ctx.chat.id;
    lista(idchat);
})

// executa uma busca manual por videos
bot.command('find', (ctx) => {
    var idchat = ctx.chat.id;
    find(idchat);
})

// exibe o ID do chat
bot.command('chatid', (ctx) => {
    bot.telegram.sendMessage(ctx.chat.id, `O ID deste chat é: ${ctx.chat.id}`);
    console.log(ctx.message.from.id);
});

// function start, envia uma mensagem em privado
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
                { text: "Adicionar Canais", callback_data: 'add' }
                ],
                [{ text: "Excluir Canais", callback_data: 'del' }]
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

// Função para verificar se existe TOKEN  cadastrado para o chat
// posteriormente deve ser validado se o TOKEN é valido, fazendo uma requisição com o TOKEN
async function defineapi(chatid) {
    var tokenapi = await api.listaChatApi(chatid);

    if (tokenapi == null) {
        console.log('Sem chave de api definida')
    } else {
        console.log(tokenapi)
    }
    return tokenapi;
}

// Validação utilizada para Grupos, para que o comando só possa ser usado por Adms.
async function validaaddcanal(ctx, pid) {
    const continua = await validaadm(ctx);
    if (continua == 'S') {
        ctx.scene.enter('add-canal');
    } else {
        bot.telegram.sendMessage(ctx.chat.id, `Disponível apenas para ADM`);
    }
};

// função para adicionar umm canal no feed
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

// para grupos, valida se o usuario tem permissão para usar o comando (donos e adms)
async function validaadm(ctx) {
    const adm = await isAdmin(ctx.chat.id, ctx.from.id, ctx);
    let tipo = ctx.chat.type;

    if ((tipo == 'private') || ((tipo == 'group' || tipo == 'supergroup') && adm == 'S')) {
        var continua = 'S';
    } else {
        var continua = 'N';
    }

    return continua;
}

// lista os canais cadastrados do chat
async function lista(idchat) {
    var dados = await canais.listchatall(idchat);

    if (dados.length > 0) {
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

        bot.telegram.sendMessage(idchat, lista);
    } else {
        bot.telegram.sendMessage(idchat, 'Sem canais para listar');
    }

    return canal;
}

// Função para buscar por novos vídeos para alimentar o feed
// o ID é utilizado nos comandos para busca manual, e executa a busca para o chat especifico
async function find(idchat) {
    var msg = '';
    var canais = await listafind(idchat);

    for (i = 0; i < canais.length; i++) {
        var verifica = await rss.getrss(canais[i].cid, 1);

        if (verifica[0].status == 1) {
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
}

// lista os canais cadastrados.
// idchat = 0 é a chamada automatica lista os canais de todos os chats
// idchat <> 0 é a chamada realizada manualmente para atualizar o feed, lista chat específico
async function listafind(idchat) {
    if (idchat == 0) {
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

// função para executar a busca por novos vídeos no tempo configurado
setInterval(async () => {
    find(0);
}, CRAWLER_INTERVAL)

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

//inicia o bot
bot.launch();