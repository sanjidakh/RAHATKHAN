const fs = require('fs');
const path = require('path');
const axios = require('axios');

module.exports = {
    config: {
        name: 'bbm',
        version: '1.0',
        hasPermission: 0,
        author: 'RAHAT😍',
        credits: 'RAHAT🇦🇪',
        countDown: 10,
        usePrefix: true,
        prefix: false, 
        groupAdminOnly: false,
        description: 'Radom bangla band music',
        category: 'random',
        commandCategory: 'RANDOM',
        guide: {
            en: 'Just type bbm to get a random BBM video.'
        },
    },
    run: async ({ api, event }) => {
        const apiUrl = `https://hridoy-apis.vercel.app/random/bbm?apikey=hridoyXQC`;

        try {
            
            const response = await axios.get(apiUrl);
            if (!response.data || !response.data.url) {
                return api.sendMessage("Failed to fetch video link. Please try again later.", event.threadID);
            }
            const videoUrl = response.data.url;

           
            const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });

           
            const cacheDir = path.join(__dirname, 'cache');
            if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
            const videoPath = path.join(cacheDir, `bbm_${Date.now()}.mp4`);
            fs.writeFileSync(videoPath, Buffer.from(videoResponse.data, 'binary'));

          
            api.sendMessage({
                attachment: fs.createReadStream(videoPath)
            }, event.threadID, () => fs.unlinkSync(videoPath));
        } catch (error) {
            console.error("Error fetching or sending BBM video:", error);
            api.sendMessage("Sorry, an error occurred while fetching or sending the BBM video. Please try again later.", event.threadID);
        }
    }
};
