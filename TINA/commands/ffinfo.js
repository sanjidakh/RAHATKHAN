const axios = require("axios");
const fs = require("fs");
const path = require("path");

const API_BASE = "https://firestats.onrender.com/api";
const API_KEY = "2f25567051a78d2f2b60a261af6babb8cb161bb32e24122eb4e6f21c767f46e0";

module.exports = {
  config: {
    name: "ffinfo",
    version: "1.0",
    credits: "RAHAT",
    usePrefix: true,
    hasPermission: 0,
    commandCategory: "information",
    countDown: 5,
    role: 0,
    description: { en: "Get FF player collection image." },
    category: "information",
    guide: { en: "{pn} <UID>" }
  },

  module.exports.run = async function ({ api, args, message }) {
    const uid = args[0];
    if (!uid) return message.reply("Provide UID!");

    const waitMsg = await message.reply("🍁 Wait...");

    try {
     
      const collRes = await axios.get(`${API_BASE}/collection?uid=${uid}&api=${API_KEY}`, { responseType: "stream" });
      const collPath = path.resolve(__dirname, `temp_coll_${uid}.png`);
      const writer = fs.createWriteStream(collPath);
      collRes.data.pipe(writer);
      await new Promise((res, rej) => {
        writer.on("finish", res);
        writer.on("error", rej);
      });

      await api.unsendMessage(waitMsg.messageID);

      
      await message.reply({ attachment: fs.createReadStream(collPath) });
      fs.unlinkSync(collPath); // Clean up
    } catch (err) {
      await api.unsendMessage(waitMsg.messageID);
      message.reply("Error: " + err.message);
    }
  }
};
