const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: 'sanjida',
    version: '1.0',
    hasPermission: 0,
    credits: 'RAHAT',
    countDown: 5,
    usePrefix: true,
    description: 'Fetches profile picture of you or a mentioned user.',
    commandCategory: 'utility',
    guide: {
      en: '   {pn} [@mention (optional)]'
    },
  },

  run: async ({ api, event, args }) => {
    try {
      const mentions = event.mentions;
      let uid = event.senderID;
      let targetName = 'User';

 
      if (args.length > 0 && mentions && Object.keys(mentions).length > 0) {
        uid = Object.keys(mentions)[0];
        targetName = mentions[uid].replace(/@/g, '');
      } else {
     
        const info = await new Promise(resolve =>
          api.getUserInfo(uid, (err, res) => resolve(res || {}))
        );
        targetName = info[uid]?.name || 'User';
      }

      const profilePicUrl = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;
      const tempPath = path.join(__dirname, `../../temp/avatar_${uid}.png`);
      await fs.ensureDir(path.dirname(tempPath));

      const response = await axios.get(profilePicUrl, { responseType: 'arraybuffer' });
      await fs.writeFile(tempPath, response.data);

      await api.sendMessage(
        {
          body: `🖼️ Profile Picture of ${targetName}`,
          attachment: fs.createReadStream(tempPath),
        },
        event.threadID
      );

      await fs.unlink(tempPath);
    } catch (error) {
      console.error('Error in pic command:', error);
      api.sendMessage('❌ Failed to fetch the profile picture.', event.threadID);
    }
  }
};
