const usetube = require('usetube')
const axios = require("axios");
const { google } = require("googleapis");

async function videoData() {
   const data = await usetube.getVideoDesc("O5kCiuSlfAQ");

   console.log(data)
}

const apiUrl = "https://www.googleapis.com/youtube/v3";
const apiKey = 'AIzaSyDmaou8GUIYlhu2HLDj6joKIhFPferctV4';

const youtube = google.youtube({
    version: "v3",
    auth: apiKey,
});


async function getrss(videoID) {
   try {
       const url = `${apiUrl}/search?key=${apiKey}&type=video&part=id&maxResults=1&order=date&videoId=${videoID}`;
       const response = await axios.get(url);

       console.log(response);
   } catch (err) {
       console.error(err);
       var dados = [{status: 0}];
   }

   return response;
}

getrss('zSgx8U16stk');