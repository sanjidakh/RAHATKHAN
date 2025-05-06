module.exports.config = {
    name: "tiktokinfo",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "RAHAT KHAN😍",
    description: "View Tiktok account information",
    commandCategory: "Khan Rahul RK",
    usages: "tiktokinfo [account name]",
    cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
    const axios = require('axios');
    const request = require('request');
    const fs = require("fs");
    
    const apikey = "e33aab1684";
    const username = args.join(" ");
    
    if (!username) {
        return api.sendMessage("You have not entered an account name!", event.threadID, event.messageID);
    }

    try {
        const response = await axios.get(`https://hungdev.id.vn/tiktok/profile?username=${username}&apikey=${apikey}`);
        const info = response.data;

        if (!info || !info.data || !info.data.user) {
            return api.sendMessage("TikTok account information not found!", event.threadID, event.messageID);
        }

        const user = info.data.user;
        const stats = info.data.stats;
        const avatarUrl = user.avatarLarger || user.avatarMedium || user.avatarThumb;

        let message = `👤 Username: ${user.uniqueId}\n`;
        message += `📌 Display name: ${user.nickname}\n`;
        message += `👀 Followers: ${stats.followerCount}\n`;
        message += `❤️ Likes: ${stats.heartCount}\n`;
        message += `🎥 Total video: ${stats.videoCount}\n`;
        message += `📝 Bio: ${user.signature || "Do not have"}\n`;

        if (!avatarUrl) {
            return api.sendMessage(message, event.threadID, event.messageID);
        }

        const filePath = __dirname + "/cache/tiktok_avatar.jpg";
        request(avatarUrl).pipe(fs.createWriteStream(filePath)).on("close", () => {
            api.sendMessage({
                body: message,
                attachment: fs.createReadStream(filePath)
            }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
        });

    } catch (error) {
        return api.sendMessage("An error occurred while retrieving TikTok information!", event.threadID, event.messageID);
    }
};
