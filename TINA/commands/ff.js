const axios = require('axios');

module.exports.config = {
    name: "ff",
    version: "1.0.3",
    hasPermission: 0,
    credits: "RAHAT KHAN💔",
    description: "Get detailed information of the account Free Fire qua ID",
    commandCategory: "Khan Rahul RK",
    usages: "ff",
    cooldowns: 5,
};

module.exports.handleReply = async function({
    api,
    event,
    handleReply
}) {
    if (handleReply.step === 1) {
        const region = event.body.toLowerCase();
        const validRegions = ["bd", "dhaka", "Bd", "Dhaka"];

        if (!validRegions.includes(region)) {
            return api.sendMessage("The area is invalid. Please choose: bd, dhaka, Bd, Dhaka", event.threadID, event.messageID);
        }

        return api.sendMessage("Enter the free Fire account ID:", event.threadID, (err, info) => {
            global.client.handleReply.push({
                name: module.exports.config.name,
                messageID: info.messageID,
                author: event.senderID,
                step: 2,
                region
            });
        }, event.messageID);
    }

    if (handleReply.step === 2) {
        const ffId = event.body;
        const region = handleReply.region;
        const apiUrl = `https://wlx-demon-info.vercel.app/profile_info?uid=${ffId}&region=${region}&key=FFwlx`;

        try {
            const response = await axios.get(apiUrl);
            const data = response.data;

            if (data && data.AccountInfo) {
                const info = data.AccountInfo;
                const guild = data.GuildInfo;
                const pet = data.petInfo;
                const social = data.socialinfo;

                let resultMessage = "Account information:\n";
                resultMessage += `👤 Name: ${info.AccountName}\n`;
                resultMessage += `🆔 ID: ${info.AccountBPID}\n`;
                resultMessage += `⭐ Level: ${info.AccountLevel} (EXP: ${info.AccountEXP})\n`;
                resultMessage += `🔥 Badge BP: ${info.AccountBPBadges}\n`;
                resultMessage += `📅 Account Creation date: ${new Date(info.AccountCreateTime * 1000).toLocaleString('bd-Dhaka')}\n`;
                resultMessage += `🔄 Last login: ${new Date(info.AccountLastLogin * 1000).toLocaleString('Bd-dhaka')}\n`;
                resultMessage += `❤️ Like: ${info.AccountLikes}\n`;

                if (guild) {
                    resultMessage += "\n🛡️ GUILD Info:\n";
                    resultMessage += `🏰 Name: ${guild.GuildName}\n`;
                    resultMessage += `🔢 ID: ${guild.GuildID}\n`;
                    resultMessage += `🎖 Level: ${guild.GuildLevel}\n`;
                    resultMessage += `👥 Member: ${guild.GuildMember}/${guild.GuildCapacity}\n`;
                }

                if (pet) {
                    resultMessage += "\n🐾 PET Info:\n";
                    resultMessage += `🐶 Name: ${pet.name}\n`;
                    resultMessage += `🎖 Level: ${pet.level}\n`;
                    resultMessage += `🔥 EXP: ${pet.exp}\n`;
                }

                if (social) {
                    resultMessage += "\n📝 SIGNATURE:\n";
                    resultMessage += `📜 ${social.AccountSignature}\n`;
                }

                api.sendMessage(resultMessage, event.threadID);
            } else {
                api.sendMessage("No information or errors occur.", event.threadID);
            }
        } catch (error) {
            console.error("Error when calling API:", error);
            api.sendMessage("Error occurs when taking account information.", event.threadID);
        }
    }
};

module.exports.run = async function({
    api,
    event
}) {
    return api.sendMessage("Please choose the area (bd, dhaka, Bd, Dhaka):", event.threadID, (err, info) => {
        global.client.handleReply.push({
            name: module.exports.config.name,
            messageID: info.messageID,
            author: event.senderID,
            step: 1
        });
    }, event.messageID);
};
