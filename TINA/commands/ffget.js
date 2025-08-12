const axios = require("axios");
const fs = require("fs");
const path = require("path");

const API_BASE = "https://firestats.onrender.com/api";
const API_KEY = "2f25567051a78d2f2b60a261af6babb8cb161bb32e24122eb4e6f21c767f46e0";

module.exports = {
  config: {
    name: "ffget",
    version: "1.0",
    credits: "RAHAT",
    usePrefix: true,
    countDown: 5,
    hasPermission: 0,
    description: { en: "Get FF player profile and outfit." },
    commandCategory: "information",
    guide: { en: "{pn} <UID>" }
  },

  run: async function ({ api, args, message }) {
    const uid = args[0];
    if (!uid) return message.reply("Provide UID!");

    const waitMsg = await message.reply("🍁 Wait...");

    try {
     
      const profileRes = await axios.get(${API_BASE}/profileinfo/v1?uid=${uid}&api=${API_KEY});
      const data = profileRes.data;
      if (data.ban_status.status !== 200) throw new Error("API error");

      const ban = data.ban_status.data;
      const profile = data.profile_info;

      
      const formatted = `
PLAYER INFO

┌🚫 BAN STATUS
├─ID: ${ban.id}
├─Banned: ${ban.is_banned ? "Yes" : "No"}
├─Last Login: ${new Date(ban.last_login * 1000).toLocaleString()}
├─Nickname: ${ban.nickname}
├─Region: ${ban.region}
└─Period: ${ban.period}

┌💁‍♂️ BASIC INFO
├─UID: ${profile.basicInfo.accountId}
├─Nickname: ${profile.basicInfo.nickname}
├─Region: ${profile.basicInfo.region}
├─Level: ${profile.basicInfo.level}
├─Exp: ${profile.basicInfo.exp}
├─Badge Count: ${profile.basicInfo.badgeCnt}
├─Liked: ${profile.basicInfo.liked}
├─Created At: ${new Date(profile.basicInfo.createAt * 1000).toLocaleString()}
├─Last Login: ${new Date(profile.basicInfo.lastLoginAt * 1000).toLocaleString()}
├─BR Rank Points: ${profile.basicInfo.rankingPoints}
└─CS Rank Points: ${profile.basicInfo.csRankingPoints}

┌🫡 SOCIAL INFO
├─Gender: ${profile.socialInfo.gender}
├─Language: ${profile.socialInfo.language}
├─Mode Prefer: ${profile.socialInfo.modePrefer}
└─Signature: ${profile.socialInfo.signature}

┌👨‍👩‍👧‍👦 GUILD INFO
├─Name: ${profile.clanBasicInfo.clanName}
├─ID: ${profile.clanBasicInfo.clanId}
├─Level: ${profile.clanBasicInfo.clanLevel}
└─Members: ${profile.clanBasicInfo.memberNum}/${profile.clanBasicInfo.capacity}

┌🐶 **PET INFO**
├─ID: ${profile.petInfo.id}
├─Level: ${profile.petInfo.level}
├─Exp: ${profile.petInfo.exp}
└─Skin ID: ${profile.petInfo.skinId}
`;

      
      const outfitRes = await axios.get(`${API_BASE}/outfit/v1?uid=${uid}&api=${API_KEY}`, { responseType: "stream" });
      const outfitPath = path.resolve(__dirname, `temp_outfit_${uid}.png`);
      const writer = fs.createWriteStream(outfitPath);
      outfitRes.data.pipe(writer);
      await new Promise((res, rej) => {
        writer.on("finish", res);
        writer.on("error", rej);
      });

      await api.unsendMessage(waitMsg.messageID);

     
      await message.reply({ body: formatted, attachment: fs.createReadStream(outfitPath) });
      fs.unlinkSync(outfitPath); // Clean up
    } catch (err) {
      await api.unsendMessage(waitMsg.messageID);
      message.reply("Error: " + err.message);
    }
  }
};
