const axios = require("axios");
const { google } = require("googleapis");
require("dotenv").config();

const apiUrl = "https://www.googleapis.com/youtube/v3";
const apiKey = process.env.APIKEY;

const youtube = google.youtube({
    version: "v3",
    auth: apiKey,
});

// "channelId":"UC4vOpUUqhQDh7XOoBxtTJOg"
async function getrss(channelId, maxResults) {
    try {
        const url = `${apiUrl}/search?key=${apiKey}&type=video&part=snippet&maxResults=${maxResults}&order=date&channelId=${channelId}`;
        const response = await axios.get(url);

        var dados = response.data.items.map(function (item) {
            return {
                status: 1,
                canal: item.snippet.channelTitle,
                canalid: channelId,
                titulo: item.snippet.title,
                idvideo: item.id.videoId,
                urlvideo: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                dtvideo: item.snippet.publishTime
            }
        });

        // console.log(dados);
    } catch (err) {
        console.error(err);
        var dados = [{ status: 0 }];
    }

    return dados;
}

async function getVideoData(video) {
    const idvideo = video.substring(video.search('v=') + 2,video.length);
    const url = `${apiUrl}/videos?key=${apiKey}&maxResults=1&part=snippet&id=${idvideo}`;

    try {
        const response = await axios.get(url);

        var dados = response.data.items.map(function (item) {
            return {
                status: 1,
                canal: item.snippet.channelId
            }           
        });

        console.log(dados[0].canal)
    }catch(err) {
       console.error('Deu merda');
       var dados = [{ status: 0 }];
    }

    return dados;
}

// getrss('UC4vOpUUqhQDh7XOoBxtTJOg', 4);

async function getid(){
    var idvideo = await getVideoData('https://www.youtube.com/watch?v=_zpJMt3QZt0');
    console.log(idvideo[0].canal)
}


//getid()



module.exports = {
    getrss,
    getVideoData
}