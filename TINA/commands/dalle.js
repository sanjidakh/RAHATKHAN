const axios = require('axios');

module.exports = {
  config: {
    name: "dalle",
    version: "1.0",
    credits: "𝐊𝐡𝐚𝐧 𝐑𝐚𝐡𝐮𝐥 𝐑𝐊",
    countDown: 10,
    hasPermssion: 2,
   description: "Generate images by Unofficial Dalle",
    commandCategory: "𝗜𝗠𝗔𝗚𝗘 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗢𝗥",
    usages: { en: "{pn} prompt" }
  }, 
  run: async({ api, event, args }) => {
    const prompt = (event.messageReply?.body.split("dalle")[1] || args.join(" ")).trim();
    if (!prompt) return api.sendMessage("❌| Wrong Format. ✅ | Use: 17/18 years old boy/girl watching football match on TV with 'Khan Rahul RK' and '69' written on the back of their dress, 4k", event.threadID, event.messageID);
    try {
  const cookies = ["1vTP8xlb8fgO0BOsHJRASjT7p_h27brHBjx4HZZBR507xJ_UqC79pnkgoJgRoWqdQYoIJCQ8zXBRadq24u2e8Q9kx6enYkK6XV9Jo0mJrqCkYaeGqBKREP53-ZTB-8trpLS1qfVYTuSoxDZbG7aLmtCqSpU5up96WuRMeq--iNYIjWhr26NEYYCI075_NWaM9kjhATbeH9TBSqJf7qYYngQ"];
const randomCookie = cookies[Math.floor(Math.random() * cookies.length)];
      const wait = api.sendMessage("𝐏𝐥𝐞𝐚𝐬𝐞 𝐖𝐚𝐢𝐭𝐢𝐧𝐠 𝐏𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠 𝐘𝐨𝐮𝐫 𝐈𝐦𝐚𝐠𝐞 \n\n𝐊𝐡𝐚𝐧 𝐑𝐚𝐡𝐮𝐥 𝐑𝐊", event.threadID);
      const response = await axios.get(`https://www.noobs-api.rf.gd/dipto/dalle?prompt=${prompt}&key=dipto008&cookie=${cookies}`);
const imageUrls = response.data.imgUrls || [];
      if (!imageUrls.length) return api.sendMessage("Empty response or no images generated.", event.threadID, event.messageID);
      const images = await Promise.all(imageUrls.map(url => axios.get(url, { responseType: 'stream' }).then(res => res.data)));
    api.unsendMessage(wait.messageID);
   api.sendMessage({ body: `✅𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥 𝐘𝐨𝐮𝐫 𝐈𝐦𝐚𝐠𝐞 \n\n𝐊𝐡𝐚𝐧 𝐑𝐚𝐡𝐮𝐥 𝐑𝐊 😘`, attachment: images }, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage(`Generation failed!\nError: ${error.message}`, event.threadID, event.messageID);
    }
  }
}
