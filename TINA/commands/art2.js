const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "art2",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "RAHAT🙃",
  description: "Generate AI art from prompt",
  commandCategory: "AI",
  usages: "[prompt]",
  cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
  const prompt = args.join(" ");
  const { threadID, messageID } = event;

  if (!prompt) {
    return api.sendMessage("❌ একটি প্রম্পট দিন!\nযেমন: art সুন্দর গ্রাম", threadID, messageID);
  }

  const apiUrl = `https://nexalo-api.vercel.app/api/art?prompt=${encodeURIComponent(prompt)}`;

  try {
    const response = await axios.get(apiUrl, { timeout: 10000 });
    const data = response.data;

    if (!data.response) {
      return api.sendMessage(`❌ "${prompt}" এর জন্য কোনো আর্ট পাওয়া যায়নি।`, threadID, messageID);
    }

    const imageUrl = data.response;
    const tempPath = path.join(__dirname, `cache/art_${Date.now()}.jpg`);

    const imgData = await axios.get(imageUrl, {
      responseType: "arraybuffer",
      timeout: 30000
    });

    await fs.outputFile(tempPath, imgData.data);

    await api.sendMessage({
      body: `🎨 "${prompt}" এর জন্য তৈরি করা আর্ট নিচে দেওয়া হলো:`,
      attachment: fs.createReadStream(tempPath)
    }, threadID, () => fs.unlink(tempPath), messageID);

  } catch (err) {
    console.error("❌ Art command error:", err.message);
    return api.sendMessage(`❌ আর্ট তৈরি করতে সমস্যা হয়েছে:\n${err.message}`, threadID, messageID);
  }
};
