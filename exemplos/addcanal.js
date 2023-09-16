


async function addcanal(pid) {
    var data = await rss.getrss(pid, 1);
    var status = data[0].status;

    if (status == 1) {
        var nomecanal = data[0].canal;
        var urlvideo = data[0].urlvideo;
        var idchat = ctx.update.message.chat.id;
        var chave = `${cid}${idchat}`
    }

    if (status == 1) {
        console.log(`Canal encontrado ${nomecanal}`);
        canais.insereCanal(nomecanal, cid, idchat, chave);

        ctx.reply(`Canal ${nomecanal} adicionado!! Veja o ultimo video \n \n` + urlvideo);
    } else {
        console.log(`Deu ruim, o canal não foi encontrado ou cota API atingido`);
        ctx.reply(`Deu ruim, o canal não foi encontrado ou cota API atingido`);
    }
}


const st = new Scenes.Stage([canaladd]);
bot.use(st.middleware());

bot.command('addcanal', ctx => {
    ctx.scene.enter('add-canal');
});

bot.launch();