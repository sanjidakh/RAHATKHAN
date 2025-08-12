// get.js
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const API_KEY = "2f25567051a78d2f2b60a261af6babb8cb161bb32e24122eb4e6f21c767f46e0";
const BASE_URL = "https://firestats.onrender.com/api";

module.exports = {
  config: {
    name: "info",
    version: "1.0",
    credits: "RAHAT",
    countDown: 5,
    hasPermission: 0,
    description: {
      vi: "",
      en: "Get FF player profile info"
    },
    commandCategory: "information",
    guide: {
      vi: "[UID]",
      en: "{pn}get [UID]"
    }
  },

  run: async function ({ api, args, message }) {
    const uid = args[0];
    if (!uid) return message.reply("Please provide a UID!");

    const profileUrl = `${BASE_URL}/profileinfo/v1?uid=${uid}&api=${API_KEY}`;
    const outfitUrl = `${BASE_URL}/outfit/v1?uid=${uid}&api=${API_KEY}`;

    const waitMessage = await message.reply("🍁 Please wait...");

    try {
      // Parallel API calls for speed
      const [profileRes, outfitRes] = await Promise.all([
        axios.get(profileUrl),
        axios.get(outfitUrl, { responseType: "arraybuffer" })
      ]);

      const profileData = profileRes.data;
      if (profileData.ban_status.status !== 200) {
        await api.unsendMessage(waitMessage.messageID);
        return message.reply("Failed to fetch info. Check UID.");
      }

      const banStatus = profileData.ban_status.data;
      const basicInfo = profileData.profile_info.basicInfo;
      const clanInfo = profileData.profile_info.clanBasicInfo;
      const socialInfo = profileData.profile_info.socialInfo;
      const petInfo = profileData.profile_info.petInfo;
      const creditScoreInfo = profileData.profile_info.creditScoreInfo;

      const formattedMessage = `
**PLAYER INFO**

┌⌚ **PLAYER ACTIVITY**
├─Last Login At: ${basicInfo.lastLoginAt ? new Date(basicInfo.lastLoginAt * 1000).toLocaleString() : "N/A"}
└─Created At: ${basicInfo.createAt ? new Date(parseInt(basicInfo.createAt)).toLocaleString() : "N/A"}

┌💁‍♂️ **BASIC INFO**
├─Nickname: ${basicInfo.nickname || "N/A"}
├─UID: ${basicInfo.accountId || "N/A"}
├─Region: ${basicInfo.region || "N/A"}
├─Level: ${basicInfo.level || "N/A"}
├─Exp: ${basicInfo.exp || "N/A"}
├─Badge Count: ${basicInfo.badgeCnt || "N/A"}
├─Liked Count: ${basicInfo.liked || "N/A"}
└─Title ID: ${basicInfo.title || "N/A"}

┌📈 **PLAYER RANKS**
├─BR Rank Point: ${basicInfo.rankingPoints || "N/A"}
├─CS Rank Point: ${basicInfo.csRankingPoints || "N/A"}
├─Max Rank: ${basicInfo.maxRank || "N/A"}
└─CS Max Rank: ${basicInfo.csMaxRank || "N/A"}

┌🫡 **SOCIAL INFO**
├─Language: ${socialInfo.language || "N/A"}
├─Gender: ${socialInfo.gender || "N/A"}
└─Signature: ${socialInfo.signature || "N/A"}

┌👨‍👩‍👧‍👦 **GUILD INFO**
├─Guild Name: ${clanInfo.clanName || "N/A"}
├─Guild ID: ${clanInfo.clanId || "N/A"}
├─Guild Level: ${clanInfo.clanLevel || "N/A"}
└─Members/Capacity: ${clanInfo.memberNum || 0}/${clanInfo.capacity || 0}

┌🐶 **PET INFO**
├─Pet ID: ${petInfo.id || "N/A"}
├─Level: ${petInfo.level || "N/A"}
└─Exp: ${petInfo.exp || "N/A"}

┌💳 **CREDIT SCORE**
└─Score: ${creditScoreInfo.creditScore || "N/A"}

┌🚫 **BAN STATUS**
├─Is Banned: ${banStatus.is_banned ? "Yes" : "No"}
├─Period: ${banStatus.period || "N/A"}
└─Last Login: ${banStatus.last_login ? new Date(banStatus.last_login * 1000).toLocaleString() : "N/A"}
`;

      await api.unsendMessage(waitMessage.messageID);

      const outfitPath = path.resolve(__dirname, `temp_outfit_${uid}.jpg`);
      fs.writeFileSync(outfitPath, Buffer.from(outfitRes.data));

      return message.reply({
        body: formattedMessage,
        attachment: fs.createReadStream(outfitPath)
      }).then(() => fs.unlinkSync(outfitPath)).catch(() => {});
    } catch (error) {
      await api.unsendMessage(waitMessage.messageID);
      return message.reply("Error fetching data.");
    }
  }
};

// info.js
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const API_KEY = "2f25567051a78d2f2b60a261af6babb8cb161bb32e24122eb4e6f21c767f46e0";
const BASE_URL = "https://firestats.onrender.com/api";

module.exports = {
  config: {
    name: "ff",
    version: "1.0",
    author: "RAHAT",
    countDown: 5,
    hasPermission: 0,
    description: {
      vi: "",
      en: "Get FF player collection info"
    },
    commandCategory: "information",
    guide: {
      vi: "[UID]",
      en: "{pn}info [UID]"
    }
  },

  run: async function ({ api, args, message }) {
    const uid = args[0];
    if (!uid) return message.reply("Please provide a UID!");

    const collectionUrl = `${BASE_URL}/collection?uid=${uid}&api=${API_KEY}`;

    const waitMessage = await message.reply("🍁 Please wait...");

    try {
      const response = await axios.get(collectionUrl, { responseType: "arraybuffer" });

      await api.unsendMessage(waitMessage.messageID);

      const collectionPath = path.resolve(__dirname, `temp_collection_${uid}.jpg`);
      fs.writeFileSync(collectionPath, Buffer.from(response.data));

      return message.reply({
        attachment: fs.createReadStream(collectionPath)
      }).then(() => fs.unlinkSync(collectionPath)).catch(() => {});
    } catch (error) {
      await api.unsendMessage(waitMessage.messageID);
      return message.reply("Error fetching collection.");
    }
  }
};
