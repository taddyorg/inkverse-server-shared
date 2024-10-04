const axios = require("axios");

function getWebhookUrl(type) {
  switch (type) {
    case "signup":
      return process.env.SLACK_SIGNUP_WEBHOOK;
    default:
      return process.env.SLACK_DEFAULT_WEBHOOK;
  }
}

async function sendSlackNotification({ payload, type }) {

  if (process.env.NODE_ENV !== "production") {
    console.log('LocalHost Sending slack notification: ', payload);
    return;
  }

  const options = {
    method: 'POST',
    url: getWebhookUrl(type),
    timeout: 1000 * 5,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'inkverse-api',
    },
    data: payload
  };

  await axios(options);
}

module.exports = {
  sendSlackNotification,
}