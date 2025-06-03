const axios = require("axios");

module.exports.config = {
  name: "4k",
  aliases: ["4k"],
  version: "2.0",
  hasPermission: 0,
  role: 0,
  credits: "RAHAT🌹",
  description: "Increase Photo quality ",
  commandCategory: "media",
  premium: true,
  guide: "{pn} [reply photo]",
  countDown: 15,
};

module.exports.run = async ({ message, event }) => {
  const dipto = "https://www.noobs-api.rf.gd/dipto";
  try {
    if (!event.messageReply.attachments)
      return message.reply("Please reply to an image to upscale");

    const imageLink = event.messageReply.attachments[0].url;
    const startTime = Date.now();
    const ok = await message.reply('Please wait... 😘');
    message.react("⌛");

    const apiurl = `${dipto}/upscalev2?url=${encodeURIComponent(imageLink)}`;
 //   const response = await axios.get(apiurl, { responseType: 'stream' });

    const endTime = Date.now();
    const timeTaken = (endTime - startTime) / 1000;

    message.react("✅");
    message.unsend(ok.messageID);

    await message.reply({ body:`✨ | Here's your image \n[ Generated in ${timeTaken} seconds ]`, attachment: await global.utils.getStreamFromURL(apiurl) });
  } catch (e) {
    console.error("4k Error: ", e.message);
    message.reply("4k Error: " + e.message);
  }
};
