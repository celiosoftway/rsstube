const database = require('./dbcanais');
const Canais = require('./tcanais');

(async () => {
  try {
    const resultado = await database.sync();
    console.log('conectado dbcanais');
  } catch (error) {
    console.log(error);
  }
})();

async function insereCanal(nome, cid, chatid, chave) {
  try {
    const resultado = await database.sync();
    console.log(resultado);

    const resultadoCreate = await Canais.create({
      nome: nome,
      cid: cid,
      chatid: chatid,
      chave: chave
    })
    console.log(resultadoCreate);
  } catch (error) {
    console.log(error);
  }
};

async function listaOne(cid) {
  try {
    var canal = await Canais.findOne({ where: { cid: cid } })
    console.log(canal.dataValues.cid + ' - ' + canal.dataValues.nome);
  } catch { console.log('canal não encontrado') }
};

async function listall(c) {
  try {
    var canal = await Canais.findAll({ attributes: ['id', 'nome', 'cid', 'chatid'], raw: true });

  } catch {
    console.log('canal não encontrado');
  }

  return canal;
};

async function listchatall(idchat) {
  //console.log(idchat);

  try {
    var canal = await Canais.findAll({
      where: { chatid: idchat },
      attributes: ['id', 'nome', 'cid', 'chatid']
    });

  } catch {
    console.log('canal não encontrado');
  }

  return canal;
};

async function listchatone(idchat, idcanal) {
  //console.log(idchat);

  try {
    var canal = await Canais.findAll({
      where: { chatid: idchat, id:idcanal  },
      attributes: ['id', 'nome', 'cid', 'chatid']
    });

  } catch {
    console.log('canal não encontrado');
  }

  return canal;
};

async function deleteone(id, chat) {
  console.log(id)
  console.log(chat)

  try {
    let result = await Canais.destroy({
      where: { id: id, chatid: chat }
    });
  } catch (e) { console.error(e) }

}

module.exports = {
  insereCanal,
  listaOne,
  listall,
  listchatall,
  listchatone,
  deleteone
}

