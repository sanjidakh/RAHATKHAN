const axios = require('axios');

module.exports = {
    config: {
        name: 'muslimai',
        version: '1.0',
        credits: 'RAHAT',
        hasPermission: 0,
        countDown: 5,
        usePrefix: true,
        groupAdminOnly: false,
        description: 'Get Islamic insights with MuslimAI.',
        commandCategory: 'utility',
        guide: {
            en: '   {pn}muslimai <text>'
        },
    },
    run: async ({ api, event, args }) => {
        const threadID = event.threadID;
        const messageID = event.messageID;

        const text = args.join(' ').trim();
        if (!text) {
            return api.sendMessage('❌ Please provide a text. Example: !muslimai Tell me about prophets', threadID, messageID);
        }

        try {
            console.log(`Requesting MuslimAI with text: ${text}`);
            const response = await axios.get(
                `https://hridoy-apis.onrender.com/ai/muslimai?text=${encodeURIComponent(text)}`,
                { timeout: 15000 }
            );

            console.log('MuslimAI response:', response.data);

            if (response.data.status && response.data.result) {
                const { answer, source } = response.data.result;
                let message = answer + '\n\n**Sources:**\n';
                source.forEach((src, index) => {
                    message += `${index + 1}. ${src.surah_title} (${src.surah_url})\n`;
                });
                api.sendMessage(message, threadID, messageID);
            } else {
                throw new Error('Invalid response from MuslimAI API');
            }
        } catch (error) {
            console.error('MuslimAI error:', error.message);
            api.sendMessage(`❌ Error: ${error.message}`, threadID, messageID);
        }
    },
};
