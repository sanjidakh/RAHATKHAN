module.exports.config = {
  name: "albam",
  version: "1.0.3",
  hasPermssion: 0,
  credits: "RAHAT KHAN🌹",
  description: "Random video",
  commandCategory: "short video",
  cooldowns: 5,
  dependencies: {
    axios: ""
  }
}, module.exports.run = async function({
  event: e,
  api: a,
  args: n
}) { 
  if (!n[0]) return a.sendMessage("╭•┄┅═══❁🌺❁═══┅┄•╮\n       𝙻𝙸𝚂𝚃 𝙾𝙵 𝙰𝙻𝙱𝚄𝙼\n╰•┄┅═══❁🌺❁═══┅┄•╯\n\n⋆✦⋆⎯⎯⎯⋆𝚅𝙸𝙳𝙴𝙾⋆⎯⎯⎯⋆✦\n𝟏. 𝙸𝚂𝙻𝙰𝙼𝙸𝙲𝙺 𝚅𝙸𝙳𝙴𝙾 \n𝟐. 𝚂𝚃𝙾𝚁𝚈 𝚅𝙸𝙳𝙴𝙾\n𝟑. 𝚂𝚄𝚁𝙰𝙰𝙷 𝚅𝙸𝙳𝙴𝙾\n𝟒. 𝚂𝚃𝚄𝚃𝚄𝚂 𝚅𝙸𝙳𝙴𝙾\n𝟓. 𝙽𝙰𝚃𝙾𝙺 𝚅𝙸𝙳𝙴𝙾\n𝟔. 𝚂𝙰𝙳 𝚅𝙸𝙳𝙴𝙾\n𝟕. 𝙰𝙻𝙾𝙽𝙴 𝚅𝙸𝙳𝙴𝙾\n𝟖. 𝙽𝙰𝚃𝚄𝚁𝙰𝙻 𝚅𝙸𝙳𝙴𝙾\n𝟗. 𝚂𝚃𝙾𝚁𝚈 𝚂𝙾𝙽𝙶 𝚅𝙸𝙳𝙴𝙾 \n𝟏𝟎. 𝙸𝚂𝙻𝙰𝙼𝙸𝙲𝙺 𝚉𝙾𝙾𝙽 \n𝟏𝟏. 𝚇𝙼𝙻 𝙱𝙰𝙱𝚈 𝚅𝙸𝙳𝙴𝙾 \n𝟏𝟐. 𝙲𝚄𝚃𝙴 𝙲𝙰𝚃 𝚅𝙸𝙳𝙴𝙾\n𝟏𝟑. 𝙶𝚁𝙰𝚅𝙸𝚃𝚈  𝚅𝙸𝙳𝙴𝙾\n𝟏𝟒. 𝙲𝙰𝚁𝚃𝙾𝙾𝙽  𝚅𝙸𝙳𝙴𝙾\n𝟏𝟓. 𝙼𝙻𝙱𝙱  𝚅𝙸𝙳𝙴𝙾\n\n⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆\n𝐓𝐞𝐥𝐥 𝐦𝐞 𝐡𝐨𝐰 𝐦𝐚𝐧𝐲 𝐯𝐢𝐝𝐞𝐨 𝐧𝐮𝐦𝐛𝐞𝐬 𝐲𝐨𝐮 𝐰𝐚𝐧𝐭 𝐭𝐨 𝐬𝐞𝐞 𝐛𝐲 𝐫𝐞𝐩𝐥𝐚𝐲𝐢𝐧𝐠 𝐭𝐡𝐢𝐬 𝐦𝐞𝐬𝐬𝐚𝐠𝐞", e.threadID, ((a, n) => {
    global.client.handleReply.push({
      name: this.config.name,
      messageID: n.messageID,
      author: e.senderID,
      type: "create"
    })
  }), e.messageID)
}, module.exports.handleReply = async ({
  api: e,
  event: a,
  client: n,
  handleReply: t,
  Currencies: s,
  Users: i,
  Threads: o
}) => {
  var { p, h } = linkanh();

  if ("create" === t.type) {
    const n = (await p.get(h)).data.data;
    let t = (await p.get(n, {
      responseType: "stream"
    })).data;
    return e.sendMessage({
      body: "𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐈𝐍𝐆 𝐘𝐎𝐔 𝐕𝐈𝐃𝐄𝐎 \n𝐅𝐑𝐎𝐌\n\n｢𝐊𝐡𝐚𝐧 𝐑𝐚𝐡𝐮𝐥 𝐑𝐊｣",
      attachment: t
    }, a.threadID, a.messageID)
  }

    function linkanh() {
        const p = require("axios");
        if ("1" == a.body)
            var h = "https://cyber-video-apis.onrender.com/vdff";
        else if ("2" == a.body)
         var   h = "https://vip-img-api2-k5qp.onrender.com/vdcosply";
        else if ("3" == a.body)
         var   h = "https://vip-img-api2-k5qp.onrender.com/vdremon";
        else if ("4" == a.body)
          var  h = "https://vip-img-api2-k5qp.onrender.com/vd6mui";
        else if ("5" == a.body)
          var  h = "https://cyber-video-apis.onrender.com/vdtrai";
        else if ("6" == a.body)
          var  h = "https://cyber-video-apis.onrender.com/vdremix";
        else if ("7" == a.body)
          var  h = "https://vip-img-api2-k5qp.onrender.com/vdrmix";
        else if ("8" == a.body)
          var  h = "https://vip-img-api2-k5qp.onrender.com/vdanime";
        else if ("9" == a.body)
         var   h = "https://vip-img-api2-k5qp.onrender.com/gai";
        else if ("10" == a.body)
         var  h = "https://vip-img-api2-k5qp.onrender.com/vdtrai";
         else if ("11" == a.body)
         var  h = "https://vip-img-api2-k5qp.onrender.com/vdff";
         else if ("12" == a.body)
         var  h = "https://cyber-video-apis.onrender.com/vdlq";
         else if ("13" == a.body)
         var  h = "https://vip-img-api2-k5qp.onrender.com/vdvip";
         else if ("14" == a.body)
         var  h =
"https://vip-img-api2-k5qp.onrender.com/vdlq";
           else if ("15" == a.body)
         var  h =
"https://cyber-video-apis.onrender.com/vdvip";
        return { p, h };
    }
};
