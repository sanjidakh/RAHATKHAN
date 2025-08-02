const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const { createReadStream } = require('fs');

module.exports.config = {
 name: "fbcover",
 version: "1.0",
 hasPermission: 0,
 credits: "RAHAT",
 description: "Generate Facebook cover style 1 or 2 with profile picture and text.",
 commandCategory: "media",
 usages: "[1|2] | name | text1 | text2",
 cooldowns: 3,
};

module.exports.run = async function ({ api, event, args }) {
 try {
 const threadID = event.threadID;
 const messageID = event.messageID;
 const senderID = event.senderID;

 if (!args[0] || !['1', '2'].includes(args[0])) {
 return api.sendMessage(
 "📌 ব্যবহার:\nfbcover 1 | name | text1 | text2\nfbcover 2 | text1 | text2",
 threadID, messageID
 );
 }

 const style = args[0];
 const userImageUrl = `https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;

 let apiUrl;

 if (style === '1' && args.length >= 4) {
 const [_, name, text1, text2] = args.join(" ").split("|").map(s => s.trim());
 apiUrl = `https://hridoy-apis.vercel.app/canvas/facebook-cover-v1?imageUrl=${encodeURIComponent(userImageUrl)}&name=${encodeURIComponent(name)}&text1=${encodeURIComponent(text1)}&text2=${encodeURIComponent(text2)}&apikey=hridoyXQC`;
 } else if (style === '2' && args.length >= 3) {
 const [_, text1, text2] = args.join(" ").split("|").map(s => s.trim());
 apiUrl = `https://hridoy-apis.vercel.app/canvas/facebook-cover-v2?imageUrl=${encodeURIComponent(userImageUrl)}&firstName=${encodeURIComponent(text1)}&lastName=${encodeURIComponent(text2)}&apikey=hridoyXQC`;
 } else {
 return api.sendMessage(
 `❌ ভুল ফরম্যাট।\nসঠিক ব্যবহার:\nfbcover 1 | name | text1 | text2\nfbcover 2 | text1 | text2`,
 threadID, messageID
 );
 }

 const response = await axios.get(apiUrl, {
 responseType: 'arraybuffer',
 timeout: 45000,
 headers: {
 'User-Agent': 'Mozilla/5.0',
 'Accept': 'image/png,image/*',
 }
 });

 if (!response.data || response.data.byteLength < 1000) {
 throw new Error("API থেকে সঠিক ইমেজ আসেনি।");
 }

 const cachePath = path.join(__dirname, 'cache');
 await fs.ensureDir(cachePath);

 const fileName = `fbcover_${senderID}_${Date.now()}.png`;
 const filePath = path.join(cachePath, fileName);
 await fs.writeFile(filePath, Buffer.from(response.data));

 api.sendMessage({
 body: `✅ ফেসবুক কভার (স্টাইল ${style}) তৈরি হয়েছে!`,
 attachment: createReadStream(filePath)
 }, threadID, () => fs.unlink(filePath, () => {}), messageID);

 } catch (e) {
 console.error(e);
 return api.sendMessage("❌ কভার তৈরি করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।", event.threadID, event.messageID);
 }
};
