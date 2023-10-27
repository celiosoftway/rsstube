const rss = require('./rss.js');
const app = require('./app.js');
const canais = require('../db/canais');

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

async function msg(ctx) {
    var idchat = ctx.chat.id;
    ctx.reply(`Ola, bot iniciado para o chat ${idchat}`)
    app.send(idchat, "Teste de mensagem");
}

module.exports = {
    addcanal,
    msg
}