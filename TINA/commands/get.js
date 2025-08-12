// commands/get.js
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const API_BASE = "https://firestats.onrender.com/api";
const API_KEY = "2f25567051a78d2f2b60a261af6babb8cb161bb32e24122eb4e6f21c767f46e0";

module.exports.config = {
  name: "get",
  version: "1.0",
  hasPermission: 0,
  permission: 0,
  credits: "RAHAT",
  usePrefix: true,
  description: "Get FF player profile and outfit image",
  commandCategory: "information",
  usages: "/get <UID>",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  if (args.length < 1) {
    return api.sendMessage("⚠️ Please provide a UID!\n\n📌 Example:\n/get 3721018990", event.threadID, event.messageID);
  }

  const uid = args[0];
  const cacheDir = path.join(__dirname, "cache");
  const profileImagePath = path.join(cacheDir, profile_${uid}.png);
  const outfitImagePath = path.join(cacheDir, outfit_${uid}.png);

  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }

  const waitMsg = await api.sendMessage("🍁 Wait...", event.threadID, event.messageID);

  try {
  
    const profileRes = await axios.get(${API_BASE}/profileinfo/v1?uid=${uid}&api=${API_KEY});
    const data = profileRes.data;
    if (data.ban_status.status !== 200) throw new Error("Invalid UID or API error");

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

┌🐶 PET INFO
├─ID: ${profile.petInfo.id}
├─Level: ${profile.petInfo.level}
├─Exp: ${profile.petInfo.exp}
└─Skin ID: ${profile.petInfo.skinId}
`;

   
    const profileImgRes = await axios.get(${API_BASE}/profileinfo/v1?uid=${uid}&api=${API_KEY}, { responseType: "arraybuffer" });
    fs.writeFileSync(profileImagePath, profileImgRes.data);


    const outfitImgRes = await axios.get(${API_BASE}/outfit/v1?uid=${uid}&api=${API_KEY}, { responseType: "arraybuffer" });
    fs.writeFileSync(outfitImagePath, outfitImgRes.data);

    await api.unsendMessage(waitMsg.messageID);


    return api.sendMessage(
      {
        body: ✅ Profile Generated\nUID: ${uid}\nNickname: ${ban.nickname}\nCreator: Riad,
        attachment: [
          fs.createReadStream(profileImagePath),
          fs.createReadStream(outfitImagePath)
        ]
      },
      event.threadID,
      () => {
        fs.unlinkSync(profileImagePath);
        fs.unlinkSync(outfitImagePath);
      },
      event.messageID
    );
  } catch (err) {
    await api.unsendMessage(waitMsg.messageID);
    return api.sendMessage(❌ Error: ${err.message}, event.threadID, event.messageID);
  }
};
