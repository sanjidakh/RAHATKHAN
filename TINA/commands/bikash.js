const axios = require('axios');
const dipto = "https://www.noobs-api.rf.gd";

module.exports.config = {
    name: "bikashbom",
    version: "2.0",
    credits: "RAHAT",
    cooldown: 5,
    hasPermssion: 1,
    commandCategory: "Bomber",
    usePrefix: true,
    description: "Bikash SMS Bomber",
    usages: "{pn} number [limit=1]",
    dependencies: {
        "axios": ""
    }
};

module.exports.run = async ({ api, args, message, event }) => {
    try {
        const number = args[0];
      const limit = args[1] || 2;

        if (!number) return api.sendMessage("🔴 | Error: Phone number required!", event.threadID, event.messageID);
        if (!/^[0-9]+$/.test(number)) return api.sendMessage("🔴 | Error: Invalid phone number!",event.threadID, event.messageID);
        if (limit > 15) return api.sendMessage("🔴 | Error: Maximum limit is 15!",event.threadID, event.messageID);

        const processingMsg = await api.sendMessage("💣 | Activating Bikash Bomber...",event.threadID);

        const { data } = await axios.get(`${dipto}/dipto/bikashBomber?number=${encodeURIComponent(number)}&limit=${limit}`);

        await api.unsendMessage(processingMsg.messageID);

        api.sendMessage(`
⚡ Bikash Bomber Results ⚡

📱 Target: ${number}
💣 Total: ${data.success + data.failed}
✅ Success: ${data.success}
❌ Failed: ${data.failed}

📊 Status: ${data.message}
        `.trim(), event.threadID, event.messageID);

    } catch (error) {
        console.error(error);
        api.sendMessage(`🔴 | Bomber Failed! ${error.message}`,event.threadID, event.messageID);
    }
};
