const database = require('./dbapi');
const Api = require('./tapi');

(async () => {
  try {
    const resultado = await database.sync();
    console.log('conectado dbapi');
  } catch (error) {
    console.log(error);
  }
})();

async function insereApi(chatid, api) {
  try {
    const resultado = await database.sync();
    console.log(resultado);

    const resultadoCreate = await Api.create({
      api: api,
      chatid: chatid
    })
    console.log(resultadoCreate);
  } catch (error) {
    console.log(error);
  }
};

async function listaChatApi(chatid) {
  try {
    var api = await Api.findOne({ where: { chatid: chatid } })
    console.log(api);
  } catch { console.log('Token de API não encontrada') }
};

module.exports = {
  insereApi,
  listaChatApi
}