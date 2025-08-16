const fs = require("fs");
const axios = require("axios");
const path = require("path");

module.exports.config = {
  name: "get",
  version: "1.0.0",
  hasPermission: 0,
  credits: "RAHAT",
  description: "Fetch Free Fire profile info",
  usePrefix: true,
  commandCategory: "utility",
  usages: "[uid]",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs": ""
  }
};

module.exports.run = async ({ api, event, args }) => {
  const API_KEY = '4ddd82e5fb22cbddf4405de46df0d9bdccc611e507075f8bd87181ec16ecfe6e';
  const BASE_URL = 'https://firestats.onrender.com/api';

  function validateUid(uid) {
    if (!uid || isNaN(uid) || uid.length < 9 || uid.length > 12) {
      return { valid: false, message: 'Invalid UID. Please provide a 9-12 digit numeric player ID.' };
    }
    return { valid: true };
  }

  function formatProfileInfo(data) {
    try {
      const { ban_status, profile_info } = data;
      const basicInfo = profile_info?.basicInfo || {};
      const socialInfo = profile_info?.socialInfo || {};
      const clanInfo = profile_info?.clanBasicInfo || null;
      const captainInfo = profile_info?.captainBasicInfo || {};

      return `
ACCOUNT INFO:
├─ Total Diamonds: ${profile_info.diamondCostRes?.diamondCost || 'Inactive'}
├─ Name: ${ban_status.data.nickname || 'Not Found'}
├─ UID: ${ban_status.data.id || 'Not Found'}
├─ Level: ${basicInfo.level || 0} (Exp: ${basicInfo.exp || 0})
├─ Region: ${ban_status.data.region || 'Unknown'}
├─ Likes: ${basicInfo.liked || 0}
├─ Honor Score: ${profile_info.creditScoreInfo?.creditScore || 'Not Found'}
├─ Title: ${basicInfo.title || 'Not Found'}
└─ Signature: ${socialInfo.signature || 'Not Set'}

ACCOUNT ACTIVITY:
├─ Most Recent OB: ${basicInfo.releaseVersion || 'Unknown'}
├─ Current BP Badges: ${basicInfo.badgeCnt || 0}
├─ BR Rank: ${basicInfo.rank ? `${basicInfo.rank} (${basicInfo.rankingPoints || 0})` : 'Not Found'}
├─ CS Points: ${basicInfo.csRankingPoints || 0}
├─ Created At: ${basicInfo.createAt ? new Date(parseInt(basicInfo.createAt) * 1000).toLocaleString() : 'Unknown'}
└─ Last Login: ${basicInfo.lastLoginAt ? new Date(parseInt(basicInfo.lastLoginAt) * 1000).toLocaleString() : 'Unknown'}

ACCOUNT OVERVIEW:
├─ Avatar ID: ${basicInfo.headPic || 'Not Found'}
├─ Banner ID: ${basicInfo.bannerId || 'Not Found'}
├─ Pin ID: ${basicInfo.pinId || 'Not Found'}
├─ Equipped Skills: ${profile_info.profileInfo?.equippedSkills?.join(', ') || 'None'}
├─ Equipped Gun ID: ${basicInfo.weaponSkinShows?.[0] || 'None'}
├─ Equipped Animation ID: ${basicInfo.gameBagShow || 'None'}

PET DETAILS:
├─ Equipped?: ${profile_info.petInfo?.isSelected ? 'Yes' : 'No'}
├─ Pet Name: ${profile_info.petInfo?.id ? 'Cactus' : 'None'}
├─ Pet Exp: ${profile_info.petInfo?.exp || 0}
├─ Pet Level: ${profile_info.petInfo?.level || 0}

GUILD INFO:
├─ Guild Name: ${clanInfo?.clanName || 'Not Found'}
├─ Guild ID: ${clanInfo?.clanId || 'Not Found'}
├─ Guild Level: ${clanInfo?.clanLevel || 0}
├─ Live Members: ${clanInfo?.memberNum || 0}
└─ Leader Info:
    ├─ Name: ${captainInfo.nickname || 'Not Found'}
    ├─ UID: ${captainInfo.accountId || 'Not Found'}
    ├─ Level: ${captainInfo.level || 0} (Exp: ${captainInfo.exp || 0})
    ├─ Created At: ${captainInfo.createAt ? new Date(parseInt(captainInfo.createAt) * 1000).toLocaleString() : 'Unknown'}
    ├─ Last Login: ${captainInfo.lastLoginAt ? new Date(parseInt(captainInfo.lastLoginAt) * 1000).toLocaleString() : 'Unknown'}
    ├─ Title: ${captainInfo.title || 'Not Found'}
    ├─ Current BP Badges: ${captainInfo.badgeCnt || 0}
    ├─ BR Points: ${captainInfo.rankingPoints || 0}
    ├─ CS Points: ${captainInfo.csRankingPoints || 0}
`.trim();
    } catch (error) {
      return 'Error: Unable to format profile information due to invalid data.';
    }
  }

  const uid = args.join('').trim();
  const uidValidation = validateUid(uid);
  if (!uidValidation.valid) {
    return api.sendMessage(`[❌]➜ ${uidValidation.message}\nExample: !ffinfo 1234567890`, event.threadID, null, event.messageID);
  }

  try {
    const loadingMessage = await api.sendMessage('[🔄]➜ Fetching Free Fire profile info...', event.threadID);

    const response = await axios.get(`${BASE_URL}/profileinfo/v1?uid=${uid}&api=${API_KEY}`, { timeout: 10000 });
    const data = response.data;

    const formattedInfo = formatProfileInfo(data);
    await api.sendMessage(`[✅]➜ Free Fire Profile Info:\n${formattedInfo}`, event.threadID, null, event.messageID);

    const outfitResponse = await axios.get(`${BASE_URL}/outfit/v1?uid=${uid}&api=${API_KEY}`, { responseType: 'arraybuffer', timeout: 10000 });
    const imagePath = path.join(__dirname, "cache", `outfit_${Date.now()}.png`);
    fs.writeFileSync(imagePath, Buffer.from(outfitResponse.data, "binary"));

    await api.sendMessage({
      body: "[✅]➜ Outfit Image:",
      attachment: fs.createReadStream(imagePath)
    }, event.threadID, () => fs.unlinkSync(imagePath), event.messageID);

    await api.unsendMessage(loadingMessage.messageID);
  } catch (error) {
    console.error(error);
    await api.sendMessage('[❌]➜ Error fetching Free Fire profile info.', event.threadID, null, event.messageID);
  }
};
