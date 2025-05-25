module.exports.config = {
  name: "ajan",
  version: "2.0",
  hasPermssion: 0,
usePrefix: true,
  credits: "𝐊𝐡𝐚𝐧 𝐑𝐚𝐡𝐮𝐥 𝐑𝐊",
  description: "সেট করা সময় অনুযায়ী স্বয়ংক্রিয়ভাবে বার্তাগুলি পাঠানো হবে!",
  commandCategory: "AutoTime",
  countDown: 3
};

module.exports.onLoad = async ({ api }) => {
  const timerData = {
    "12:45 PM": {
      message: "এখন যোহর এর আজান দিবে সবাই নামাজ পড়েন",
      url: "https://i.postimg.cc/MKnS5xTK/vtOBIkA.jpg"
    },
    "04:15 AM": {
      message: "এখন ফরজ এর আজান দিবে সবাই নামাজ পরে নাও",
      url: "https://i.postimg.cc/8z92mKdw/7K67WOG.jpg"
    },
    "04:00 PM": {
      message: "একটু পরে আছরের আজান দিবে সবাই নামাজ আদায় করে নিবেন",
      url: "https://i.postimg.cc/G216Z45y/hprI30O.jpg"
    },
    "05:15 PM": {
      message: "এখন মাগরিব এর আজান হবে সবাই নামাজ আদায় করবেন",
      url: "https://i.postimg.cc/5y4T2Z19/vlFSFL6.jpg"
    },
    "07:00 PM": {
      message: "এখন এশার আজান দিবে এই সব কাজ অফ করে নামাজ পড়েন",
      url: "https://i.postimg.cc/y8VqctFc/vtOBIkA.jpg"
    }
  };

  const checkTimeAndSendMessage = async () => {
    const currentTime = new Date(Date.now() + 21600000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).split(',').pop().trim();

    if (timerData[currentTime]) {
      console.log(timerData[currentTime].message);
      console.log(timerData[currentTime].url);
      try {
       let messageData = { body: timerData[currentTime].message,attachment:(await require('axios').get(timerData[currentTime].url, { responseType: 'stream' })).data };

        global.data.allThreadID.forEach(i => api.sendMessage(messageData, i));
      } catch (error) {
        console.error(`Failed to send message for time ${currentTime}:`, error);
      }
    }
    setTimeout(checkTimeAndSendMessage, 45000);
  };

  checkTimeAndSendMessage();
};

module.exports.run= ({}) => {};
