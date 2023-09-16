const database = require('./dbuser');
const Usuario = require('./usuario');

(async () => {
  try {
    const resultado = await database.sync();
    console.log('conectado dbuser');
  } catch (error) {
    console.log(error);
  }
})();

async function insereUser(nome, user, tlid, tipo) {
  try {
    const resultado = await database.sync();
    console.log(resultado);

    const resultadoCreate = await Usuario.create({
      nome: nome,
      user: user,
      tlid: tlid,
      tipo: tipo
    })
    console.log(resultadoCreate);
  } catch (error) {
    console.log(error);
  }
};

async function listaUser(ptlid) {
  try {
    var usuario = await Usuario.findOne({ where: { tlid: ptlid } })
    console.log(usuario.dataValues.tlid + ' - ' + usuario.dataValues.nome);
  } catch { console.log('usuario não encontrado') }
};

module.exports = {
  insereUser,
  listaUser
}