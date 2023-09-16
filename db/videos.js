const database = require('./dbvideos');
const Videos = require('./tvideos');

(async () => {
  try {
    const resultado = await database.sync();
    console.log('conectado dbvideos');
  } catch (error) {
    console.log(error);
  }
})();

async function inserevideo(idvideo, urlvideo, idcanal, codcanal,dtvideo,idchat,chave) {
  try {
    const resultado = await database.sync();
    console.log(resultado);

    const resultadoCreate = await Videos.create({
      idvideo: idvideo, 
      urlvideo: urlvideo, 
      idcanal: idcanal, 
      codcanal: codcanal,
      dtvideo: dtvideo,
      idchat: idchat,
      chave: chave
    })
    console.log(resultadoCreate);
  } catch (error) {
    console.log(error);
  }
};

async function listavideo(idcanal, idvideo) {
  var status = 0;
  try {
    var videos = await Videos.findOne({ where: { codcanal: idcanal, idvideo: idvideo } })

    console.log(videos.dataValues.idcanal + ' - ' + videos.dataValues.idvideo);
    status = 1;
  } catch { 
    console.log('video não encontrado') 
  }

  return status;
};

module.exports = { inserevideo, listavideo}